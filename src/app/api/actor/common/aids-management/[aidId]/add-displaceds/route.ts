'use server';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';
import { verifyJWT } from '@/utils/auth';
// import { USER_TYPE } from '@prisma/client';
import { IActionResponse } from '@/types/common/action-response.type';
import { USER_TYPE } from '@prisma/client'

interface IBody {
    displacedIds: string[];
}

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ aidId: string }> }
) {
    try {
        const token = req.headers.get('authorization');
        if (!token) {
            return NextResponse.json<IActionResponse>(
                { status: 401, message: 'غير مصرح' },
                { status: 401 }
            );
        }

        const sender = verifyJWT(token);
        const { aidId } = await params;
        const { displacedIds } = (await req.json()) as IBody;

        if (!displacedIds?.length) {
            return NextResponse.json<IActionResponse>(
                { status: 400, message: 'لا يوجد نازحين' },
                { status: 400 }
            );
        }

        const aid = await prisma.aid.findUnique({
            where: { id: aidId },
            include: {
                delegatePortions: true,
            },
        });

        if (!aid) {
            return NextResponse.json<IActionResponse>(
                { status: 404, message: 'المساعدة غير موجودة' },
                { status: 404 }
            );
        }

        if (sender.role === USER_TYPE.MANAGER) {
            await prisma.aidDisplaced.createMany({
                data: displacedIds.map(id => ({
                    aidId,
                    displacedId: id,
                    deliveryCode: Math.floor(1000 + Math.random() * 9000).toString(),
                })),
            });

            return NextResponse.json<IActionResponse>({
                status: 200,
                message: 'تم إضافة النازحين للمساعدة بنجاح',
            });
        }

        if (sender.role === USER_TYPE.DELEGATE) {
            const delegatePortion = aid.delegatePortions.find(
                p => p.delegateId === sender.id
            );

            if (!delegatePortion) {
                return NextResponse.json<IActionResponse>(
                    { status: 403, message: 'غير مخصص لك جزء من هذه المساعدة' },
                    { status: 403 }
                );
            }

            if (displacedIds.length > delegatePortion.portion) {
                return NextResponse.json<IActionResponse>(
                    { status: 400, message: 'عدد النازحين أكبر من حصتك' },
                    { status: 400 }
                );
            }

            await prisma.$transaction([
                prisma.aidDisplaced.createMany({
                    data: displacedIds.map(id => ({
                        aidId,
                        displacedId: id,
                        deliveryCode: Math.floor(1000 + Math.random() * 9000).toString(),
                    })),
                }),

                prisma.aidDelegatePortion.update({
                    where: { id: delegatePortion.id },
                    data: {
                        portion: delegatePortion.portion - displacedIds.length,
                    },
                }),
            ]);

            return NextResponse.json<IActionResponse>({
                status: 200,
                message: 'تم إضافة النازحين وتحديث الحصة',
            });
        }

        return NextResponse.json<IActionResponse>(
            { status: 403, message: 'غير مصرح' },
            { status: 403 }
        );

    } catch (err: any) {

        return NextResponse.json<IActionResponse>(
            {
                status: 500,
                message: 'حدث خطأ أثناء إضافة النازحين',
                error: err.message,
            },
            { status: 500 }
        );
    }
}
