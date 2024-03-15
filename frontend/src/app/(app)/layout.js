'use client'

import React from 'react'
import { Inter } from 'next/font/google'
import Loading from '@/components/Loading'
import { useAuth } from '@/hooks/auth'
import Navigation from '@/components/Navigation'

const inter = Inter({ subsets: ['latin'] })

export default function AppLayout ({ children }) {
  const { user } = useAuth({ middleware: 'auth' })

  return (
    <html lang="en" className="h-full">
      <body className={inter.className + ' h-full'}>
        {
          (user) ?
          <>
            <Navigation/>
            <main className="h-full">
              <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                {children}
              </div>
            </main>
          </>
          : 
          <>
            <main className="h-full">
              <Loading/>
            </main>
          </>
        }
      </body>
    </html>
  )
}
