import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/utils/prisma'
import { verifyJWT } from '@/utils/auth'
import { USER_TYPE, USER_RANK } from '@/constants/user-types'
import { IDisplacedProfile, IDisplacedProfileResponse } from '@/types/actor/displaceds/profile/displaced-profile.type'
import { AGES, ACCOMMODATION_TYPE, FAMILY_STATUS_TYPE, SOCIAL_STATUS, GENDER } from '@/types/actor/common/index.type'
import { TDisplacedProfileFormValues } from '@/validations/actor/displaceds/profile/displaced-profile.schema'

export async function GET(
    request: Request,
    { params }: { params: Promise<{ displacedId: string }> }
) {
    try {
        const token = request.headers.get('authorization')
        if (!token)
            return NextResponse.json(
                { status: 401, message: 'Unauthorized', user: {} },
                { status: 401 }
            )

        const verified = verifyJWT(token)
        if (!verified)
            return NextResponse.json(
                { status: 401, message: 'Invalid token', user: {} },
                { status: 401 }
            )

        const { displacedId } = await params

        const displacedRaw = await prisma.displacedProfile.findUnique({
            where: { userId: displacedId },
            include: {
                user: true,
                wives: true,
                socialStatus: { include: { ageGroups: true } },
                displacement: true,
                warInjuries: true,
                martyrs: true,
                medicalConditions: true,
            },
        })

        const delegateName = await prisma.delegateProfile.findUnique({
            where: { userId: displacedRaw?.displacement.delegateId },
            select: {
                name: true
            }
        })

        if (!displacedRaw)
            return NextResponse.json(
                { status: 404, message: 'Not found', user: {} },
                { status: 404 }
            )

        // Transform Prisma response to match IDisplacedProfile
        const user: IDisplacedProfile = {
            id: displacedRaw.userId,
            name: displacedRaw.name,
            email: displacedRaw.user.email,
            identity: displacedRaw.identity,
            nationality: displacedRaw.nationality,
            gender: displacedRaw.gender as GENDER,
            profileImage: displacedRaw.profileImage,
            mobileNumber: displacedRaw.phoneNumber,
            alternativeMobileNumber: displacedRaw.alternativePhoneNumber ?? undefined,
            role: USER_TYPE.DISPLACED,
            rank: USER_RANK.DISPLACED,

            originalAddress: displacedRaw.originalAddress,

            wives: displacedRaw.wives.map(w => ({
                name: w.name,
                identity: w.identity,
                nationality: w.nationality,
                isPregnant: w.isPregnant,
                isWetNurse: w.isWetNurse,
            })),

            socialStatus: {
                status: displacedRaw.socialStatus.status as SOCIAL_STATUS,
                numberOfWives: displacedRaw.socialStatus.numberOfWives,
                numberOfMales: displacedRaw.socialStatus.numberOfMales,
                numberOfFemales: displacedRaw.socialStatus.numberOfFemales,
                // totalFamilyMembers: displacedRaw.socialStatus.totalFamilyMembers,
                ageGroups: displacedRaw.socialStatus.ageGroups.reduce(
                    (acc, ag) => ({ ...acc, [ag.ageGroup as AGES]: ag.count }),
                    {} as Record<AGES, number>
                ),
            },

            displacement: {
                tentNumber: displacedRaw.displacement.tentNumber,
                tentType: displacedRaw.displacement.tentType as ACCOMMODATION_TYPE,
                familyStatusType: displacedRaw.displacement.familyStatusType as FAMILY_STATUS_TYPE,
                displacementDate: displacedRaw.displacement.displacementDate.toISOString(),
                delegate: {
                    id: displacedRaw.displacement.delegateId,
                    name: delegateName?.name || '',
                },
            },

            warInjuries: displacedRaw.warInjuries.map(w => ({
                name: w.name,
                injury: w.injury,
            })),
            martyrs: displacedRaw.martyrs.map(m => ({ name: m.name })),
            medicalConditions: displacedRaw.medicalConditions.map(m => ({
                name: m.name,
                condition: m.condition,
            })),

            additionalNotes: displacedRaw.additionalNotes ?? undefined,
        }

        const response: IDisplacedProfileResponse = {
            status: 200,
            message: 'OK',
            user,
        }

        return NextResponse.json(response)
    } catch (err: any) {
        console.error(err)
        return NextResponse.json(
            { status: 500, message: err.message || 'Internal error', user: {} },
            { status: 500 }
        )
    }
}


