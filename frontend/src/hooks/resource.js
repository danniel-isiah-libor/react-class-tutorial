import axios from '@/lib/axios'

/**
 * Create a new resource.
 *
 * @param {*} { setError, setLoading, baseURL, route }
 * @return {*}
 */
const useResource = ({ setError, setLoading, baseURL, route }) => {
  /**
   * Fetch all records from the resource.
   *
   * @return {*}
   */
  const index = () => {
    setLoading(true)

    return axios(baseURL).get(`${route}`)
      .then(({ data }) => data)
      .catch(error => error)
      .finally(() => setLoading(false))
  }

  /**
   * Fetch a single record from the resource.
   *
   * @param {*} id
   * @return {*}
   */
  const show = (id) => {
    setLoading(true)

    return axios(baseURL).get(`${route}/${id}`)
      .then(({ data }) => data)
      .catch(error => error)
      .finally(() => setLoading(false))
  }

  /**
   * Store a new record in the resource.
   *
   * @param {*} payload
   * @return {*}
   */
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

  /**
   * Update a record in the resource.
   *
   * @param {*} id
   * @param {*} payload
   * @return {*}
   */
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

  /**
   * Delete a record from the resource.
   *
   * @param {*} id
   * @return {*}
   */
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

export { useResource }
