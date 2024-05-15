import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import type { ResponseData } from "@/types";
import { createClient } from "@/lib/supabase/server";

export async function POST(
    req: NextRequest
): Promise<NextResponse<ResponseData<object>>> {
    const client = createClient();
    const body: { email: string } = await req.json();
    const { error } = await client.auth.resend({
        email: body?.email,
        type: "signup",
    });
    return NextResponse.json(
        {
            message: !error ? "" : error.message,
            data: {},
            isError: !error ? false : true,
        },
        {
            status: 200,
        }
    );
}
