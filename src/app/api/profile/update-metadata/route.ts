import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import type { ResponseData } from "@/types";
import { createClient } from "@/lib/supabase/server";
import type { User } from "@supabase/supabase-js";

export async function POST(
    req: NextRequest
): Promise<NextResponse<ResponseData<User | null>>> {
    const client = createClient();
    const body: {
        id: string;
        metadata: { fullname: string; github: string; twitter: string };
    } = await req.json();
    const { error, data } = await client
        .from("profiles")
        .update({
            full_name: body.metadata.fullname,
            github: body.metadata.github,
            twitter: body.metadata.twitter,
        })
        .eq("id", body.id)
        .select()
        .single();
    console.log("ini error", error);
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
