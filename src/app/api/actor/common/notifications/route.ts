// src/app/api/notifications/route.ts
'use server';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';
import { verifyJWT } from '@/utils/auth';
import { NOTIFICATION_STATUS } from '@gen/client';

export async function GET(req: NextRequest) {
    try {
        const token = req.headers.get('authorization')?.replace('Bearer ', '');
        if (!token) return NextResponse.json({ status: 401, message: 'غير مصرح' }, { status: 401 });

        const user = verifyJWT(token);

        const url = new URL(req.url);
        const page = Number(url.searchParams.get('page') || '1');
        const limit = Number(url.searchParams.get('limit') || '10');
        const skip = (page - 1) * limit;

        const [totalItems, recipients] = await Promise.all([
            prisma.notificationRecipient.count({ where: { userId: user.id } }),
            prisma.notificationRecipient.findMany({
                where: { userId: user.id },
                include: { notification: { include: { fromUser: true } } },
                orderBy: { notification: { createdAt: 'desc' } },
                skip,
                take: limit,
            }),
        ]);

        const notifications = recipients.map(r => ({
            id: r.notification.id,
            title: r.notification.title,
            body: r.notification.body,
            status: r.status,
            action: r.notification.action,
            from: { id: r.notification.fromUser.id, rank: r.notification.fromUser.rank },
            dateTime: r.notification.createdAt,
        }));

        return NextResponse.json({
            status: 200,
            notifications,
            pagination: { page, limit, totalItems, totalPages: Math.ceil(totalItems / limit) },
        });
    } catch (err: any) {
        return NextResponse.json({
            status: 500,
            message: err.message || 'حدث خطأ غير متوقع',
            notifications: [],
            pagination: { page: 1, limit: 0, totalItems: 0, totalPages: 0 },
        });
    }
}
