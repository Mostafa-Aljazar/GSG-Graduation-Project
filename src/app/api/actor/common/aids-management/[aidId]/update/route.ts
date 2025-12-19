'use server';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';
import { verifyJWT } from '@/utils/auth';
import { USER_TYPE, TYPE_AID, DISTRIBUTION_METHOD, QUANTITY_TYPE } from '@prisma/client';
import { TAid, ISelectedDelegatePortion, ICategoryRange } from '@/types/actor/common/aids-management/aids-management.types';
import { IActionResponse } from '@/types/common/action-response.type';
import { TYPE_AIDS } from '@/types/actor/common/index.type';

interface IUpdateAidRequest {
    payload: TAid;
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ aidId: string }> }) {
    try {
        const token = req.headers.get('authorization');
        if (!token) return NextResponse.json({ status: 401, message: 'غير مصرح' }, { status: 401 });

        const sender = verifyJWT(token);
        if (sender.role !== USER_TYPE.MANAGER) return NextResponse.json({ status: 403, message: 'ليس لديك صلاحية تعديل المساعدات' }, { status: 403 });

        const { aidId } = await params;
        // const body = await req.json();

        const { payload } = (await req.json()) as IUpdateAidRequest;

        // if (!body?.payload) return NextResponse.json({ status: 400, message: 'payload غير موجود' }, { status: 400 });

        // const payload: TAid = body.payload;

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

        const aid = await prisma.aid.update({
            where: { id: aidId },
            data: {
                name: payload.aidName,
                type: mapAidType(payload.aidType),
                description: payload.aidContent,
                deliveryDate: payload.deliveryDate ? new Date(payload.deliveryDate) : null,
                deliveryLocation: payload.deliveryLocation ?? null,
                securityRequired: payload.securityRequired ?? false,
                quantityType: payload.quantityAvailability as QUANTITY_TYPE,
                existingQuantity: payload.existingQuantity ?? null,
                additionalNotes: payload.additionalNotes ?? null,
                distributionMethod: payload.distributionMechanism as DISTRIBUTION_METHOD,
                isCompleted: payload.isCompleted ?? false,
                categories: {
                    deleteMany: {},
                    create: payload.selectedCategories?.map((c: ICategoryRange) => ({
                        label: c.label,
                        min: c.min,
                        max: c.max ?? null,
                        portion: c.portion ?? null,
                    })),
                },
                delegatePortions: {
                    deleteMany: {},
                    create: payload.selectedDelegatesPortions?.map((d: ISelectedDelegatePortion) => ({
                        delegateId: d.delegateId,
                        portion: d.portion,
                    })),
                },
                displacedAssignments: {
                    deleteMany: {},
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

        return NextResponse.json<IActionResponse>({
            status: 200,
            message: 'تم تعديل المساعدة بنجاح',
        });

    } catch (err: any) {
        console.error(err);
        return NextResponse.json<IActionResponse>({
            status: 500,
            message: err.message || 'حدث خطأ أثناء تعديل المساعدة',
            error: err.message || 'Internal Server Error',
        }, { status: 500 });
    }
}
