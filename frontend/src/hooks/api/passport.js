import axios from '@/lib/axios'
import useSWR from 'swr'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { deleteCookie, getCookie, hasCookie, setCookie } from 'cookies-next'

/**
 * Use Passport authentication.
 *
 * @param {*} [{ middleware, redirectIfAuthenticated }={}]
 * @return {*}
 */
const usePassport = ({ middleware, redirectIfAuthenticated } = {}) => {
  const router = useRouter()
  const baseURL = process.env.AUTH_SERVICE_URL

  /**
   * Fetch the user from the server.
   */
  const { data: user, error, mutate } = useSWR('/api/user', () =>
    axios(baseURL)
      .get('/api/user')
      .then(res => res.data)
      .catch((error) => {
        if (error.response.status === 401 && hasCookie('token')) {
          return refreshToken()
        } else {
          deleteCookie('token')
          throw error
        }
      })
  )

  /**
   * Refresh the token.
   */
  const refreshToken = () => {
    axios(baseURL)
      .post('/api/refresh-token', { refresh_token: JSON.parse(getCookie('token') ?? null)?.refresh_token })
      .then(({ data }) => {
        setCookie('token', data)
        mutate()
      })
      .catch((error) => {
        deleteCookie('token')
        throw error
      })
  }

  /**
   * Register a new user.
   *
   * @param {*} { setError, ...props }
   */
  const register = ({ setError, ...props }) => {
    setError({})

    axios(baseURL)
      .post('/register', props)
      .then(({ data }) => {
        setCookie('token', data)
        mutate()
      })
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
  const login = ({ setError, ...props }) => {
    setError({})

    axios(baseURL)
      .post('/login', props)
      .then(({ data }) => {
        setCookie('token', data)
        mutate()
      })
      .catch(error => {
        if (error.response.status !== 422) throw error

        setError((prev) => ({ ...prev, ...error.response.data.errors }))
      })
  }

  /**
   * Send a forgot password email.
   *
   * @param {*} { setError, email }
   */
  const forgotPassword = ({ setError, email }) => {
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
  const resetPassword = ({ setError, ...props }) => {
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
   * Resend the email verification notification.
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
      await axios(baseURL).post('/logout').then(() => {
        deleteCookie('token')
        mutate()
      })
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

export { usePassport }
