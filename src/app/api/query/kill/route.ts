import { createClientClickhouse } from "@/lib/utils";
import { ClickHouseError } from "@clickhouse/client";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import type { ResponseData, BodyRequestGetQuery, QueryResult } from "@/types";

export async function POST(
    req: NextRequest
): Promise<NextResponse<ResponseData<QueryResult | null>>> {
    const result: QueryResult = [];
    let message: string = "Unknown error";
    let isError: boolean = true;

    try {
        const body: BodyRequestGetQuery = await req.json();
        const client = createClientClickhouse;

        await client.command({
            query: `KILL QUERY WHERE query_id='${body.queryId}'`,
        });
        isError = false;
        message = "";
    } catch (error) {
        if (error instanceof ClickHouseError) message = error.message;
        else if (error instanceof Error) message = error.message;
        else message = "unknown error";
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
