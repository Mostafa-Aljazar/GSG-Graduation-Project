import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/utils/prisma";
import { sendOTPEmail } from "@/actions/auth/sendOTPEmail";
import { generateOTP } from "@/utils/auth/otp";
import { IActionResponse } from "@/types/common/action-response.type";

export async function POST(req: NextRequest) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json<IActionResponse>(
                { message: "البريد الإلكتروني مطلوب", status: 400 },
                { status: 400 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return NextResponse.json<IActionResponse>(
                { message: "المستخدم غير موجود", status: 404 },
                { status: 404 }
            );
        }

        const otp = generateOTP();
        const expiresAt = new Date(Date.now() + 60 * 1000);

        const existingOtp = await prisma.userOtp.findUnique({
            where: { userId: user.id },
        });

        if (existingOtp) {
            await prisma.userOtp.update({
                where: { userId: user.id },
                data: {
                    otp,
                    expiresAt,
                },
            });
        } else {
            await prisma.userOtp.create({
                data: {
                    userId: user.id,
                    otp,
                    expiresAt,
                },
            });
        }

        await sendOTPEmail(email, otp, 1);

        return NextResponse.json<IActionResponse>(
            { message: "تم إرسال رمز التحقق بنجاح", status: 200 },
            { status: 200 }
        );
    } catch (err) {
        console.error(err);

        return NextResponse.json<IActionResponse>(
            { message: "حدث خطأ غير متوقع", status: 500 },
            { status: 500 }
        );
    }
}
