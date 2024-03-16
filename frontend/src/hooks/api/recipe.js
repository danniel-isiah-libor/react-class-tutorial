import { useState } from 'react'
import { useResource } from '../resource'

/**
 * Use the Recipe service.
 *
 * @param {*} [{ setError }={}]
 * @return {*}
 */
const useRecipe = ({ setError } = {}) => {
  const baseURL = process.env.RECIPE_SERVICE_URL
  const route = '/api/recipes'
  const [loading, setLoading] = useState(false)

  return {
    ...useResource({ setError, setLoading, baseURL, route }),
    loading
  }
}

export { useRecipe }
