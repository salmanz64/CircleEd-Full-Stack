"use client"

import { useState, useEffect } from "react"
import { notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ReviewCard } from "@/components/ReviewCard"
import { TokenBadge } from "@/components/TokenBadge"
import { PrimaryButton } from "@/components/PrimaryButton"
import { Star, Calendar, CheckCircle } from "lucide-react"
import Image from "next/image"
import { skillsAPI, sessionsAPI, chatsAPI, Skill, SkillReview } from "@/lib/api" 
import { useRouter } from "next/navigation"
import { useToast } from "@/components/Toast"

export default function SkillProfilePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const [skill, setSkill] = useState<Skill | null>(null)
  const [reviews, setReviews] = useState<SkillReview[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [skillId, setSkillId] = useState<string | null>(null)
  const [currentUser, setCurrentUser] = useState<any>(null)

  // Extract skill ID from params (needed for Next.js 15)
  useEffect(() => {
    params.then(p => setSkillId(p.id))
  }, [params])

  // Fetch current user
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'
        const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null
        const response = await fetch(`${API_BASE_URL}/users/me`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
        if (response.ok) {
          const user = await response.json()
          setCurrentUser(user)
        }
      } catch (err) {
        console.error('Failed to load current user:', err)
      }
    }
    fetchCurrentUser()
  }, [])

  const [selectedSlot, setSelectedSlot] = useState<{ day: string; time: string } | null>(null)
  const [booking, setBooking] = useState(false)
  const router = useRouter()
  const { showToast } = useToast()


  useEffect(() => {
    if (!skillId) return

    const fetchData = async () => {
      try {
        setLoading(true)
        const s = await skillsAPI.getById(Number(skillId))
        setSkill(s)
        const r = await skillsAPI.getReviews(Number(skillId))
        setReviews(r)
        setError(null)
      } catch (err) {
        console.error("Error loading skill:", err)
        setError(err instanceof Error ? err.message : "Failed to load skill")
      } finally {
        setLoading(false)
      }
    }

    fetchData()

    // Listen for review submission event to refresh reviews
    const handleReviewSubmitted = () => {
      fetchData()
    }

    window.addEventListener('reviewSubmitted', handleReviewSubmitted)
    return () => {
      window.removeEventListener('reviewSubmitted', handleReviewSubmitted)
    }
  }, [skillId])

  if (loading) {
    return (
      <div className="text-center py-16">
        <div className="inline-block">
          <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        </div>
        <p className="text-gray-600 mt-4">Loading skill...</p>
      </div>
    )
  }

  if (error || !skill) {
    return (
      <div className="text-center py-16">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Unable to load skill</h3>
        <p className="text-gray-600 mb-6">{error || "Skill not found"}</p>
      </div>
    )
  }


  const parseTimeToNextDate = (dayName: string, timeStr: string): string => {
    // Parse time like "10:00 AM" into hours/minutes
    const [time, meridiem] = timeStr.split(' ')
    const [hourStr, minStr] = time.split(':')
    let hour = parseInt(hourStr, 10)
    const minute = parseInt(minStr || '0', 10)
    if (meridiem && meridiem.toUpperCase() === 'PM' && hour !== 12) hour += 12
    if (meridiem && meridiem.toUpperCase() === 'AM' && hour === 12) hour = 0

    const dayIdx = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'].indexOf(dayName)
    const now = new Date()

    // Find next date equal to dayIdx (could be today if later time)
    const daysAhead = (dayIdx - now.getDay() + 7) % 7
    let candidate = new Date(now)
    candidate.setDate(now.getDate() + daysAhead)
    candidate.setHours(hour, minute, 0, 0)

    // If candidate is in the past (today but earlier time), push one week ahead
    if (candidate <= now) {
      candidate.setDate(candidate.getDate() + 7)
    }

    return candidate.toISOString()
  }

  const handleSelectSlot = (day: string, time: string) => {
    setSelectedSlot({ day, time })
  }

  const bookSession = async () => {
    if (!selectedSlot) {
      showToast({ title: "Select slot", message: 'Please select a day and time slot', type: 'warning' })
      return
    }

    if (!skill || !currentUser) return
    try {
      setBooking(true)
      const scheduled_at = parseTimeToNextDate(selectedSlot.day, selectedSlot.time)
      const newSession = await sessionsAPI.book({
        skill_id: Number(skillId),
        teacher_id: skill.teacher_id,
        student_id: currentUser.id,
        scheduled_at,
        duration_minutes: 60,
      })

      // Create or get chat with teacher and then navigate to chat view
      const chat = await chatsAPI.getOrCreate?.(skill.teacher_id)

      showToast({ title: 'Booked', message: 'Successfully booked — opening chat...', type: 'success' })
      router.push(`/chat?chat=${chat?.id}`)
    } catch (err) {
      showToast({ title: 'Booking failed', message: err instanceof Error ? err.message : 'Failed to book session', type: 'error' })
    } finally {
      setBooking(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">{skill.title}</h1>
            <p className="text-lg text-gray-600">{skill.description}</p>
          </div>
          <TokenBadge amount={skill.tokens_per_session || (skill as any).tokensPerSession} variant="large" />
        </div>

        {/* Teacher Info */}
        <div className="flex items-center gap-4 p-4 bg-white rounded-lg border">
          {skill.teacher?.avatar_url ? (
            <Image
              src={skill.teacher?.avatar_url}
              alt={skill.teacher?.full_name || "Teacher"}
              width={64}
              height={64}
              className="rounded-full"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-white text-xl font-semibold">
              {(skill.teacher?.full_name || skill.title).charAt(0)}
            </div>
          )}
          <div className="flex-1">
            <p className="font-semibold text-lg">{skill.teacher?.full_name || "Unknown Teacher"}</p>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{(skill.rating ?? 0).toFixed(1)}</span>
              </div>
              <span className="text-gray-500">({reviews.length || skill.review_count || 0} reviews)</span>
            </div>
          </div>
        </div>

        {/* Badges (category, level, language) */}
        <div className="flex flex-wrap gap-2">
          {[skill.category, skill.level, skill.language]
            .filter(Boolean)
            .map((badge) => (
              <span
                key={String(badge)}
                className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-sm font-medium flex items-center gap-1"
              >
                <CheckCircle className="h-4 w-4" />
                {badge}
              </span>
            ))}
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Availability */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Availability
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {skill.availability && skill.availability.length > 0 ? (
                skill.availability.map((slot, idx) => (
                  <div key={idx}>
                    <p className="font-semibold mb-2">{slot.day}</p>
                    <div className="flex flex-wrap gap-2">
                      {slot.timeSlots.map((time, timeIdx) => (
                        <button
                          key={timeIdx}
                          onClick={() => handleSelectSlot(slot.day, time)}
                          className={`px-3 py-1.5 rounded-lg border transition-colors text-sm ${selectedSlot?.day === slot.day && selectedSlot?.time === time ? 'bg-primary text-white border-primary' : 'hover:bg-primary hover:text-white hover:border-primary'}`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-600">Availability not listed</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Booking Card */}
        <Card>
          <CardHeader>
            <CardTitle>Book a Session</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Session Cost</p>
              <TokenBadge amount={skill.tokens_per_session || (skill as any).tokensPerSession} variant="large" />
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Level</p>
              <span className="px-3 py-1 rounded-md bg-blue-100 text-blue-700 text-sm font-medium">
                {skill.level}
              </span>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Language</p>
              <span className="px-3 py-1 rounded-md bg-green-100 text-green-700 text-sm font-medium">
                {skill.language}
              </span>
            </div>
            <PrimaryButton className="w-full mt-4" onClick={bookSession} disabled={booking}>
              {booking ? 'Booking...' : `Book Session • ${skill.tokens_per_session || (skill as any).tokensPerSession} tokens`}
            </PrimaryButton>
            {selectedSlot && (
              <p className="mt-2 text-sm text-gray-600">Selected: {selectedSlot.day} — {selectedSlot.time}</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Reviews */}
      <Card>
        <CardHeader>
          <CardTitle>Reviews ({reviews.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <ReviewCard
                  key={String(review.id)}
                  reviewerName={review.reviewer?.full_name || "Anonymous"}
                  reviewerAvatar={review.reviewer?.avatar_url}
                  rating={review.rating}
                  comment={review.comment}
                  date={review.created_at || undefined}
                />
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">No reviews yet.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

