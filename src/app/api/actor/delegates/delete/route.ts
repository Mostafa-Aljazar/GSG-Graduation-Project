'use server';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';
import { USER_TYPE, USER_RANK, USER_RANK_LABELS } from '@/constants/user-types';
import { verifyJWT } from '@/utils/auth';
import { IActionResponse } from '@/types/common/action-response.type';
import { GENDER, SOCIAL_STATUS } from '@prisma/client';

interface IDeleteDelegatesPayload {
    userIds: string[];
}

export async function DELETE(req: NextRequest) {
    try {
        const token = req.headers.get('authorization');
        if (!token) {
            return NextResponse.json({ status: 401, message: 'غير مصرح' }, { status: 401 });
        }

        const verified = verifyJWT(token);
        if (verified.rank !== USER_RANK.MANAGER) {
            return NextResponse.json({ status: 403, message: 'غير مسموح بالحذف' }, { status: 403 });
        }

        const body = (await req.json()) as IDeleteDelegatesPayload;
        const { userIds } = body;

        if (!userIds?.length) {
            return NextResponse.json({ status: 400, message: 'البيانات غير كاملة' }, { status: 400 });
        }

        const defaultEmail = 'defaultDelegate@gmail.com';
        const defaultName = 'بدون مندوب';

        const result = await prisma.$transaction(async (tx) => {
            // تحقق إذا كان المندوب الافتراضي موجود
            let defaultDelegate = await tx.user.findUnique({
                where: { email: defaultEmail },
                include: { delegate: true },
            });

            if (!defaultDelegate) {
                defaultDelegate = await tx.user.create({
                    data: {
                        email: defaultEmail,
                        role: USER_TYPE.DELEGATE,
                        rank: USER_RANK.DELEGATE,
                        status: 'ACTIVE',
                        delegate: {
                            create: {
                                name: defaultName,
                                identity: '',
                                nationality: '',
                                gender: GENDER.MALE,
                                phoneNumber: '',
                                alternativePhoneNumber: null,
                                age: 0,
                                socialStatus: SOCIAL_STATUS.SINGLE,
                                education: '',
                                numberOfResponsibleCamps: 0,
                                numberOfFamilies: 0,
                            },
                        },
                    },
                    include: { delegate: true },
                });
            } else if (!defaultDelegate.delegate) {
                await tx.delegateProfile.create({
                    data: {
                        userId: defaultDelegate.id,
                        name: defaultName,
                        identity: '',
                        nationality: '',
                        gender: GENDER.MALE,
                        phoneNumber: '',
                        alternativePhoneNumber: null,
                        age: 0,
                        socialStatus: SOCIAL_STATUS.SINGLE,
                        education: '',
                        numberOfResponsibleCamps: 0,
                        numberOfFamilies: 0,
                    },
                });
            }

            // منع حذف المندوب الافتراضي
            if (userIds.includes(defaultDelegate.id)) {
                throw new Error('لا يمكن حذف المندوب الافتراضي');
            }

            // تحديث جميع الـ Displacement المرتبطة بالمندوبين المحذوفين إلى المندوب الافتراضي
            await tx.displacement.updateMany({
                where: { delegateId: { in: userIds } },
                data: { delegateId: defaultDelegate.id },
            });

            // حذف child records المرتبطة بالمندوبين المحذوفين
            await tx.userOtp.deleteMany({ where: { userId: { in: userIds } } });
            await tx.delegateProfile.deleteMany({ where: { userId: { in: userIds } } });

            // حذف المستخدمين
            await tx.user.deleteMany({ where: { id: { in: userIds } } });

            return defaultDelegate;
        });

        const response: IActionResponse = {
            status: 200,
            message: `تم حذف ${userIds.length} ${USER_RANK_LABELS.DELEGATE} وربطهم بالمندوب الافتراضي ${defaultName}`,
        };

        return NextResponse.json(response, { status: 200 });
    } catch (error: any) {
        console.log("🚀 ~ DELETE ~ error:", error)
        return NextResponse.json(
            { status: 500, message: error.message || 'خطأ', error: error.message || 'خطأ' },
            { status: 500 }
        );
    }
}
