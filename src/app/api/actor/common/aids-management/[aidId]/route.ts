'use server';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';
import { verifyJWT } from '@/utils/auth';
import { USER_TYPE, AID_STATUS, DISTRIBUTION_METHOD, QUANTITY_TYPE } from '@prisma/client';
import { IAidResponse, TAid, ICategoryRange, ISelectedDelegatePortion, IReceivedDisplaceds } from '@/types/actor/common/aids-management/aids-management.types';
import { DISTRIBUTION_MECHANISM, QUANTITY_AVAILABILITY, TYPE_AIDS, TYPE_GROUP_AIDS } from '@/types/actor/common/index.type';
import { IActionResponse } from '@/types/common/action-response.type';

export async function GET(req: NextRequest, { params }: { params: Promise<{ aidId: string }> }) {
    try {
        const token = req.headers.get('authorization');
        if (!token) return NextResponse.json<IAidResponse>({ status: 401, message: 'غير مصرح', aid: {} as TAid }, { status: 401 });

        const sender = verifyJWT(token);

        if (USER_TYPE.MANAGER != sender.role && USER_TYPE.DELEGATE != sender.role) {
            return NextResponse.json<IAidResponse>({ status: 403, message: 'غير مصرح بالدخول', aid: {} as TAid }, { status: 403 });
        }

        const { aidId } = await params;

        const aid = await prisma.aid.findUnique({
            where: { id: aidId },
            include: {
                categories: true,
                delegatePortions: true,
                displacedAssignments: true,
            },
        });

        if (!aid) return NextResponse.json<IAidResponse>({ status: 404, message: 'المساعدة غير موجودة', aid: {} as TAid }, { status: 404 });

        // Map DB to TAid
        const mapTypeAidsToClient = (type: string): TYPE_AIDS => {
            switch (type) {
                case 'FINANCIAL': return TYPE_AIDS.FINANCIAL_AID;
                case 'FOOD': return TYPE_AIDS.FOOD_AID;
                case 'MEDICAL': return TYPE_AIDS.MEDICAL_AID;
                case 'CLEANING': return TYPE_AIDS.CLEANING_AID;
                case 'CLOTHING': return TYPE_AIDS.CLOTHING_AIDS;
                case 'EDUCATIONAL': return TYPE_AIDS.EDUCATIONAL_AID;
                case 'OTHER': return TYPE_AIDS.OTHER_AID;
                default: return TYPE_AIDS.OTHER_AID;
            }
        };

        const mapDistributionMethod = (
            m: DISTRIBUTION_METHOD
        ): DISTRIBUTION_MECHANISM => {
            switch (m) {
                case DISTRIBUTION_METHOD.DELEGATES:
                    return DISTRIBUTION_MECHANISM.DELEGATES_LISTS;

                case DISTRIBUTION_METHOD.DISPLACED_FAMILIES:
                    return DISTRIBUTION_MECHANISM.DISPLACED_FAMILIES;

                default:
                    throw new Error('Unknown distribution mechanism');
            }
        };


        const mapQuantity = (
            m: QUANTITY_TYPE
        ): QUANTITY_AVAILABILITY => {
            switch (m) {
                case QUANTITY_TYPE.LIMITED:
                    return QUANTITY_AVAILABILITY.LIMITED;

                case QUANTITY_TYPE.UNLIMITED:
                    return QUANTITY_AVAILABILITY.UNLIMITED;

                default:
                    throw new Error('Unknown distribution mechanism');
            }
        };
        const aidData: TAid = {
            id: aid.id,
            aidName: aid.name,
            aidType: mapTypeAidsToClient(aid.type),
            aidContent: aid.description,
            deliveryDate: aid.deliveryDate ?? null,
            deliveryLocation: aid.deliveryLocation ?? '',
            securityRequired: aid.securityRequired,
            quantityAvailability: mapQuantity(aid.quantityType),
            existingQuantity: aid.existingQuantity ?? undefined,
            additionalNotes: aid.additionalNotes ?? undefined,
            distributionMechanism: mapDistributionMethod(aid.distributionMethod),
            selectedCategories: aid.categories.map((c): ICategoryRange => ({
                id: c.id,
                label: c.label,
                min: c.min,
                max: c.max ?? null,
                portion: c.portion ?? undefined,
            })),
            selectedDelegatesPortions: aid.delegatePortions.map((d): ISelectedDelegatePortion => ({
                delegateId: d.delegateId,
                portion: d.portion,
            })),
            selectedDisplacedIds: aid.displacedAssignments.map(d => d.displacedId),
            receivedDisplaceds: aid.displacedAssignments
                .filter(d => d.receivedAt)
                .map((d): IReceivedDisplaceds => ({ displacedId: d.displacedId, receivedTime: d.receivedAt! })),
            securitiesId: [],
            isCompleted: aid.isCompleted,
            aidStatus: (() => {
                switch (aid.status) {
                    case AID_STATUS.UPCOMING: return TYPE_GROUP_AIDS.COMING_AIDS;
                    case AID_STATUS.ONGOING: return TYPE_GROUP_AIDS.ONGOING_AIDS;
                    case AID_STATUS.PREVIOUS: return TYPE_GROUP_AIDS.PREVIOUS_AIDS;
                }
            })(),
        };

        return NextResponse.json<IAidResponse>({ status: 200, message: 'تم جلب المساعدة بنجاح', aid: aidData });
    } catch (err: any) {
        console.error(err);
        return NextResponse.json<IAidResponse>({
            status: 500,
            message: err.message || 'حدث خطأ أثناء جلب المساعدة',
            aid: {} as TAid,
            error: err.message || 'Internal Server Error',
        }, { status: 500 });
    }
}

/////////////////////////////////////////////////////////////////////////////////////

export async function DELETE(
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
                { status: 403, message: 'ليس لديك صلاحية حذف المساعدات' },
                { status: 403 }
            );
        }

        const { aidId } = await params;

        const aid = await prisma.aid.findUnique({
            where: { id: aidId },
            select: { id: true },
        });

        if (!aid) {
            return NextResponse.json<IActionResponse>(
                { status: 404, message: 'المساعدة غير موجودة' },
                { status: 404 }
            );
        }

        await prisma.aid.delete({
            where: { id: aidId },
        });

        return NextResponse.json<IActionResponse>({
            status: 200,
            message: 'تم حذف المساعدة بنجاح',
        });
    } catch (err: any) {
        console.error(err);

        return NextResponse.json<IActionResponse>(
            {
                status: 500,
                message: 'حدث خطأ أثناء حذف المساعدة',
                error: err.message,
            },
            { status: 500 }
        );
    }
}
