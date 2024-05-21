import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import type { ITableCharts, ResponseData } from "@/types";
import { createClient } from "@/lib/supabase/server";

export async function POST(
    req: NextRequest
): Promise<NextResponse<ResponseData<ITableCharts[] | null>>> {
    const client = createClient();
    const { error: err, data } = await client.auth.getUser();
    if (err) {
        return NextResponse.json({
            message: "Unauthenticated",
            data: null,
            isError: true,
        });
    }
    const body: { query_id: string; config: string } = await req.json();

    const { error, data: d } = await client
        .from("charts")
        .insert({
            config: body.config,
            query_id: body.query_id,
            user_id: data.user.id,
        })
        .select();

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
