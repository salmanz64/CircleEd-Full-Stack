import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Navbar } from "@/components/Navbar"
import { ToastProvider } from "@/components/Toast"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "CircleEd - Peer-to-Peer Learning Platform",
  description: "Exchange skills using tokens. Teach or learn skills, schedule sessions, and grow together.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ToastProvider>
          <Navbar />
          {children}
        </ToastProvider>
      </body>
    </html>
  )
}

