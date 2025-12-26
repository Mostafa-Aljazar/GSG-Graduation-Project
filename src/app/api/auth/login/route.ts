'use server';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';
import { comparePassword, createJWT } from '@/utils/auth';
import { IUser } from '@/types/actor/common/user/user.type';
import { COOKIE_NAME } from '@/constants';
import { USER_TYPE } from '@prisma/client';
import { USER_TYPE as USER_TYPE_LOCAL, USER_RANK as USER_RANK_LOCAL } from '@/constants/user-types';

export async function POST(req: NextRequest) {
    try {
        const { email, password, role } = await req.json();

        if (!email || !password || !role) {
            return NextResponse.json(
                { status: 400, message: 'الرجاء إدخال جميع البيانات المطلوبة' },
                { status: 400 }
            );
        }

        // Step 1: Find user by email and role
        const userRecord = await prisma.user.findFirst({
            where: { email, role: role as USER_TYPE },
        });

        if (!userRecord || !userRecord.password) {
            return NextResponse.json(
                { status: 401, message: 'بيانات الدخول غير صحيحة' },
                { status: 401 }
            );
        }

        // Step 2: Verify password
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

        // Step 3: Fetch profile separately
        let profileData: {
            name: string;
            identity: string;
            phoneNumber: string;
            profileImage: string | null;
        } | null = null;

        switch (role) {
            case USER_TYPE.DISPLACED:
                const displaced = await prisma.displacedProfile.findUnique({
                    where: { userId: userRecord.id },
                });
                profileData = displaced
                    ? {
                        name: displaced.name,
                        identity: displaced.identity,
                        phoneNumber: displaced.phoneNumber,
                        profileImage: displaced.profileImage || null,
                    }
                    : { name: '', identity: '', phoneNumber: '', profileImage: null };
                break;

            case USER_TYPE.DELEGATE:
                const delegate = await prisma.delegateProfile.findUnique({
                    where: { userId: userRecord.id },
                });
                profileData = delegate
                    ? {
                        name: delegate.name,
                        identity: delegate.identity,
                        phoneNumber: delegate.phoneNumber,
                        profileImage: delegate.profileImage || null,
                    }
                    : { name: '', identity: '', phoneNumber: '', profileImage: null };
                break;

            case USER_TYPE.MANAGER:
                const manager = await prisma.managerProfile.findUnique({
                    where: { userId: userRecord.id },
                });
                profileData = manager
                    ? {
                        name: manager.name,
                        identity: manager.identity,
                        phoneNumber: manager.phoneNumber,
                        profileImage: manager.profileImage || null,
                    }
                    : { name: '', identity: '', phoneNumber: '', profileImage: null };
                break;

            case USER_TYPE.SECURITY_PERSON:
                const security = await prisma.securityProfile.findUnique({
                    where: { userId: userRecord.id },
                });
                profileData = security
                    ? {
                        name: security.name,
                        identity: security.identity,
                        phoneNumber: security.phoneNumber,
                        profileImage: security.profileImage || null,
                    }
                    : { name: '', identity: '', phoneNumber: '', profileImage: null };
                break;

            default:
                profileData = { name: '', identity: '', phoneNumber: '', profileImage: null };
        }

        // Step 4: Generate JWT
        const token = createJWT({
            id: userRecord.id,
            role: userRecord.role as USER_TYPE,
            rank: userRecord.rank,
        });

        // Step 5: Build user object
        const user: IUser = {
            id: userRecord.id,
            email: userRecord.email,
            role: userRecord.role as USER_TYPE_LOCAL,
            rank: userRecord.rank as USER_RANK_LOCAL,
            name: profileData.name,
            identity: profileData.identity,
            phoneNumber: profileData.phoneNumber,
            profileImage: profileData.profileImage,
            createdAt: userRecord.createdAt,
        };

        // Step 6: Send response with cookie
        const res = NextResponse.json({
            status: 200,
            message: 'تم تسجيل الدخول بنجاح',
            token,
            user,
        });

        res.cookies.set({
            name: COOKIE_NAME,
            value: JSON.stringify({ token, user }),
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24 * 7, // 7 days
        });

        return res;
    } catch (err: any) {
        return NextResponse.json(
            { status: 500, message: err.message || 'حدث خطأ أثناء تسجيل الدخول' },
            { status: 500 }
        );
    }
}
