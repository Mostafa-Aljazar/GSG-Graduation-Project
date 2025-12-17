'use server';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';
import { verifyJWT } from '@/utils/auth';
import { AID_STATUS, AID_TYPE, NOTIFICATION_STATUS, TYPE_AID, USER_TYPE } from '@prisma/client';
import { IActionResponse } from '@/types/common/action-response.type';
import { TYPE_GROUP_AIDS } from '@/types/actor/common/index.type';

interface IChangeStatusAid {
    aidGroup: TYPE_GROUP_AIDS
}
export async function PUT(
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
        if (sender.role !== USER_TYPE.MANAGER) {
            return NextResponse.json<IActionResponse>(
                { status: 401, message: 'غير مصرح' },
                { status: 401 }
            );
        }
        const { aidId } = await params;
        const { aidGroup } = (await req.json()) as IChangeStatusAid;


        const aid = await prisma.aid.findUnique({
            where: { id: aidId }
        });

        if (!aid) {
            return NextResponse.json<IActionResponse>(
                { status: 404, message: 'المساعدة غير موجودة' },
                { status: 404 }
            );
        }

        const mapAidStatus = (type: TYPE_GROUP_AIDS): AID_STATUS => {
            switch (type) {
                case TYPE_GROUP_AIDS.COMING_AIDS: return AID_STATUS.UPCOMING;
                case TYPE_GROUP_AIDS.ONGOING_AIDS: return AID_STATUS.ONGOING;
                case TYPE_GROUP_AIDS.PREVIOUS_AIDS: return AID_STATUS.PREVIOUS;
                default: throw new Error('Unknown aid type');
            }
        };


        const mapAidTypeToNotificationAidType = (type: TYPE_AID): AID_TYPE => {
            switch (type) {
                case TYPE_AID.FINANCIAL:
                    return AID_TYPE.FINANCIAL_AID
                case TYPE_AID.FOOD:
                    return AID_TYPE.FOOD_AID
                case TYPE_AID.MEDICAL:
                    return AID_TYPE.MEDICAL_AID
                case TYPE_AID.CLEANING:
                    return AID_TYPE.CLEANING_AID
                case TYPE_AID.CLOTHING:
                    return AID_TYPE.CLOTHING_AIDS
                case TYPE_AID.EDUCATIONAL:
                    return AID_TYPE.EDUCATIONAL_AID
                case TYPE_AID.OTHER:
                    return AID_TYPE.OTHER_AID
            }
        }

        await prisma.aid.update({
            where: { id: aidId },
            data: {
                status: mapAidStatus(aidGroup)
            }
        });



        const displacedUsers = await prisma.aidDisplaced.findMany({
            where: { aidId },
            select: {
                displacedId: true,
                deliveryCode: true
            }
        });

        // If there are no assigned displaced yet, assign delivery codes
        if (mapAidStatus(aidGroup) === AID_STATUS.ONGOING) {

            // Send notifications only for displaced assigned
            if (displacedUsers.length) {
                displacedUsers.map(async (item) => {
                    const notifications = await prisma.notification.create({
                        data: {

                            // title: "sssssssssssssss",
                            title: 'بدء توزيع المساعدة',
                            body: `تم بدء توزيع مساعدة ${aid.name}. رمز الاستلام (${item.deliveryCode})`,
                            action: 'ADD_AID',
                            aidType: mapAidTypeToNotificationAidType(aid.type),
                            fromUserId: sender.id,
                            toUsers: {
                                create: {
                                    userId: item.displacedId,
                                    status: NOTIFICATION_STATUS.UNREAD,
                                }
                            },
                        }
                    });
                })

            }

        }

        return NextResponse.json<IActionResponse>({
            status: 200,
            message: 'تم إضافة النازحين للمساعدة بنجاح',
        });


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
