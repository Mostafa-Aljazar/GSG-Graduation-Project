import { NextResponse } from 'next/server'
import { prisma } from '@/utils/prisma'
import { verifyJWT } from '@/utils/auth'
import { IDisplacedsIdsResponse } from '@/types/actor/general/displaceds/displaces-response.type'
import { TDisplacedsFilterFormValues } from '@/validations/actor/general/displaceds/displaceds-filter-form.schema'
import { WIFE_STATUS } from '@/types/actor/common/index.type'
import { ACCOMMODATION_TYPE, FAMILY_STATUS_TYPE } from '@prisma/client'

export async function GET(request: Request) {
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
        if (!verified) {
            return NextResponse.json({
                status: 401,
                message: 'رمز غير صالح',
                displaceds: [],
                pagination: { page: 1, limit: 0, totalItems: 0, totalPages: 0 },
            }, { status: 401 })
        }

        const url = new URL(request.url)
        // const page = Number(url.searchParams.get('page') || 1)
        // const limit = Number(url.searchParams.get('limit') || 15)
        // const skip = (page - 1) * limit
        const search = url.searchParams.get('search') || ''

        let filters: TDisplacedsFilterFormValues = {
            wifeStatus: null,
            familyNumber: null,
            ages: null,
            chronicDisease: null,
            accommodationType: null,
            familyStatusType: null,
            delegate: null,
        }

        try {
            const f = url.searchParams.get('filters')
            if (f) filters = JSON.parse(f)
        } catch { }

        const where: any = {}

        // -------------------------------
        // CASE-INSENSITIVE SEARCH
        // typing "moh" returns Mohamed
        // -------------------------------
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { identity: { contains: search, mode: 'insensitive' } }
            ]
        }

        // -------------------------------
        // WIFE FILTER
        // PREGNANT → any wife { isPregnant = true }
        // WET_NURSE → any wife { isWetNurse = true }
        // -------------------------------
        if (filters.wifeStatus) {
            const isPregnant = filters.wifeStatus === WIFE_STATUS.PREGNANT
            const isWetNurse = filters.wifeStatus === WIFE_STATUS.WET_NURSE

            where.wives = {
                some: {
                    ...(isPregnant && { isPregnant: true }),
                    ...(isWetNurse && { isWetNurse: true })
                }
            }
        }

        // -------------------------------
        // AGE GROUP FILTER
        // displaced.socialStatus.ageGroups has children age groups
        // -------------------------------
        if (filters.ages?.length) {
            where.socialStatus = {
                ageGroups: {
                    some: {
                        ageGroup: { in: filters.ages }
                    }
                }
            }
        }

        // -------------------------------
        // CHRONIC DISEASE
        // true  => has ANY medical conditions
        // false => has ZERO medical conditions
        // -------------------------------
        if (filters.chronicDisease) {
            if (filters.chronicDisease === 'true') {
                where.medicalConditions = { some: {} }
            } else {
                where.medicalConditions = { none: {} }
            }
        }

        // -------------------------------
        // DISPLACEMENT FILTERS
        // They must all merge correctly without override
        // -------------------------------
        if (filters.accommodationType ||
            filters.familyStatusType ||
            (filters.delegate && filters.delegate.length)
        ) {
            where.displacement = {
                ...(filters.accommodationType && {
                    tentType: filters.accommodationType as ACCOMMODATION_TYPE
                }),
                ...(filters.familyStatusType && {
                    familyStatusType: filters.familyStatusType as FAMILY_STATUS_TYPE
                }),
                ...(filters.delegate && filters.delegate.length && {
                    delegateId: { in: filters.delegate }
                })
            }
        }

        // -------------------------------
        // MAIN QUERY
        // -------------------------------
        let displacedData = await prisma.displacedProfile.findMany({
            where,
            include: {
                socialStatus: true,
                wives: true,
                displacement: {
                    include: {
                        delegate: {
                            include: {
                                delegate: true
                            }
                        }
                    }
                }
            }
        })

        // -------------------------------
        // FAMILY NUMBER FILTER
        // males + females + wives + 1
        // -------------------------------
        if (filters.familyNumber) {
            displacedData = displacedData.filter(d => {
                const number =
                    d.socialStatus.numberOfMales +
                    d.socialStatus.numberOfFemales +
                    d.wives.length

                return number >= filters.familyNumber!
            })
        }

        const displacedsIds = displacedData.map((item) => item.userId);

        return NextResponse.json<IDisplacedsIdsResponse>({
            status: 200,
            message: "تم جلب معرفات النازحين",
            displacedsIds,
        });

    } catch (error: any) {
        return NextResponse.json<IDisplacedsIdsResponse>({
            status: 500,
            message: error?.message || 'خطأ أثناء جلب النازحين',
            displacedsIds: [],
            error: error?.message || 'خطأ أثناء جلب النازحين',
        }, { status: 500 })
    }
}
