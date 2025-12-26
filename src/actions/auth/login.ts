'use server'

import { USER_TYPE, } from '@/constants/user-types'
import { AqsaGuestAPI } from '@/services/api'
import { IUser } from '@/types/actor/common/user/user.type'
import { ILoginResponse } from '@/types/auth/loginResponse.type'
import { setSessionCookie, getSessionCookie } from '@/utils/auth/cookies/serverCookies'

export interface ILoginProps {
    userType: USER_TYPE
    email: string
    password: string
}

export const login = async ({
    email,
    password,
    userType,
}: ILoginProps): Promise<ILoginResponse> => {
    try {
        // src\app\api\auth\login
        const response = await AqsaGuestAPI.post<ILoginResponse>('/auth/login', {
            email,
            password,
            role: userType,
        })

        if (!response.data || response.status !== 200) {
            throw new Error('حدث خطأ في تسجيل الدخول')
        }

        await setSessionCookie({ token: response.data.token, user: response.data.user })

        return {
            status: 200,
            message: 'تم تسجيل الدخول بنجاح',
            token: response.data.token,
            user: response.data.user,
            error: undefined,
        }
    } catch (err: unknown) {
        let errorMessage = 'حدث خطأ في تسجيل الدخول'
        if (err instanceof Error) errorMessage = err.message

        return {
            status: 500,
            message: errorMessage,
            token: '',
            user: {} as IUser,
            error: errorMessage,
        }
    }
}
