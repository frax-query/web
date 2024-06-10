import type { ITableDashboard, ResponseData } from "@/types";
import { useCallback, useEffect, useState } from "react";

export const useDiscovery = () => {
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [listDashboard, setListDashboard] = useState<
        (ITableDashboard & { profiles: { username: string } })[]
    >([]);
    const [view, setView] = useState("recently_created");

    const getAllDashboard = useCallback(
        async (variant: string, signal: AbortSignal | null | undefined) => {
            try {
                setLoading(true);
                setError("");
                const raw = await fetch("/api/dashboard", {
                    method: "POST",
                    body: JSON.stringify({ variant: variant }),
                    signal: signal,
                });
                const res: ResponseData<
                    | (ITableDashboard & { profiles: { username: string } })[]
                    | null
                > = await raw.json();
                if (res.data) {
                    setListDashboard(res.data);
                } else setError(res.message);
            } catch (error) {
                if (error instanceof Error) setError(error.message);
                else setError("Unkown error");
            }
            setLoading(false);
        },
        []
    );

    const searchDashboard = useCallback(
        async (search: string, signal: AbortSignal | null | undefined) => {
            try {
                const raw = await fetch("/api/dashboard/search", {
                    method: "POST",
                    body: JSON.stringify({ search: search }),
                    signal: signal,
                });
                const res: ResponseData<ITableDashboard[] | null> =
                    await raw.json();
                if (res.data) {
                    return res.data;
                } else return [];
            } catch (error) {
                console.log(error);
                return [];
            }
        },
        []
    );

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;
        getAllDashboard(view, signal);

        return () => {
            controller.abort();
        };
    }, [view]);

    return {
        error,
        listDashboard,
        loading,
        setView,
        searchDashboard,
    };
};
