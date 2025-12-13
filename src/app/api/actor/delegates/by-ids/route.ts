// src/app/api/actor/delegates/by-ids/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/utils/prisma'
import { verifyJWT } from '@/utils/auth'

export async function GET(request: Request) {
    try {
        const token = request.headers.get('authorization')
        if (!token) {
            return NextResponse.json(
                {
                    status: 401,
                    message: 'غير مصرح',
                    delegates: [],
                    pagination: { page: 1, limit: 0, totalItems: 0, totalPages: 0 }
                },
                { status: 401 }
            )
        }

        const verified = verifyJWT(token)
        if (!verified) {
            return NextResponse.json(
                {
                    status: 401,
                    message: 'رمز غير صالح',
                    delegates: [],
                    pagination: { page: 1, limit: 0, totalItems: 0, totalPages: 0 }
                },
                { status: 401 }
            )
        }

        const url = new URL(request.url)
        const page = Number(url.searchParams.get('page') || 1)
        const limit = Number(url.searchParams.get('limit') || 15)
        const skip = (page - 1) * limit

        const idsParam = url.searchParams.getAll('Ids')
        const delegateIds = idsParam.length ? idsParam : []

        const totalItems = await prisma.delegateProfile.count({
            where: { userId: { in: delegateIds } }
        })

        const delegatesData = await prisma.delegateProfile.findMany({
            where: { userId: { in: delegateIds } },
            skip,
            take: limit,
            include: {
                user: {
                    include: {
                        displacements: {
                            include: {
                                displacedProfiles: { include: { socialStatus: true } }
                            }
                        }
                    }
                }
            }
        })

        const delegates = delegatesData.map(d => {
            const allDisplacedProfiles = d.user.displacements.flatMap(dis => dis.displacedProfiles)
            const familyNumber = allDisplacedProfiles.length
            const displacedNumber = allDisplacedProfiles.reduce(
                (acc, p) => acc + (p.socialStatus?.numberOfFemales + p.socialStatus?.numberOfMales + p.socialStatus?.numberOfWives + 1 || 0),
                0
            )

            return {
                id: d.userId,
                name: d.name,
                identity: d.identity,
                displacedNumber,
                familyNumber,
                mobileNumber: d.phoneNumber
            }
        })

        const totalPages = Math.ceil(totalItems / limit)

        return NextResponse.json({
            status: 200,
            message: 'تم جلب بيانات المناديب',
            delegates,
            pagination: { page, limit, totalItems, totalPages }
        })
    } catch (error: any) {
        return NextResponse.json(
            {
                status: 500,
                message: error?.message || 'خطأ أثناء جلب بيانات المناديب',
                delegates: [],
                pagination: { page: 1, limit: 0, totalItems: 0, totalPages: 0 }
            },
            { status: 500 }
        )
    }
}
