import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import type { ITableDashboard, ResponseData } from "@/types";
import { createClient } from "@/lib/supabase/server";

export async function POST(
    req: NextRequest
): Promise<NextResponse<ResponseData<ITableDashboard[] | null>>> {
    const client = createClient();
    const body: { username: string } = await req.json();
    const { error, data } = await client.rpc("get_dashboard_by_username", {
        user_name: body.username,
    });

    return NextResponse.json(
        {
            message: error ? error.message : "",
            data: data as ITableDashboard[],
            isError: error ? true : false,
        },
        {
            status: 200,
        }
    );
}
