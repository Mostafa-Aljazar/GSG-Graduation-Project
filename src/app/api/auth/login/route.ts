'use server';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';
import { comparePassword, createJWT } from '@/utils/auth';
import { USER_TYPE, USER_RANK } from '@/constants/user-types';
import { IUser } from '@/types/actor/common/user/user.type';
import { COOKIE_NAME } from '@/constants/cookie-name';

export async function POST(req: NextRequest) {
    try {
        const { email, password, role } = await req.json();

        if (!email || !password || !role) {
            return NextResponse.json(
                { status: 400, message: 'الرجاء إدخال جميع البيانات المطلوبة' },
                { status: 400 }
            );
        }

        // include الديناميكي حسب نوع المستخدم
        const includeMap = {
            DISPLACED: { displaced: true },
            DELEGATE: { delegate: true },
            MANAGER: { manager: true },
            SECURITY_PERSON: { security: true },
        };

        const includeRelation = includeMap[role as keyof typeof includeMap] || {};

        // تعريف النوع بعد include
        type UserWithProfile = {
            id: string;
            email: string;
            password: string | null;
            role: USER_TYPE;
            rank: USER_RANK;
            status: string;
            createdAt: Date;
            updatedAt: Date;
            displaced?: {
                name: string;
                identity: string;
                phoneNumber: string;
                profileImage?: string | null;
            };
            delegate?: {
                name: string;
                identity: string;
                phoneNumber: string;
                profileImage?: string | null;
            };
            manager?: {
                name: string;
                identity: string;
                phoneNumber: string;
                profileImage?: string | null;
            };
            security?: {
                name: string;
                identity: string;
                phoneNumber: string;
                profileImage?: string | null;
            };
        };

        const userRecord = (await prisma.user.findFirst({
            where: { email, role },
            include: includeRelation,
        })) as UserWithProfile | null;

        if (!userRecord || !userRecord.password) {
            return NextResponse.json(
                { status: 401, message: 'بيانات الدخول غير صحيحة' },
                { status: 401 }
            );
        }

        const isValid = await comparePassword({
            password,
            hash: userRecord.password,
        });

        if (!isValid) {
            return NextResponse.json(
                { status: 401, message: 'بيانات الدخول غير صحيحة' },
                { status: 401 }
            );
        }

        const token = createJWT({
            id: userRecord.id,
            role: userRecord.role as USER_TYPE,
            rank: userRecord.rank as USER_RANK,
        });

        // profileData حسب نوع المستخدم
        const profileData: {
            name: string;
            identity: string;
            phoneNumber: string;
            profileImage: string | null;
        } = (() => {
            switch (role) {
                case USER_TYPE.DISPLACED:
                    return {
                        name: userRecord.displaced?.name || '',
                        identity: userRecord.displaced?.identity || '',
                        phoneNumber: userRecord.displaced?.phoneNumber || '',
                        profileImage: userRecord.displaced?.profileImage || null,
                    };
                case USER_TYPE.DELEGATE:
                    return {
                        name: userRecord.delegate?.name || '',
                        identity: userRecord.delegate?.identity || '',
                        phoneNumber: userRecord.delegate?.phoneNumber || '',
                        profileImage: userRecord.delegate?.profileImage || null,
                    };
                case USER_TYPE.MANAGER:
                    return {
                        name: userRecord.manager?.name || '',
                        identity: userRecord.manager?.identity || '',
                        phoneNumber: userRecord.manager?.phoneNumber || '',
                        profileImage: userRecord.manager?.profileImage || null,
                    };
                case USER_TYPE.SECURITY_PERSON:
                    return {
                        name: userRecord.security?.name || '',
                        identity: userRecord.security?.identity || '',
                        phoneNumber: userRecord.security?.phoneNumber || '',
                        profileImage: userRecord.security?.profileImage || null,
                    };
                default:
                    return {
                        name: '',
                        identity: '',
                        phoneNumber: '',
                        profileImage: null,
                    };
            }
        })();

        const user: IUser = {
            id: userRecord.id,
            name: profileData.name,
            email: userRecord.email,
            identity: profileData.identity,
            phoneNumber: profileData.phoneNumber,
            createdAt: userRecord.createdAt,
            role: userRecord.role as USER_TYPE,
            rank: userRecord.rank as USER_RANK,
            profileImage: profileData.profileImage,
        };

        // return NextResponse.json({
        //     status: 200,
        //     message: 'تم تسجيل الدخول بنجاح',
        //     token,
        //     user,
        // });

        const res = NextResponse.json({
            status: 200,
            message: 'تم تسجيل الدخول بنجاح',
            token,
            user,
        })

        // Set cookie in response
        res.cookies.set({
            name: COOKIE_NAME,
            value: JSON.stringify({ token, user }),
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24 * 7,
        })

        return res

    } catch (err: any) {
        return NextResponse.json(
            { status: 500, message: err.message || 'حدث خطأ أثناء تسجيل الدخول' },
            { status: 500 }
        );
    }
}
