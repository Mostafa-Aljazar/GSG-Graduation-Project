// src/app/api/actor/displaceds/by-ids/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";
import { verifyJWT } from "@/utils/auth";
import { IPagination } from "@/types/common/pagination.type";
import { IDisplaced, IDisplacedsResponse } from "@/types/actor/general/displaceds/displaces-response.type";

export async function GET(request: NextRequest) {
    try {
        const token = request.headers.get("authorization");
        if (!token) {
            return NextResponse.json(
                {
                    status: 401,
                    message: "غير مصرح",
                    displaceds: [],
                    pagination: { page: 1, limit: 0, totalItems: 0, totalPages: 0 },
                },
                { status: 401 }
            );
        }

        const verified = verifyJWT(token);
        if (!verified) {
            return NextResponse.json(
                {
                    status: 401,
                    message: "رمز غير صالح",
                    displaceds: [],
                    pagination: { page: 1, limit: 0, totalItems: 0, totalPages: 0 },
                },
                { status: 401 }
            );
        }

        const url = new URL(request.url);
        const page = Number(url.searchParams.get("page") || 1);
        const limit = Number(url.searchParams.get("limit") || 15);
        const skip = (page - 1) * limit;

        const idsParam = url.searchParams.getAll("ids"); // lowercase for query param
        const displacedIds = idsParam.length ? idsParam : [];

        const totalItems = await prisma.displacedProfile.count({
            where: { userId: { in: displacedIds } },
        });

        const displacedData = await prisma.displacedProfile.findMany({
            where: { userId: { in: displacedIds } },
            skip,
            take: limit,
            include: {
                displacement: true,
                socialStatus: true,
                user: true,
            },
        });

        const displaceds: IDisplaced[] = await Promise.all(
            displacedData.map(async (d) => {
                // Get delegate info
                const delegate = await prisma.delegateProfile.findUnique({
                    where: { userId: d.displacement.delegateId || "" },
                    select: { name: true, userId: true },
                });

                const familyNumber =
                    (d.socialStatus?.numberOfMales || 0) +
                    (d.socialStatus?.numberOfFemales || 0) +
                    (d.socialStatus?.numberOfWives || 0) +
                    1;

                return {
                    id: d.userId,
                    name: d.name,
                    identity: d.identity,
                    tent: d.displacement?.tentNumber || "",
                    familyNumber,
                    mobileNumber: d.phoneNumber,
                    delegate: {
                        id: delegate?.userId || "",
                        name: delegate?.name || "",
                    },
                };
            })
        );

        const totalPages = Math.ceil(totalItems / limit);

        const pagination: IPagination = { page, limit, totalItems, totalPages };

        const response: IDisplacedsResponse = {
            status: 200,
            message: "تم جلب بيانات النازحين",
            displaceds,
            pagination,
        };

        return NextResponse.json(response);
    } catch (err: any) {
        return NextResponse.json(
            {
                status: 500,
                message: err?.message || "خطأ أثناء جلب بيانات النازحين",
                displaceds: [],
                pagination: { page: 1, limit: 0, totalItems: 0, totalPages: 0 },
                error: err?.message || "Internal server error",
            },
            { status: 500 }
        );
    }
}
