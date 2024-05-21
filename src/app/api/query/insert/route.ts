import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import type { ITableQuery, ResponseData } from "@/types";
import { createClient } from "@/lib/supabase/server";
import { currentDateTime } from "@/lib/utils";

export async function POST(
    req: NextRequest
): Promise<NextResponse<ResponseData<ITableQuery[] | null>>> {
    const client = createClient();
    const { error: err, data } = await client.auth.getUser();
    if (err) {
        return NextResponse.json({
            message: "Unauthenticated",
            data: null,
            isError: true,
        });
    }
    const body: { query: string; title: string } = await req.json();

    const { error, data: d } = await client
        .from("query")
        .insert({
            query: body.query,
            created_at: currentDateTime,
            title: body.title,
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
