'use client'

import React, { useState } from 'react'
import * as Yup from 'yup'
import { useRouter } from 'next/navigation'
import { useValidate } from '@/hooks/validate'
import { useRecipe } from '@/hooks/api/recipe'

export default function RecipeCreate () {
  // Form fields
  const fields = {
    title: '',
    ingredients: '',
    instructions: ''
  }

  // Form validation schema
  const schema = Yup.object().shape({
    title: Yup.string().required('This is a required field'),
    ingredients: Yup.string().required('This is a required field'),
    instructions: Yup.string().required('This is a required field')
  })

  const [form, setForm] = useState(fields)
  const [error, setError] = useState({})
  const { validate } = useValidate()
  const { store, loading } = useRecipe({ setError })
  const router = useRouter()

  /**
   * Handle form input change
   *
   * @param {*} event
   */
  const onChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }))
    setError((prev) => ({ ...prev, [event.target.name]: [] }))
  }

  /**
   * Handle form submission
   *
   * @param {*} event
   */
  const onSubmit = async (event) => {
    event.preventDefault()

    if (await validate({ ...form, setError, schema })) {
      store(form).then(() => router.push('/'))
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="space-y-12">
        <div className="border-b border-gray-900/10 pb-12">
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <label htmlFor="title" className="block text-sm font-medium leading-6 text-gray-900">
                Recipe
              </label>
              <div className="mt-2">
                <input
                    disabled={loading}
                    onChange={onChange}
                    type="text"
                    name="title"
                    id="title"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
                <small className="text-red-600">{error?.title}</small>
              </div>
            </div>

            <div className="col-span-full">
              <label htmlFor="ingredients" className="block text-sm font-medium leading-6 text-gray-900">
                Ingredients
              </label>
              <div className="mt-2">
                <textarea
                    disabled={loading}
                    onChange={onChange}
                    id="ingredients"
                    name="ingredients"
                    rows={3}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    defaultValue={''}
                />
                <small className="text-red-600">{error?.ingredients}</small>
              </div>
            </div>

            <div className="col-span-full">
              <label htmlFor="instructions" className="block text-sm font-medium leading-6 text-gray-900">
                Instructions
              </label>
              <div className="mt-2">
                <textarea
                    disabled={loading}
                    onChange={onChange}
                    id="instructions"
                    name="instructions"
                    rows={3}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    defaultValue={''}
                />
                <small className="text-red-600">{error?.instructions}</small>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button
          disabled={loading}
          onClick={() => router.push('/')}
          className="text-sm font-semibold leading-6 text-gray-900"
        >
          Cancel
        </button>
        <button
          disabled={loading}
          type="submit"
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Save
        </button>
      </div>
    </form>
  )
}
