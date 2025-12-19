'use server';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';
import { TASKS_TABS } from '@/types/actor/common/index.type';
import { verifyJWT } from '@/utils/auth';
import { IActionResponse } from '@/types/common/action-response.type';
import { USER_TYPE, USER_RANK } from '@prisma/client';

interface ISecurityTaskPayload {
    dateTime: string; // ISO string
    title: string;
    body: string;
    securitiesIds: string[]; // IDs as string
    type: TASKS_TABS;
}

export async function POST(req: NextRequest) {
    try {
        const token = req.headers.get('authorization');
        if (!token) {
            return NextResponse.json<IActionResponse>(
                { status: 401, message: 'غير مصرح' },
                { status: 401 }
            );
        }

        const verified = verifyJWT(token);

        // Only MANAGER or SECURITY_OFFICER can create tasks
        if (
            verified.role !== USER_TYPE.MANAGER &&
            verified.rank !== USER_RANK.SECURITY_OFFICER
        ) {
            return NextResponse.json<IActionResponse>(
                { status: 403, message: 'غير مسموح بإنشاء المهمة' },
                { status: 403 }
            );
        }

        const body = (await req.json()) as ISecurityTaskPayload;
        const { dateTime, title, body: taskBody, securitiesIds, type } = body;

        // Validate inputs
        if (!dateTime || !title || !taskBody || !securitiesIds?.length || !type) {
            return NextResponse.json<IActionResponse>(
                { status: 400, message: 'البيانات غير كاملة' },
                { status: 400 }
            );
        }

        // Remove null/undefined and convert to string
        const validSecuritiesIds = securitiesIds.filter(Boolean).map(String);
        if (!validSecuritiesIds.length) {
            return NextResponse.json<IActionResponse>(
                { status: 400, message: 'يرجى تحديد عناصر الأمن الصحيحة' },
                { status: 400 }
            );
        }

        // Create task
        const task = await prisma.securityTask.create({
            data: {
                dateTime: new Date(dateTime),
                title,
                body: taskBody,
                type,
                assignedSecurities: {
                    create: validSecuritiesIds.map(securityId => ({ securityId })),
                },
            },
            include: { assignedSecurities: true },
        });

        return NextResponse.json<IActionResponse>(
            { status: 201, message: 'تم إضافة المهمة بنجاح' },
            { status: 201 }
        );

    } catch (error: any) {
        return NextResponse.json<IActionResponse>(
            {
                status: 500,
                message: error?.message || 'حدث خطأ أثناء إنشاء المهمة',
                error: error?.message || 'خطأ',
            },
            { status: 500 }
        );
    }
}
