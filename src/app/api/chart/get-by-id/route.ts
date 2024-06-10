import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import type { ITableCharts, ResponseData } from "@/types";
import { createClient } from "@/lib/supabase/server";

export async function POST(
    req: NextRequest
): Promise<NextResponse<ResponseData<ITableCharts[] | null>>> {
    const client = createClient();
    const body: { chart_id: string } = await req.json();
    const { error, data: d } = await client
        .from("charts")
        .select("*")
        .eq("id", body.chart_id);

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
