"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { PrimaryButton } from "@/components/PrimaryButton"
import { usersAPI, sessionsAPI } from "@/lib/api"
import type { User as ApiUser, Session as ApiSession } from "@/lib/api"
import { Camera, X, Flame, TrendingUp, BookOpen, Award, Clock, CheckCircle, Star, User as UserIcon } from "lucide-react"
import { TokenBadge } from "@/components/TokenBadge"

export default function ProfilePage() {
  const [user, setUser] = useState<ApiUser | null>(null)
  const [bio, setBio] = useState("")
  const [skillsToTeach, setSkillsToTeach] = useState("")
  const [skillsToLearn, setSkillsToLearn] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [upcomingSessions, setUpcomingSessions] = useState<ApiSession[]>([])

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true)
        const userData = await usersAPI.getCurrentUser()
        setUser(userData)
        setBio(userData.bio || "")
        // Initialize skills inputs from API data
        setSkillsToTeach((userData as any).skills_to_teach ? (userData as any).skills_to_teach.join(", ") : "")
        setSkillsToLearn((userData as any).skills_to_learn ? (userData as any).skills_to_learn.join(", ") : "")
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load profile")
      } finally {
        setLoading(false)
      }
    }

    const fetchSessions = async () => {
      try {
        const s = await sessionsAPI.getUpcoming()
        setUpcomingSessions(s || [])
      } catch (err) {
        // ignore for now
        setUpcomingSessions([])
      }
    }

    fetchUser()
    fetchSessions()
  }, [])

  const handleSave = async () => {
    try {
      setSaving(true)
      await usersAPI.update({
        bio,
        skills_to_teach: skillsToTeach.split(",").map(s => s.trim()),
        skills_to_learn: skillsToLearn.split(",").map(s => s.trim()),
      } as any)
      setIsEditing(false)
      alert("Profile saved successfully!")
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to save profile")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <div className="inline-block mb-4">
            <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <div className="text-center text-red-600">Failed to load profile</div>
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
          <p className="text-gray-600">Manage your profile and learning journey</p>
        </div>
        <Button 
          variant={isEditing ? "default" : "outline"}
          onClick={() => setIsEditing(!isEditing)}
          disabled={saving}
        >
          {isEditing ? (saving ? "Saving..." : "Done Editing") : "Edit Profile"}
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* Profile Header with Stats */}
      <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-100">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Avatar */}
            <div className="relative">
              {user.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt={user.full_name}
                  className="w-32 h-32 rounded-full object-cover ring-4 ring-white shadow-lg"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-5xl font-semibold ring-4 ring-white shadow-lg">
                  {user.full_name.charAt(0)}
                </div>
              )}
              {isEditing && (
                <button className="absolute bottom-0 right-0 p-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors shadow-lg">
                  <Camera className="h-5 w-5" />
                </button>
              )}
            </div>

            {/* User Info and Quick Stats */}
            <div className="flex-1">
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-gray-900 mb-1">{user.full_name}</h2>
                <p className="text-gray-600 mb-2">{user.email}</p>
                <p className="text-sm text-gray-700 line-clamp-2">{user.bio || "No bio yet"}</p>
              </div>

              {/* Quick Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="h-4 w-4 text-indigo-600" />
                    <span className="text-xs text-gray-600">Token Balance</span>
                  </div>
                  <p className="text-xl font-bold">
                    <TokenBadge amount={user.token_balance} />
                  </p>
                </div>

                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <Flame className="h-4 w-4 text-orange-500" />
                    <span className="text-xs text-gray-600">Streak</span>
                  </div>
                  <p className="text-xl font-bold text-orange-600">{(user as any)?.streak || 0} days</p>
                </div>

                <div className="bg-white rounded-lg p-3 shadow-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <Award className="h-4 w-4 text-indigo-600" />
                    <span className="text-xs text-gray-600">Member</span>
                  </div>
                  <p className="text-xl font-bold text-indigo-600">Pro</p>
                </div>

              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Bio Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserIcon className="h-5 w-5 text-indigo-600" />
                About You
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    placeholder="Write a short bio..."
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={4}
                  />
                </div>
              ) : (
                <p className="text-gray-700">{bio}</p>
              )}
            </CardContent>
          </Card>

          {/* Skills to Teach */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-indigo-600" />
                Skills I Can Teach
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <div className="space-y-2">
                  <Label htmlFor="teach">Enter skills separated by commas</Label>
                  <Input
                    id="teach"
                    placeholder="JavaScript, React, Node.js"
                    value={skillsToTeach}
                    onChange={(e) => setSkillsToTeach(e.target.value)}
                  />
                </div>
              ) : null}
              <div className="flex flex-wrap gap-2 mt-3">
                {skillsToTeach
                  .split(",")
                  .map((s) => s.trim())
                  .filter((s) => s.length > 0)
                  .map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-sm font-medium flex items-center gap-2"
                    >
                      {skill}
                      {isEditing && (
                        <button
                          onClick={() => {
                            const skills = skillsToTeach
                              .split(",")
                              .map((s) => s.trim())
                              .filter((s) => s.length > 0 && s !== skill)
                            setSkillsToTeach(skills.join(", "))
                          }}
                          className="hover:text-indigo-900"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </span>
                  ))}
              </div>
            </CardContent>
          </Card>

          {/* Skills to Learn */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-purple-600" />
                Skills I Want to Learn
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <div className="space-y-2">
                  <Label htmlFor="learn">Enter skills separated by commas</Label>
                  <Input
                    id="learn"
                    placeholder="Spanish, Guitar, Design"
                    value={skillsToLearn}
                    onChange={(e) => setSkillsToLearn(e.target.value)}
                  />
                </div>
              ) : null}
              <div className="flex flex-wrap gap-2 mt-3">
                {skillsToLearn
                  .split(",")
                  .map((s) => s.trim())
                  .filter((s) => s.length > 0)
                  .map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-sm font-medium flex items-center gap-2"
                    >
                      {skill}
                      {isEditing && (
                        <button
                          onClick={() => {
                            const skills = skillsToLearn
                              .split(",")
                              .map((s) => s.trim())
                              .filter((s) => s.length > 0 && s !== skill)
                            setSkillsToLearn(skills.join(", "))
                          }}
                          className="hover:text-purple-900"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </span>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Additional Info */}
        <div className="space-y-6">
          {/* Upcoming Sessions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-5 w-5 text-indigo-600" />
                Next Sessions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingSessions.length > 0 ? (
                upcomingSessions.map((session) => (
                  <div key={session.id} className="p-3 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg border border-indigo-100">
                    <p className="font-semibold text-sm text-gray-900">{(session as any).skillTitle || (session as any).skill?.title || "Session"}</p>
                    <p className="text-xs text-gray-600 mt-1">with {(session as any).teacherName || (session as any).teacher?.full_name || "Teacher"}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      {(session as any).date || (session as any).scheduled_at} at {(session as any).time || "-"}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-600">No upcoming sessions</p>
              )}
            </CardContent>
          </Card>

          {/* Account Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Account Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Account Type</span>
                  <span className="font-semibold text-indigo-600">Premium</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Member Since</span>
                  <span className="font-semibold">Jan 2024</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Verification</span>
                  <span className="flex items-center gap-1 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    Verified
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profile Strength */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500" />
                Profile Strength
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-gradient-to-r from-indigo-600 to-purple-600 h-2 rounded-full" style={{ width: "75%" }}></div>
                </div>
                <p className="text-sm text-gray-600">75% Complete</p>
                <p className="text-xs text-gray-500">Add a profile picture to complete your profile</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Save Button */}
      {isEditing && (
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setIsEditing(false)}>
            Cancel
          </Button>
          <PrimaryButton onClick={handleSave} className="px-8">
            Save Changes
          </PrimaryButton>
        </div>
      )}
    </div>
  )
}

