import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import type { ResponseData } from "@/types";
import { createClient } from "@/lib/supabase/server";
import type { Session, User, WeakPassword } from "@supabase/supabase-js";

export async function POST(req: NextRequest): Promise<
    NextResponse<
        ResponseData<{
            user: User | null;
            session: Session | null;
            weakPassword?: WeakPassword | null | undefined;
        }>
    >
> {
    const client = createClient();
    const body: { email: string; password: string } = await req.json();
    const { error, data } = await client.auth.signInWithPassword({
        email: body?.email,
        password: body?.password,
    });
    return NextResponse.json(
        {
            message: !error ? "" : error.message,
            data: data,
            isError: !error ? true : false,
        },
        {
            status: 200,
        }
    );
}
