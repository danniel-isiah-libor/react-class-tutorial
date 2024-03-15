import axios from '@/lib/axios'

export const useResource = ({ setError, setLoading, baseURL, route }) => {
  const index = () => {
    setLoading(true)

    return axios(baseURL).get(`${route}`)
      .then(({ data }) => data)
      .catch(error => error)
      .finally(() => setLoading(false))
  }

  const show = (id) => {
    setLoading(true)

    return axios(baseURL).get(`${route}/${id}`)
      .then(({ data }) => data)
      .catch(error => error)
      .finally(() => setLoading(false))
  }

  const store = (payload) => {
    setLoading(true)

    return axios(baseURL).post(`${route}`, payload)
      .then(({ data }) => data)
      .catch(error => {
        if (error.response.status !== 422) throw error

        setError((prev) => ({ ...prev, ...error.response.data.errors }))
      })
      .finally(() => setLoading(false))
  }

  const update = (id, payload) => {
    setLoading(true)

    return axios(baseURL).put(`${route}/${id}`, payload)
      .then(({ data }) => data)
      .catch(error => {
        if (error.response.status !== 422) throw error

        setError((prev) => ({ ...prev, ...error.response.data.errors }))
      })
      .finally(() => setLoading(false))
  }

  const destroy = (id) => {
    setLoading(true)

    return axios(baseURL).delete(`${route}/${id}`)
      .then(({ data }) => data)
      .catch(error => error)
      .finally(() => setLoading(false))
  }

  return {
    index,
    show,
    store,
    update,
    destroy
  }
}
