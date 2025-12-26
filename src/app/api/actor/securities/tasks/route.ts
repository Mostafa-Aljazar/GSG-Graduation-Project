'use server';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';
import { TASKS_TABS } from '@/types/actor/common/index.type';
import { verifyJWT } from '@/utils/auth';
import { ITask, ITasksResponse } from '@/types/actor/security/tasks/TasksResponse.type';
import { USER_TYPE } from '@prisma/client';

export async function GET(req: NextRequest) {
    try {
        const token = req.headers.get('authorization');
        if (!token) {
            return NextResponse.json<ITasksResponse>(
                {
                    status: 401,
                    message: 'غير مصرح',
                    tasks: [],
                    pagination: { page: 1, limit: 0, totalItems: 0, totalPages: 0 },
                    error: 'غير مصرح',
                },
                { status: 401 }
            );
        }

        const verified = verifyJWT(token);

        // Only MANAGER or SECURITY_PERSON can fetch tasks
        if (verified.role !== USER_TYPE.MANAGER && verified.role !== USER_TYPE.SECURITY_PERSON) {
            return NextResponse.json<ITasksResponse>(
                {
                    status: 403,
                    message: 'غير مسموح بعرض المهام',
                    tasks: [],
                    pagination: { page: 1, limit: 0, totalItems: 0, totalPages: 0 },
                    error: 'غير مسموح',
                },
                { status: 403 }
            );
        }

        const { searchParams } = new URL(req.url);
        const page = Number(searchParams.get('page') || 1);
        const limit = Number(searchParams.get('limit') || 5);
        const taskType = searchParams.get('taskType') as TASKS_TABS | null;

        const skip = (page - 1) * limit;

        const whereClause: any = {};
        if (taskType) whereClause.type = taskType;

        const totalItems = await prisma.securityTask.count({ where: whereClause });

        const tasksData = await prisma.securityTask.findMany({
            skip,
            take: limit,
            where: whereClause,
            include: { assignedSecurities: true },
            orderBy: { dateTime: 'desc' }, // NEWEST first
        });

        const tasks: ITask[] = tasksData.map(t => ({
            id: t.id,
            dateTime: t.dateTime,
            title: t.title,
            body: t.body,
            securitiesIds: t.assignedSecurities.map(s => s.securityId),
            type: TASKS_TABS[t.type],
        }));

        const totalPages = Math.ceil(totalItems / limit);

        return NextResponse.json<ITasksResponse>({
            status: 200,
            message: 'تم جلب بيانات المهام',
            tasks,
            pagination: { page, limit, totalItems, totalPages },
        });
    } catch (error: any) {
        return NextResponse.json<ITasksResponse>({
            status: 500,
            message: error?.message || 'حدث خطأ أثناء جلب بيانات المهام',
            tasks: [],
            pagination: { page: 1, limit: 0, totalItems: 0, totalPages: 0 },
            error: error?.message || 'خطأ',
        });
    }
}
