import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import type { ResponseData } from "@/types";
import { createClient } from "@/lib/supabase/server";

export async function POST(
    req: NextRequest
): Promise<NextResponse<ResponseData<object>>> {
    const client = createClient();
    const body: { query: string; title: string; id: string } = await req.json();
    const { error } = await client
        .from("query")
        .update({ title: body.title, query: body.query })
        .eq("id", body.id);
    return NextResponse.json(
        {
            message: error ? error.message : "",
            data: {},
            isError: error ? true : false,
        },
        {
            status: 200,
        }
    );
}
