import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import type { ResponseData } from "@/types";
import { createClient } from "@/lib/supabase/server";
import type { EmailOtpType, Session, User } from "@supabase/supabase-js";

export async function POST(
    req: NextRequest
): Promise<
    NextResponse<ResponseData<{ user: User | null; session: Session | null }>>
> {
    const client = createClient();
    const body: { email: string; otp: string; type: string } = await req.json();
    const { error, data } = await client.auth.verifyOtp({
        email: body?.email,
        type: body?.type as EmailOtpType,
        token: body?.otp,
    });
    return NextResponse.json(
        {
            message: error ? error.message : "",
            data: data,
            isError: error ? true : false,
        },
        {
            status: 200,
        }
    );
}
