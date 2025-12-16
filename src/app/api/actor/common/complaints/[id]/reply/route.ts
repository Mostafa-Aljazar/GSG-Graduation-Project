'use server';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';
import { verifyJWT } from '@/utils/auth';
import { COMPLAINT_STATUS, NOTIFICATION_ACTION, NOTIFICATION_STATUS, USER_RANK } from '@prisma/client';
import { IActionResponse } from '@/types/common/action-response.type';
import { IReplyComplaintProps } from '@/actions/actor/general/complaints/replyComplaint';
import { USER_RANK_LABELS } from '@/constants/user-types';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const token = req.headers.get('authorization')
        if (!token) return NextResponse.json<IActionResponse>({ status: 401, message: 'غير مصرح' }, { status: 401 });

        const viewer = verifyJWT(token);
        const body: IReplyComplaintProps = await req.json();

        const { id: complaintId } = await params
        const { reply } = body;

        const complaint = await prisma.complaint.findUnique({
            where: { id: complaintId },
            include: { receiver: true, sender: true },
        });

        if (!complaint) {
            return NextResponse.json<IActionResponse>({ status: 404, message: 'الشكوى غير موجودة' }, { status: 404 });
        }

        const canReply =
            complaint.receiverId === viewer.id ||
            (viewer.rank === USER_RANK.SECURITY_OFFICER && complaint.receiver.role === USER_RANK.SECURITY_PERSON);

        if (!canReply) {
            return NextResponse.json<IActionResponse>({ status: 403, message: 'لا يمكنك الرد على هذه الشكوى' }, { status: 403 });
        }

        const updated = await prisma.complaint.update({
            where: { id: complaintId },
            data: { reply, status: COMPLAINT_STATUS.READ },
        });

        await prisma.notification.create({
            data: {
                title: "رد الشكوى",
                body: `قام ال${USER_RANK_LABELS[viewer.rank]} بالرد على الشكوى التي ارسلتها اليه`,
                action: NOTIFICATION_ACTION.ANOTHER,
                fromUserId: viewer.id,
                toUsers: {
                    create: [{
                        userId: complaint.sender.id,
                        status: NOTIFICATION_STATUS.UNREAD,
                    }]

                },
            },
            include: { toUsers: true },
        });

        return NextResponse.json<IActionResponse>({
            status: 200,
            message: 'تم ارسال الرد بنجاح',
        });
    } catch (err: any) {
        return NextResponse.json<IActionResponse>({
            status: 500,
            message: err?.message || 'حدث خطأ أثناء ارسال الرد',
            error: err?.message || 'خطأ',
        }, { status: 500 });
    }
}
