import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import type { ResponseData } from "@/types";
import { createClient } from "@/lib/supabase/server";

export async function POST(
    req: NextRequest
): Promise<NextResponse<ResponseData<null>>> {
    const client = createClient();
    const body: { ids: string[] } = await req.json();
    const { data, error } = await client
        .from("query")
        .delete()
        .in("id", body.ids);
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
