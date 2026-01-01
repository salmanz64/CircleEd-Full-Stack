"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { PrimaryButton } from "@/components/PrimaryButton"
import { Button } from "@/components/ui/button"
import { Bell, Clock, Calendar, LogOut } from "lucide-react"

export default function SettingsPage() {
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(true)
  const [sessionReminders, setSessionReminders] = useState(true)
  const [timezone, setTimezone] = useState("America/New_York")
  const [sessionDuration, setSessionDuration] = useState("60")
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    try {
      setSaving(true)
      // TODO: Call API to save settings
      alert("Settings saved successfully!")
    } catch (err) {
      alert("Failed to save settings")
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = () => {
    if (confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("access_token")
      localStorage.removeItem("user")
      window.location.href = "/login"
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">Manage your account preferences</p>
      </div>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </CardTitle>
          <CardDescription>
            Choose how you want to be notified
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="email-notifications">Email Notifications</Label>
              <p className="text-sm text-gray-500">
                Receive notifications via email
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={emailNotifications}
                onChange={(e) => setEmailNotifications(e.target.checked)}
              />
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="push-notifications">Push Notifications</Label>
              <p className="text-sm text-gray-500">
                Receive browser push notifications
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={pushNotifications}
                onChange={(e) => setPushNotifications(e.target.checked)}
              />
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="session-reminders">Session Reminders</Label>
              <p className="text-sm text-gray-500">
                Get reminders before upcoming sessions
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={sessionReminders}
                onChange={(e) => setSessionReminders(e.target.checked)}
              />
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Preferences
          </CardTitle>
          <CardDescription>
            Set your preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="timezone">Timezone</Label>
            <Select value={timezone} onChange={(e) => setTimezone(e.target.value)}>
              <option value="America/New_York">America/New_York</option>
              <option value="America/Chicago">America/Chicago</option>
              <option value="America/Los_Angeles">America/Los_Angeles</option>
              <option value="Europe/London">Europe/London</option>
              <option value="Europe/Paris">Europe/Paris</option>
              <option value="Asia/Tokyo">Asia/Tokyo</option>
            </Select>
          </div>

          <div>
            <Label htmlFor="session-duration">Default Session Duration</Label>
            <Select value={sessionDuration} onChange={(e) => setSessionDuration(e.target.value)}>
              <option value="30">30 minutes</option>
              <option value="45">45 minutes</option>
              <option value="60">60 minutes (1 hour)</option>
              <option value="90">90 minutes</option>
              <option value="120">120 minutes (2 hours)</option>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      <div className="flex gap-4">
        <PrimaryButton onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save Settings"}
        </PrimaryButton>
      </div>

      {/* Logout Section */}
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="text-red-600">Logout</CardTitle>
        </CardHeader>
        <CardContent>
          <Button
            onClick={handleLogout}
            variant="destructive"
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Logout from this device
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

