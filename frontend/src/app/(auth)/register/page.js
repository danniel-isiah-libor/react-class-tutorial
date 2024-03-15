'use client'

import React, { useState } from 'react'
import * as Yup from 'yup'
import { useAuth } from '@/hooks/auth'
import { useValidate } from '@/hooks/validate'

export default function Register () {
  const { register } = useAuth({
    middleware: 'guest',
    redirectIfAuthenticated: '/'
  })

  const fields = {
    name: '',
    email: '',
    password: '',
    password_confirmation: ''
  }

  const schema = Yup.object().shape({
    name: Yup.string().required('This field is required'),
    email: Yup.string().email('Invalid email format').required('This field is required'),
    password: Yup.string().required('This field is required'),
    password_confirmation: Yup.string()
      .required('This field is required')
      .oneOf([Yup.ref('password')], 'Password doesn\'t match')
  })

  const [form, setForm] = useState(fields)
  const [error, setError] = useState({})
  const { validate } = useValidate()

  const onChange = async (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setError((prev) => ({ ...prev, [e.target.name]: [] }))
  }

  const onSubmit = async (e) => {
    e.preventDefault()

    if (await validate({ ...form, setError, schema })) {
      register({ ...form, setError })
    }
  }

  return (
      <>
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <img
              className="mx-auto h-10 w-auto"
              src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
              alt="Your Company"
            />
            <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
              Sign up an account
            </h2>
          </div>

          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form onSubmit={onSubmit} className="space-y-6">
            <div>
                <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                  Name
                </label>
                <div className="mt-2">
                  <input
                    onChange={onChange}
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                  <small className="text-red-600">{error?.name}</small>
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    onChange={onChange}
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                  <small className="text-red-600">{error?.email}</small>
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                    Password
                </label>
                <div className="mt-2">
                  <input
                    onChange={onChange}
                    id="password"
                    name="password"
                    type="password"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                  <small className="text-red-600">{error?.password}</small>
                </div>
              </div>

              <div>
                <label htmlFor="password_confirmation" className="block text-sm font-medium leading-6 text-gray-900">
                    Password Confirmation
                </label>
                <div className="mt-2">
                  <input
                    onChange={onChange}
                    id="password_confirmation"
                    name="password_confirmation"
                    type="password"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                  <small className="text-red-600">{error?.password_confirmation}</small>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Sign up
                </button>
              </div>
            </form>
          </div>
        </div>
      </>
  )
}
