import { usePassport } from './api/passport'
import { useSanctum } from './api/sanctum'

/**
 * This hook is used to determine which authentication service provider to use.
 *
 * @param {*} obj
 * @return {*}
 */
const useAuth = (obj) => {
  const sanctum = useSanctum(obj)
  const passport = usePassport(obj)

  switch (process.env.AUTH_SERVICE_PROVIDER) {
    case 'passport':
      return passport

    default:
      return sanctum
  }
}

export { useAuth }
