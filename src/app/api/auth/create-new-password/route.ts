'use server';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';
import { hashPassword, } from '@/utils/auth';

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
        if (!user) {
            return NextResponse.json({ status: 404, message: 'User not found' }, { status: 404 });
        }
        // ensure OTP exists and not expired (to allow password creation)
        if (!user.otp) {
            return NextResponse.json({ status: 400, message: 'OTP not verified' }, { status: 400 });
        }

        const now = new Date();
        if (user.otp.expiresAt < now) {
            return NextResponse.json({ status: 400, message: 'OTP expired' }, { status: 400 });
        }

        // hash password and update user
        const hashed = await hashPassword({ password });

        await prisma.user.update({
            where: { id: user.id },
            data: { password: hashed, status: 'ACTIVE' },
        });

        // remove OTP record
        await prisma.userOtp.deleteMany({ where: { userId: user.id } });
        const res = NextResponse.json({ status: 200, message: 'Password set and go to login' });

        return res;
    } catch (err: any) {
        console.error(err);
        return NextResponse.json({ status: 500, message: err.message || 'Internal error' }, { status: 500 });
    }
}