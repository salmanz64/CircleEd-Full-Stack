"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { PrimaryButton } from "@/components/PrimaryButton"
import { usersAPI } from "@/lib/api"

export default function CreateProfilePage() {
  const router = useRouter()
  const [bio, setBio] = useState("")
  const [skillsToTeach, setSkillsToTeach] = useState("")
  const [skillsToLearn, setSkillsToLearn] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await usersAPI.update({
        bio,
        skills_to_teach: skillsToTeach.split(",").map((s) => s.trim()).filter(Boolean),
        skills_to_learn: skillsToLearn.split(",").map((s) => s.trim()).filter(Boolean),
      } as any)
      // update local storage user (store both snake_case and camelCase variants)
      try {
        const raw = localStorage.getItem("user")
        if (raw) {
          const u = JSON.parse(raw)
          const teachArr = skillsToTeach.split(",").map((s) => s.trim()).filter(Boolean)
          const learnArr = skillsToLearn.split(",").map((s) => s.trim()).filter(Boolean)
          u.bio = bio
          u.skills_to_teach = teachArr
          u.skills_to_learn = learnArr
          u.skillsToTeach = teachArr
          u.skillsToLearn = learnArr
          // mirror full_name/name if present
          if (u.full_name && !u.name) u.name = u.full_name
          if (u.name && !u.full_name) u.full_name = u.name
          localStorage.setItem("user", JSON.stringify(u))
        }
      } catch (e) {
        // ignore localStorage errors
      }

      router.push("/profile")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save profile")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Create your profile</CardTitle>
        </CardHeader>
        <CardContent>
          {error && <p className="text-red-600">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="bio">Short Bio</Label>
              <Textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} rows={4} />
            </div>

            <div>
              <Label htmlFor="teach">Skills I can teach (comma separated)</Label>
              <Input id="teach" value={skillsToTeach} onChange={(e) => setSkillsToTeach(e.target.value)} />
            </div>

            <div>
              <Label htmlFor="learn">Skills I want to learn (comma separated)</Label>
              <Input id="learn" value={skillsToLearn} onChange={(e) => setSkillsToLearn(e.target.value)} />
            </div>

            <div className="flex justify-end">
              <PrimaryButton type="submit" disabled={loading}>{loading ? "Saving..." : "Create profile"}</PrimaryButton>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}