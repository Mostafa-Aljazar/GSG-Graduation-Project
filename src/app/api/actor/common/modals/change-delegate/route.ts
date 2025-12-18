'use server';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';
import { verifyJWT } from '@/utils/auth';
import { NOTIFICATION_STATUS, NOTIFICATION_ACTION, USER_RANK } from '@gen/client';
import { IActionResponse } from '@/types/common/action-response.type';

interface IChangeDelegatePayload {
    displacedIds: string[]; // affected displaced users
    delegateId: string;     // new delegate
}

export async function POST(req: NextRequest) {
    try {
        const token = req.headers.get('authorization')?.replace('Bearer ', '');
        if (!token) return NextResponse.json({ status: 401, message: 'غير مصرح' }, { status: 401 });

        const sender = verifyJWT(token);

        if (sender.rank !== USER_RANK.MANAGER) {
            return NextResponse.json({ status: 403, message: 'غير مسموح' }, { status: 403 });
        }

        const { displacedIds, delegateId } = (await req.json()) as IChangeDelegatePayload;

        if (!delegateId || !displacedIds?.length) {
            return NextResponse.json({ status: 400, message: 'البيانات غير كاملة' }, { status: 400 });
        }

        await prisma.$transaction(async (tx) => {
            // Find the delegate
            const delegate = await tx.user.findUnique({
                where: { id: delegateId },
                include: { delegate: true },
            });
            if (!delegate) throw new Error('المندوب غير موجود');

            // Update the delegateId in all affected displaced users' displacements
            await tx.displacement.updateMany({
                where: { displacedProfiles: { some: { userId: { in: displacedIds } } } },
                data: { delegateId: delegate.id },
            });

            await tx.notification.create({
                data: {
                    title: "تغيير المندوب المسؤول",
                    body: `تم تغيير المندوب التابع له إلى المندوب ${delegate.delegate?.name}`,
                    action: NOTIFICATION_ACTION.CHANGE_DELEGATE,
                    fromUserId: sender.id,
                    toUsers: {
                        create: displacedIds.map((id) => ({
                            userId: id,
                            status: NOTIFICATION_STATUS.UNREAD,
                        })),
                    },
                },
                include: { toUsers: true },
            });

            // Send notification to the new delegate
            await tx.notification.create({
                data: {
                    title: `تم تعيين عائلات جديدة إليك`,
                    body: `تم إضافة ${displacedIds.length} من النازحين تحت مسؤوليتك كمندوب`,
                    action: NOTIFICATION_ACTION.CHANGE_DELEGATE,
                    fromUserId: sender.id,
                    toUsers: {
                        create: [{ userId: delegate.id, status: NOTIFICATION_STATUS.UNREAD }],
                    },
                },
                include: { toUsers: true },
            });

            // return { displacedNotifications, delegateNotification };
        });

        return NextResponse.json<IActionResponse>({
            status: 200,
            message: `تم تحديث المندوب وإرسال الإشعارات إلى جميع المستخدمين`,
        });
    } catch (err: any) {
        return NextResponse.json<IActionResponse>(
            { status: 500, message: err.message || 'حدث خطأ', error: err.message || 'خطأ' },
            { status: 500 }
        );
    }
}
