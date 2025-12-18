import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';
import { createJWT } from '@/utils/auth';
import { USER_TYPE, USER_RANK } from '@gen/client';
import { sendOTPEmail } from '@/actions/auth/sendOTPEmail';
import { GENDER, SOCIAL_STATUS } from '@/types/actor/common/index.type';
import { generateOTP } from '@/utils/auth/otp';



export async function POST(req: NextRequest) {
    try {
        const token = req.headers.get('authorization');

        if (!token) return NextResponse.json({ status: 401, message: 'Unauthorized' }, { status: 401 });

        // verify token and ensure manager role
        // verifyJWT is exported from utils/auth via index
        const { verifyJWT } = await import('@/utils/auth');
        let verified: any;
        try {
            verified = verifyJWT(token);
        } catch (e) {
            return NextResponse.json({ status: 401, message: 'Invalid token' }, { status: 401 });
        }

        if (!verified || verified.role !== USER_TYPE.MANAGER) {
            return NextResponse.json({ status: 403, message: 'Forbidden' }, { status: 403 });
        }

        const body = await req.json();
        const { name, email, identity, nationality, gender, mobileNumber, alternativeMobileNumber, age, socialStatus, education } = body;

        if (!email || !name) {
            return NextResponse.json({ status: 400, message: 'Email and name are required' }, { status: 400 });
        }

        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
            return NextResponse.json({ status: 400, message: 'User with this email already exists' }, { status: 400 });
        }

        // create user (no password yet) and delegate profile
        const user = await prisma.user.create({
            data: {
                email,
                role: USER_TYPE.DELEGATE,
                rank: USER_RANK.DELEGATE,
                status: 'PENDING',
                delegate: {
                    create: {
                        name,
                        identity: identity || '',
                        nationality: nationality || '',
                        gender: GENDER[gender as GENDER] || 'MALE',
                        phoneNumber: mobileNumber || '',
                        alternativePhoneNumber: alternativeMobileNumber || null,
                        age: age || 0,
                        socialStatus: (socialStatus as SOCIAL_STATUS) || 'SINGLE',
                        education: education || '',
                        numberOfResponsibleCamps: 0,
                        numberOfFamilies: 0,
                    },
                },
            },
            include: { delegate: true },
        });
        console.log("🚀 ~ POST ~ user.id:", user.id)

        // create OTP
        const otp = generateOTP();
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

        await prisma.userOtp.create({
            data: {
                userId: user.id,
                otp,
                expiresAt,
            },
        });

        // send OTP email
        try {
            await sendOTPEmail(email, otp);
        } catch (err) {
            // Log but continue
            console.error('Failed to send OTP', err);
        }

        return NextResponse.json({ status: 201, message: 'Delegate created and OTP sent', userId: user.id }, { status: 201 });
    } catch (err: any) {
        console.error(err);
        return NextResponse.json({ status: 500, message: err.message || 'Internal error' }, { status: 500 });
    }
}
