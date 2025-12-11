import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';
import { hashPassword, } from '@/utils/auth';
import { AUTH_ROUTES } from '@/constants/routes';

export async function POST(req: NextRequest) {
    try {
        const { email, password, confirmPassword } = await req.json();

        if (!email || !password || !confirmPassword) {
            return NextResponse.json({ status: 400, message: 'Missing required fields' }, { status: 400 });
        }

        if (password !== confirmPassword) {
            return NextResponse.json({ status: 400, message: 'Passwords do not match' }, { status: 400 });
        }

        const user = await prisma.user.findUnique({ where: { email }, include: { otp: true } });
        console.log("🚀 ~ POST ~ user:", user)
        if (!user) return NextResponse.json({ status: 404, message: 'User not found' }, { status: 404 });

        // ensure OTP exists and not expired (to allow password creation)
        if (!user.otp) return NextResponse.json({ status: 400, message: 'OTP not verified' }, { status: 400 });

        const now = new Date();
        if (user.otp.expiresAt < now) {
            return NextResponse.json({ status: 400, message: 'OTP expired' }, { status: 400 });
        }

        // hash password and update user
        const hashed = await hashPassword({ password });

        const updated = await prisma.user.update({
            where: { id: user.id },
            data: { password: hashed, status: 'ACTIVE' },
        });

        // remove OTP record
        await prisma.userOtp.deleteMany({ where: { userId: user.id } });

        // create JWT and set cookie (same behavior as login)
        // const token = createJWT({ id: updated.id, role: updated.role as USER_TYPE, rank: updated.rank as USER_RANK });

        // const profile = {
        //     id: updated.id,
        //     name: '',
        //     email: updated.email,
        //     identity: '',
        //     nationality: '',
        //     gender: '',
        //     profileImage: null,
        //     mobileNumber: '',
        //     alternativeMobileNumber: undefined,
        //     role: updated.role,
        //     rank: updated.rank,
        // };

        // const res = NextResponse.json({ status: 200, message: 'Password set and logged in', token, user: profile });
        const res = NextResponse.json({ status: 200, message: 'Password set and go to login' });
        NextResponse.redirect(AUTH_ROUTES.LOGIN)
        // res.cookies.set({
        //     name: COOKIE_NAME,
        //     value: JSON.stringify({ token, user: profile }),
        //     httpOnly: true,
        //     secure: process.env.NODE_ENV === 'production',
        //     sameSite: 'lax',
        //     path: '/',
        //     maxAge: 60 * 60 * 24 * 7,
        // });

        return res;
    } catch (err: any) {
        console.error(err);
        return NextResponse.json({ status: 500, message: err.message || 'Internal error' }, { status: 500 });
    }
}
