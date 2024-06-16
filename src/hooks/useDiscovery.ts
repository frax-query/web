import type { ITableDashboard, ResponseData } from "@/types";
import { useCallback, useEffect, useState } from "react";

export const useDiscovery = () => {
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [listDashboard, setListDashboard] = useState<
        (ITableDashboard & { profiles: { username: string } })[]
    >([]);
    const [view, setView] = useState("recently_created");
    const [totalDashborads, setTotalDashboards] = useState(0);
    const [page, setPage] = useState(0);
    const limit = 39;

    const getAllDashboard = useCallback(
        async (page: number, view: string, limit: number) => {
            try {
                setLoading(true);
                setError("");
                const raw = await fetch("/api/dashboard", {
                    method: "POST",
                    body: JSON.stringify({
                        variant: view,
                        from: page * limit,
                        to: page * limit + limit,
                    }),
                });
                const res: ResponseData<
                    | (ITableDashboard & { profiles: { username: string } })[]
                    | null
                > & { total: number } = await raw.json();
                if (res.data) {
                    setListDashboard((prev) => {
                        const newArr = [...prev];
                        if (res.data) return [...newArr, ...res.data];
                        else return newArr;
                    });
                    setTotalDashboards(res.total);
                    setPage(page + 1);
                } else setError(res.message);
            } catch (error) {
                if (error instanceof Error) setError(error.message);
                else setError("Unkown error");
            }
            setLoading(false);
        },
        []
    );

    const searchDashboard = useCallback(async (search: string) => {
        try {
            const raw = await fetch("/api/dashboard/search", {
                method: "POST",
                body: JSON.stringify({ search: search }),
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
    }, []);

    useEffect(() => {
        setPage(0);
        getAllDashboard(0, view, limit);
        setListDashboard([]);
    }, [view, limit]);

    return {
        error,
        listDashboard,
        loading,
        totalDashborads,
        page,
        view,
        limit,
        setView,
        searchDashboard,
        getAllDashboard,
    };
};
