'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }

    getUser()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl md:text-3xl font-bold text-primary-700">
              EcareBots Dashboard
            </h1>
            <button
              onClick={handleSignOut}
              className="px-6 py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 focus:ring-4 focus:ring-gray-400 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main id="main-content" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Welcome back, {user?.user_metadata?.full_name || user?.email}!
          </h2>
          <p className="text-lg text-gray-600">
            Your health coordination hub is ready.
          </p>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Medications Card */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              <div className="text-4xl mr-4">💊</div>
              <h3 className="text-xl font-semibold text-gray-800">Medications</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Manage your medications and track adherence
            </p>
            <button className="w-full px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 focus:ring-4 focus:ring-primary-300 transition-colors">
              View Medications
            </button>
          </div>

          {/* Appointments Card */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center mb-4">
              <div className="text-4xl mr-4">📅</div>
              <h3 className="text-xl font-semibold text-gray-800">Appointments</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Schedule and manage doctor appointments
            </p>
            <button className="w-full px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 focus:ring-4 focus:ring-primary-300 transition-colors">
              View Appointments
            </button>
          </div>
        </div>

        {/* Today's Schedule Preview */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Today's Schedule
          </h3>
          <div className="text-center py-8 text-gray-500">
            <p className="text-lg">No items scheduled for today</p>
            <p className="text-sm mt-2">Add medications or appointments to see them here</p>
          </div>
        </div>

        {/* Voice Command Placeholder */}
        <div className="mt-8 bg-blue-50 rounded-lg border-2 border-blue-200 p-6">
          <div className="flex items-center mb-4">
            <div className="text-3xl mr-3">🎙️</div>
            <h3 className="text-xl font-semibold text-gray-800">Voice Commands</h3>
          </div>
          <p className="text-gray-700 mb-4">
            Voice command feature coming soon! You'll be able to:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>"Add medication insulin 10 units before breakfast"</li>
            <li>"Schedule appointment with cardiologist next Tuesday"</li>
            <li>"Show my medications for today"</li>
          </ul>
        </div>
      </main>
    </div>
  )
}
