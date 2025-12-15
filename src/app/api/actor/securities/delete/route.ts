'use server';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';
import { USER_TYPE, USER_RANK, USER_RANK_LABELS } from '@/constants/user-types';
import { verifyJWT } from '@/utils/auth';
import { IActionResponse } from '@/types/common/action-response.type';

interface IDeleteSecuritiesPayload {
    userIds: string[];
}

export async function DELETE(req: NextRequest) {
    try {
        const token = req.headers.get('authorization');
        if (!token)
            return NextResponse.json({ status: 401, message: 'غير مصرح' }, { status: 401 });

        const verified = verifyJWT(token);
        const body = (await req.json()) as IDeleteSecuritiesPayload;
        let { userIds } = body;

        if (!userIds?.length)
            return NextResponse.json({ status: 400, message: 'البيانات غير كاملة' }, { status: 400 });

        // صلاحيات الحذف
        if (verified.rank === USER_RANK.MANAGER) {
            // المدير يمكنه حذف أي شخص
        } else if (verified.rank === USER_RANK.SECURITY_OFFICER) {
            const mySecurityIds = await prisma.securityProfile.findMany({
                where: { userId: verified.id },
                select: { userId: true },
            });
            const allowedIds = mySecurityIds.map(s => s.userId);
            userIds = userIds.filter(id => allowedIds.includes(id));
            if (!userIds.length)
                return NextResponse.json({ status: 403, message: 'غير مسموح بالحذف' }, { status: 403 });
        } else {
            return NextResponse.json({ status: 403, message: 'غير مسموح بالحذف' }, { status: 403 });
        }

        // حذف SecurityTaskAssignment المرتبطة بالمستخدمين
        await prisma.securityTaskAssignment.deleteMany({
            where: { securityId: { in: userIds } },
        });

        // حذف UserOtp المرتبطة بالمستخدمين
        await prisma.userOtp.deleteMany({
            where: { userId: { in: userIds } },
        });

        // حذف SecurityProfile المرتبطة بالمستخدمين
        await prisma.securityProfile.deleteMany({
            where: { userId: { in: userIds } },
        });

        // حذف الـ User بعد حذف كل child records
        await prisma.user.deleteMany({
            where: { id: { in: userIds } },
        });

        const response: IActionResponse = {
            status: 200,
            message: `تم حذف ${userIds.length} ${USER_RANK_LABELS.SECURITY_PERSON} بنجاح`,
        };

        return NextResponse.json(response, { status: 200 });

    } catch (error: any) {
        return NextResponse.json(
            { status: 500, message: error.message || 'خطأ', error: error.message || 'خطأ' },
            { status: 500 }
        );
    }
};
