import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
    if (request.nextUrl.pathname.startsWith("/api")) {
        const allowedOrigins = process.env.ALLOWED_ORIGIN?.split(",") ?? [
            "http://localhost:3000",
        ];
        if (!allowedOrigins.includes(request.headers.get("origin") ?? "")) {
            return new NextResponse(null, {
                status: 400,
                statusText: "Bad Request",
            });
        }
        return;
    }
    return await updateSession(request);
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * Feel free to modify this pattern to include more paths.
         */
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};
