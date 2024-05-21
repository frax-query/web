import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import type { ITableCharts, ResponseData } from "@/types";
import { createClient } from "@/lib/supabase/server";

export async function POST(
    req: NextRequest
): Promise<NextResponse<ResponseData<ITableCharts[] | null>>> {
    const client = createClient();
    const body: { config: string; id: string } = await req.json();
    const { error, data } = await client
        .from("charts")
        .update({ config: body.config })
        .eq("id", body.id)
        .select();
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
