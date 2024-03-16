'use client'

import React from 'react'
import PropTypes from 'prop-types'
import { Inter } from 'next/font/google'
import { useAuth } from '@/hooks/auth'
import Navigation from '@/components/Navigation'
import Loading from '@/components/Loading'

const inter = Inter({ subsets: ['latin'] })

AppLayout.propTypes = {
  children: PropTypes.object.isRequired
}

export default function AppLayout ({ children }) {
  // Get the authenticated user
  const { user } = useAuth({ middleware: 'auth' })

  return (
    <html lang="en" className="h-full">
      <body className={inter.className + ' h-full'}>
        {
          (user)
            ? <>
            <Navigation/>
            <main className="h-full">
              <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                {children}
              </div>
            </main>
          </>
            : <>
            <main className="h-full">
              <Loading/>
            </main>
          </>
        }
      </body>
    </html>
  )
}
