import React from 'react'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export default function AuthLayout ({ children }) {
  return (
    <html lang="en" className="h-full">
      <body className={inter.className + ' h-full'}>
        <main className="h-full">
            {children}
        </main>
      </body>
    </html>
  )
}
