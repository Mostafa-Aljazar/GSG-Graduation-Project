import { getSession } from '@/utils/auth/getSession'
import { logout } from '@/utils/auth/logout'
import axios from 'axios'

// const baseURL = "https://travel-and-explore.online/api"
const baseURL = ''


// Shared config
const defaultConfig = {
  baseURL: baseURL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
}


// Guest API
const AqsaGuestAPI = axios.create(defaultConfig)

AqsaGuestAPI.interceptors.response.use(
  res => res,
  err => {
    if (!err.response) {
      return Promise.reject({
        status: 500,
        error: 'حدث خطأ في الشبكة'
      })
    }

    return Promise.reject(err)
  }
)


// Auth API
const AqsaAPI = axios.create(defaultConfig)

AqsaAPI.interceptors.request.use(async config => {
  const session = getSession()

  if (!session?.token) {
    return Promise.reject({
      status: 401,
      error: 'يرجى تسجيل الدخول للمتابعة'
    })
  }

  config.headers['Authorization'] = `Bearer ${session.token}`
  return config
})

AqsaAPI.interceptors.response.use(
  res => res,
  err => {
    if (!err.response) {
      return Promise.reject({
        status: 500,
        error: 'حدث خطأ في الشبكة'
      })
    }

    if (err.response.status === 401) {
      logout()
    }

    return Promise.reject(err)
  }
)


export { AqsaGuestAPI, AqsaAPI }
