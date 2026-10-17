import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Plus_Jakarta_Sans, Inter } from 'next/font/google'
import { LanguageProvider } from '@/lib/language-context'
import { AuthProvider } from '@/lib/auth-context'
import './globals.css'

const _display = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-display' })
const _sans = Inter({ subsets: ['latin'], variable: '--font-sans' })

export const metadata: Metadata = {
  title: 'CIS CWIE Hub | Cooperative & Work-Integrated Education',
  description:
    'CIS CWIE Hub connects students, advisors, mentors, and companies through a digital cooperative education workflow. Department of Computer and Information Science, KMUTNB.',
  generator: 'v0.app',
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#7B1145',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${_display.variable} ${_sans.variable} bg-background`}>
      <body className="font-sans antialiased">
        <LanguageProvider>
          <AuthProvider>
            {children}
            {process.env.NODE_ENV === 'production' && <Analytics />}
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}
