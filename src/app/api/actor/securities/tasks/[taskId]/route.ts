'use server';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';
import { TASKS_TABS } from '@/types/actor/common/index.type';
import { verifyJWT } from '@/utils/auth';
import { IActionResponse } from '@/types/common/action-response.type';
import { USER_RANK, USER_TYPE } from '@prisma/client';

interface ISecurityTaskPayload {
    taskId?: string;
    dateTime: string;
    title: string;
    body: string;
    securitiesIds: string[];
    type: TASKS_TABS;
}

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ taskId: string }> }
) {
    try {
        const token = req.headers.get('authorization');
        if (!token) {
            return NextResponse.json<IActionResponse>(
                { status: 401, message: 'غير مصرح' },
                { status: 401 }
            );
        }

        const verified = verifyJWT(token);
        // Allow only MANAGER or SECURITY_OFFICER
        if (
            verified.role !== USER_TYPE.MANAGER &&
            verified.rank !== USER_RANK.SECURITY_OFFICER
        ) {
            return NextResponse.json<IActionResponse>(
                { status: 403, message: 'غير مسموح بالتعديل' },
                { status: 403 }
            );
        }

        const { taskId } = await params;
        const body = (await req.json()) as ISecurityTaskPayload;
        const { dateTime, title, body: taskBody, securitiesIds, type } = body;

        if (!dateTime || !title || !taskBody || !securitiesIds?.length || !type) {
            return NextResponse.json<IActionResponse>(
                { status: 400, message: 'البيانات غير كاملة' },
                { status: 400 }
            );
        }

        const task = await prisma.securityTask.update({
            where: { id: taskId },
            data: {
                dateTime: new Date(dateTime),
                title,
                body: taskBody,
                type,
                assignedSecurities: {
                    deleteMany: {},
                    create: securitiesIds.map(securityId => ({ securityId })),
                },
            },
            include: { assignedSecurities: true },
        });

        return NextResponse.json<IActionResponse>(
            { status: 200, message: 'تم تعديل المهمة بنجاح' },
            { status: 200 }
        );
    } catch (error: any) {
        return NextResponse.json<IActionResponse>(
            {
                status: 500,
                message: error?.message || 'حدث خطأ أثناء حفظ المهمة',
                error: error?.message || 'خطأ',
            },
            { status: 500 }
        );
    }
}


export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ taskId: string }> }
) {
    try {
        const token = req.headers.get('authorization');
        if (!token) {
            return NextResponse.json<IActionResponse>(
                { status: 401, message: 'غير مصرح' },
                { status: 401 }
            );
        }

        const verified = verifyJWT(token);
        // Only MANAGER or SECURITY_OFFICER can delete
        if (verified.role !== USER_TYPE.MANAGER && verified.rank !== USER_RANK.SECURITY_OFFICER) {
            return NextResponse.json<IActionResponse>(
                { status: 403, message: 'غير مسموح بحذف المهام' },
                { status: 403 }
            );
        }

        const { taskId } = await params;
        if (!taskId) {
            return NextResponse.json<IActionResponse>(
                { status: 400, message: 'معرف المهمة مطلوب' },
                { status: 400 }
            );
        }

        // Delete all assigned securities for this task
        await prisma.securityTaskAssignment.deleteMany({
            where: { taskId }
        });

        // Delete the task itself
        await prisma.securityTask.delete({
            where: { id: taskId }
        });

        return NextResponse.json<IActionResponse>(
            { status: 200, message: 'تم حذف المهمة بنجاح' },
            { status: 200 }
        );

    } catch (error: any) {
        return NextResponse.json<IActionResponse>(
            {
                status: 500,
                message: error?.message || 'حدث خطأ أثناء حذف المهمة',
                error: error?.message || 'خطأ',
            },
            { status: 500 }
        );
    }
}
