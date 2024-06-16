import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import type { ResponseData } from "@/types";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest): Promise<
    NextResponse<
        ResponseData<{
            total_views: number | null;
            total_likes: number | null;
        } | null>
    >
> {
    const client = createClient();
    const body: { username: string } = await req.json();
    const { error, data } = await client
        .rpc("get_user_summary", {
            user_name: body.username,
        })
        .single();

    return NextResponse.json(
        {
            message: error ? error.message : "",
            data: data as {
                total_views: number | null;
                total_likes: number | null;
            } | null,
            isError: error ? true : false,
        },
        {
            status: 200,
        }
    );
}
