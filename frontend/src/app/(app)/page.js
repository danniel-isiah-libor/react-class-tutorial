'use client'

import React, { useEffect, useState } from 'react'
import { DateTime } from 'luxon'
import Link from 'next/link'

import { useRecipe } from '@/hooks/api/recipe'

export default function Home () {
  const [recipes, setRecipes] = useState([])
  const { index } = useRecipe()

  useEffect(() => {
    index().then((data) => setRecipes(data))
  }, [])

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-12">
      <ul role="list" className="divide-y divide-gray-100">
        {(recipes.length)
          ? (recipes.map((recipe) => (
          <li key={recipe?.id} className="flex justify-between gap-x-6 py-5">
            <Link href={`/recipe/${recipe?.id}`} className="w-full">
              <div className="flex min-w-0 gap-x-4">
                <div className="min-w-0 flex-auto">
                  <p className="text-sm font-semibold leading-6 text-gray-900">{recipe?.title}</p>
                  <p className="mt-1 truncate text-xs leading-5 text-gray-500">{recipe?.user?.name}</p>
                </div>
              </div>
              <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
                <p className="mt-1 text-xs leading-5 text-gray-500">
                  {DateTime.fromISO(recipe?.updated_at).toRelative()}
                </p>
              </div>
            </Link>
          </li>
            )))
          : null}
      </ul>
    </div>
  )
}
