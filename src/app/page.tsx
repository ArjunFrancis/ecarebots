import Link from 'next/link'

export default function Home() {
  return (
    <main id="main-content" className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="max-w-2xl w-full space-y-8 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-primary-700">
          Welcome to EcareBots
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-700">
          Your voice-first healthcare coordination platform
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12">
          <Link 
            href="/auth/login"
            className="px-8 py-4 bg-primary-600 text-white text-lg font-semibold rounded-lg hover:bg-primary-700 focus:ring-4 focus:ring-primary-300 transition-colors min-w-[200px]"
          >
            Sign In
          </Link>
          
          <Link 
            href="/auth/signup"
            className="px-8 py-4 bg-white text-primary-600 text-lg font-semibold rounded-lg border-2 border-primary-600 hover:bg-primary-50 focus:ring-4 focus:ring-primary-300 transition-colors min-w-[200px]"
          >
            Sign Up
          </Link>
        </div>
        
        <div className="mt-16 p-6 bg-blue-50 rounded-lg border-2 border-blue-200">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            🎙️ Voice-First Design
          </h2>
          <p className="text-lg text-gray-700">
            Designed for accessibility. Optimized for voice commands. Built for independence.
          </p>
        </div>
      </div>
    </main>
  )
}
