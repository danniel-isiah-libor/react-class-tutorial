import useSWR from 'swr'
import axios from '@/lib/axios'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export const useSanctum = ({ middleware, redirectIfAuthenticated } = {}) => {
  const router = useRouter()
  const baseURL = process.env.AUTH_SERVICE_URL

  const { data: user, error, mutate } = useSWR('/api/user', () =>
    axios(baseURL)
      .get('/api/user')
      .then(res => res.data)
      .catch(error => {
        if (error.response.status !== 409) throw error

        router.push('/verify-email')
      })
  )

  const csrf = () => axios(baseURL).get('/sanctum/csrf-cookie')

  const register = async ({ setError, ...props }) => {
    await csrf()

    setError({})

    axios(baseURL)
      .post('/register', props)
      .then(() => mutate())
      .catch(error => {
        if (error.response.status !== 422) throw error

        setError((prev) => ({ ...prev, ...error.response.data.errors }))
      })
  }

  const login = async ({ setError, ...props }) => {
    await csrf()

    setError({})

    axios(baseURL)
      .post('/login', props)
      .then(() => mutate())
      .catch(error => {
        if (error.response.status !== 422) throw error

        setError((prev) => ({ ...prev, ...error.response.data.errors }))
      })
  }

  const forgotPassword = async ({ setError, email }) => {
    await csrf()

    setError({})

    axios(baseURL)
      .post('/forgot-password', { email })
      .then(() => true)
      .catch(error => {
        if (error.response.status !== 422) throw error

        setError((prev) => ({ ...prev, ...error.response.data.errors }))
      })
  }

  const resetPassword = async ({ setError, ...props }) => {
    await csrf()

    setError({})

    axios(baseURL)
      .post('/reset-password', { token: router.query.token, ...props })
      .then(response => router.push('/login?reset=' + btoa(response.data.status)))
      .catch(error => {
        if (error.response.status !== 422) throw error

        setError((prev) => ({ ...prev, ...error.response.data.errors }))
      })
  }

  const resendEmailVerification = () => {
    axios(baseURL)
      .post('/email/verification-notification')
      .then(() => true)
  }

  const logout = async () => {
    if (!error) {
      await axios(baseURL).post('/logout')

      mutate()
    }

    window.location.pathname = '/login'
  }

  useEffect(() => {
    if (middleware === 'guest' && redirectIfAuthenticated && user) router.push(redirectIfAuthenticated)
    if (middleware === 'auth' && error) logout()
  }, [user, error])

  return {
    user,
    register,
    login,
    forgotPassword,
    resetPassword,
    resendEmailVerification,
    logout
  }
}
