import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Secure Phonebook',
  description: 'A highly secure, Apple-style designed phonebook',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko" className="antialiased">
      <body className={`${inter.className} bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-50 selection:bg-blue-500/30 min-h-screen flex flex-col`}>
        <main className="flex-1 w-full max-w-5xl mx-auto p-4 sm:p-6 md:p-8">
          {children}
        </main>
      </body>
    </html>
  )
}
