import { LOCALSTORAGE_SESSION_KEY } from "@/constants/session-key"
import { AUTH_ROUTES } from "@/constants/routes"

export const logout = () => {
  localStorage.removeItem(LOCALSTORAGE_SESSION_KEY) // remove session from local storage
  window.location.href = AUTH_ROUTES.LOGIN // redirect to login page
}
