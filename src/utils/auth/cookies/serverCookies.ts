// utils/auth/cookies/server.ts
import { cookies } from 'next/headers'
import { COOKIE_NAME } from '@/constants/cookie-name'
import { IUser } from '@/types/actor/common/user/user.type'

export interface Session {
    token: string
    user: IUser
}

export async function setSessionCookie(session: Session, options?: Partial<{
    path: string
    maxAge: number
    httpOnly: boolean
    secure: boolean
    sameSite: 'lax' | 'strict' | 'none'
}>) {
    const cookieStore = cookies();
    (await cookieStore).set({
        name: COOKIE_NAME,
        value: JSON.stringify(session),
        path: '/',
        httpOnly: false,
        maxAge: 60 * 60 * 24 * 7,
        sameSite: 'lax',
        ...options,
    })
}

export async function getSessionCookie(): Promise<Session | null> {
    const cookieStore = cookies()
    const raw = (await cookieStore).get(COOKIE_NAME)?.value
    if (!raw) return null

    try {
        return JSON.parse(raw) as Session
    } catch {
        return null
    }
}

export async function clearSessionCookie() {
    const cookieStore = cookies();
    (await cookieStore).delete(COOKIE_NAME)
}
