'use server';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';
import { verifyJWT } from '@/utils/auth';
import { TAid, ISelectedDelegatePortion, ICategoryRange } from '@/types/actor/common/aids-management/aids-management.types';
import { IActionResponse } from '@/types/common/action-response.type';
import { DISTRIBUTION_MECHANISM, QUANTITY_AVAILABILITY, TYPE_AIDS } from '@/types/actor/common/index.type';
import { USER_TYPE, TYPE_AID, DISTRIBUTION_METHOD, QUANTITY_TYPE, AID_STATUS } from '@gen/client'

interface IAddAidRequest {
    payload: TAid;
}

export async function POST(req: NextRequest) {
    try {
        const token = req.headers.get('authorization')
        if (!token) return NextResponse.json({ status: 401, message: 'غير مصرح' }, { status: 401 });

        const sender = verifyJWT(token);
        if (sender.role !== USER_TYPE.MANAGER) {
            return NextResponse.json({ status: 403, message: 'ليس لديك صلاحية إنشاء المساعدات' }, { status: 403 });
        }

        const { payload } = (await req.json()) as IAddAidRequest;

        if (!payload.aidName || !payload.aidType || !payload.aidContent) {
            return NextResponse.json({ status: 400, message: 'البيانات غير كاملة' }, { status: 400 });
        }

        const mapAidType = (type: TYPE_AIDS): TYPE_AID => {
            switch (type) {
                case TYPE_AIDS.FINANCIAL_AID: return TYPE_AID.FINANCIAL;
                case TYPE_AIDS.FOOD_AID: return TYPE_AID.FOOD;
                case TYPE_AIDS.MEDICAL_AID: return TYPE_AID.MEDICAL;
                case TYPE_AIDS.CLEANING_AID: return TYPE_AID.CLEANING;
                case TYPE_AIDS.CLOTHING_AIDS: return TYPE_AID.CLOTHING;
                case TYPE_AIDS.EDUCATIONAL_AID: return TYPE_AID.EDUCATIONAL;
                case TYPE_AIDS.OTHER_AID: return TYPE_AID.OTHER;
                default: throw new Error('Unknown aid type');
            }
        };

        const mapDistributionMethod = (
            m: DISTRIBUTION_MECHANISM
        ): DISTRIBUTION_METHOD => {
            switch (m) {
                case DISTRIBUTION_MECHANISM.DELEGATES_LISTS:
                    return DISTRIBUTION_METHOD.DELEGATES;

                case DISTRIBUTION_MECHANISM.DISPLACED_FAMILIES:
                    return DISTRIBUTION_METHOD.DISPLACED_FAMILIES;

                default:
                    throw new Error('Unknown distribution mechanism');
            }
        };

        const mapQuantityType = (
            q: QUANTITY_AVAILABILITY
        ): QUANTITY_TYPE => {
            switch (q) {
                case QUANTITY_AVAILABILITY.LIMITED:
                    return QUANTITY_TYPE.LIMITED;

                case QUANTITY_AVAILABILITY.UNLIMITED:
                    return QUANTITY_TYPE.UNLIMITED;

                default:
                    throw new Error('Unknown quantity type');
            }
        };


        const aid = await prisma.aid.create({
            data: {
                name: payload.aidName,
                type: mapAidType(payload.aidType),
                description: payload.aidContent,
                deliveryDate: payload.deliveryDate ? new Date(payload.deliveryDate) : null,
                deliveryLocation: payload.deliveryLocation ?? null,
                securityRequired: payload.securityRequired ?? false,
                quantityType: mapQuantityType(payload.quantityAvailability),
                distributionMethod: mapDistributionMethod(payload.distributionMechanism),
                existingQuantity: payload.existingQuantity ?? null,
                additionalNotes: payload.additionalNotes ?? null,
                status: AID_STATUS.UPCOMING,
                isCompleted: false,
                createdById: sender.id,
                categories: {
                    create: payload.selectedCategories?.map((c: ICategoryRange) => ({
                        label: c.label,
                        min: c.min,
                        max: c.max ?? null,
                        portion: c.portion ?? null,
                    })),
                },
                delegatePortions: {
                    create: payload.selectedDelegatesPortions?.map((d: ISelectedDelegatePortion) => ({
                        delegateId: d.delegateId,
                        portion: d.portion,
                    })),
                },
                displacedAssignments: {
                    create: payload.selectedDisplacedIds?.map((displacedId) => ({
                        displacedId,
                        deliveryCode: Math.floor(1000 + Math.random() * 9000).toString(),
                    })),
                },
            },
            include: {
                categories: true,
                delegatePortions: true,
                displacedAssignments: true,
            },
        });


        return NextResponse.json({
            status: 200,
            message: 'تم إضافة المساعدة بنجاح',
            aid,
        } as IActionResponse);
    } catch (err: any) {
        console.error(err);
        return NextResponse.json(
            {
                status: 500,
                message: err.message || 'حدث خطأ أثناء إضافة المساعدة',
                error: err.message || 'Internal Server Error',
            },
            { status: 500 }
        );
    }
}
