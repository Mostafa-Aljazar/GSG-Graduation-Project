'use server';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';
import { DISPLACED_RECEIVED_AIDS_TABS, TYPE_AIDS } from '@/types/actor/common/index.type';
import { IDisplacedReceivedAidsResponse } from '@/types/actor/displaceds/received-aids/displaced-received-aids-response.type';

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ displacedId: string }> }
) {
    try {
        const { displacedId } = await params;

        const { searchParams } = new URL(req.url);
        const page = Number(searchParams.get('page') ?? 1);
        const limit = Number(searchParams.get('limit') ?? 10);
        const tabType = searchParams.get('tabType') as DISPLACED_RECEIVED_AIDS_TABS | null;

        const skip = (page - 1) * limit;

        const where: any = { displacedId };

        if (tabType === DISPLACED_RECEIVED_AIDS_TABS.RECEIVED_AIDS) {
            where.displacedReceived = 'RECEIVED_AIDS';
        }

        // Fetch all first, filter later for PROVIDED_AIDS
        let rows = await prisma.aidDisplaced.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            include: {
                aid: true,
                aidGiver: {
                    select: {
                        id: true,
                        role: true,
                        delegate: { select: { name: true } },
                        manager: { select: { name: true } }
                    }
                }
            }
        });

        // Filter PROVIDED_AIDS by aid status
        if (tabType === DISPLACED_RECEIVED_AIDS_TABS.RECEIVED_AIDS) {
            rows = rows.filter(ad => ad.displacedReceived == "RECEIVED_AIDS");
        } else {
            rows = rows.filter(ad => ad.displacedReceived == "PROVIDED_AIDS");

        }

        const totalItems = rows.length;
        const paginatedRows = rows.slice(skip, skip + limit);

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

        const receivedAids = paginatedRows.map(item => {
            const giverName = item.aidGiver?.delegate?.name ?? item.aidGiver?.manager?.name ?? '';
            return {
                id: item.id,
                tabType: item.displacedReceived as DISPLACED_RECEIVED_AIDS_TABS,
                aidName: item.aid.name,
                aidType: mapTypeAidsToClient(item.aid.type),
                aidContent: item.aid.description,
                deliveryLocation: item.aid.deliveryLocation ?? '',
                deliveryDate: item.aid.deliveryDate ?? '',
                receiptDate: item.receivedAt ?? undefined,
                aidGiver: {
                    giverId: item.aidGiver?.id ?? '',
                    name: giverName,
                    role: item.aidGiver?.role as 'DELEGATE' | 'MANAGER'
                }
            };
        });


        return NextResponse.json<IDisplacedReceivedAidsResponse>({
            status: 200,
            message: 'success',
            receivedAids,
            pagination: {
                page,
                limit,
                totalItems,
                totalPages: Math.ceil(totalItems / limit)
            }
        });
    } catch (err) {
        return NextResponse.json<IDisplacedReceivedAidsResponse>({
            status: 500,
            error: err instanceof Error ? err.message : 'unknown error',
            receivedAids: [],
            pagination: {
                page: 1,
                limit: 0,
                totalItems: 0,
                totalPages: 0
            }
        });
    }
}
