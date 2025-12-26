import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/utils/prisma'
import { verifyJWT } from '@/utils/auth'
import { USER_TYPE, USER_RANK, AGES } from '@prisma/client'
import { generateOTP } from '@/utils/auth/otp'
import { sendOTPEmail } from '@/actions/auth/sendOTPEmail'

export async function POST(req: NextRequest) {
    try {
        const token = req.headers.get('authorization')

        if (!token) {
            return NextResponse.json({ status: 401, message: 'Unauthorized' }, { status: 401 })
        }

        let verified: any
        try {
            verified = verifyJWT(token)
        } catch {
            return NextResponse.json({ status: 401, message: 'Invalid token' }, { status: 401 })
        }

        if (!verified || ![USER_TYPE.MANAGER, USER_TYPE.DELEGATE].includes(verified.role)) {
            return NextResponse.json({ status: 403, message: 'Forbidden' }, { status: 403 })
        }

        const body = await req.json()

        const {
            name,
            email,
            identity,
            nationality,
            gender,
            profileImage,
            mobileNumber,
            alternativeMobileNumber,
            originalAddress,
            wives = [],
            socialStatus,
            displacement,
            warInjuries = [],
            martyrs = [],
            medicalConditions = [],
            additionalNotes
        } = body

        if (!email || !name) {
            return NextResponse.json({ status: 400, message: 'Email and name required' }, { status: 400 })
        }

        const existingUser = await prisma.user.findUnique({ where: { email } })
        if (existingUser) {
            return NextResponse.json(
                { status: 400, message: 'User with this email already exists' },
                { status: 400 }
            )
        }

        // =============================
        // FIXED AGE GROUP TRANSFORMATION
        // =============================
        const ageGroupsCreate = Object.entries(socialStatus?.ageGroups || {}).map(
            ([ageKey, count]) => ({
                ageGroup: ageKey as AGES,
                count: Number(count)
            })
        )

        // =============================
        // MAIN CREATE
        // =============================
        const user = await prisma.user.create({
            data: {
                email,
                role: USER_TYPE.DISPLACED,
                rank: USER_RANK.DISPLACED,
                status: 'PENDING',

                displaced: {
                    create: {
                        name,
                        identity,
                        nationality,
                        gender,
                        profileImage: profileImage || null,
                        phoneNumber: mobileNumber,
                        alternativePhoneNumber: alternativeMobileNumber || null,
                        originalAddress,
                        additionalNotes: additionalNotes || null,

                        wives: {
                            create: wives.map((w: any) => ({
                                name: w.name,
                                identity: w.identity,
                                nationality: w.nationality,
                                isPregnant: w.isPregnant,
                                isWetNurse: w.isWetNurse
                            }))
                        },

                        socialStatus: {
                            create: {
                                status: socialStatus.status,
                                numberOfWives: socialStatus.numberOfWives,
                                numberOfMales: socialStatus.numberOfMales,
                                numberOfFemales: socialStatus.numberOfFemales,

                                ageGroups: {
                                    create: ageGroupsCreate
                                }
                            }
                        },

                        displacement: {
                            create: {
                                tentNumber: displacement.tentNumber,
                                tentType: displacement.tentType,
                                familyStatusType: displacement.familyStatusType,
                                displacementDate: new Date(displacement.displacementDate),

                                // delegate comes from payload or token
                                delegateId: displacement.delegate?.id || verified.id
                            }
                        },

                        warInjuries: {
                            create: warInjuries.map((w: any) => ({
                                name: w.name,
                                injury: w.injury
                            }))
                        },

                        martyrs: {
                            create: martyrs.map((m: any) => ({
                                name: m.name
                            }))
                        },

                        medicalConditions: {
                            create: medicalConditions.map((m: any) => ({
                                name: m.name,
                                condition: m.condition
                            }))
                        }
                    }
                }
            }
        })

        // =============================
        // OTP
        // =============================
        const otp = generateOTP()
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000)

        await prisma.userOtp.create({
            data: {
                userId: user.id,
                otp,
                expiresAt
            }
        })

        try {
            await sendOTPEmail(email, otp)
        } catch (err) {
            console.error('Email sending failed', err)
        }

        return NextResponse.json(
            { status: 201, message: 'Displaced created and OTP sent', userId: user.id },
            { status: 201 }
        )

    } catch (err: any) {
        console.error(err)
        return NextResponse.json({ status: 500, message: err.message }, { status: 500 })
    }
}
