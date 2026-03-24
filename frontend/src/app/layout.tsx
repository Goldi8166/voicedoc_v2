import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'VoiceDoc — AI Health Assistant',
  description: 'Voice-first AI health triage for rural India. Describe your symptoms in Hindi or English and get instant guidance.',
  keywords: 'health, AI, rural india, triage, doctor, hindi, voice',
  openGraph: {
    title: 'VoiceDoc — AI Health Assistant',
    description: 'Get instant AI-powered health guidance in Hindi or English',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <div className="ambient-bg" />
        {children}
      </body>
    </html>
  )
}
