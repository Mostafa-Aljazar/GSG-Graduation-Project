import { NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";
import { verifyJWT } from "@/utils/auth";
import { USER_TYPE } from "@gen/client";
import { IWrittenContent, IWrittenContentResponse } from "@/types/common/written-content/written-content-response.type";
import { TYPE_WRITTEN_CONTENT as TYPE_WRITTEN_CONTENT_LOCAL } from "@/types/common/index.type";


export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        // const { searchParams } = new URL(req.url);
        // const type = searchParams.get('type') as TYPE_WRITTEN_CONTENT;

        // if (!type) {
        //     return NextResponse.json(
        //         {
        //             status: 400,
        //             message: 'نوع المحتوى مفقود',
        //             error: 'type is required',
        //         },
        //         { status: 400 }
        //     );
        // }

        const { id } = await params;

        // TODO: Replace with real DB call
        const writtenContent = await prisma.writtenContent.findUnique({
            where: { id },
        });

        if (!writtenContent) {
            return NextResponse.json(
                {
                    status: 404,
                    message: 'المحتوى غير موجود',
                    error: 'Not found',
                },
                { status: 404 }
            );
        }

        const writtenContentRes: IWrittenContent = {
            ...writtenContent,
            id: writtenContent.id,
            type: writtenContent.type as TYPE_WRITTEN_CONTENT_LOCAL,
            content: writtenContent.content,
            imgs: writtenContent.imgs,
            title: writtenContent.title,
            createdAt: writtenContent.createdAt,
            updateAt: writtenContent.updatedAt,
            brief: writtenContent.brief || ""
        }

        return NextResponse.json<IWrittenContentResponse>(
            {
                status: 200,
                message: 'تم جلب البيانات بنجاح',
                writtenContent: writtenContentRes,
            },
            { status: 200 }
        );
    } catch (err: any) {
        return NextResponse.json(
            {
                status: 500,
                message: 'حدث خطأ أثناء جلب بيانات المحتوى',
                error: err.message,
            },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const token = request.headers.get("authorization");

        if (!token) {
            return NextResponse.json(
                {
                    status: 401,
                    message: "غير مصرح",
                },
                { status: 401 }
            );
        }

        const verified = verifyJWT(token);

        if (verified.role !== USER_TYPE.MANAGER) {
            return NextResponse.json(
                {
                    status: 401,
                    message: "رمز غير صالح",
                },
                { status: 401 }
            );
        }

        const { id } = await params;

        // const { searchParams } = new URL(request.url);
        // const type = searchParams.get("type");

        // if (!type) {
        //     return NextResponse.json(
        //         {
        //             status: 400,
        //             message: "نوع المحتوى مطلوب",
        //             error: "type مطلوب",
        //         },
        //         { status: 400 }
        //     );
        // }

        const exists = await prisma.writtenContent.findUnique({
            where: { id },
        });

        if (!exists) {
            return NextResponse.json(
                {
                    status: 404,
                    message: "المحتوى غير موجود",
                },
                { status: 404 }
            );
        }

        await prisma.writtenContent.delete({
            where: { id },
        });

        return NextResponse.json(
            {
                status: 200,
                message: "تم حذف المحتوى بنجاح",
            },
            { status: 200 }
        );
    } catch (err) {
        const message =
            err instanceof Error ? err.message : "حدث خطأ أثناء حذف المحتوى";

        return NextResponse.json(
            {
                status: 500,
                message,
                error: message,
            },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const token = request.headers.get("authorization");

        if (!token) {
            return NextResponse.json(
                {
                    status: 401,
                    message: "غير مصرح",
                },
                { status: 401 }
            );
        }

        const verified = verifyJWT(token);

        if (verified.role !== USER_TYPE.MANAGER) {
            return NextResponse.json(
                {
                    status: 401,
                    message: "رمز غير صالح",
                },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { title, content, brief = "", imageUrls = [], type } = body;

        if (!title || !content || !type) {
            return NextResponse.json(
                {
                    status: 400,
                    message: "البيانات غير مكتملة",
                    error: "title, content, type مطلوبة",
                },
                { status: 400 }
            );
        }

        const { id } = await params;

        const exists = await prisma.writtenContent.findUnique({
            where: { id },
        });

        if (!exists) {
            return NextResponse.json(
                {
                    status: 404,
                    message: "المحتوى غير موجود",
                },
                { status: 404 }
            );
        }

        await prisma.writtenContent.update({
            where: { id },
            data: {
                title,
                content,
                brief,
                imgs: imageUrls,
                type,
            },
        });

        return NextResponse.json(
            {
                status: 200,
                message: "تم تحديث المحتوى بنجاح",
            },
            { status: 200 }
        );
    } catch (err) {
        const message =
            err instanceof Error ? err.message : "حدث خطأ أثناء تحديث المحتوى";

        return NextResponse.json(
            {
                status: 500,
                message,
                error: message,
            },
            { status: 500 }
        );
    }
}
