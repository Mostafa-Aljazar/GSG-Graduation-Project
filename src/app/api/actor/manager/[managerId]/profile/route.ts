import { NextResponse } from 'next/server'
import { prisma } from '@/utils/prisma'
import { USER_TYPE, USER_RANK } from '@/constants/user-types'
import { GENDER, SOCIAL_STATUS } from '@/types/actor/common/index.type'
import { verifyJWT } from '@/utils/auth';

export async function GET(request: Request, { params }: { params: Promise<{ managerId: string }> }) {
    try {

        const token = request.headers.get('authorization');

        if (!token) {
            return NextResponse.json({ status: 401, message: 'غير مصرح' }, { status: 401 })
        }

        const { managerId } = await params
        if (!managerId) {
            return NextResponse.json(
                { status: 400, message: 'معرّف المدير مطلوب', user: {} },
                { status: 400 }
            )
        }

        const userRecord = await prisma.user.findUnique({
            where: { id: managerId },
            include: { manager: true },
        })

        if (!userRecord || !userRecord.manager) {
            return NextResponse.json(
                { status: 404, message: 'الملف الشخصي غير موجود', user: {} },
                { status: 404 }
            )
        }

        const profile = {
            id: userRecord.id,
            name: userRecord.manager.name,
            email: userRecord.email,
            identity: userRecord.manager.identity,
            nationality: userRecord.manager.nationality,
            gender: GENDER[userRecord.manager.gender],
            profileImage: userRecord.manager.profileImage || null,
            mobileNumber: userRecord.manager.phoneNumber,
            alternativeMobileNumber: userRecord.manager.alternativePhoneNumber || undefined,
            role: USER_TYPE.MANAGER,
            rank: USER_RANK.MANAGER,
            socialStatus: SOCIAL_STATUS[userRecord.manager.socialStatus],
        }

        return NextResponse.json({
            status: 200,
            message: 'تم جلب الملف الشخصي بنجاح',
            user: profile,
        })
    } catch (err: any) {
        return NextResponse.json(
            { status: 500, message: err.message || 'خطأ داخلي', user: {} },
            { status: 500 }
        )
    }
}


export async function PUT(
    request: Request,
    { params }: { params: Promise<{ managerId: string }> }
) {
    try {
        const token = request.headers.get('authorization');
        if (!token) {
            return NextResponse.json({ status: 401, message: 'Unauthorized' }, { status: 401 });
        }

        // verify token and get user info (implement verifyJWT in utils)
        const verifiedUser = verifyJWT(token);

        if (!verifiedUser) {
            return NextResponse.json({ status: 401, message: 'Invalid token' }, { status: 401 });
        }

        const { managerId } = await params;
        const body = await request.json();


        const isAuthorized = managerId == verifiedUser.id && verifiedUser.role == USER_TYPE.MANAGER
        if (!isAuthorized) {
            return NextResponse.json({ status: 401, message: 'not authorized' }, { status: 401 });
        }


        const userRecord = await prisma.user.findUnique({
            where: { id: managerId },
            include: { manager: true },
        });

        if (!userRecord || !userRecord.manager) {
            return NextResponse.json(
                { status: 404, message: 'Manager not found', user: {} },
                { status: 404 }
            );
        }

        // update manager fields
        const updatedManager = await prisma.managerProfile.update({
            where: { userId: userRecord.id },
            data: {
                name: body.name,
                identity: body.identity,
                nationality: body.nationality,
                gender: body.gender,
                profileImage: body.profileImage || null,
                phoneNumber: body.mobileNumber,
                alternativePhoneNumber: body.alternativeMobileNumber || null,
                socialStatus: body.socialStatus,
            },
        });

        return NextResponse.json({
            status: 200,
            message: 'Manager profile updated successfully',
            user: {
                id: userRecord.id,
                name: updatedManager.name,
                email: userRecord.email,
                identity: updatedManager.identity,
                nationality: updatedManager.nationality,
                gender: GENDER[updatedManager.gender],
                profileImage: updatedManager.profileImage,
                mobileNumber: updatedManager.phoneNumber,
                alternativeMobileNumber: updatedManager.alternativePhoneNumber,
                role: USER_TYPE.MANAGER,
                rank: USER_RANK.MANAGER,
                socialStatus: SOCIAL_STATUS[updatedManager.socialStatus],
            },
        });
    } catch (err: any) {
        return NextResponse.json(
            { status: 500, message: err.message || 'Internal error' },
            { status: 500 }
        );
    }
}

