// app/api/auth/logout/route.ts
import { NextResponse } from "next/server";
import { COOKIE_NAME } from "@/constants/cookie-name";

export async function POST() {
    const response = NextResponse.redirect("/"); // or any route

    // Clear cookie on server-side
    response.headers.append(
        "Set-Cookie",
        `${COOKIE_NAME}=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax; ${process.env.NODE_ENV === "production" ? "Secure;" : ""
        }`
    );

    return response;
}
