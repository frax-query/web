"use client";

import { useQuery } from "@/hooks/useQuery";
import { optionCharts, getDataSeries } from "@/lib/utils";
import type {
    ICharts,
    IDataMetrics,
    IDataSeries,
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

interface ICardChart {
    handleRemoveCard: (id: string) => void;
    id: string;
    config: ICharts;
}
export const CardChart: React.FC<ICardChart> = ({
    handleRemoveCard,
    id,
    config,
}) => {
    const [error, setError] = useState("");
    const [query, setQuery] = useState("");
    const [dataMetrics, setDataMetrics] = useState<IDataMetrics>({
        textValue: "",
        value: null,
        compareValue: null,
    });
    const [dataX, setDataX] = useState<(string | number | null)[]>([]);
    const [dataSeries, setDataSeries] = useState<IDataSeries>([]);
    const [loading, setLoading] = useState(true);

    const { theme } = useTheme();
    const { runQuery, data, error: err, loading: loadingQuery } = useQuery();

    useEffect(() => {
        setDataMetrics({
            compareValue: config.metricConfig.compareValue,
            textValue: config.metricConfig.textCompare,
            value: config.metricConfig.value,
        });
    }, [JSON.stringify(config)]);

    // get query function
    const fetchQuery = async (id: string) => {
        try {
            setLoading(true);
            setError("");
            const raw = await fetch("/api/query/get-by-id", {
                method: "POST",
                body: JSON.stringify({ query_id: id }),
            });
            const data: ResponseData<ITableQuery[] | null> = await raw.json();
            if (data.data) {
                if (data.data.length > 0) {
                    setQuery(data.data[0].query);
                }
            }
            setLoading(false);
        } catch (error) {
            setLoading(false);
            if (error instanceof Error) setError(error.message);
            else setError("unknown error");
        }
    };

    useEffect(() => {
        (async () => {
            await fetchQuery(id);
        })();
    }, [id]);

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
            {config.selectedChart !== "metric" && (
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
                <CardMetrics config={config} data={dataMetrics} />
            )}
        </Card>
    );
};
