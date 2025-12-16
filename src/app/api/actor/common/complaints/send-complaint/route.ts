// src/app/api/actor/common/complaints/send-complaint/route.ts
'use server';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';
import { verifyJWT } from '@/utils/auth';
import { USER_TYPE, USER_RANK, TUserRank } from '@/constants/user-types';
import { IActionResponse } from '@/types/common/action-response.type';
import { COMPLAINT_STATUS } from '@prisma/client';

interface ISendComplaintPayload {
    reception: USER_TYPE.MANAGER | USER_TYPE.DELEGATE | USER_TYPE.SECURITY_PERSON;
    title: string;
    content: string;
}

const ALLOWED_RECEPTIONS: Record<TUserRank, (USER_TYPE | USER_RANK)[]> = {
    DISPLACED: [USER_TYPE.MANAGER, USER_TYPE.DELEGATE, USER_RANK.SECURITY_OFFICER],
    DELEGATE: [USER_TYPE.MANAGER, USER_RANK.SECURITY_OFFICER],
    SECURITY_PERSON: [USER_TYPE.MANAGER, USER_RANK.SECURITY_OFFICER],
    SECURITY_OFFICER: [USER_TYPE.MANAGER],
    MANAGER: [],
};

export async function POST(req: NextRequest) {
    try {
        const token = req.headers.get('authorization')?.replace('Bearer ', '');
        if (!token) {
            return NextResponse.json<IActionResponse>(
                { status: 401, message: 'غير مصرح' },
                { status: 401 }
            );
        }

        const sender = verifyJWT(token);
        const senderRank = sender.rank as TUserRank;

        const { reception, title, content } =
            (await req.json()) as ISendComplaintPayload;

        if (!reception || !title || !content) {
            return NextResponse.json<IActionResponse>(
                { status: 400, message: 'البيانات غير كاملة' },
                { status: 400 }
            );
        }

        const allowed = ALLOWED_RECEPTIONS[senderRank] ?? [];
        if (!allowed.includes(reception)) {
            return NextResponse.json<IActionResponse>(
                { status: 403, message: 'جهة الاستقبال غير مسموح بها' },
                { status: 403 }
            );
        }

        let receiverId: string | null = null;

        if (reception === USER_TYPE.MANAGER) {
            const manager = await prisma.user.findFirst({
                where: { role: USER_TYPE.MANAGER },
                select: { id: true },
            });
            receiverId = manager?.id ?? null;
        }

        if (reception === USER_TYPE.SECURITY_PERSON) {
            const officer = await prisma.user.findFirst({
                where: { rank: USER_RANK.SECURITY_OFFICER },
                select: { id: true },
            });
            receiverId = officer?.id ?? null;
        }

        if (
            reception === USER_TYPE.DELEGATE &&
            senderRank === USER_RANK.DISPLACED
        ) {
            const displaced = await prisma.displacedProfile.findUnique({
                where: { userId: sender.id },
                select: {
                    displacement: { select: { delegateId: true } },
                },
            });

            if (displaced?.displacement?.delegateId) {
                receiverId = displaced.displacement.delegateId;
            }
        }

        if (!receiverId) {
            return NextResponse.json<IActionResponse>(
                { status: 404, message: 'لا يوجد مستلم لهذه الجهة' },
                { status: 404 }
            );
        }

        await prisma.complaint.create({
            data: {
                title,
                body: content,
                status: COMPLAINT_STATUS.PENDING,
                senderId: sender.id,
                receiverId,
            },
        });

        return NextResponse.json<IActionResponse>({
            status: 200,
            message: 'تم إرسال الشكوى بنجاح',
        });
    } catch (err: any) {
        return NextResponse.json<IActionResponse>(
            {
                status: 500,
                message: err?.message || 'حدث خطأ',
                error: err?.message || 'خطأ',
            },
            { status: 500 }
        );
    }
}
