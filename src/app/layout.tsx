import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'EcareBots - Accessible Healthcare Coordination',
  description: 'Voice-first healthcare coordination platform for elderly and disabled users',
  keywords: ['healthcare', 'accessibility', 'voice-first', 'WCAG', 'elderly care'],
  authors: [{ name: 'EcareBots Team' }],
  themeColor: '#0ea5e9',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=5',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-gray-50 text-gray-900 antialiased`}>
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary-600 focus:text-white focus:rounded"
        >
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  )
}
