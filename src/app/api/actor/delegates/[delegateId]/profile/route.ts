// app/api/actor/delegates/[delegateId]/profile/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';
import { USER_TYPE } from '@/constants/user-types';
import { verifyJWT } from '@/utils/auth';
import { GENDER, SOCIAL_STATUS } from '@prisma/client';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ delegateId: string }> }
) {
    try {
        const token = request.headers.get('authorization');
        if (!token) {
            return NextResponse.json({ status: 401, message: 'غير مصرح' }, { status: 401 });
        }

        const verifiedUser = verifyJWT(token);
        if (!verifiedUser) {
            return NextResponse.json({ status: 401, message: 'Invalid token' }, { status: 401 });
        }

        const { delegateId } = await params;
        if (!delegateId) {
            return NextResponse.json(
                { status: 400, message: 'معرّف المندوب مطلوب', user: {} },
                { status: 400 }
            );
        }

        const userRecord = await prisma.user.findUnique({
            where: { id: delegateId },
            include: { delegate: true },
        });

        if (!userRecord || !userRecord.delegate) {
            return NextResponse.json(
                { status: 404, message: 'الملف الشخصي غير موجود', user: {} },
                { status: 404 }
            );
        }

        const profile = {
            id: userRecord.id,
            name: userRecord.delegate.name,
            email: userRecord.email,
            identity: userRecord.delegate.identity,
            nationality: userRecord.delegate.nationality,
            gender: GENDER[userRecord.delegate.gender],
            age: userRecord.delegate.age,
            profileImage: userRecord.delegate.profileImage || null,
            education: userRecord.delegate.education,
            mobileNumber: userRecord.delegate.phoneNumber,
            alternativeMobileNumber: userRecord.delegate.alternativePhoneNumber || undefined,
            numberOfResponsibleCamps: userRecord.delegate.numberOfResponsibleCamps,
            numberOfFamilies: userRecord.delegate.numberOfFamilies,
            role: USER_TYPE.DELEGATE,
            socialStatus: SOCIAL_STATUS[userRecord.delegate.socialStatus],
        };

        return NextResponse.json({
            status: 200,
            message: 'تم جلب الملف الشخصي بنجاح',
            user: profile,
        });
    } catch (err: any) {
        return NextResponse.json(
            { status: 500, message: err.message || 'خطأ داخلي', user: {} },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ delegateId: string; }> }
) {
    try {
        const token = request.headers.get('authorization');
        if (!token) {
            return NextResponse.json({ status: 401, message: 'Unauthorized' }, { status: 401 });
        }

        const verifiedUser = verifyJWT(token);
        if (!verifiedUser) {
            // if (verifiedUser.role !== USER_TYPE.MANAGER) {
            return NextResponse.json({ status: 401, message: 'Not authorized' }, { status: 401 });
        }

        const { delegateId } = await params;
        const body = await request.json();

        const userRecord = await prisma.user.findUnique({
            where: { id: delegateId },
            include: { delegate: true },
        });

        if (!userRecord || !userRecord.delegate) {
            return NextResponse.json(
                { status: 404, message: 'Delegate not found', user: {} },
                { status: 404 }
            );
        }

        const updatedDelegate = await prisma.delegateProfile.update({
            where: { userId: userRecord.id },
            data: {
                name: body.name,
                identity: body.identity,
                nationality: body.nationality,
                gender: body.gender,
                profileImage: body.profileImage || null,
                phoneNumber: body.mobileNumber,
                alternativePhoneNumber: body.alternativeMobileNumber || null,
                numberOfResponsibleCamps: body.numberOfResponsibleCamps || 0,
                numberOfFamilies: body.numberOfFamilies || 0,
                socialStatus: body.socialStatus,
            },
        });

        return NextResponse.json({
            status: 200,
            message: 'Delegate profile updated successfully',
            user: {
                id: userRecord.id,
                name: updatedDelegate.name,
                email: userRecord.email,
                identity: updatedDelegate.identity,
                nationality: updatedDelegate.nationality,
                gender: GENDER[updatedDelegate.gender],
                profileImage: updatedDelegate.profileImage,
                mobileNumber: updatedDelegate.phoneNumber,
                alternativeMobileNumber: updatedDelegate.alternativePhoneNumber,
                numberOfResponsibleCamps: updatedDelegate.numberOfResponsibleCamps,
                numberOfFamilies: updatedDelegate.numberOfFamilies,
                role: USER_TYPE.DELEGATE,
                socialStatus: SOCIAL_STATUS[updatedDelegate.socialStatus],
            },
        });
    } catch (err: any) {
        return NextResponse.json(
            { status: 500, message: err.message || 'Internal error' },
            { status: 500 }
        );
    }
}
