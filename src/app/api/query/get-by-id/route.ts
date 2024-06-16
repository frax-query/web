import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import type { ITableQuery, ResponseData } from "@/types";
import { createClient } from "@/lib/supabase/server";

export async function POST(
    req: NextRequest
): Promise<NextResponse<ResponseData<ITableQuery[] | null>>> {
    const client = createClient();
    const body: { query_id: string } = await req.json();
    const { error, data: d } = await client
        .from("query")
        .select("*")
        .eq("id", body.query_id);

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
