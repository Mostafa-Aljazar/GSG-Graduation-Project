'use server';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/utils/prisma';
import { verifyJWT } from '@/utils/auth';
import { COMPLAINT_STATUS, USER_RANK } from '@prisma/client';
import { COMPLAINTS_STATUS, COMPLAINTS_TABS } from '@/types/actor/common/index.type';
import { IActionResponse } from '@/types/common/action-response.type';
import { IComplaint, IComplaintsResponse } from '@/types/actor/general/complaints/complaints-response.type';

export async function GET(req: NextRequest) {
    try {
        const token = req.headers.get('authorization')?.replace('Bearer ', '');
        if (!token) {
            return NextResponse.json<IComplaintsResponse>({
                status: 401,
                message: 'غير مصرح',
                complaints: [],
                pagination: { page: 1, limit: 0, totalItems: 0, totalPages: 0 },
                error: 'غير مصرح',
            }, { status: 401 });

        }

        const viewer = verifyJWT(token); // viewer = token user
        const { searchParams } = new URL(req.url);

        const page = Number(searchParams.get('page') ?? 1);
        const limit = Number(searchParams.get('limit') ?? 5);
        const search = searchParams.get('search') ?? '';
        const dateFrom = searchParams.get('dateRange[0]');
        const dateTo = searchParams.get('dateRange[1]');
        const status = searchParams.get('status') as COMPLAINT_STATUS | undefined;
        const complaintType = searchParams.get('complaintType') as COMPLAINTS_TABS;

        const pageOwnerId = searchParams.get('userAlreadyId') ?? '';
        const pageOwnerRank = searchParams.get('userAlreadyType') as USER_RANK;

        const isOwner = viewer.id === pageOwnerId;

        const where: any = {};

        // ---------------- SELF VIEW ----------------
        if (isOwner) {
            switch (pageOwnerRank) {
                case USER_RANK.DISPLACED:
                    // Displaced only sees sent complaints
                    where.senderId = viewer.id;
                    break;

                case USER_RANK.DELEGATE:
                    if (complaintType === COMPLAINTS_TABS.SENT_COMPLAINTS) where.senderId = viewer.id;
                    if (complaintType === COMPLAINTS_TABS.RECEIVED_COMPLAINTS) where.receiverId = viewer.id;
                    break;

                case USER_RANK.MANAGER:
                    where.receiverId = viewer.id; // Manager only sees received
                    break;

                case USER_RANK.SECURITY_PERSON:
                case USER_RANK.SECURITY_OFFICER:
                    if (complaintType === COMPLAINTS_TABS.SENT_COMPLAINTS) where.senderId = viewer.id;
                    if (complaintType === COMPLAINTS_TABS.RECEIVED_COMPLAINTS) where.receiverId = viewer.id;
                    break;
            }
        } else {
            // ---------------- CROSS VIEW ----------------
            switch (pageOwnerRank) {
                case USER_RANK.DISPLACED:
                    if (viewer.rank === USER_RANK.MANAGER) {
                        where.senderId = pageOwnerId;
                    } else if (viewer.rank === USER_RANK.DELEGATE) {
                        where.senderId = pageOwnerId;
                        where.receiverId = viewer.id;
                    } else if (viewer.rank === USER_RANK.SECURITY_OFFICER) {
                        where.senderId = pageOwnerId;
                        // where.receiver: { rank: USER_RANK.SECURITY_OFFICER };
                        where.receiver = { rank: { equals: USER_RANK.SECURITY_OFFICER } };

                    } else {
                        return NextResponse.json({ status: 200, message: 'No complaints', complaints: [], pagination: { page, limit, totalItems: 0, totalPages: 0 } });
                    }
                    break;

                case USER_RANK.DELEGATE:
                    if (viewer.rank === USER_RANK.MANAGER) {
                        if (complaintType === COMPLAINTS_TABS.SENT_COMPLAINTS) where.senderId = pageOwnerId;
                        else where.receiverId = pageOwnerId;
                    } else if (viewer.rank === USER_RANK.SECURITY_OFFICER) {
                        where.senderId = pageOwnerId;
                        // where.receiver: { rank: USER_RANK.SECURITY_OFFICER };
                        where.receiver = { rank: { equals: USER_RANK.SECURITY_OFFICER } };
                    } else if (viewer.rank === USER_RANK.DISPLACED) {
                        where.senderId = viewer.id;
                        where.receiverId = pageOwnerId;
                    } else {
                        return NextResponse.json({ status: 200, message: 'No complaints', complaints: [], pagination: { page, limit, totalItems: 0, totalPages: 0 } });
                    }
                    break;

                case USER_RANK.MANAGER:
                    // All viewers see complaints sent to manager
                    where.receiverId = pageOwnerId;
                    break;

                case USER_RANK.SECURITY_OFFICER:
                    if (viewer.rank === USER_RANK.MANAGER || viewer.rank === USER_RANK.SECURITY_OFFICER) {
                        if (complaintType === COMPLAINTS_TABS.SENT_COMPLAINTS) where.senderId = pageOwnerId;
                        else where.receiver = { rank: { equals: USER_RANK.SECURITY_OFFICER } };

                        // else where.receiver: { rank: USER_RANK.SECURITY_OFFICER };
                    } else {
                        where.receiver = { rank: { equals: USER_RANK.SECURITY_OFFICER } };
                        // where.receiver: { rank: USER_RANK.SECURITY_OFFICER };
                    }
                    break;

                case USER_RANK.SECURITY_PERSON:
                    if (viewer.rank === USER_RANK.MANAGER || viewer.rank === USER_RANK.SECURITY_OFFICER) {
                        if (complaintType === COMPLAINTS_TABS.SENT_COMPLAINTS) where.senderId = pageOwnerId;
                        else where.receiver = { rank: { equals: USER_RANK.SECURITY_OFFICER } };
                        // else where.receiver: { rank: USER_RANK.SECURITY_OFFICER };
                    } else {
                        where.senderId = pageOwnerId;
                    }
                    break;
            }
        }

        if (status && status !== COMPLAINT_STATUS.PENDING) {
            where.status = status;
        }

        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { body: { contains: search, mode: 'insensitive' } },
            ];
        }

        if (dateFrom || dateTo) {
            where.createdAt = {};
            if (dateFrom) where.createdAt.gte = new Date(dateFrom);
            if (dateTo) where.createdAt.lte = new Date(dateTo);
        }

        const skip = (page - 1) * limit;

        const [complaints, totalItems] = await prisma.$transaction([
            prisma.complaint.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    sender: {
                        select: {
                            id: true,
                            role: true,
                            rank: true,
                            displaced: { select: { name: true, profileImage: true } },
                            delegate: { select: { name: true, profileImage: true } },
                            manager: { select: { name: true, profileImage: true } },
                            security: { select: { name: true, profileImage: true } },
                        },
                    },
                    receiver: {
                        select: {
                            id: true,
                            role: true,
                            rank: true,
                            displaced: { select: { name: true, profileImage: true } },
                            delegate: { select: { name: true, profileImage: true } },
                            manager: { select: { name: true, profileImage: true } },
                            security: { select: { name: true, profileImage: true } },
                        },
                    },
                },
            }),
            prisma.complaint.count({ where }),
        ]);

        const mapped: IComplaint[] = complaints.map(c => ({
            id: c.id,
            date: c.createdAt,
            title: c.title,
            body: c.body,
            status: c.status as COMPLAINTS_STATUS,
            reply: c.reply || undefined,
            sender: {
                id: c.sender.id,
                role: c.sender.role ?? c.sender.rank,
                name: c.sender.displaced?.name || c.sender.delegate?.name || c.sender.manager?.name || c.sender.security?.name || '',
                image: c.sender.displaced?.profileImage || c.sender.delegate?.profileImage || c.sender.manager?.profileImage || c.sender.security?.profileImage || '',
            },
            receiver: {
                id: c.receiver.id,
                role: c.receiver.role ?? c.receiver.rank,
                name: c.receiver.displaced?.name || c.receiver.delegate?.name || c.receiver.manager?.name || c.receiver.security?.name || '',
                image: c.receiver.displaced?.profileImage || c.receiver.delegate?.profileImage || c.receiver.manager?.profileImage || c.receiver.security?.profileImage || '',
            },
        }));

        return NextResponse.json<IComplaintsResponse>({
            status: 200,
            message: 'تم جلب الشكاوى بنجاح',
            complaints: mapped,
            pagination: { page, limit, totalItems, totalPages: Math.ceil(totalItems / limit) },
        });

    } catch (err: any) {
        return NextResponse.json<IComplaintsResponse>({
            status: 500,
            message: err?.message || 'حدث خطأ',
            complaints: [],
            pagination: { page: 1, limit: 0, totalItems: 0, totalPages: 0 },
            error: err?.message || 'خطأ',
        }, { status: 500 });
    }
}
