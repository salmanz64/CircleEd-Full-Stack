"use client"

import { useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"

// Criteria for completion: bio non-empty OR at least one skill to teach or learn
function isProfileComplete(user: any) {
  if (!user) return false
  const bioOk = user.bio && user.bio.trim().length > 0
  const teachOk = (user.skills_to_teach || user.skillsToTeach || []).length > 0
  const learnOk = (user.skills_to_learn || user.skillsToLearn || []).length > 0
  return bioOk || teachOk || learnOk
}

export default function ProfileCompletionGuard() {
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Only run client-side
    try {
      const raw = localStorage.getItem("user")
      if (!raw) return // not logged in
      const user = JSON.parse(raw)

      const createPath = "/profile/create"
      // If we're already on the create page, do nothing
      if (pathname === createPath) return

      if (!isProfileComplete(user)) {
        router.replace(createPath)
      }
    } catch (e) {
      // ignore parsing errors
    }
  }, [pathname, router])

  return null
}
