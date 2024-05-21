import { useCallback, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { ClickHouseError } from "@clickhouse/client";
import type {
    ITableCharts,
    ITableQuery,
    QueryResult,
    ResponseData,
} from "@/types";

export const useQuery = () => {
    const [loading, setLoading] = useState(false);
    const [loadingCancel, setLoadingCancel] = useState(false);
    const [error, setError] = useState("");
    const [data, setData] = useState<QueryResult | null>(null);
    const [queryId, setQueryId] = useState("");
    const [controller, setController] = useState<AbortController>(
        new AbortController()
    );

    const resetData = useCallback(() => {
        setData(null);
    }, [setData]);

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
                    const res: ResponseData<QueryResult | null> =
                        await data.json();
                    setError(res.message);
                    setData(res.data);
                })
                .catch((err: unknown) => {
                    setData(null);
                    setLoading(true);
                    if (err instanceof ClickHouseError) setError(err.message);
                    else if (typeof err === "string") setError(err);
                    else if (err instanceof Error) setError(err.message);
                    else if (
                        err instanceof DOMException &&
                        err.name == "AbortError"
                    )
                        setError(err.message);
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
        controller.abort();
        setController(new AbortController());
        await fetch("/api/query/kill", {
            method: "POST",
            body: JSON.stringify({ queryId: queryId }),
        })
            .then(async (data) => {
                const res: ResponseData<QueryResult | null> = await data.json();
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
        error,
        controller,
        runQuery,
        cancelQuery,
        resetData,
    };
};

export const saveQuery = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const saveQuery = useCallback(
        async (query: string, title: string): Promise<ITableQuery | null> => {
            setLoading(true);
            setError("");
            try {
                const raw = await fetch("/api/query/insert", {
                    method: "POST",
                    body: JSON.stringify({ query: query, title: title }),
                });
                const res: ResponseData<ITableQuery[] | null> =
                    await raw.json();
                setError(res.message);
                setLoading(false);
                return res?.data && res?.data.length > 0 ? res.data[0] : null;
            } catch (error) {
                setLoading(false);
                if (error instanceof Error) setError(error.message);
                else setError("unknown error");
                return null;
            }
        },
        [setLoading]
    );

    const updateQuery = useCallback(
        async (
            title: string,
            query: string,
            query_id: string
        ): Promise<boolean> => {
            setLoading(true);
            setError("");
            try {
                const raw = await fetch("/api/query/update", {
                    method: "POST",
                    body: JSON.stringify({
                        title: title,
                        query: query,
                        id: query_id,
                    }),
                });
                const res: ResponseData<object> = await raw.json();
                setError(res?.message);
                setLoading(false);
                return true;
            } catch (error) {
                setLoading(false);
                if (error instanceof Error) setError(error?.message);
                else setError("unknown error");
                return false;
            }
        },
        []
    );

    const deleteQuery = useCallback(async (ids: string[]): Promise<string> => {
        setLoading(true);
        try {
            const raw = await fetch("/api/query/delete", {
                method: "POST",
                body: JSON.stringify({ ids: ids }),
            });
            const res: ResponseData<null> = await raw.json();
            setLoading(false);
            return res.message;
        } catch (error) {
            setLoading(false);
            if (error instanceof Error) return error.message;
            return "unknown error";
        }
    }, []);
    return {
        loading,
        error,
        saveQuery,
        updateQuery,
        deleteQuery,
    };
};

export const getQuery = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const getData = async (): Promise<
        (ITableQuery & { charts: ITableCharts[] })[]
    > => {
        try {
            setLoading(true);
            setError("");
            const raw = await fetch("/api/query/get-all", { method: "POST" });
            const res: ResponseData<
                (ITableQuery & { charts: ITableCharts[] })[] | null
            > = await raw.json();
            setError(res.message);
            setLoading(false);
            return res.data ? res.data : [];
        } catch (error) {
            if (error instanceof Error) setError(error.message);
            setError("Opps something went wrong");
            setLoading(false);
            return [];
        }
    };

    return {
        loading,
        error,
        getData,
    };
};

export const saveCharts = () => {
    const [loading, setLoading] = useState(false);

    const saveChart = useCallback(
        async (
            query_id: string,
            config: string
        ): Promise<ResponseData<ITableCharts[] | null>> => {
            setLoading(true);
            try {
                const raw = await fetch("/api/chart/insert", {
                    method: "POST",
                    body: JSON.stringify({
                        query_id: query_id,
                        config: config,
                    }),
                });
                const res: ResponseData<ITableCharts[] | null> =
                    await raw.json();
                setLoading(false);
                return res;
            } catch (error) {
                let err = "unknown error";
                if (error instanceof Error) err = error?.message;
                setLoading(false);
                return {
                    data: null,
                    isError: true,
                    message: err,
                };
            }
        },
        [setLoading]
    );

    const updateChart = useCallback(
        async (
            config: string,
            id: string
        ): Promise<ResponseData<ITableCharts[] | null>> => {
            setLoading(true);
            try {
                const raw = await fetch("/api/chart/update", {
                    method: "POST",
                    body: JSON.stringify({ config: config, id: id }),
                });
                const res = await raw.json();
                setLoading(false);
                return res;
            } catch (error) {
                let err = "unknown error";
                setLoading(false);
                if (error instanceof Error) err = error.message;
                return {
                    isError: true,
                    message: err,
                    data: null,
                };
            }
        },
        [setLoading]
    );

    const deleteChart = useCallback((ids: string[]) => {
        fetch("/api/chart/delete", {
            method: "POST",
            body: JSON.stringify({ ids: ids }),
        });
    }, []);

    return {
        loading,
        saveChart,
        updateChart,
        deleteChart,
    };
};
