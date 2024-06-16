import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import type { ResponseData } from "@/types";
import { createClient } from "@/lib/supabase/server";

export async function POST(
    req: NextRequest
): Promise<NextResponse<ResponseData<number | null>>> {
    const client = createClient();
    const { error: err, data } = await client.auth.getUser();
    if (err) {
        return NextResponse.json({
            message: "Unauthenticated",
            data: null,
            isError: true,
        });
    }
    const body: { dashboard_id: string } = await req.json();

    const { error } = await client
        .from("likes_dashboard")
        .delete()
        .eq("dashboard_id", body.dashboard_id)
        .eq("user_id", data.user.id);

    if (error) {
        return NextResponse.json(
            {
                message: error.message,
                data: null,
                isError: true,
            },
            {
                status: 200,
            }
        );
    }

    const { error: rr, data: dd } = await client
        .from("dashboard")
        .select("likes")
        .single();

    return NextResponse.json(
        {
            message: rr ? rr.message : "",
            data: dd?.likes ?? 0,
            isError: rr ? true : false,
        },
        {
            status: 200,
        }
    );
}
