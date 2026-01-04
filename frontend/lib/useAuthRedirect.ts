import { useRouter } from "next/navigation"
import { useEffect } from "react"

export function useAuthRedirect(redirectPath: string = "/dashboard") {
  const router = useRouter()

  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined") return

    const checkAuthAndRedirect = () => {
      const token = localStorage.getItem("access_token")

      // If user is logged in (has token), redirect to dashboard
      if (token) {
        router.push(redirectPath)
        router.refresh()
      }
    }

    checkAuthAndRedirect()
  }, [router, redirectPath])
}
