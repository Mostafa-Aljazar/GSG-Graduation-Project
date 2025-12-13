'use server';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';
import { verifyJWT } from '@/utils/auth';
import { USER_RANK } from '@prisma/client';
import { ISecurityIdsResponse } from '@/types/actor/general/securities/securities-response.types';

export async function GET(req: NextRequest) {
    try {
        const token = req.headers.get('authorization');

        if (!token) {
            const emptyResponse: ISecurityIdsResponse = {
                status: 401,
                message: 'غير مصرح',
                securitiesIds: [],
                error: 'غير مصرح',
            };
            return NextResponse.json<ISecurityIdsResponse>(emptyResponse, { status: 401 });
        }

        const verified = verifyJWT(token);
        // FIXME: add authorization to manager and security officer 
        if (!verified) {
            const emptyResponse: ISecurityIdsResponse = {
                status: 401,
                message: 'رمز غير صالح',
                securitiesIds: [],
                error: 'رمز غير صالح',
            };
            return NextResponse.json<ISecurityIdsResponse>(emptyResponse, { status: 401 });
        }

        const securities = await prisma.securityProfile.findMany({
            where: {
                rank: { in: [USER_RANK.SECURITY_PERSON, USER_RANK.SECURITY_OFFICER] },
            },
            select: { userId: true },
        });

        const securitiesIds = securities.map((s) => s.userId);

        const response: ISecurityIdsResponse = {
            status: 200,
            message: 'تم جلب معرفات أفراد الأمن',
            securitiesIds,
        };

        return NextResponse.json<ISecurityIdsResponse>(response, { status: 200 });
    } catch (err: any) {
        const errorResponse: ISecurityIdsResponse = {
            status: 500,
            message: err?.message || 'خطأ أثناء جلب معرفات أفراد الأمن',
            securitiesIds: [],
            error: err?.message || 'خطأ',
        };
        return NextResponse.json<ISecurityIdsResponse>(errorResponse, { status: 500 });
    }
}
