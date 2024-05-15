import { createClientClickhouse } from "@/lib/utils";
import { ClickHouseError } from "@clickhouse/client";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import type { ResponseData, BodyRequestGetQuery, QueryResult } from "@/types";

export async function POST(
    req: NextRequest
): Promise<NextResponse<ResponseData<QueryResult | null>>> {
    let result: QueryResult = [];
    let message: string = "Unknown error";
    let isError: boolean = true;

    try {
        const body: BodyRequestGetQuery = await req.json();
        const client = createClientClickhouse;

        const raw = await client.query({
            query: body?.query,
            format: "JSONEachRow",
            query_id: body?.queryId,
        });
        result = await raw.json();
        isError = false;
        message = "";
    } catch (err) {
        if (err instanceof ClickHouseError) message = err.message;
        else if (typeof err === "string") message = err;
        else if (err instanceof Error) message = err.message;
        else message = "unknown error" as string;
    }
    return NextResponse.json(
        {
            message: message,
            data: result,
            isError: isError,
        },
        {
            status: 200,
        }
    );
}
