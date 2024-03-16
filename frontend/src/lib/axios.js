import Axios from 'axios'
import { getCookie } from 'cookies-next'

/**
 * Create a new Axios instance.
 *
 * @param {*} baseURL
 */
const axios = (baseURL) => {
  const headers = {
    'X-Requested-With': 'XMLHttpRequest',
    Accept: 'application/json'
  }

  const token = JSON.parse(getCookie('token') ?? null)?.access_token

  if(token) headers.Authorization = `Bearer ${token}`

  return Axios.create({
    baseURL,
    headers,
    withCredentials: true,
    withXSRFToken: true
  })
}

export default axios
