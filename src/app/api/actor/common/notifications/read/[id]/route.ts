// src/app/api/notifications/read/[id]/route.ts
'use server';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';
import { verifyJWT } from '@/utils/auth';
import { NOTIFICATION_STATUS } from '@gen/client';
import { IActionResponse } from '@/types/common/action-response.type';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const token = req.headers.get('authorization')
        if (!token) return NextResponse.json({ status: 401, message: 'غير مصرح' }, { status: 401 });

        const user = verifyJWT(token);

        const { id: notificationId } = await params
        // const url = new URL(req.url);
        // const notificationId = url.pathname.split('/').pop();
        if (!notificationId) return NextResponse.json({ status: 400, message: 'Notification ID مفقود' });

        const updated = await prisma.notificationRecipient.updateMany({
            where: { notificationId, userId: user.id },
            data: { status: NOTIFICATION_STATUS.READ, readAt: new Date() },
        });

        return NextResponse.json<IActionResponse>({ status: 200, message: 'تم تحديث الإشعار كمقروء' });
    } catch (err: any) {
        return NextResponse.json<IActionResponse>({ status: 500, message: err.message || 'حدث خطأ' }, { status: 500 });
    }
}
