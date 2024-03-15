import Axios from 'axios'
import { getCookie } from 'cookies-next'

const axios = (baseURL) => Axios.create({
  baseURL,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    Accept: 'application/json',
    Authorization: `Bearer ${JSON.parse(getCookie('token') ?? null)?.access_token}`
  },
  withCredentials: true,
  withXSRFToken: true
})

export default axios