export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ displacedId: string }> }
) {
    try {
        const token = req.headers.get('authorization')
        if (!token)
            return NextResponse.json({ status: 401, message: 'Unauthorized' }, { status: 401 })

        let verified: any
        try {
            verified = verifyJWT(token)
        } catch {
            return NextResponse.json({ status: 401, message: 'Invalid token' }, { status: 401 })
        }

        if (!verified || ![USER_TYPE.MANAGER, USER_TYPE.DELEGATE].includes(verified.role)) {
            return NextResponse.json({ status: 403, message: 'Forbidden' }, { status: 403 })
        }

        const { displacedId } = await params

        // const delegateOfDisplaced = await prisma.displacedProfile.findUnique({
        //     where: { userId: displacedId },
        //     include: {
        //         displacement: true,
        //     },
        // })

        // if (verified.role == USER_TYPE.DELEGATE && verified.id !== delegateOfDisplaced?.displacement.delegateId) {
        //     return NextResponse.json({ status: 403, message: 'Forbidden' }, { status: 403 })
        // }

        const payload: TDisplacedProfileFormValues = await req.json()

        // =========================
        // Update nested relations safely
        // =========================
        const updatedDisplaced = await prisma.displacedProfile.update({
            where: { userId: displacedId },
            data: {
                name: payload.name,
                identity: payload.identity,
                nationality: payload.nationality,
                gender: payload.gender,
                profileImage: payload.profileImage ?? null,
                phoneNumber: payload.mobileNumber,
                alternativePhoneNumber: payload.alternativeMobileNumber ?? null,
                originalAddress: payload.originalAddress,
                additionalNotes: payload.additionalNotes ?? null,

                // Wives
                wives: {
                    deleteMany: {},
                    create: (payload.wives || []).map((w) => ({
                        name: w.name,
                        identity: w.identity,
                        nationality: w.nationality,
                        isPregnant: w.isPregnant,
                        isWetNurse: w.isWetNurse,
                    })),
                },

                // Social status + age groups
                socialStatus: payload.socialStatus
                    ? {
                        update: {
                            status: payload.socialStatus.status,
                            numberOfWives: payload.socialStatus.numberOfWives,
                            numberOfMales: payload.socialStatus.numberOfMales,
                            numberOfFemales: payload.socialStatus.numberOfFemales,
                            ageGroups: {
                                deleteMany: {},
                                create: Object.entries(payload.socialStatus.ageGroups || {}).map(
                                    ([ageGroup, count]) => ({
                                        ageGroup: ageGroup as AGES,
                                        count: count,
                                    })
                                ),
                            },
                        },
                    }
                    : undefined,

                // Displacement
                displacement: payload.displacement
                    ? {
                        update: {
                            tentNumber: payload.displacement.tentNumber,
                            tentType: payload.displacement.tentType,
                            familyStatusType: payload.displacement.familyStatusType,
                            displacementDate: new Date(payload.displacement.displacementDate),
                            delegateId: payload.displacement.delegate.id,
                        },
                    }
                    : undefined,

                // War injuries
                warInjuries: {
                    deleteMany: {},
                    create: (payload.warInjuries || []).map((w) => ({
                        name: w.name,
                        injury: w.injury,
                    })),
                },

                // Martyrs
                martyrs: {
                    deleteMany: {},
                    create: (payload.martyrs || []).map((m) => ({
                        name: m.name,
                    })),
                },

                // Medical conditions
                medicalConditions: {
                    deleteMany: {},
                    create: (payload.medicalConditions || []).map((m) => ({
                        name: m.name,
                        condition: m.condition,
                    })),
                },
            },
        })

        return NextResponse.json({
            status: 200,
            message: 'تم تحديث الملف الشخصي للنازح بنجاح',
            displaced: updatedDisplaced,
        })
    } catch (err: any) {
        console.error(err)
        return NextResponse.json(
            { status: 500, message: err.message || 'Internal server error' },
            { status: 500 }
        )
    }
}

// export async function DELETE(req: NextRequest, { params }: { params: { displacedId: string } }) {
//     try {
//         const token = req.headers.get('authorization')
//         if (!token) return NextResponse.json({ status: 401, message: 'Unauthorized' }, { status: 401 })

//         let verified: any
//         try {
//             verified = verifyJWT(token)
//         } catch (e) {
//             return NextResponse.json({ status: 401, message: 'Invalid token' }, { status: 401 })
//         }

//         if (!verified || verified.role !== USER_TYPE.MANAGER) {
//             return NextResponse.json({ status: 403, message: 'Forbidden' }, { status: 403 })
//         }

//         const displacedId = params.displacedId

//         // delete user which will remove related profile
//         await prisma.user.delete({ where: { id: displacedId } })

//         return NextResponse.json({ status: 200, message: 'Deleted' })
//     } catch (err: any) {
//         console.error(err)
//         return NextResponse.json({ status: 500, message: err.message || 'Internal error' }, { status: 500 })
//     }
// }
