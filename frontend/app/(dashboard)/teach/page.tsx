"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PrimaryButton } from "@/components/PrimaryButton"
import { TokenBadge } from "@/components/TokenBadge"
import { skillsAPI, usersAPI, Skill, User } from "@/lib/api"
import { CreateSkillModal, SkillFormData } from "@/components/CreateSkillModal"
import { Plus, Edit, Trash2, Star, Calendar, Eye, BarChart3, Users, TrendingUp, RefreshCw } from "lucide-react"
import Link from "next/link"

const categoryIcons = {
  Programming: "💻",
  Design: "🎨",
  Business: "📊",
  Languages: "🌍",
  Music: "🎵",
  Fitness: "💪",
  "Art & Craft": "✏️",
  Photography: "📸",
  Writing: "✍️",
  Marketing: "📢",
}

const levelColors = {
  Beginner: "from-emerald-400 to-emerald-600",
  Intermediate: "from-blue-400 to-blue-600",
  Advanced: "from-orange-400 to-orange-600",
}

type SkillView = {
  id: number | string
  title: string
  description: string
  category: string
  level: string
  language: string
  rating: number
  reviewCount: number
  tokensPerSession: number
  availability: { day: string; timeSlots: string[] }[]
}

export default function TeachPage() {
  const [skills, setSkills] = useState<SkillView[]>([])
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingSkill, setEditingSkill] = useState<SkillView | null>(null)
  const [actionLoading, setActionLoading] = useState<number | string | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  const fetchSkills = useCallback(async () => {
    try {
      setLoading(true)

      // Try to get current authenticated user (may fail if not logged in)
      const user = await usersAPI.getCurrentUser().catch(() => null)
      setCurrentUser(user)

      const data = await skillsAPI.getAll()

      // If we have a current user, only show skills where teacher_id matches
      const filtered = user ? data.filter((s: any) => s.teacher_id === user.id || (s.teacher && s.teacher.id === user.id)) : []

      // Map API skill shape to UI-friendly shape (handle snake_case)
      const mapped = filtered.map((s: any) => ({
        id: s.id,
        title: s.title,
        description: s.description,
        category: s.category,
        level: s.level,
        language: s.language,
        rating: s.rating || 0,
        reviewCount: s.review_count || 0,
        tokensPerSession: s.tokens_per_session || s.tokensPerSession || 0,
        availability: s.availability || [],
      }))

      setSkills(mapped)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch skills")
      setSkills([])
    } finally {
      setLoading(false)
    }
  }, [])

  const handleRefresh = useCallback(async () => {
    try {
      setRefreshing(true)
      await fetchSkills()
    } finally {
      setRefreshing(false)
    }
  }, [fetchSkills])

  useEffect(() => {
    fetchSkills()
    
    // Listen for review submissions to refresh skills
    const handleReviewSubmitted = () => {
      fetchSkills()
    }
    
    window.addEventListener('reviewSubmitted', handleReviewSubmitted)
    
    return () => {
      window.removeEventListener('reviewSubmitted', handleReviewSubmitted)
    }
  }, [fetchSkills])

  const handleCreateSkill = async (skillData: SkillFormData) => {
    try {
      const newSkill = await skillsAPI.create({
        title: skillData.title,
        description: skillData.description,
        category: skillData.category,
        level: skillData.level as 'Beginner' | 'Intermediate' | 'Advanced',
        language: skillData.language,
        tokens_per_session: skillData.tokensPerSession,
        availability: skillData.availability,
        teacher_id: currentUser?.id ?? 1, // Use current user id when available
      })
      // Map returned skill to SkillView
      const mapped = {
        id: newSkill.id,
        title: newSkill.title,
        description: newSkill.description,
        category: newSkill.category,
        level: newSkill.level,
        language: newSkill.language,
        rating: (newSkill as any).rating || 0,
        reviewCount: (newSkill as any).review_count || 0,
        tokensPerSession: (newSkill as any).tokens_per_session || 0,
        availability: (newSkill as any).availability || [],
      }
      setSkills([mapped, ...skills])
      setIsModalOpen(false)
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to create skill")
    }
  }

  const handleEditSkill = async (skillData: SkillFormData) => {
    if (!editingSkill) return
    
    try {
      setActionLoading(editingSkill.id)
      const updatedSkill = await skillsAPI.update(Number(editingSkill.id), {
        title: skillData.title,
        description: skillData.description,
        category: skillData.category,
        level: skillData.level as 'Beginner' | 'Intermediate' | 'Advanced',
        language: skillData.language,
        tokens_per_session: skillData.tokensPerSession,
        availability: skillData.availability,
      })
      
      // Map returned skill to SkillView
      const mapped = {
        id: updatedSkill.id,
        title: updatedSkill.title,
        description: updatedSkill.description,
        category: updatedSkill.category,
        level: updatedSkill.level,
        language: updatedSkill.language,
        rating: (updatedSkill as any).rating || 0,
        reviewCount: (updatedSkill as any).review_count || 0,
        tokensPerSession: (updatedSkill as any).tokens_per_session || 0,
        availability: (updatedSkill as any).availability || [],
      }
      
      setSkills(skills.map(s => s.id === editingSkill.id ? mapped : s))
      setEditingSkill(null)
      setIsModalOpen(false)
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update skill")
    } finally {
      setActionLoading(null)
    }
  }

  const handleDeleteSkill = async (id: number | string) => {
    if (confirm("Are you sure you want to delete this skill?")) {
      try {
        setActionLoading(id)
        await skillsAPI.delete(Number(id))
        setSkills(skills.filter((skill) => skill.id !== id))
      } catch (err) {
        alert(err instanceof Error ? err.message : "Failed to delete skill")
      } finally {
        setActionLoading(null)
      }
    }
  }

  const totalReviews = skills.reduce((sum, skill) => sum + skill.reviewCount, 0)
  const avgRating = skills.length > 0 ? (skills.reduce((sum, skill) => sum + skill.rating, 0) / skills.length).toFixed(1) : "0.0"
  const categoryIcon = (category: string) => categoryIcons[category as keyof typeof categoryIcons] || "⭐"
  const levelGradient = (level: string) => levelColors[level as keyof typeof levelColors] || "from-indigo-400 to-indigo-600"

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <div className="inline-block mb-4">
            <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-600">Loading your skills...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Skills</h1>
          <p className="text-gray-600">Manage your teaching skills and track your performance</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span className="text-sm">{refreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>
          <PrimaryButton 
            onClick={() => {
              setEditingSkill(null)
              setIsModalOpen(true)
            }}
            className="flex items-center gap-2 whitespace-nowrap"
          >
            <Plus className="h-4 w-4" />
            Create New Skill
          </PrimaryButton>
        </div>
      </div>

      <CreateSkillModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingSkill(null)
        }}
        onSubmit={editingSkill ? handleEditSkill : handleCreateSkill}
        initialData={editingSkill ? {
          title: editingSkill.title,
          description: editingSkill.description,
          category: editingSkill.category,
          level: editingSkill.level as 'Beginner' | 'Intermediate' | 'Advanced',
          language: editingSkill.language,
          tokensPerSession: editingSkill.tokensPerSession,
          availability: editingSkill.availability,
        } : undefined}
        isEditMode={!!editingSkill}
      />

      {/* Stats Section */}
      {skills.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-medium text-indigo-700">
                <BarChart3 className="h-5 w-5" />
                Total Skills
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-indigo-900">{skills.length}</p>
              <p className="text-xs text-indigo-600 mt-2">Skills being taught</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-medium text-purple-700">
                <Users className="h-5 w-5" />
                Total Reviews
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold text-purple-900">{totalReviews}</p>
              <p className="text-xs text-purple-600 mt-2">From {totalReviews > 0 ? "learners" : "no learners yet"}</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-sm font-medium text-orange-700">
                <TrendingUp className="h-5 w-5" />
                Average Rating
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <p className="text-4xl font-bold text-orange-900">{avgRating}</p>
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(parseFloat(avgRating)) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-xs text-orange-600 mt-2">Across all skills</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Skills Grid */}
      {skills.length === 0 ? (
        <Card className="border-0 shadow-lg">
          <CardContent className="pt-16 pb-16 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Plus className="h-10 w-10 text-indigo-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No skills yet</h3>
              <p className="text-gray-600 mb-8">
                Start teaching by creating your first skill. Share your knowledge and earn tokens from learners!
              </p>
              <PrimaryButton 
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 mx-auto"
              >
                <Plus className="h-4 w-4" />
                Create Your First Skill
              </PrimaryButton>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((skill) => {
            const gradientClass = levelGradient(skill.level)
            const icon = categoryIcon(skill.category)
            
            return (
              <Card key={skill.id} className="group relative overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 bg-white">
                {/* Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-indigo-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {/* Level Badge */}
                <div className={`absolute top-4 right-4 bg-gradient-to-r ${gradientClass} text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg`}>
                  {skill.level}
                </div>

                <CardHeader className="pb-3 relative z-10 pt-10">
                  <div className="flex items-start gap-2 mb-3">
                    <span className="text-3xl">{icon}</span>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-base font-bold text-gray-900 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                        {skill.title}
                      </CardTitle>
                      <p className="text-xs text-gray-500 font-medium mt-1">{skill.category}</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 line-clamp-2">{skill.description}</p>
                </CardHeader>

                <CardContent className="space-y-4 relative z-10">
                  {/* Rating & Reviews */}
                  <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-100">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3.5 w-3.5 ${
                            i < Math.floor(skill.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900">{skill.rating.toFixed(1)}</p>
                    </div>
                    <p className="text-xs text-gray-600 font-medium">{skill.reviewCount} reviews</p>
                  </div>

                  {/* Language & Token Price */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-2 bg-indigo-50 rounded-lg border border-indigo-100">
                      <p className="text-xs text-gray-500 mb-1">Language</p>
                      <p className="text-sm font-semibold text-indigo-700">{skill.language}</p>
                    </div>
                    <div className="p-2 bg-purple-50 rounded-lg border border-purple-100">
                      <p className="text-xs text-gray-500 mb-1">Per Session</p>
                      <TokenBadge amount={skill.tokensPerSession} />
                    </div>
                  </div>

                  {/* Availability */}
                  <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <p className="text-xs font-semibold text-gray-700 mb-2">Available</p>
                    <div className="flex flex-wrap gap-2">
                      {skill.availability.slice(0, 2).map((slot, idx) => (
                        <span key={idx} className="px-2 py-1 text-xs rounded bg-white text-gray-700 border border-gray-200 font-medium">
                          {slot.day}
                        </span>
                      ))}
                      {skill.availability.length > 2 && (
                        <span className="px-2 py-1 text-xs rounded bg-white text-gray-700 border border-gray-200 font-medium">
                          +{skill.availability.length - 2}
                        </span>
                      )}
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="pt-3 relative z-10 flex gap-2">
                  <Button variant="outline" className="flex-1 text-xs h-8" asChild>
                    <Link href={`/marketplace/${skill.id}`} className="flex items-center justify-center gap-1">
                      <Eye className="h-3.5 w-3.5" />
                      View
                    </Link>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 px-2"
                    onClick={() => {
                      setEditingSkill(skill)
                      setIsModalOpen(true)
                    }}
                    disabled={actionLoading === skill.id}
                  >
                    <Edit className="h-3.5 w-3.5" />
                  </Button>
                  <Button 
                    variant="outline"
                    size="sm"
                    className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleDeleteSkill(skill.id)}
                    disabled={actionLoading === skill.id}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}




