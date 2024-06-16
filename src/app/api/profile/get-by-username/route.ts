import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import type { IProfile, ResponseData } from "@/types";
import { createClient } from "@/lib/supabase/server";

export async function POST(
    req: NextRequest
): Promise<NextResponse<ResponseData<IProfile | null>>> {
    const client = createClient();
    const body: { username: string } = await req.json();
    const { error, data: d } = await client
        .from("profiles")
        .select("*")
        .eq("username", body.username)
        .single();

    return NextResponse.json(
        {
            message: error ? error.message : "",
            data: d,
            isError: error ? true : false,
        },
        {
            status: 200,
        }
    );
}
