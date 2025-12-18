'use server';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';
import { verifyJWT } from '@/utils/auth';
import { USER_TYPE, USER_RANK } from '@gen/client';
import { ISecuritiesNamesResponse } from '@/types/actor/general/securities/securities-response.types';

export async function GET(req: NextRequest) {
    try {
        const token = req.headers.get('authorization');

        if (!token) {
            const emptyResponse: ISecuritiesNamesResponse = {
                status: 401,
                message: 'غير مصرح',
                securitiesNames: [],
                error: 'غير مصرح',
            };
            return NextResponse.json<ISecuritiesNamesResponse>(emptyResponse, { status: 401 });
        }

        const verified = verifyJWT(token);
        // FIXME: add authorization to manager and security officer 
        if (!verified) {
            const emptyResponse: ISecuritiesNamesResponse = {
                status: 401,
                message: 'رمز غير صالح',
                securitiesNames: [],
                error: 'رمز غير صالح',
            };
            return NextResponse.json<ISecuritiesNamesResponse>(emptyResponse, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const idsParam = searchParams.get('ids');
        const ids: string[] | undefined = idsParam
            ? idsParam.split(',').map((i) => i.trim())
            : undefined;

        const securities = await prisma.securityProfile.findMany({
            where: {
                rank: { in: [USER_RANK.SECURITY_PERSON, USER_RANK.SECURITY_OFFICER] },
                ...(ids ? { userId: { in: ids } } : {}),
            },
            select: {
                userId: true,
                name: true,
            },
        });

        const securitiesNames = securities.map((s) => ({
            id: s.userId,
            name: s.name,
        }));

        const response: ISecuritiesNamesResponse = {
            status: 200,
            message: 'تم جلب أسماء أفراد الأمن',
            securitiesNames,
        };

        return NextResponse.json<ISecuritiesNamesResponse>(response, { status: 200 });
    } catch (err: any) {
        const errorResponse: ISecuritiesNamesResponse = {
            status: 500,
            message: err?.message || 'خطأ أثناء جلب أسماء أفراد الأمن',
            securitiesNames: [],
            error: err?.message || 'خطأ',
        };
        return NextResponse.json<ISecuritiesNamesResponse>(errorResponse, { status: 500 });
    }
}
