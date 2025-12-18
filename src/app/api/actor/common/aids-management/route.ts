'use server';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';
import { verifyJWT } from '@/utils/auth';
import { USER_TYPE, AID_STATUS, DISTRIBUTION_METHOD, QUANTITY_TYPE } from '@gen/enums'
import { IAidsResponse, TAid, ICategoryRange, ISelectedDelegatePortion, IReceivedDisplaceds } from '@/types/actor/common/aids-management/aids-management.types';
import { IPagination } from '@/types/common/pagination.type';
import { TYPE_GROUP_AIDS, TYPE_AIDS, DISTRIBUTION_MECHANISM, QUANTITY_AVAILABILITY } from '@/types/actor/common/index.type';

interface IGetAidsQuery {
    page?: string;
    limit?: string;
    type?: TYPE_AIDS;
    startDate?: string;
    endDate?: string;
    minRecipients?: string;
    maxRecipients?: string;
    aidStatus?: TYPE_GROUP_AIDS;
}

export async function GET(req: NextRequest) {
    try {
        const token = req.headers.get('authorization');
        if (!token) return NextResponse.json<IAidsResponse>({
            status: 401, message: 'غير مصرح', aids: [],
            pagination: { page: 1, limit: 0, totalItems: 0, totalPages: 0 },
        }, { status: 401 });

        const sender = verifyJWT(token);

        // Only MANAGER and DELEGATE can fetch
        if (USER_TYPE.MANAGER !== sender.role && USER_TYPE.DELEGATE !== sender.role) {
            return NextResponse.json<IAidsResponse>({
                status: 403, message: 'غير مصرح بالدخول', aids: [],
                pagination: { page: 1, limit: 0, totalItems: 0, totalPages: 0 },
            }, { status: 403 });
        }

        const url = new URL(req.url);
        const query = url.searchParams;

        const { page = '1', limit = '10', type, startDate, endDate, minRecipients, maxRecipients, aidStatus } =
            Object.fromEntries(query.entries()) as IGetAidsQuery;

        const skip = (Number(page) - 1) * Number(limit);
        const take = Number(limit);

        const filters: any = {};

        // Map TYPE_AIDS to TYPE_AID
        const mapTypeAidsToDb = (t: TYPE_AIDS): string => {
            switch (t) {
                case TYPE_AIDS.FINANCIAL_AID: return 'FINANCIAL';
                case TYPE_AIDS.FOOD_AID: return 'FOOD';
                case TYPE_AIDS.MEDICAL_AID: return 'MEDICAL';
                case TYPE_AIDS.CLEANING_AID: return 'CLEANING';
                case TYPE_AIDS.CLOTHING_AIDS: return 'CLOTHING';
                case TYPE_AIDS.EDUCATIONAL_AID: return 'EDUCATIONAL';
                case TYPE_AIDS.OTHER_AID: return 'OTHER';
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


        if (type) filters.type = mapTypeAidsToDb(type);

        if (aidStatus) {
            switch (aidStatus) {
                case TYPE_GROUP_AIDS.COMING_AIDS: filters.status = AID_STATUS.UPCOMING; break;
                case TYPE_GROUP_AIDS.ONGOING_AIDS: filters.status = AID_STATUS.ONGOING; break;
                case TYPE_GROUP_AIDS.PREVIOUS_AIDS: filters.status = AID_STATUS.PREVIOUS; break;
            }
        }

        if (startDate || endDate) {
            filters.deliveryDate = {};
            if (startDate) filters.deliveryDate.gte = new Date(startDate);
            if (endDate) filters.deliveryDate.lte = new Date(endDate);
        }

        if (sender.role === USER_TYPE.DELEGATE) {
            filters.delegatePortions = { some: { delegateId: sender.id } };
        }

        const totalItems = await prisma.aid.count({ where: filters });

        const aidsDb = await prisma.aid.findMany({
            where: filters,
            include: {
                categories: true,
                delegatePortions: true,
                displacedAssignments: true,
            },
            skip,
            take,
            orderBy: { deliveryDate: 'desc' },
        });

        const mappedAids: TAid[] = aidsDb.map(aid => ({
            id: aid.id,
            aidName: aid.name,
            aidType: Object.keys(TYPE_AIDS).find(key => mapTypeAidsToDb(TYPE_AIDS[key as keyof typeof TYPE_AIDS]) === aid.type) as TYPE_AIDS,
            aidContent: aid.description,
            deliveryDate: aid.deliveryDate ?? null,
            deliveryLocation: aid.deliveryLocation ?? '',
            securityRequired: aid.securityRequired,
            quantityAvailability: mapQuantity(aid.quantityType) as any,
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
        }));

        const filteredAids = mappedAids.filter(aid => {
            const count = aid.selectedDisplacedIds.length;
            if (minRecipients && count < Number(minRecipients)) return false;
            if (maxRecipients && count > Number(maxRecipients)) return false;
            return true;
        });

        const pagination: IPagination = {
            page: Number(page),
            limit: Number(limit),
            totalItems,
            totalPages: Math.ceil(totalItems / Number(limit)),
        };

        return NextResponse.json<IAidsResponse>({ status: 200, message: 'تم جلب المساعدات بنجاح', aids: filteredAids, pagination } as IAidsResponse);
    } catch (err: any) {
        console.error(err);
        return NextResponse.json<IAidsResponse>({
            status: 500,
            message: err.message || 'حدث خطأ أثناء جلب المساعدات',
            aids: [],
            pagination: { page: 1, limit: 0, totalItems: 0, totalPages: 0 },
            error: err.message || 'Internal Server Error',
        }, { status: 500 });
    }
}
