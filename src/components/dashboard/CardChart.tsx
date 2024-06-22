"use client";

import { useQuery } from "@/hooks/useQuery";
import { optionCharts, getDataSeries, defaultConfigChart } from "@/lib/utils";
import type {
    ICharts,
    IDataSeries,
    ITableCharts,
    ITableQuery,
    ResponseData,
} from "@/types";
import * as echarts from "echarts";
import { Trash2Icon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useMemo, useState } from "react";
import { CardMetrics } from "../card-metrics";
import { Card } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import ReactECharts from "echarts-for-react";
import { CardTable } from "../card-table";

interface ICardChart {
    handleRemoveCard: (id: string) => void;
    id: string;
    query_id: string;
}
export const CardChart: React.FC<ICardChart> = ({
    handleRemoveCard,
    id,
    query_id,
}) => {
    const [error, setError] = useState("");
    const [query, setQuery] = useState("");
    const [dataX, setDataX] = useState<(string | number | null)[]>([]);
    const [dataSeries, setDataSeries] = useState<IDataSeries>([]);
    const [loading, setLoading] = useState(true);
    const [config, setConfig] = useState<ICharts>(defaultConfigChart);

    const { theme } = useTheme();
    const { runQuery, data, error: err, loading: loadingQuery } = useQuery();

    // get query function
    const fetchQuery = async (id: string, chart_id: string) => {
        try {
            setLoading(true);
            setError("");
            const raw = fetch("/api/query/get-by-id", {
                method: "POST",
                body: JSON.stringify({ query_id: id }),
            });
            const raw2 = fetch("/api/chart/get-by-id", {
                method: "POST",
                body: JSON.stringify({ chart_id: chart_id }),
            });
            await Promise.all([raw, raw2])
                .then((responses) =>
                    Promise.all(responses.map((x) => x.json()))
                )
                .then((realData) => {
                    const data1 = realData[0] as ResponseData<
                        ITableQuery[] | null
                    >;
                    const data2 = realData[1] as ResponseData<
                        ITableCharts[] | null
                    >;
                    if (data1.data)
                        if (data1.data.length > 0)
                            setQuery(data1.data[0].query);
                        else setError("Query not found");
                    else setError(data1.message);

                    if (data2.data)
                        if (data2.data.length > 0)
                            setConfig(JSON.parse(data2.data[0].config));
                        else setError("Chart config not found");
                    else setError(data2.message);
                });
            setLoading(false);
        } catch (error) {
            setLoading(false);
            if (error instanceof Error) setError(error.message);
            else setError("unknown error");
        }
    };

    useEffect(() => {
        (async () => {
            await fetchQuery(query_id, id);
        })();
    }, [query_id, id]);

    useEffect(() => {
        (async () => {
            if (query) {
                await runQuery(query);
            }
        })();
    }, [query]);

    useEffect(() => {
        if (err) {
            setError(err);
        }
    }, [err]);

    const getOptionsChart = useMemo(() => {
        return optionCharts(config, dataX, dataSeries, theme === "dark");
    }, [JSON.stringify(config), dataX, dataSeries, theme, config]);

    useEffect(() => {
        (() => {
            const newConfig = { ...config };
            newConfig.yaxis.formatter = (v: number | string | null) => {
                return new Intl.NumberFormat("en", {
                    notation: "compact",
                }).format(Number(v));
            };
            const { dataX, dataY } = getDataSeries(config, data);
            setDataX(dataX);
            setDataSeries(dataY);
        })();
    }, [config, data]);

    if (loading || loadingQuery) {
        return (
            <Card className="relative h-full w-full p-4">
                <div className="h-full w-full">
                    <Skeleton className="h-8 w-[50%]" />
                    <div className="mb-4 grid h-[calc(100%_-_2rem)] w-full grid-cols-6 items-end gap-4">
                        <Skeleton className="h-[30%] w-full" />
                        <Skeleton className="h-[50%] w-full" />
                        <Skeleton className="h-[70%] w-full" />
                        <Skeleton className="h-[90%] w-full" />
                        <Skeleton className="h-[70%] w-full" />
                        <Skeleton className="h-[90%] w-full" />
                    </div>
                </div>
            </Card>
        );
    }

    if (error) {
        return (
            <Card className="relative h-full w-full p-4">
                <div className="flex h-full w-full items-center justify-center">
                    <div className="flex flex-col items-center justify-center gap-2">
                        <div>Oops something went wrong.</div>
                        <div>{error}</div>
                    </div>
                </div>
            </Card>
        );
    }

    return (
        <Card className="relative h-full w-full p-4">
            <Card className="absolute right-[0.5rem] top-[0.5rem] z-[10] p-2">
                <div className="flex items-center gap-2">
                    <Trash2Icon
                        className="h-[0.875rem] w-[0.875rem]"
                        onMouseDown={(e) => {
                            e.preventDefault(),
                                e.stopPropagation(),
                                handleRemoveCard(id);
                        }}
                    />
                </div>
            </Card>
            {!["metric", "table"].includes(config.selectedChart) && (
                <ReactECharts
                    echarts={echarts}
                    option={getOptionsChart}
                    notMerge={true}
                    style={{ height: "100%", width: "100%" }}
                    theme={theme === "dark" ? "dark-theme" : "light-theme"}
                    key={
                        JSON.stringify(config) +
                        id +
                        theme +
                        String(config.title.show)
                    }
                />
            )}
            {config.selectedChart === "metric" && (
                <CardMetrics config={config} result={data ?? []} />
            )}
            {config.selectedChart === "table" && (
                <CardTable
                    title={config.title.value}
                    data={data ?? []}
                    columns={
                        data && data.length > 0 ? Object.keys(data[0]) : []
                    }
                />
            )}
        </Card>
    );
};
