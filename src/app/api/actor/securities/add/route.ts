import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';
import { USER_TYPE, USER_RANK } from '@prisma/client';
import { sendOTPEmail } from '@/actions/auth/sendOTPEmail';
import { GENDER, SOCIAL_STATUS } from '@/types/actor/common/index.type';
import { generateOTP } from '@/utils/auth/otp';
import { verifyJWT } from '@/utils/auth';
import { IActionResponse } from '@/types/common/action-response.type';
import { USER_TYPE as USER_TYPE_LOCAL, USER_RANK as USER_RANK_LOCAL } from '@/constants/user-types';

export async function POST(req: NextRequest) {
    try {
        const token = req.headers.get('authorization');
        if (!token) return NextResponse.json<IActionResponse>({ status: 401, message: 'Unauthorized' }, { status: 401 });

        const verified = verifyJWT(token);

        if ((verified.role !== USER_TYPE_LOCAL.MANAGER && verified.rank !== USER_RANK_LOCAL.SECURITY_OFFICER)) {
            return NextResponse.json<IActionResponse>({ status: 403, message: 'Forbidden' }, { status: 403 });
        }

        const body = await req.json();
        const {
            name,
            email,
            identity,
            nationality,
            gender,
            profileImage,
            mobileNumber,
            alternativeMobileNumber,
            socialStatus,
            additionalNotes,
            rank,
        } = body;

        if (!email || !name) {
            return NextResponse.json<IActionResponse>({ status: 400, message: 'Email and name are required' }, { status: 400 });
        }

        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
            return NextResponse.json<IActionResponse>({ status: 400, message: 'User with this email already exists' }, { status: 400 });
        }

        // Create user with SecurityProfile
        const user = await prisma.user.create({
            data: {
                email,
                role: USER_TYPE.SECURITY_PERSON,
                rank: rank === USER_RANK.SECURITY_OFFICER ? USER_RANK.SECURITY_OFFICER : USER_RANK.SECURITY_PERSON,
                status: 'PENDING',
                security: {
                    create: {
                        name,
                        identity: identity || '',
                        nationality: nationality || '',
                        gender: GENDER[gender as GENDER] || GENDER.MALE,
                        phoneNumber: mobileNumber || '',
                        alternativePhoneNumber: alternativeMobileNumber || null,
                        socialStatus: socialStatus || SOCIAL_STATUS.SINGLE,
                        additionalNotes: additionalNotes || null,
                        profileImage: profileImage || '',
                        role: USER_TYPE.SECURITY_PERSON,
                        rank: USER_RANK[rank as USER_RANK] || USER_RANK.SECURITY_PERSON,
                    },
                },
            },
            include: { security: true },
        });

        // Generate OTP
        const otp = generateOTP();
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

        await prisma.userOtp.create({
            data: {
                userId: user.id,
                otp,
                expiresAt,
            },
        });

        // Send OTP email
        try {
            await sendOTPEmail(email, otp);
        } catch (err) {
            console.error('Failed to send OTP', err);
        }

        return NextResponse.json<IActionResponse>({
            status: 201,
            message: 'Security person created and OTP sent',
        }, { status: 201 });

    } catch (err: any) {
        console.error(err);
        return NextResponse.json<IActionResponse>({ status: 500, message: err.message || 'Internal error' }, { status: 500 });
    }
}
