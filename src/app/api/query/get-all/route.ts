import { NextResponse } from "next/server";
import type { ITableQuery, ResponseData } from "@/types";
import { createClient } from "@/lib/supabase/server";

export async function POST(): Promise<
    NextResponse<ResponseData<ITableQuery[] | null>>
> {
    const client = createClient();
    const { error: err, data } = await client.auth.getUser();
    if (err) {
        return NextResponse.json({
            message: "Unauthenticated",
            data: null,
            isError: true,
        });
    }
    const { error, data: d } = await client
        .from("query")
        .select("*, charts(id, config, query_id)")
        .eq("user_id", data.user.id)
        .order("updated_at", { ascending: false });
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
