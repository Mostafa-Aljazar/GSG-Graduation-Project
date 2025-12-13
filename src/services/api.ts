import { clearSessionCookie, getSessionCookie } from '@/utils/auth/cookies/serverCookies'
import axios from 'axios'

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api'

const defaultConfig = {
  baseURL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
}

export const AqsaGuestAPI = axios.create(defaultConfig)

AqsaGuestAPI.interceptors.response.use(
  res => res,
  err => {
    if (!err.response) {
      return Promise.reject({ status: 500, error: 'حدث خطأ في الشبكة' })
    }
    return Promise.reject(err)
  }
)

export const AqsaAPI = axios.create(defaultConfig)

AqsaAPI.interceptors.request.use(
  async config => {
    const session = await getSessionCookie()
    if (!session?.token) {
      throw { status: 401, error: 'يرجى تسجيل الدخول للمتابعة' }
    }
    config.headers.Authorization = session.token;
    return config
  },
  err => Promise.reject(err)
)

AqsaAPI.interceptors.response.use(
  res => res,
  async err => {
    if (!err.response) {
      return Promise.reject({ status: 500, error: 'حدث خطأ في الشبكة' })
    }
    console.log("🚀 ~ err.response:", err.response)
    if (err.response.status === 401) {
      // await clearSessionCookie()
    }
    return Promise.reject(err)
  }
)
