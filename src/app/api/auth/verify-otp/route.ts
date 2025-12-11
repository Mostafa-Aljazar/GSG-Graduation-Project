import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';

export async function POST(req: NextRequest) {
    try {
        const { email, otp } = await req.json();

        if (!email || !otp) return NextResponse.json({ status: 400, message: 'Email and otp required' }, { status: 400 });

        const user = await prisma.user.findUnique({ where: { email }, include: { otp: true } });

        if (!user || !user.otp) {
            return NextResponse.json({ status: 404, message: 'OTP not found' }, { status: 404 });
        }

        const now = new Date();
        if (user.otp.expiresAt < now) {
            return NextResponse.json({ status: 400, message: 'OTP expired' }, { status: 400 });
        }

        if (user.otp.otp !== otp) {
            return NextResponse.json({ status: 400, message: 'Invalid OTP' }, { status: 400 });
        }

        // Optionally mark verified: we could delete OTP or keep it until password set
        // We'll keep it until create-new-password but could mark a flag.

        // حذف الـ OTP بعد التحقق بنجاح
        // await prisma.userOtp.delete({ where: { userId: user.id } });

        return NextResponse.json({ status: 200, message: 'OTP verified' }, { status: 200 });
    } catch (err: any) {
        console.error(err);
        return NextResponse.json({ status: 500, message: err.message || 'Internal error' }, { status: 500 });
    }
}
