// src/app/api/notifications/add/route.ts
'use server';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';
import { verifyJWT } from '@/utils/auth';
import { NOTIFICATION_STATUS, NOTIFICATION_ACTION, USER_TYPE } from '@gen/client';
import { IActionResponse } from '@/types/common/action-response.type';

interface IAddNotificationPayload {
    userIds: string[]; // recipients
    action: 'CALL' | 'MEETING';
    details: string;
}

export async function POST(req: NextRequest) {
    try {
        const token = req.headers.get('authorization')?.replace('Bearer ', '');
        if (!token) return NextResponse.json({ status: 401, message: 'غير مصرح' }, { status: 401 });

        const sender = verifyJWT(token);

        const { userIds, action, details } = await req.json() as IAddNotificationPayload;

        if (!details || !action || !userIds?.length) {
            return NextResponse.json({ status: 400, message: 'البيانات غير كاملة' }, { status: 400 });
        }

        const notification = await prisma.notification.create({
            data: {
                title: action === 'CALL'
                    ? `تم استدعاؤك من ${sender.rank}`
                    : `إشعار بحضور اجتماع من ${sender.rank}`,
                body: details,
                action,
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
            message: `تم إرسال الإشعار إلى ${userIds.length} مستخدم`,
            data: notification,
        } as IActionResponse);
    } catch (err: any) {
        return NextResponse.json({ status: 500, message: err.message || 'حدث خطأ', error: err.message || 'خطأ' }, { status: 500 });
    }
}
