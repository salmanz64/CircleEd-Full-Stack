"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { sessionsAPI, skillsAPI, Session, Skill } from "@/lib/api"
import type { User as ApiUser } from "@/lib/api"
import { Calendar, Clock, User, CheckCircle, XCircle, AlertCircle, MessageSquare, Star, X } from "lucide-react"
import { TokenBadge } from "@/components/TokenBadge"
import Link from "next/link"
import { useToast } from "@/components/Toast"
import { 
  sendSessionAcceptedNotification, 
  sendSessionRejectedNotification, 
  sendSessionCompletedNotification, 
  sendTokensEarnedNotification 
} from "@/lib/notifications"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"

export default function BookingsPage() {
  const [activeTab, setActiveTab] = useState<"all" | "upcoming" | "past">("all")
  const [sessions, setSessions] = useState<Session[]>([])
  const [skills, setSkills] = useState<Map<number, Skill>>(new Map())
  const [users, setUsers] = useState<Map<number, ApiUser>>(new Map())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState<number | null>(null)
  const { showToast } = useToast()
  
  // Review modal state
  const [reviewModal, setReviewModal] = useState<{ isOpen: boolean; sessionId: number | null }>({ isOpen: false, sessionId: null })
  const [reviewData, setReviewData] = useState({ rating: 5, comment: '' })
  const [reviewSubmitting, setReviewSubmitting] = useState(false)

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setLoading(true)
        const data = await sessionsAPI.getAll()
        setSessions(data)

        // Fetch all unique skills
        const skillIds = new Set(data.map((s: any) => s.skill_id))
        const skillsMap = new Map<number, Skill>()
        
        for (const skillId of skillIds) {
          try {
            const skill = await skillsAPI.getById(skillId)
            skillsMap.set(skillId, skill)
          } catch (err) {
            console.error(`Failed to fetch skill ${skillId}:`, err)
          }
        }
        
        setSkills(skillsMap)

        // Fetch all unique users (teachers and students)
        const userIds = new Set<number>()
        data.forEach((s: any) => {
          userIds.add(s.teacher_id)
          userIds.add(s.student_id)
        })
        
        const usersMap = new Map<number, ApiUser>()
        for (const userId of userIds) {
          try {
            const user = await fetch(`${API_BASE_URL}/users/${userId}`, {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('access_token')}`
              }
            }).then(r => r.json())
            usersMap.set(userId, user)
          } catch (err) {
            console.error(`Failed to fetch user ${userId}:`, err)
          }
        }
        
        setUsers(usersMap)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch bookings")
      } finally {
        setLoading(false)
      }
    }

    fetchSessions()
  }, [])

  // Filter sessions by status based on active tab
  const filteredSessions = sessions.filter((session) => {
    if (activeTab === "upcoming") {
      return session.status === "pending" || session.status === "confirmed"
    }
    if (activeTab === "past") {
      return session.status === "completed" || session.status === "cancelled"
    }
    return true
  })

  // Lightweight placeholder current user: attempt to read from localStorage (client-side only)
  const [currentUser, setCurrentUser] = useState<ApiUser | null>(null)
  useEffect(() => {
    try {
      const u = typeof window !== "undefined" ? localStorage.getItem("user") : null
      if (u) setCurrentUser(JSON.parse(u))
    } catch (e) {
      setCurrentUser(null)
    }
  }, [])

  // Derive bookings arrays; we map to a UI-friendly shape with actual user data
  const bookingsAsStudent = filteredSessions
    .filter((s) => (currentUser ? s.student_id === currentUser.id : false))
    .map((s) => {
      const skill = skills.get(s.skill_id)
      const teacher = users.get(s.teacher_id)
      return {
        id: s.id,
        skillTitle: skill?.title || `Skill #${s.skill_id}`,
        teacherName: teacher?.full_name || `Teacher #${s.teacher_id}`,
        studentName: currentUser?.full_name || "You",
        status: s.status,
        scheduledAt: s.scheduled_at,
        durationMinutes: s.duration_minutes,
        tokensPerSession: skill?.tokens_per_session || 0,
        reviewSubmitted: (s as any).review_submitted || 0,
      }
    })

  const bookingsAsTeacher = filteredSessions
    .filter((s) => (currentUser ? s.teacher_id === currentUser.id : false))
    .map((s) => {
      const skill = skills.get(s.skill_id)
      const student = users.get(s.student_id)
      return {
        id: s.id,
        skillTitle: skill?.title || `Skill #${s.skill_id}`,
        teacherName: currentUser?.full_name || "You",
        studentName: student?.full_name || `Student #${s.student_id}`,
        status: s.status,
        scheduledAt: s.scheduled_at,
        durationMinutes: s.duration_minutes,
        tokensPerSession: skill?.tokens_per_session || 0,
        reviewSubmitted: (s as any).review_submitted || 0,
      }
    })

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
      confirmed: "bg-green-100 text-green-700 border-green-200",
      completed: "bg-blue-100 text-blue-700 border-blue-200",
      cancelled: "bg-red-100 text-red-700 border-red-200",
    }
    const icons = {
      pending: AlertCircle,
      confirmed: CheckCircle,
      completed: CheckCircle,
      cancelled: XCircle,
    }
    const Icon = icons[status as keyof typeof icons] || AlertCircle

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${
          styles[status as keyof typeof styles] || styles.pending
        }`}
      >
        <Icon className="h-3 w-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
    })
  }

  const handleStudentCancel = async (bookingId: number) => {
    try {
      setActionLoading(bookingId)
      await sessionsAPI.cancel(bookingId)
      // Refresh sessions
      const data = await sessionsAPI.getAll()
      setSessions(data)
      // Emit event for wallet page to refresh
      window.dispatchEvent(new Event('tokensUpdated'))
      showToast({ title: 'Booking cancelled', message: 'Tokens have been refunded', type: 'success' })
    } catch (err) {
      showToast({ 
        title: 'Failed to cancel', 
        message: err instanceof Error ? err.message : 'Failed to cancel booking', 
        type: 'error' 
      })
    } finally {
      setActionLoading(null)
    }
  }

  const handleTeacherConfirm = async (bookingId: number) => {
    try {
      setActionLoading(bookingId)
      await sessionsAPI.confirm(bookingId)
      // Refresh sessions
      const data = await sessionsAPI.getAll()
      setSessions(data)
      
      // Find the session for notification details
      const session = data.find(s => s.id === bookingId)
      const skill = session ? skills.get(session.skill_id) : null
      
      // Send notification
      if (skill) {
        sendSessionAcceptedNotification(skill.title, skill.teacher?.full_name || 'Unknown', bookingId)
      }
      
      showToast({ title: 'Booking confirmed', type: 'success' })
    } catch (err) {
      showToast({ 
        title: 'Failed to confirm', 
        message: err instanceof Error ? err.message : 'Failed to confirm booking', 
        type: 'error' 
      })
    } finally {
      setActionLoading(null)
    }
  }

  const handleTeacherDecline = async (bookingId: number) => {
    try {
      setActionLoading(bookingId)
      await sessionsAPI.decline(bookingId)
      // Refresh sessions
      const data = await sessionsAPI.getAll()
      setSessions(data)
      
      // Find the session for notification details
      const session = data.find(s => s.id === bookingId)
      const skill = session ? skills.get(session.skill_id) : null
      
      // Send notification
      if (skill) {
        sendSessionRejectedNotification(skill.title, bookingId)
      }
      
      // Emit event for wallet page to refresh
      window.dispatchEvent(new Event('tokensUpdated'))
      showToast({ title: 'Booking declined', message: 'Tokens have been refunded to student', type: 'success' })
    } catch (err) {
      showToast({ 
        title: 'Failed to decline', 
        message: err instanceof Error ? err.message : 'Failed to decline booking', 
        type: 'error' 
      })
    } finally {
      setActionLoading(null)
    }
  }

  const handleTeacherComplete = async (bookingId: number) => {
    try {
      setActionLoading(bookingId)
      await sessionsAPI.complete(bookingId)
      // Refresh sessions
      const data = await sessionsAPI.getAll()
      setSessions(data)
      
      // Find the session for notification details
      const session = data.find(s => s.id === bookingId)
      const skill = session ? skills.get(session.skill_id) : null
      
      if (skill) {
        // Send notification for session completion
        sendSessionCompletedNotification(skill.title, bookingId)
        
        // Send notification for tokens earned
        sendTokensEarnedNotification(skill.tokens_per_session, skill.title, bookingId)
      }
      
      // Emit event for wallet page to refresh
      window.dispatchEvent(new Event('tokensUpdated'))
      showToast({ title: 'Session marked complete', type: 'success' })
    } catch (err) {
      showToast({ 
        title: 'Failed to complete', 
        message: err instanceof Error ? err.message : 'Failed to mark session as complete', 
        type: 'error' 
      })
    } finally {
      setActionLoading(null)
    }
  }

  const handleSubmitReview = async () => {
    if (!reviewModal.sessionId) return
    
    // Find the session from the list
    const session = sessions.find(s => s.id === reviewModal.sessionId)
    if (!session) return

    try {
      setReviewSubmitting(true)
      await skillsAPI.addReview(session.skill_id, {
        rating: reviewData.rating,
        comment: reviewData.comment
      })
      
      // Update the session to mark it as reviewed
      setSessions(sessions.map(s => 
        s.id === reviewModal.sessionId 
          ? { ...s, review_submitted: reviewData.rating }
          : s
      ))
      
      showToast({ title: 'Review submitted', message: 'Thank you for your feedback!', type: 'success' })
      setReviewModal({ isOpen: false, sessionId: null })
      setReviewData({ rating: 5, comment: '' })
      
      // Emit event to refresh dashboard/wallet
      window.dispatchEvent(new Event('reviewSubmitted'))
      
      // Refresh skills to update rating
      const skillIds = new Set(sessions.map((s: any) => s.skill_id))
      const skillsMap = new Map<number, Skill>()
      for (const skillId of skillIds) {
        try {
          const skill = await skillsAPI.getById(skillId)
          skillsMap.set(skillId, skill)
        } catch (err) {
          console.error(`Failed to fetch skill ${skillId}:`, err)
        }
      }
      setSkills(skillsMap)
    } catch (err) {
      showToast({ 
        title: 'Failed to submit review', 
        message: err instanceof Error ? err.message : 'Failed to submit review', 
        type: 'error' 
      })
    } finally {
      setReviewSubmitting(false)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Bookings</h1>
        <p className="text-gray-600">Manage your learning and teaching sessions</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b">
        {[
          { id: "all", label: "All" },
          { id: "upcoming", label: "Upcoming" },
          { id: "past", label: "Past" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`px-4 py-2 font-medium border-b-2 transition-colors ${
              activeTab === tab.id
                ? "border-primary text-primary"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Bookings as Student */}
      {bookingsAsStudent.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Learning Sessions
          </h2>
          <div className="space-y-4">
            {bookingsAsStudent.map((booking) => (
              <Card key={booking.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-lg font-semibold">{booking.skillTitle}</h3>
                        {getStatusBadge(booking.status)}
                      </div>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          <span>Teacher: {booking.teacherName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(booking.scheduledAt)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>
                            {formatTime(booking.scheduledAt)} ({booking.durationMinutes} min)
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Cost:</span>
                          <TokenBadge amount={booking.tokensPerSession} />
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-wrap justify-end">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/chat`} className="flex items-center justify-center">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Message
                        </Link>
                      </Button>
                      {booking.status === "pending" && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleStudentCancel(booking.id)}
                          disabled={actionLoading === booking.id}
                        >
                          {actionLoading === booking.id ? 'Cancelling...' : 'Cancel'}
                        </Button>
                      )}
                      {booking.status === "completed" && (
                        booking.reviewSubmitted > 0 ? (
                          <div className="flex flex-col items-center gap-1 p-2 bg-green-50 rounded-lg border border-green-200">
                            <div className="flex items-center gap-1 text-green-600">
                              <Star className="h-4 w-4 fill-green-600" />
                              <span className="text-sm font-medium">Reviewed</span>
                            </div>
                            <div className="text-xs text-green-600 font-semibold">{booking.reviewSubmitted}/5 stars</div>
                          </div>
                        ) : (
                          <Button 
                            variant="default" 
                            size="sm"
                            className="bg-amber-600 hover:bg-amber-700"
                            onClick={() => setReviewModal({ isOpen: true, sessionId: booking.id })}
                          >
                            <Star className="h-4 w-4 mr-2" />
                            Leave Review
                          </Button>
                        )
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Bookings as Teacher */}
      {bookingsAsTeacher.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Teaching Sessions
          </h2>
          <div className="space-y-4">
            {bookingsAsTeacher.map((booking) => (
              <Card key={booking.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-lg font-semibold">{booking.skillTitle}</h3>
                        {getStatusBadge(booking.status)}
                      </div>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          <span>Student: {booking.studentName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(booking.scheduledAt)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>
                            {formatTime(booking.scheduledAt)} ({booking.durationMinutes} min)
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Earnings:</span>
                          <TokenBadge amount={booking.tokensPerSession} />
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-wrap justify-end">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/chat`}>
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Message
                        </Link>
                      </Button>
                      {booking.status === "pending" && (
                        <>
                          <Button 
                            variant="default" 
                            size="sm" 
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => handleTeacherConfirm(booking.id)}
                            disabled={actionLoading === booking.id}
                          >
                            {actionLoading === booking.id ? 'Confirming...' : 'Confirm'}
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleTeacherDecline(booking.id)}
                            disabled={actionLoading === booking.id}
                          >
                            {actionLoading === booking.id ? 'Declining...' : 'Decline'}
                          </Button>
                        </>
                      )}
                      {booking.status === "confirmed" && (
                        <Button 
                          variant="default" 
                          size="sm"
                          onClick={() => handleTeacherComplete(booking.id)}
                          disabled={actionLoading === booking.id}
                        >
                          {actionLoading === booking.id ? 'Completing...' : 'Mark Complete'}
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {bookingsAsStudent.length === 0 && bookingsAsTeacher.length === 0 && (
        <Card>
          <CardContent className="pt-12 pb-12 text-center">
            <div className="max-w-md mx-auto">
              <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No bookings found</h3>
              <p className="text-gray-600 mb-6">
                {activeTab === "upcoming"
                  ? "You don't have any upcoming sessions."
                  : activeTab === "past"
                    ? "You don't have any past sessions."
                    : "Start by booking a session or creating a skill to teach."}
              </p>
              <div className="flex gap-4 justify-center">
                <Button asChild>
                  <Link href="/marketplace">Browse Skills</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/teach">Create Skill</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Review Modal */}
      {reviewModal.isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <div>
                <CardTitle>Leave a Review</CardTitle>
                <p className="text-sm text-gray-500 mt-1">
                  {reviewModal.sessionId ? 
                    (() => {
                      const session = sessions.find(s => s.id === reviewModal.sessionId)
                      const skill = session ? skills.get(session.skill_id) : null
                      return skill ? `for ${skill.title}` : 'for this skill'
                    })()
                  : ''}
                </p>
              </div>
              <button
                onClick={() => setReviewModal({ isOpen: false, sessionId: null })}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="h-5 w-5" />
              </button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-3 block">How would you rate this session?</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => setReviewData({ ...reviewData, rating })}
                      className="transition-transform hover:scale-110"
                      title={`${rating} star${rating !== 1 ? 's' : ''}`}
                    >
                      <Star
                        className={`h-8 w-8 ${
                          rating <= reviewData.rating
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {reviewData.rating === 1 && "Poor - Didn't meet expectations"}
                  {reviewData.rating === 2 && "Fair - Below average"}
                  {reviewData.rating === 3 && "Good - As expected"}
                  {reviewData.rating === 4 && "Very Good - Exceeded expectations"}
                  {reviewData.rating === 5 && "Excellent - Outstanding session"}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Comment (Optional)</label>
                <Textarea
                  placeholder="Share your experience with this session..."
                  value={reviewData.comment}
                  onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                  className="min-h-24"
                />
                <p className="text-xs text-gray-500 mt-1">{reviewData.comment.length}/500</p>
              </div>
              <div className="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setReviewModal({ isOpen: false, sessionId: null })}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1 bg-amber-600 hover:bg-amber-700"
                  onClick={handleSubmitReview}
                  disabled={reviewSubmitting}
                >
                  {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}




