import { NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";
import { TYPE_WRITTEN_CONTENT } from "@gen/client";
import { IPagination } from "@/types/common/pagination.type";
import { IWrittenContent, IWrittenContentsResponse } from "@/types/common/written-content/written-content-response.type";
import { TYPE_WRITTEN_CONTENT as TYPE_WRITTEN_CONTENT_LOCAL } from "@/types/common/index.type";

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const type = url.searchParams.get("type") as TYPE_WRITTEN_CONTENT;
        const page = parseInt(url.searchParams.get("page") || "1");
        const limit = parseInt(url.searchParams.get("limit") || "5");

        if (!type) {
            return NextResponse.json(
                { status: 400, message: "نوع المحتوى مطلوب", error: "type is required", writtenContents: [], pagination: { page, limit, totalItems: 0, totalPages: 0 } },
                { status: 400 }
            );
        }

        const totalItems = await prisma.writtenContent.count({ where: { type } });
        const totalPages = Math.ceil(totalItems / limit);
        const skip = (page - 1) * limit;

        const writtenContents = await prisma.writtenContent.findMany({
            where: { type },
            skip,
            take: limit,
            orderBy: { createdAt: "desc" },
        });

        const pagination: IPagination = { page, limit, totalItems, totalPages };


        const writtenContentsRes: IWrittenContent[] = writtenContents.map((item) => {
            return {
                id: item.id,
                type: item.type as TYPE_WRITTEN_CONTENT_LOCAL,
                content: item.content,
                imgs: item.imgs,
                title: item.title,
                createdAt: item.createdAt,
                updateAt: item.updatedAt,
                brief: item.brief || ""
            }
        })
        return NextResponse.json<IWrittenContentsResponse>({
            status: 200,
            message: "تم جلب البيانات بنجاح",
            writtenContents: writtenContentsRes,
            pagination,
        });
    } catch (err: any) {
        return NextResponse.json<IWrittenContentsResponse>({
            status: 500,
            message: "حدث خطأ أثناء جلب بيانات المحتوى",
            error: err.message,
            writtenContents: [],
            pagination: { page: 1, limit: 0, totalItems: 0, totalPages: 0 },
        });
    }
}
