// utils/auth/cookies/client.ts
import Cookies from 'js-cookie'
import { COOKIE_NAME } from '@/constants'
import { IUser } from '@/types/actor/common/user/user.type'

export interface Session {
    token: string
    user: IUser
}

export const cookieClient = {
    // Get session from cookie
    get(): Session | null {
        const raw = Cookies.get(COOKIE_NAME)
        if (!raw) return null

        try {
            return JSON.parse(raw) as Session
        } catch {
            return null
        }
    },

    // Set session in cookie
    set(session: Session, options?: Cookies.CookieAttributes) {
        Cookies.set(
            COOKIE_NAME,
            JSON.stringify(session),
            {
                path: '/',
                sameSite: 'lax',
                ...options, // allow overriding defaults, e.g., expires
            }
        )
    },

    // Clear session cookie
    clear() {
        Cookies.remove(COOKIE_NAME, { path: '/' })
    },
}
