'use client'

import React, { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/auth'
import { useRecipe } from '@/hooks/api/recipe'
import { useRouter } from 'next/navigation'

export default function RecipeShow ({ params }) {
  const { user } = useAuth({ middleware: 'auth' })
  const [recipe, setRecipe] = useState({})
  const { show, destroy } = useRecipe()
  const router = useRouter()

  useEffect(() => {
    show(params.id).then((data) => setRecipe(data))
  }, [])

  const onDelete = async () => {
    await destroy(params.id).then(() => router.push('/'))
  }

  if (!user) return (<></>)

  return (
    <div>
      <div className="px-4 sm:px-0">
        <h3 className="text-base font-semibold leading-7 text-gray-900">{recipe?.title}</h3>
        <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">{recipe?.user?.name}</p>
      </div>
      <div className="mt-6 border-t border-gray-100">
        <dl className="divide-y divide-gray-100">
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">Ingredients</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0" style={{ whiteSpace: "pre-line" }}>
              {recipe?.ingredients}
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">Instructions</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0" style={{ whiteSpace: "pre-line" }}>
              {recipe?.instructions}
            </dd>
          </div>
        </dl>
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button onClick={() => router.push('/')} className="text-sm font-semibold leading-6 text-gray-900">
          Back
        </button>
        {user?.id === recipe?.user_id
          ? <>
              <button
                onClick={() => router.push(`/recipe/${params.id}/edit`)}
                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete()}
                className="rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
              >
                Delete
              </button>
            </>
          : null
        }
      </div>
    </div>
  )
}
