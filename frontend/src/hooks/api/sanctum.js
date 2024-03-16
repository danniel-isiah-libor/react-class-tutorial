import axios from '@/lib/axios'
import useSWR from 'swr'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

/**
 * Use Sanctum authentication.
 *
 * @param {*} [{ middleware, redirectIfAuthenticated }={}]
 * @return {*}
 */
const useSanctum = ({ middleware, redirectIfAuthenticated } = {}) => {
  const router = useRouter()
  const baseURL = process.env.AUTH_SERVICE_URL

  /**
   * Fetch the user from the server.
   */
  const { data: user, error, mutate } = useSWR('/api/user', () =>
    axios(baseURL)
      .get('/api/user')
      .then(res => res.data)
      .catch(error => {
        if (error.response.status !== 409) throw error

        router.push('/verify-email')
      })
  )

  /**
   * Fetch the CSRF token.
   */
  const csrf = () => axios(baseURL).get('/sanctum/csrf-cookie')

  /**
   * Register a new user.
   *
   * @param {*} { setError, ...props }
   */
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

  /**
   * Log the user in.
   *
   * @param {*} { setError, ...props }
   */
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

  /**
   * Send a password reset email.
   *
   * @param {*} { setError, email }
   */
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

  /**
   * Reset the user's password.
   *
   * @param {*} { setError, ...props }
   */
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

  /**
   * Resend the email verification.
   */
  const resendEmailVerification = () => {
    axios(baseURL)
      .post('/email/verification-notification')
      .then(() => true)
  }

  /**
   * Log the user out.
   */
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

export { useSanctum }
