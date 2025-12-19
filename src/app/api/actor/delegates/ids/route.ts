import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/utils/prisma'
import { verifyJWT } from '@/utils/auth'
import { USER_TYPE } from '@prisma/client'

export async function GET(req: NextRequest) {
    try {
        const token = req.headers.get('authorization')

        if (!token) {
            return NextResponse.json(
                {
                    status: 401,
                    message: 'غير مصرح',
                    delegatesIds: [],
                },
                { status: 401 }
            )
        }

        const verified = verifyJWT(token)
        if (!verified) {
            // if (!verified || (verified.role !== USER_TYPE.MANAGER && verified.role !== USER_TYPE.SECURITY_PERSON)) {
            return NextResponse.json(
                { status: 401, message: 'رمز غير صالح', delegatesIds: [] },
                { status: 401 }
            )
        }

        const delegates = await prisma.delegateProfile.findMany({
            select: { userId: true }
        })

        const delegatesIds = delegates.map(d => d.userId)

        return NextResponse.json(
            {
                status: 200,
                message: 'تم جلب أرقام معرفات المناديب',
                delegatesIds
            },
            { status: 200 }
        )

    } catch (err: any) {
        return NextResponse.json(
            {
                status: 500,
                message: err?.message || 'خطأ أثناء جلب معرفات المناديب',
                delegatesIds: []
            },
            { status: 500 }
        )
    }
}
