import { IActionResponse } from "@/types/common/action-response.type";
import { verifyJWT } from "@/utils/auth";
import { prisma } from "@/utils/prisma";
import { USER_TYPE } from "@gen/client";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const token = request.headers.get('authorization')
    if (!token) {
      return NextResponse.json({
        status: 401,
        message: 'غير مصرح',
        displaceds: [],
        pagination: { page: 1, limit: 0, totalItems: 0, totalPages: 0 },
      }, { status: 401 })
    }

    const verified = verifyJWT(token)
    if (verified.role !== USER_TYPE.MANAGER) {
      return NextResponse.json<IActionResponse>({
        status: 401,
        message: 'رمز غير صالح',
      }, { status: 401 })
    }


    const body = await request.json();

    const {
      title,
      content,
      brief = "",
      imageUrls = [],
      type,
    } = body;

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

    const newContent = await prisma.writtenContent.create({
      data: {
        title,
        content,
        brief,
        imgs: imageUrls,
        type,
      },
    });

    return NextResponse.json<IActionResponse>(
      {
        status: 200,
        message: "تم إضافة المحتوى بنجاح",
      },
      { status: 200 }
    );
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "حدث خطأ أثناء إضافة المحتوى";

    return NextResponse.json<IActionResponse>(
      {
        status: 500,
        message,
        error: message,
      },
      { status: 500 }
    );
  }
}
