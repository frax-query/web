import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import type { ILikesDashboard, ResponseData } from "@/types";
import { createClient } from "@/lib/supabase/server";

export async function POST(
    req: NextRequest
): Promise<NextResponse<ResponseData<ILikesDashboard[] | null>>> {
    const client = createClient();
    const body: { dashboard_id: string } = await req.json();
    const { error: err, data } = await client.auth.getUser();
    if (err) {
        return NextResponse.json({
            message: "Unauthenticated",
            data: null,
            isError: true,
        });
    }
    const { error, data: d } = await client
        .from("likes_dashboard")
        .select("*")
        .eq("dashboard_id", body.dashboard_id)
        .eq("user_id", data.user.id);

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
