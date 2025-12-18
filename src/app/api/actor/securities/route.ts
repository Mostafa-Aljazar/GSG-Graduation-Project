'use server';

import { NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';
import { verifyJWT } from '@/utils/auth';
import { ISecuritiesResponse, ISecurity } from '@/types/actor/general/securities/securities-response.types';
import { USER_RANK } from '@gen/client'; // Prisma enum

export async function GET(request: Request) {
    try {
        const token = request.headers.get('authorization');

        if (!token) {
            const emptyResponse: ISecuritiesResponse = {
                status: 401,
                message: 'غير مصرح',
                securities: [],
                pagination: { page: 1, limit: 0, totalItems: 0, totalPages: 0 },
                error: 'غير مصرح',
            };
            return NextResponse.json<ISecuritiesResponse>(emptyResponse, { status: 401 });
        }

        const verified = verifyJWT(token);
        if (!verified) {
            const emptyResponse: ISecuritiesResponse = {
                status: 401,
                message: 'رمز غير صالح',
                securities: [],
                pagination: { page: 1, limit: 0, totalItems: 0, totalPages: 0 },
                error: 'رمز غير صالح',
            };
            return NextResponse.json<ISecuritiesResponse>(emptyResponse, { status: 401 });
        }

        const url = new URL(request.url);
        const page = Number(url.searchParams.get('page') || 1);
        const limit = Number(url.searchParams.get('limit') || 15);
        const skip = (page - 1) * limit;

        // Only count security profiles with valid ranks
        const totalItems = await prisma.securityProfile.count({
            where: { rank: { in: [USER_RANK.SECURITY_PERSON, USER_RANK.SECURITY_OFFICER] } },
        });

        const securityData = await prisma.securityProfile.findMany({
            skip,
            take: limit,
            where: { rank: { in: [USER_RANK.SECURITY_PERSON, USER_RANK.SECURITY_OFFICER] } },
            include: { user: true },
        });

        const securities: ISecurity[] = securityData.map((s) => ({
            id: s.userId,
            name: s.name,
            identity: s.identity,
            mobileNumber: s.phoneNumber,
            rank: s.rank as 'SECURITY_PERSON' | 'SECURITY_OFFICER', // type assertion
        }));

        const totalPages = Math.ceil(totalItems / limit);

        return NextResponse.json<ISecuritiesResponse>({
            status: 200,
            message: 'تم جلب بيانات أفراد الأمن',
            securities,
            pagination: { page, limit, totalItems, totalPages },
        });
    } catch (error: any) {
        const emptyResponse: ISecuritiesResponse = {
            status: 500,
            message: error?.message || 'خطأ أثناء جلب بيانات أفراد الأمن',
            securities: [],
            pagination: { page: 1, limit: 0, totalItems: 0, totalPages: 0 },
            error: error?.message || 'خطأ أثناء جلب بيانات أفراد الأمن',
        };
        return NextResponse.json<ISecuritiesResponse>(emptyResponse, { status: 500 });
    }
}
