"use client"

import { useState, useEffect } from "react"
import { SkillCard } from "@/components/SkillCard"
import { Select } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { skillsAPI, Skill } from "@/lib/api"
import { Search, Filter, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedLevel, setSelectedLevel] = useState("all")
  const [selectedLanguage, setSelectedLanguage] = useState("all")
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentUserId, setCurrentUserId] = useState<number | null>(null)

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
          const u = await response.json()
          setCurrentUserId(u.id)
        }
      } catch (err) {
        console.error('Failed to load current user:', err)
      }
    }
    fetchCurrentUser()
  }, [])

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        setLoading(true)
        const data = await skillsAPI.getAll({
          category: selectedCategory !== "all" ? selectedCategory : undefined,
          level: selectedLevel !== "all" ? selectedLevel : undefined,
          language: selectedLanguage !== "all" ? selectedLanguage : undefined,
          search: searchQuery || undefined,
        })
        // Filter out skills posted by the current user
        const filteredData = data.filter((skill: Skill) => skill.teacher_id !== currentUserId)
        setSkills(filteredData)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch skills")
        setSkills([])
      } finally {
        setLoading(false)
      }
    }

    if (currentUserId !== null) {
      const debounceTimer = setTimeout(fetchSkills, 300)
      
      // Listen for review submissions to refresh skills
      const handleReviewSubmitted = () => {
        fetchSkills()
      }
      
      window.addEventListener('reviewSubmitted', handleReviewSubmitted)
      
      return () => {
        clearTimeout(debounceTimer)
        window.removeEventListener('reviewSubmitted', handleReviewSubmitted)
      }
    }
  }, [searchQuery, selectedCategory, selectedLevel, selectedLanguage, currentUserId])

  const categories = ["all", "Programming", "Languages", "Design", "Business", "Music"]
  const levels = ["all", "Beginner", "Intermediate", "Advanced"]
  const languages = ["all", "English", "Spanish", "French", "Mandarin"]

  const filteredSkills = skills

  const hasActiveFilters = selectedCategory !== "all" || selectedLevel !== "all" || selectedLanguage !== "all" || searchQuery !== ""

  const handleResetFilters = () => {
    setSearchQuery("")
    setSelectedCategory("all")
    setSelectedLevel("all")
    setSelectedLanguage("all")
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-50 via-transparent to-purple-50 rounded-lg -z-10"></div>
        <div className="py-8">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-6 w-6 text-indigo-600" />
            <span className="text-sm font-semibold text-indigo-600">Discover Learning</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Skill Marketplace</h1>
          <p className="text-gray-600 text-lg">Find expert teachers and learn new skills with your tokens</p>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 mt-6 max-w-md">
            <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
              <p className="text-2xl font-bold text-indigo-600">{skills.length}</p>
              <p className="text-xs text-gray-600 mt-1">Skills Available</p>
            </div>
            <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
              <p className="text-2xl font-bold text-purple-600">{Array.from(new Set(skills.map((s) => s.teacher?.full_name || "Unknown"))).length}</p>
              <p className="text-xs text-gray-600 mt-1">Expert Teachers</p>
            </div>
            <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
              <p className="text-2xl font-bold text-orange-600">{skills.length > 0 ? (skills.reduce((sum, s) => sum + s.rating, 0) / skills.length).toFixed(1) : "0"}</p>
              <p className="text-xs text-gray-600 mt-1">Avg. Rating</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-5 w-5 text-gray-700" />
          <h2 className="text-lg font-semibold text-gray-900">Filter Skills</h2>
          {hasActiveFilters && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleResetFilters}
              className="ml-auto text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50"
            >
              Reset Filters
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search skills, teachers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white border-gray-300"
            />
          </div>
          <Select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            {categories.filter((c) => c !== "all").map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </Select>
          <Select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
          >
            {levels.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </Select>
          <Select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
          >
            {languages.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </Select>
        </div>
      </div>

      {/* Results Section */}
      {loading ? (
        <div className="text-center py-16">
          <div className="inline-block">
            <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-600 mt-4">Loading skills...</p>
        </div>
      ) : error ? (
        <div className="text-center py-16">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="h-10 w-10 text-red-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Error loading skills</h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button 
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold"
            >
              Try Again
            </Button>
          </div>
        </div>
      ) : filteredSkills.length > 0 ? (
        <div>
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {filteredSkills.length} {filteredSkills.length === 1 ? "Skill" : "Skills"} Found
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {selectedCategory !== "all" && `Category: ${selectedCategory} • `}
              {selectedLevel !== "all" && `Level: ${selectedLevel} • `}
              {selectedLanguage !== "all" && `Language: ${selectedLanguage}`}
            </p>
          </div>

          {/* Skills Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSkills.map((skill) => (
              <SkillCard
                key={skill.id}
                id={String(skill.id)}
                title={skill.title}
                teacherName={skill.teacher?.full_name || "Unknown"}
                teacherAvatar={skill.teacher?.avatar_url}
                rating={skill.rating}
                reviewCount={skill.review_count}
                tokensPerSession={skill.tokens_per_session}
                category={skill.category}
                level={skill.level}
                language={skill.language}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="h-10 w-10 text-indigo-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No skills found</h3>
            <p className="text-gray-600 mb-6">
              {searchQuery || selectedCategory !== "all" || selectedLevel !== "all" || selectedLanguage !== "all"
                ? "Try adjusting your filters to find more skills" 
                : "No skills available at the moment"}
            </p>
            {(searchQuery || selectedCategory !== "all" || selectedLevel !== "all" || selectedLanguage !== "all") && (
              <Button 
                onClick={handleResetFilters}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold"
              >
                Reset Filters
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

