// src/app/api/actor/common/modals/update-request/route.ts
'use server';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';
import { verifyJWT } from '@/utils/auth';
import { NOTIFICATION_ACTION, NOTIFICATION_STATUS, USER_TYPE } from '@prisma/client';
import { IActionResponse } from '@/types/common/action-response.type';

interface IUpdateUsersRequestPayload {
    userIds: string[];
    userType: USER_TYPE;
}

export async function POST(req: NextRequest) {
    try {
        const token = req.headers.get('authorization');
        if (!token)
            return NextResponse.json({ status: 401, message: 'غير مصرح' }, { status: 401 });

        const sender = verifyJWT(token);

        const { userIds, userType } = (await req.json()) as IUpdateUsersRequestPayload;

        if (!userIds?.length || !userType) {
            return NextResponse.json({ status: 400, message: 'البيانات غير كاملة' }, { status: 400 });
        }

        // Fixed details message
        const details = "يرجى تحديث بياناتك الشخصية في النظام لضمان استمرارية الخدمة.";

        // Create notification for targeted users
        const notification = await prisma.notification.create({
            data: {
                title: `طلب تحديث بيانات ${userType === USER_TYPE.DISPLACED ? 'النازحين' : userType === USER_TYPE.DELEGATE ? 'المندوبين' : 'المستخدمين'}`,
                body: details,
                action: NOTIFICATION_ACTION.UPDATE,
                fromUserId: sender.id,
                toUsers: {
                    create: userIds.map(id => ({
                        userId: id,
                        status: NOTIFICATION_STATUS.UNREAD,
                    })),
                },
            },
            include: { toUsers: true },
        });

        return NextResponse.json({
            status: 200,
            message: `تم إرسال طلب تحديث بيانات لـ ${userIds.length} ${userType === USER_TYPE.DISPLACED ? 'نازح' : userType === USER_TYPE.DELEGATE ? 'مندوب' : 'مستخدم'} بنجاح`,
            data: notification,
        } as IActionResponse);
    } catch (err: any) {
        return NextResponse.json(
            {
                status: 500,
                message: err.message || 'حدث خطأ',
                error: err.message || 'خطأ',
            },
            { status: 500 }
        );
    }
}
