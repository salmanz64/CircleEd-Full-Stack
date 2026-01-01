"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TokenBadge } from "@/components/TokenBadge"
import { Button } from "@/components/ui/button"
import { usersAPI, sessionsAPI, skillsAPI, Session, Skill } from "@/lib/api"
import { useState, useEffect, useCallback } from "react"
import { Flame, Calendar, TrendingUp, BookOpen, ArrowRight, Clock, Zap, Award, MessageSquare, Wallet, User, RefreshCw } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const [userName, setUserName] = useState("User")
  const [tokenBalance, setTokenBalance] = useState(0)
  const [upcomingSessions, setUpcomingSessions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [streak, setStreak] = useState(0)
  const [skillsLearned, setSkillsLearned] = useState(0)
  const [refreshing, setRefreshing] = useState(false)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      const [userData, sessionsData] = await Promise.all([
        usersAPI.getCurrentUser(),
        sessionsAPI.getAll(),
      ])
      
      setUserName(userData.full_name || "User")
      setTokenBalance(userData.token_balance || 0)
      setStreak(userData.streak ?? 0)

      // Get upcoming sessions with full details
      const upcomingSessions = sessionsData
        .filter((s: Session) => 
          (s.status === "pending" || s.status === "confirmed") &&
          new Date(s.scheduled_at) > new Date()
        )
        .sort((a, b) => new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime())
        .slice(0, 5)

      // Fetch skill details for each session
      const upcomingWithDetails = await Promise.all(
        upcomingSessions.map(async (session: Session) => {
          try {
            const skill = await skillsAPI.getById(session.skill_id)
            return {
              ...session,
              skillTitle: skill.title,
              tokensPerSession: skill.tokens_per_session,
            }
          } catch (err) {
            console.error(`Failed to fetch skill ${session.skill_id}:`, err)
            return {
              ...session,
              skillTitle: `Skill #${session.skill_id}`,
              tokensPerSession: 0,
            }
          }
        })
      )

      setUpcomingSessions(upcomingWithDetails)

      // Calculate skills learned from completed sessions
      const completedSessions = sessionsData.filter((s: Session) => s.status === "completed" && s.student_id === userData.id)
      const uniqueSkillIds = new Set(completedSessions.map((s: Session) => s.skill_id))
      setSkillsLearned(uniqueSkillIds.size)

      setError(null)
    } catch (err) {
      console.error("Error fetching dashboard data:", err)
      setError(err instanceof Error ? err.message : "Failed to load dashboard")
    } finally {
      setLoading(false)
    }
  }, [])

  const handleRefresh = useCallback(async () => {
    try {
      setRefreshing(true)
      await fetchData()
    } finally {
      setRefreshing(false)
    }
  }, [fetchData])

  useEffect(() => {
    fetchData()

    // Refresh every 30 seconds
    const interval = setInterval(handleRefresh, 30000)

    // Listen for token updates and review submissions from bookings
    const handleTokensUpdated = () => {
      handleRefresh()
    }
    const handleReviewSubmitted = () => {
      handleRefresh()
    }
    window.addEventListener('tokensUpdated', handleTokensUpdated)
    window.addEventListener('reviewSubmitted', handleReviewSubmitted)

    return () => {
      clearInterval(interval)
      window.removeEventListener('tokensUpdated', handleTokensUpdated)
      window.removeEventListener('reviewSubmitted', handleReviewSubmitted)
    }
  }, [fetchData, handleRefresh])

  // streak and skillsLearned are populated from the backend via usersAPI.getCurrentUser()

  return (
    <div className="space-y-8">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <p className="text-red-800">Error loading dashboard: {error}</p>
        </div>
      )}

      {loading ? (
        <div className="text-center py-16">
          <div className="inline-block">
            <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-600 mt-4">Loading your dashboard...</p>
        </div>
      ) : (
        <>
          {/* Welcome Header with Refresh */}
          <div className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-10 rounded-lg"></div>
            <div className="relative py-8 px-6 rounded-lg flex items-center justify-between">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">Welcome back, {userName.split(" ")[0]}! 👋</h1>
                <p className="text-gray-600 text-lg">Here's your learning journey at a glance</p>
              </div>
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                <span className="text-sm">{refreshing ? 'Refreshing...' : 'Refresh'}</span>
              </button>
            </div>
          </div>

          {/* Stats Grid - Enhanced */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Token Balance */}
            <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-transparent to-indigo-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
                <CardTitle className="text-sm font-medium text-gray-700">Token Balance</CardTitle>
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-indigo-600" />
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="mb-3">
                  <TokenBadge amount={tokenBalance} />
                </div>
                <div className="flex items-center gap-2 text-green-600 text-xs font-semibold">
                  <ArrowRight className="h-3 w-3" />
                  <span>Your balance</span>
                </div>
              </CardContent>
            </Card>

            {/* Streak */}
            <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-transparent to-orange-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
                <CardTitle className="text-sm font-medium text-gray-700">Learning Streak</CardTitle>
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Flame className="h-5 w-5 text-orange-600" />
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="text-4xl font-bold text-orange-600 mb-2">{streak}</div>
                <p className="text-xs text-orange-600 font-semibold">days in a row</p>
              </CardContent>
            </Card>

            {/* Upcoming Sessions */}
            <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-transparent to-purple-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
                <CardTitle className="text-sm font-medium text-gray-700">Sessions Booked</CardTitle>
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Calendar className="h-5 w-5 text-purple-600" />
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="text-4xl font-bold text-purple-600 mb-2">{upcomingSessions.length}</div>
                <p className="text-xs text-purple-600 font-semibold">upcoming sessions</p>
              </CardContent>
            </Card>

            {/* Skills Learned */}
            <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-transparent to-emerald-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 relative z-10">
                <CardTitle className="text-sm font-medium text-gray-700">Skills Learned</CardTitle>
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <BookOpen className="h-5 w-5 text-emerald-600" />
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="text-4xl font-bold text-emerald-600 mb-2">{skillsLearned}</div>
                <p className="text-xs text-emerald-600 font-semibold">Skills registered</p>
              </CardContent>
            </Card>
          </div>

          {/* Upcoming Sessions & Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Sessions */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-indigo-600" />
                Upcoming Sessions
              </CardTitle>
              <Button variant="ghost" size="sm" asChild className="text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50">
                <Link href="/bookings">View All</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {upcomingSessions.length > 0 ? (
              <div className="space-y-3">
                {upcomingSessions.map((session) => {
                  const sessionDate = new Date(session.scheduled_at)
                  const dateStr = sessionDate.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })
                  const timeStr = sessionDate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })
                  const statusColor = session.status === 'confirmed' ? 'text-green-600 bg-green-50' : 'text-yellow-600 bg-yellow-50'
                  
                  return (
                    <div
                      key={session.id}
                      className="p-4 border border-gray-200 rounded-lg hover:border-indigo-300 hover:bg-indigo-50/50 transition-all duration-300 group"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">{session.skillTitle}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className={`text-xs px-2 py-1 rounded-full font-semibold ${statusColor}`}>
                              {session.status === 'confirmed' ? '✓ Confirmed' : 'Pending'}
                            </span>
                            <span className="text-xs text-gray-500 font-medium">{session.tokensPerSession} tokens</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-gray-600 mt-2">
                            <Calendar className="h-3 w-3" />
                            <span>{dateStr} at {timeStr}</span>
                          </div>
                        </div>
                        <Button variant="outline" size="sm" asChild className="whitespace-nowrap h-8 border-indigo-200 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50">
                          <Link href="/bookings">Manage</Link>
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600 mb-4">No upcoming sessions</p>
                <Button asChild className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white">
                  <Link href="/marketplace">Browse Skills</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-purple-600" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <Button 
                asChild 
                className="h-24 flex-col gap-2 bg-gradient-to-br from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-semibold shadow-md hover:shadow-lg transition-all"
              >
                <Link href="/marketplace" className="flex flex-col items-center gap-2">
                  <BookOpen className="h-6 w-6" />
                  <span className="text-sm">Browse Skills</span>
                </Link>
              </Button>

              <Button 
                variant="outline" 
                asChild 
                className="h-24 flex-col gap-2 border-2 border-purple-200 hover:bg-purple-50 hover:border-purple-300"
              >
                <Link href="/chat" className="flex flex-col items-center gap-2">
                  <MessageSquare className="h-6 w-6" />
                  <span className="text-sm">Messages</span>
                </Link>
              </Button>

              <Button 
                variant="outline" 
                asChild 
                className="h-24 flex-col gap-2 border-2 border-orange-200 hover:bg-orange-50 hover:border-orange-300"
              >
                <Link href="/wallet" className="flex flex-col items-center gap-2">
                  <Wallet className="h-6 w-6" />
                  <span className="text-sm">My Tokens</span>
                </Link>
              </Button>

              <Button 
                variant="outline" 
                asChild 
                className="h-24 flex-col gap-2 border-2 border-pink-200 hover:bg-pink-50 hover:border-pink-300"
              >
                <Link href="/profile" className="flex flex-col items-center gap-2">
                  <User className="h-6 w-6" />
                  <span className="text-sm">Profile</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Motivation Banner */}
      <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-6 text-white shadow-lg">
        <div className="absolute inset-0 opacity-10">
          <Award className="absolute top-2 left-2 h-20 w-20 rotate-12" />
          <Zap className="absolute bottom-2 right-2 h-20 w-20 -rotate-12" />
        </div>
        <div className="relative z-10">
          <p className="text-sm font-semibold mb-1 opacity-90">Keep up the momentum!</p>
          <p className="text-lg font-bold">You're on a {streak}-day streak! Keep learning to unlock more rewards.</p>
          <Button 
            asChild 
            className="mt-4 bg-white text-indigo-600 hover:bg-gray-100 font-semibold"
          >
            <Link href="/marketplace">Explore New Skills</Link>
          </Button>
        </div>
      </div>
        </>
      )}
    </div>
  )
}

