import { NextResponse } from "next/server";
import type { ResponseData } from "@/types";
import { createClient } from "@/lib/supabase/server";

export async function POST(): Promise<NextResponse<ResponseData<null>>> {
    const client = createClient();
    const { error } = await client.auth.signOut();
    return NextResponse.json(
        {
            message: error ? error.message : "",
            data: null,
            isError: error ? true : false,
        },
        {
            status: 200,
        }
    );
}
