"use client"

import { useState, useEffect } from "react"
// Modal built as vanilla markup; no Dialog primitives required from card component
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select } from "@/components/ui/select"
import { X } from "lucide-react"

interface CreateSkillModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (skillData: SkillFormData) => void
  initialData?: SkillFormData
  isEditMode?: boolean
}

export interface SkillFormData {
  title: string
  description: string
  category: string
  level: "Beginner" | "Intermediate" | "Advanced"
  language: string
  tokensPerSession: number
  availability: Array<{
    day: string
    timeSlots: string[]
  }>
}

const categories = [
  "Programming",
  "Design",
  "Business",
  "Languages",
  "Music",
  "Fitness",
  "Art & Craft",
  "Photography",
  "Writing",
  "Marketing",
]

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

export function CreateSkillModal({ isOpen, onClose, onSubmit, initialData, isEditMode = false }: CreateSkillModalProps) {
  const [formData, setFormData] = useState<SkillFormData>(
    initialData || {
      title: "",
      description: "",
      category: "Programming",
      level: "Beginner",
      language: "English",
      tokensPerSession: 10,
      availability: [{ day: "Monday", timeSlots: ["10:00 AM", "2:00 PM"] }],
    }
  )

  const [selectedDays, setSelectedDays] = useState<string[]>(
    initialData?.availability?.map(a => a.day) || ["Monday"]
  )

  useEffect(() => {
    if (initialData) {
      setFormData(initialData)
      setSelectedDays(initialData.availability?.map(a => a.day) || ["Monday"])
    } else {
      setFormData({
        title: "",
        description: "",
        category: "Programming",
        level: "Beginner",
        language: "English",
        tokensPerSession: 10,
        availability: [{ day: "Monday", timeSlots: ["10:00 AM", "2:00 PM"] }],
      })
      setSelectedDays(["Monday"])
    }
  }, [initialData, isOpen])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === "tokensPerSession" ? parseInt(value) : value,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const ensureDayAvailability = (day: string) => {
    const exists = formData.availability.find((a) => a.day === day)
    if (!exists) {
      setFormData((prev) => ({
        ...prev,
        availability: [...prev.availability, { day, timeSlots: ["10:00 AM", "2:00 PM"] }],
      }))
    }
  }

  const removeDayAvailability = (day: string) => {
    setFormData((prev) => ({
      ...prev,
      availability: prev.availability.filter((a) => a.day !== day),
    }))
  }

  const handleDayChange = (day: string) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter((d) => d !== day))
      removeDayAvailability(day)
    } else {
      setSelectedDays([...selectedDays, day])
      ensureDayAvailability(day)
    }
  }

  const updateTimeSlot = (day: string, idx: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      availability: prev.availability.map((a) =>
        a.day === day ? { ...a, timeSlots: a.timeSlots.map((t, i) => (i === idx ? value : t)) } : a
      ),
    }))
  }

  const addTimeSlot = (day: string) => {
    setFormData((prev) => ({
      ...prev,
      availability: prev.availability.map((a) => (a.day === day ? { ...a, timeSlots: [...a.timeSlots, "10:00 AM"] } : a)),
    }))
  }

  const removeTimeSlot = (day: string, idx: number) => {
    setFormData((prev) => ({
      ...prev,
      availability: prev.availability.map((a) =>
        a.day === day ? { ...a, timeSlots: a.timeSlots.filter((_, i) => i !== idx) } : a
      ),
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title.trim() || !formData.description.trim()) {
      alert("Please fill in all required fields")
      return
    }

    // Ensure availability includes selectedDays (fallback)
    const availability = selectedDays.map((day) => {
      const found = formData.availability.find((a) => a.day === day)
      return found || { day, timeSlots: ["10:00 AM", "2:00 PM"] }
    })

    const updatedFormData = {
      ...formData,
      availability,
    }

    onSubmit(updatedFormData)
    setFormData({
      title: "",
      description: "",
      category: "Programming",
      level: "Beginner",
      language: "English",
      tokensPerSession: 10,
      availability: [{ day: "Monday", timeSlots: ["10:00 AM", "2:00 PM"] }],
    })
    setSelectedDays(["Monday"])
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{isEditMode ? 'Edit Skill' : 'Create New Skill'}</h2>
            <p className="text-sm text-gray-600 mt-1">
              {isEditMode 
                ? 'Update your skill details' 
                : 'Share your expertise and start earning tokens'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Skill Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Skill Title *
            </label>
            <Input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g., Advanced JavaScript Fundamentals"
              className="w-full"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe what students will learn..."
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          {/* Grid: Category, Level, Language */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleSelectChange("category", e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Level
              </label>
              <select
                value={formData.level}
                onChange={(e) => handleSelectChange("level", e.target.value as "Beginner" | "Intermediate" | "Advanced")}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Language
              </label>
              <Input
                type="text"
                value={formData.language}
                onChange={(e) => handleSelectChange("language", e.target.value)}
                placeholder="e.g., English"
              />
            </div>
          </div>

          {/* Token Price */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">
              Tokens per Session
            </label>
            <Input
              type="number"
              name="tokensPerSession"
              value={formData.tokensPerSession}
              onChange={handleInputChange}
              min="1"
              max="100"
              className="w-full"
            />
            <p className="text-xs text-gray-500 mt-1">
              Set the number of tokens students need to book a session
            </p>
          </div>

          {/* Availability */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Availability (Select days)
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {days.map((day) => (
                <label
                  key={day}
                  className="flex items-center gap-2 p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedDays.includes(day)}
                    onChange={() => handleDayChange(day)}
                    className="w-4 h-4 text-indigo-600 rounded cursor-pointer"
                  />
                  <span className="text-sm font-medium text-gray-700">{day}</span>
                </label>
              ))}
            </div>

            {/* Per-day time slots editor */}
            <div className="mt-4 space-y-3">
              {selectedDays.map((day) => {
                const dayAvailability = formData.availability.find((a) => a.day === day)
                const timeSlots = dayAvailability?.timeSlots || []

                return (
                  <div key={day} className="p-3 border border-gray-200 rounded-lg bg-white">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-semibold">{day}</div>
                      <button
                        type="button"
                        className="text-sm text-indigo-600 hover:underline"
                        onClick={() => addTimeSlot(day)}
                      >
                        + Add time
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      {timeSlots.map((t, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <Input
                            value={t}
                            onChange={(e) => updateTimeSlot(day, idx, e.target.value)}
                            className="w-full"
                            placeholder="e.g., 10:00 AM"
                          />
                          <button
                            type="button"
                            className="text-red-600 px-2"
                            onClick={() => removeTimeSlot(day, idx)}
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                      {timeSlots.length === 0 && (
                        <div className="text-sm text-gray-500">No times set for this day. Add one above.</div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex gap-3 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold"
            >
              {isEditMode ? 'Update Skill' : 'Create Skill'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
