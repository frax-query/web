import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import type { ITableDashboard, ResponseData } from "@/types";
import { createClient } from "@/lib/supabase/server";

export async function POST(
    req: NextRequest
): Promise<NextResponse<ResponseData<ITableDashboard[] | null>>> {
    const client = createClient();
    const variants = {
        recently_created: "updated_at",
        most_loves: "likes",
        most_views: "views",
    };
    const body: { variant: string } = await req.json();

    const { error, data: d } = await client
        .from("dashboard")
        .select("*, profiles (username)")
        .order(variants[body.variant as keyof typeof variants], {
            ascending: false,
        });

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
