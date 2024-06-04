import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import type { ResponseData } from "@/types";
import { createClient } from "@/lib/supabase/server";

export async function POST(
    req: NextRequest
): Promise<NextResponse<ResponseData<null>>> {
    const client = createClient();

    const body: {
        title: string;
        description: string;
        data: string;
        layouts: string;
        id: string;
    } = await req.json();

    const { error, data: d } = await client
        .from("dashboard")
        .update({
            title: body.title,
            description: body.description,
            data: body.data,
            layouts: body.layouts,
        })
        .eq("id", body.id);

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
