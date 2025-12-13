// app/api/actor/securities/[securityId]/profile/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';
import { USER_TYPE, USER_RANK } from '@/constants/user-types';
import { verifyJWT } from '@/utils/auth';
import { GENDER, SOCIAL_STATUS } from '@/types/actor/common/index.type';
import { TSecurityProfileFormValues } from '@/validations/actor/securities/profile/security-profile.schema';
import { ISecurityProfile, ISecurityProfileResponse } from '@/types/actor/security/profile/security-profile-response.type';
import { IActionResponse } from '@/types/common/action-response.type';

// ---------------- GET ----------------
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ securityId: string }> }
) {
    try {
        const token = req.headers.get('authorization');
        if (!token) return NextResponse.json<ISecurityProfileResponse>({ status: 401, message: 'Unauthorized', user: {} as ISecurityProfile }, { status: 401 });

        const verifiedUser = verifyJWT(token);
        if (!verifiedUser) return NextResponse.json<ISecurityProfileResponse>({ status: 401, message: 'Invalid token', user: {} as ISecurityProfile }, { status: 401 });

        const { securityId } = await params;
        const user = await prisma.user.findUnique({
            where: { id: securityId },
            include: { security: true },
        });

        if (!user || !user.security) {
            return NextResponse.json<ISecurityProfileResponse>({ status: 404, message: 'Security person not found', user: {} as ISecurityProfile }, { status: 404 });
        }

        const profile: ISecurityProfile = {
            id: user.id,
            name: user.security.name,
            email: user.email,
            identity: user.security.identity,
            nationality: user.security.nationality,
            gender: user.security.gender as GENDER,
            profileImage: user.security.profileImage || null,
            mobileNumber: user.security.phoneNumber,
            alternativeMobileNumber: user.security.alternativePhoneNumber || undefined,
            role: USER_TYPE.SECURITY_PERSON,
            rank: user.security.rank as USER_RANK.SECURITY_PERSON | USER_RANK.SECURITY_OFFICER,
            socialStatus: SOCIAL_STATUS[user.security.socialStatus],
            additionalNotes: user.security.additionalNotes || undefined,
        };

        const response: ISecurityProfileResponse = {
            status: 200,
            message: 'تم جلب الملف الشخصي بنجاح',
            user: profile,
        };

        return NextResponse.json(response);
    } catch (err: any) {
        return NextResponse.json<ISecurityProfileResponse>({
            status: 500,
            message: err.message || 'Internal error',
            user: {} as ISecurityProfile,
            error: err.message,
        }, { status: 500 });
    }
}

// ---------------- PUT ----------------
export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ securityId: string }> }
) {
    try {
        const token = req.headers.get('authorization');
        if (!token) return NextResponse.json<IActionResponse>({ status: 401, message: 'Unauthorized' }, { status: 401 });

        const verifiedUser = verifyJWT(token);
        if (!verifiedUser || (verifiedUser.role !== USER_TYPE.MANAGER && verifiedUser.rank !== USER_RANK.SECURITY_OFFICER)) {
            return NextResponse.json<IActionResponse>({ status: 403, message: 'Forbidden' }, { status: 403 });
        }

        const { securityId } = await params;
        const body: TSecurityProfileFormValues = await req.json();

        const user = await prisma.user.findUnique({
            where: { id: securityId },
            include: { security: true },
        });

        if (!user || !user.security) {
            return NextResponse.json<IActionResponse>({ status: 404, message: 'Security person not found' }, { status: 404 });
        }

        const updatedSecurity = await prisma.securityProfile.update({
            where: { userId: user.id },
            data: {
                name: body.name,
                identity: body.identity,
                nationality: body.nationality,
                gender: body.gender,
                profileImage: body.profileImage || null,
                phoneNumber: body.mobileNumber,
                alternativePhoneNumber: body.alternativeMobileNumber || null,
                socialStatus: body.socialStatus,
                role: USER_TYPE.SECURITY_PERSON,
                rank: USER_RANK[body.rank as USER_RANK] || user.security.rank,
                additionalNotes: body.additionalNotes || null,
            },
        });

        const response: IActionResponse = {
            status: 200,
            message: 'تم تحديث بيانات فرد الأمن بنجاح',
        };

        return NextResponse.json(response);
    } catch (err: any) {
        return NextResponse.json<IActionResponse>({
            status: 500,
            message: err.message || 'Internal error',
            error: err.message,
        }, { status: 500 });
    }
}
