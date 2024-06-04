import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import type { ITableDashboard, ResponseData } from "@/types";
import { createClient } from "@/lib/supabase/server";

export async function POST(
    req: NextRequest
): Promise<NextResponse<ResponseData<ITableDashboard[] | null>>> {
    const client = createClient();
    const body: { dashboard_id: string } = await req.json();
    const { error, data: d } = await client
        .from("dashboard")
        .select("*")
        .eq("id", body.dashboard_id);

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
