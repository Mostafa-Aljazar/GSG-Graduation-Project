'use server';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';
import { verifyJWT } from '@/utils/auth';
import {
    USER_TYPE,
    QUANTITY_TYPE,
    NOTIFICATION_ACTION,
    AID_TYPE
} from '@prisma/client';
import { IActionResponse } from '@/types/common/action-response.type';

interface IReceiveAidBody {
    receiveCode: string;
    displacedId: string;
}

const mapAidType = (type: string): AID_TYPE => {
    switch (type) {
        case 'FINANCIAL':
            return AID_TYPE.FINANCIAL_AID;
        case 'FOOD':
            return AID_TYPE.FOOD_AID;
        case 'MEDICAL':
            return AID_TYPE.MEDICAL_AID;
        case 'CLEANING':
            return AID_TYPE.CLEANING_AID;
        case 'CLOTHING':
            return AID_TYPE.CLOTHING_AIDS;
        case 'EDUCATIONAL':
            return AID_TYPE.EDUCATIONAL_AID;
        case 'OTHER':
        default:
            return AID_TYPE.OTHER_AID;
    }
};
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

        if (
            sender.role !== USER_TYPE.MANAGER &&
            sender.role !== USER_TYPE.DELEGATE
        ) {
            return NextResponse.json<IActionResponse>(
                { status: 403, message: 'غير مصرح' },
                { status: 403 }
            );
        }

        const { aidId } = await params;
        const { receiveCode, displacedId } =
            (await req.json()) as IReceiveAidBody;

        const aid = await prisma.aid.findUnique({
            where: { id: aidId },
        });

        if (!aid) {
            return NextResponse.json<IActionResponse>(
                { status: 404, message: 'المساعدة غير موجودة' },
                { status: 404 }
            );
        }

        const aidDisplaced = await prisma.aidDisplaced.findUnique({
            where: {
                aidId_displacedId: {
                    aidId,
                    displacedId,
                },
            },
        });
        console.log("🚀 ~ POST ~ aidDisplaced:", aidDisplaced)

        if (!aidDisplaced) {
            return NextResponse.json<IActionResponse>(
                { status: 404, message: 'السجل غير موجود' },
                { status: 404 }
            );
        }

        if (aidDisplaced.displacedReceived == "RECEIVED_AIDS") {
            console.log(`🚀 ~ POST ~ aidDisplaced.displacedReceived == "RECEIVED_AIDS":`, aidDisplaced.displacedReceived == "RECEIVED_AIDS")
            return NextResponse.json<IActionResponse>(
                { status: 400, message: 'تم استلام المساعدة مسبقاً' },
                { status: 400 }
            );
        }

        if (aidDisplaced.deliveryCode !== receiveCode) {
            return NextResponse.json<IActionResponse>(
                { status: 400, message: 'رمز الاستلام غير صحيح' },
                { status: 400 }
            );
        }

        await prisma.$transaction(async (tx) => {
            await tx.aidDisplaced.update({
                where: {
                    aidId_displacedId: {
                        aidId,
                        displacedId,
                    },
                },
                data: {
                    receivedAt: new Date(),
                    aidGiverId: sender.id,
                    displacedReceived: 'RECEIVED_AIDS'
                },
            });

            if (aid.quantityType === QUANTITY_TYPE.LIMITED) {
                if (!aid.existingQuantity || aid.existingQuantity <= 0) {
                    throw new Error('الكمية غير متوفرة');
                }

                await tx.aid.update({
                    where: { id: aidId },
                    data: {
                        existingQuantity: {
                            decrement: 1,
                        },
                    },
                });
            }

            const notification = await tx.notification.create({
                data: {
                    title: 'تم استلام المساعدة',
                    body: `تم استلام مساعدة ${aid.name} بنجاح`,
                    action: NOTIFICATION_ACTION.ADD_AID,
                    aidType: mapAidType(aid.type), // <- use mapped value
                    fromUserId: sender.id,
                },
            });

            await tx.notificationRecipient.create({
                data: {
                    notificationId: notification.id,
                    userId: displacedId,
                },
            });
        });

        return NextResponse.json<IActionResponse>({
            status: 200,
            message: 'تم تسليم المساعدة بنجاح',
        });
    } catch (err: any) {
        return NextResponse.json<IActionResponse>(
            {
                status: 500,
                message: 'حدث خطأ أثناء تسليم المساعدة',
                error: err.message,
            },
            { status: 500 }
        );
    }
}
