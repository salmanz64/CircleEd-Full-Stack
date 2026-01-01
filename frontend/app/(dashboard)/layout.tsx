import { Sidebar } from "@/components/Sidebar"
import { MobileSidebar } from "@/components/MobileSidebar"
import ProfileCompletionGuard from "@/components/ProfileCompletionGuard"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <MobileSidebar />
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto px-4 py-8">
          {/* Redirect new users to complete their profile before exploring the app */}
          <ProfileCompletionGuard />
          {children}
        </div>
      </main>
    </div>
  )
}

