import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import type { ITableDashboard, ResponseData } from "@/types";
import { createClient } from "@/lib/supabase/server";
import { buildSlug } from "@/lib/utils";

export async function POST(
    req: NextRequest
): Promise<NextResponse<ResponseData<ITableDashboard[] | null>>> {
    const client = createClient();
    const { error: err, data } = await client.auth.getUser();
    if (err) {
        return NextResponse.json({
            message: "Unauthenticated",
            data: null,
            isError: true,
        });
    }
    const body: {
        title: string;
        description: string;
        data: string;
        layouts: string;
    } = await req.json();

    const titleSlug = buildSlug(body.title + " " + Date.now());

    const { error, data: d } = await client
        .from("dashboard")
        .insert({
            title: body.title,
            description: body.description,
            data: body.data,
            layouts: body.layouts,
            user_id: data.user.id,
            title_slug: titleSlug,
        })
        .select();

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
