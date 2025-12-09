'use server';

import { USER_TYPE, USER_RANK } from '@/constants/user-types';
import { AqsaGuestAPI } from '@/services/api';
import { IUser } from '@/types/actor/common/user/user.type';
import { ILoginResponse, } from '@/types/auth/loginResponse.type';

export interface ILoginProps {
    userType: USER_TYPE;
    email: string;
    password: string;
}

const USE_FAKE = true;

export const login = async ({
    email,
    password,
    userType,
}: ILoginProps): Promise<ILoginResponse> => {
    if (USE_FAKE) {
        const fakeResponse: ILoginResponse = {
            status: 200,
            message: 'تم تسجيل الدخول بنجاح',
            token: 'fake-jwt-token',
            user: {
                id: "1",
                name: 'John Doe',
                email,
                identity: '408656429',
                phoneNumber: '+1234567890',
                createdAt: new Date(),
                role: userType,
                rank: USER_RANK[userType],
                profileImage: null,
            },
            error: undefined,
        };

        return new Promise((resolve) => setTimeout(() => resolve(fakeResponse), 500));
    }

    /////////////////////////////////////////////////////////////
    // REAL IMPLEMENTATION
    /////////////////////////////////////////////////////////////
    try {
        const response = await AqsaGuestAPI.post('/login', {
            email,
            password,
            role: userType,
        });

        if (!response.data || response.status !== 200) {
            throw new Error('حدث خطأ في تسجيل الدخول');
        }

        return {
            status: 200,
            message: 'تم تسجيل الدخول بنجاح',
            token: response.data.token,
            user: response.data.user,
            error: undefined,
        };

    } catch (err: unknown) {
        const statusCode = 500;
        let errorMessage = 'حدث خطأ في تسجيل الدخول';

        if (err instanceof Error) {
            errorMessage = err.message;
        }

        return {
            status: statusCode,
            message: errorMessage,
            token: '',
            user: {} as IUser,
            error: errorMessage,
        };
    }
};
