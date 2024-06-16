import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import type { ITableDashboard, ResponseData } from "@/types";
import { createClient } from "@/lib/supabase/server";

export async function POST(
    req: NextRequest
): Promise<
    NextResponse<ResponseData<ITableDashboard[] | null> & { total: number }>
> {
    const client = createClient();
    const variants = {
        recently_created: "updated_at",
        most_loves: "likes",
        most_views: "views",
    };
    const body: { variant: string; from: string; to: string } =
        await req.json();

    const {
        error,
        data: d,
        count,
    } = await client
        .from("dashboard")
        .select("*, profiles (username)", { count: "exact" })
        .order(variants[body.variant as keyof typeof variants], {
            ascending: false,
        })
        .range(Number(body.from), Number(body.to))
        .limit(40);
    return NextResponse.json(
        {
            message: error ? error.message : "",
            data: d,
            isError: error ? true : false,
            total: count ?? 0,
        },
        {
            status: 200,
        }
    );
}
