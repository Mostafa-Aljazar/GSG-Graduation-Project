import { prisma } from "@/utils/prisma"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
    const body = await request.json()

    const { email, name } = body

    if (!email) {
        return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const created = await prisma.mOSTAFA.create({
        data: {
            email,
            name,
        },
    })

    return NextResponse.json(created)
}
