import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import type { ResponseData } from "@/types";
import { createClient } from "@/lib/supabase/server";
import type { Session, User } from "@supabase/supabase-js";

export async function POST(
    req: NextRequest
): Promise<
    NextResponse<ResponseData<{ user: User | null; session: Session | null }>>
> {
    console.log("ini disini");
    const client = createClient();
    const body: {
        email: string;
        password: string;
        username: string;
        fullname: string;
    } = await req.json();

    const { error, data } = await client.auth.signUp({
        email: body.email,
        password: body.password,
        options: {
            data: {
                username: body.username,
                full_name: body.fullname,
            },
        },
    });
    return NextResponse.json(
        {
            message: !error ? "" : error.message,
            data: data,
            isError: error ? false : true,
        },
        {
            status: 200,
        }
    );
}
