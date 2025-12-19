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
                    delegateNames: [],
                },
                { status: 401 }
            )
        }

        const verified = verifyJWT(token)
        if (!verified) {
            return NextResponse.json(
                { status: 401, message: 'رمز غير صالح', delegatesIds: [] },
                { status: 401 }
            )
        }

        const { searchParams } = new URL(req.url)
        const idsParam = searchParams.get('ids')

        let ids: string[] | undefined = undefined

        if (idsParam) {
            ids = idsParam.split(',').map(i => i.trim())
        }

        const delegates = await prisma.user.findMany({
            where: {
                AND: [
                    { role: USER_TYPE.DELEGATE },
                    ids ? { id: { in: ids } } : {},
                ],
            },
            select: {
                id: true,
                delegate: {
                    select: {
                        name: true
                    }
                },
            },
        })

        const delegateNames = delegates.map(d => ({
            id: d.id,
            name: d.delegate?.name,
        }))

        return NextResponse.json(
            {
                status: 200,
                message: 'تم جلب أسماء المناديب',
                delegateNames,
            },
            { status: 200 }
        )

    } catch (err: any) {
        return NextResponse.json(
            {
                status: 500,
                message: err?.message || 'خطأ أثناء جلب أسماء المناديب',
                delegateNames: [],
                error: err?.message || 'خطأ',
            },
            { status: 500 }
        )
    }
}
