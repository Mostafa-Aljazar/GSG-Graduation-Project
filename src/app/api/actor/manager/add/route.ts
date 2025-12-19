import { NextRequest, NextResponse } from 'next/server';
import { createJWT, hashPassword } from '@/utils/auth';
import { prisma } from '@/utils/prisma';
import { USER_RANK, USER_TYPE } from '@prisma/client';
// import { USER_TYPE, USER_RANK } from '';

export async function POST(req: NextRequest) {
    try {
        const { name, email, password, identity, nationality, gender, phoneNumber } = await req.json();

        // تحقق إذا يوجد أي مدير في النظام
        const existingManager = await prisma.user.findFirst({
            where: { rank: USER_RANK.MANAGER },
        });

        if (existingManager) {
            return NextResponse.json(
                { status: 400, message: 'Manager already exists' },
                { status: 400 }
            );
        }

        // تشفير كلمة المرور
        const hashedPassword = await hashPassword({ password });

        // إنشاء الـ user والمدير
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                role: USER_TYPE.MANAGER,
                rank: USER_RANK.MANAGER,
                status: 'ACTIVE',
                manager: {
                    create: {
                        name,
                        identity,
                        nationality,
                        gender,
                        phoneNumber,
                        role: USER_TYPE.MANAGER,
                        rank: USER_RANK.MANAGER,
                        socialStatus: 'SINGLE', // افتراضي
                    },
                },
            },
            include: { manager: true },
        });

        // إنشاء JWT
        const token = createJWT({
            id: user.id,
            role: USER_TYPE.MANAGER,
            rank: USER_RANK.MANAGER,
        });

        return NextResponse.json({ status: 200, user, token });
    } catch (err: any) {
        console.error(err);
        return NextResponse.json(
            { status: 500, message: err.message },
            { status: 500 }
        );
    }
}
