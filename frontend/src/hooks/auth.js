import { useSanctum } from "./api/sanctum"
import { usePassport } from "./api/passport"

export const useAuth = (obj) => {
    switch (process.env.AUTH_SERVICE_PROVIDER) {
        case 'passport':
            return usePassport(obj)

        default:
            return useSanctum(obj)
    }
}