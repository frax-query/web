"use client";

import type { ICharts, QueryResult } from "@/types";
import { useCallback, useMemo } from "react";

export const CardMetrics: React.FC<{
    config: ICharts;
    result: QueryResult;
}> = ({ config, result }) => {
    const formatNumber = useCallback((e: number) => {
        return new Intl.NumberFormat().format(e);
    }, []);

    const value = useMemo(() => {
        const res = result.reduce((acc, cur) => {
            const isExist = Object.keys(cur).includes(
                config.metricConfig.value
            );
            if (!isExist) return acc + 0;
            else
                return (
                    acc +
                    (isNaN(Number(cur[config.metricConfig.value]))
                        ? 0
                        : Number(cur[config.metricConfig.value]))
                );
        }, 0);
        console.log(res);
        return res;
    }, [config.metricConfig.value, result]);

    const compareValue = useMemo(() => {
        const res = result.reduce((acc, cur) => {
            const isExist = Object.keys(cur).includes(
                config.metricConfig.compareValue
            );
            if (!isExist) return acc + 0;
            else
                return (acc +
                    cur[config.metricConfig.compareValue]) as unknown as number;
        }, 0);
        return res;
    }, [config.metricConfig.compareValue, result]);

    const percentageValue = useMemo(() => {
        console.log(value, compareValue);
        return Math.floor(value - compareValue) / compareValue;
    }, [value, compareValue]);

    return (
        <div className="h-full w-full">
            <div className="mx-auto flex h-full max-w-[300px] flex-col items-center justify-center gap-1  text-left">
                <p className="truncate text-[20px] font-medium tracking-tight">
                    {config.title.value}
                </p>
                <div className="truncate text-4xl font-bold tracking-tight">
                    {formatNumber(value)}
                </div>
                {config.metricConfig.compareValue && (
                    <p className="truncate text-xs text-muted-foreground">
                        <span
                            className={
                                value >= compareValue
                                    ? "text-green-600"
                                    : "text-red-600"
                            }
                        >
                            {value > compareValue && "+"}
                            {formatNumber(percentageValue)}%
                        </span>{" "}
                        {config.metricConfig.textCompare}
                    </p>
                )}
            </div>
        </div>
    );
};
