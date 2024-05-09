import { useCallback, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { ClickHouseError } from "@clickhouse/client";
import type { QueryResult, ResponseData } from "@/types";

export const useQuery = () => {
    const [loading, setLoading] = useState(false);
    const [loadingCancel, setLoadingCancel] = useState(false);
    const [error, setError] = useState("");
    const [data, setData] = useState<QueryResult | null>(null);
    const [queryId, setQueryId] = useState("");
    const [controller, setController] = useState<AbortController>(
        new AbortController()
    );

    const runQuery = useCallback(
        async (query: string | undefined) => {
            setLoading(true);
            const id = uuidv4();
            setQueryId(id);
            await fetch("/api/query", {
                body: JSON.stringify({ query: query ?? "", queryId: id }),
                method: "POST",
                signal: controller.signal,
            })
                .then(async (data) => {
                    const res: ResponseData = await data.json();
                    setError(res.message);
                    setData(res.data);
                })
                .catch((err: unknown) => {
                    setData(null);
                    if (err instanceof ClickHouseError) setError(err.message);
                    else if (typeof err === "string") setError(err);
                    else if (err instanceof Error) setError(err.message);
                    else if (
                        err instanceof DOMException &&
                        err.name == "AbortError"
                    )
                        setLoading(true);
                    else setError("unknown error");
                })
                .finally(() => {
                    setLoading(false);
                });
        },
        [controller, queryId]
    );

    const cancelQuery = useCallback(async () => {
        setLoadingCancel(true);
        setController(new AbortController());
        await fetch("/api/kill-query", {
            method: "POST",
            body: JSON.stringify({ queryId: queryId }),
        })
            .then(async (data) => {
                const res: ResponseData = await data.json();
                setError(res.message);
                setData(res.data);
            })
            .catch((err: unknown) => {
                setData(null);
                if (err instanceof ClickHouseError) setError(err.message);
                else if (typeof err === "string") setError(err);
                else if (err instanceof Error) setError(err.message);
                else setError("unknown error");
            })
            .finally(() => {
                setLoadingCancel(false);
            });
    }, [queryId]);

    return {
        data,
        loading,
        loadingCancel,
        runQuery,
        cancelQuery,
        error,
    };
};
