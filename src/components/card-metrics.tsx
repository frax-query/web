"use client";

import type { ICharts, IDataMetrics } from "@/types";
import { useCallback, useMemo } from "react";

export const CardMetrics: React.FC<{ config: ICharts; data: IDataMetrics }> = ({
    config,
    data,
}) => {
    const formatNumber = useCallback((e: number) => {
        return new Intl.NumberFormat().format(e);
    }, []);
    const val = useMemo(() => {
        return (
            Math.floor(
                ((Number(data.value) - Number(data.compareValue)) /
                    Number(data.compareValue)) *
                    1000
            ) / 10
        );
    }, [data.value, data.compareValue]);

    return (
        <div className="h-full w-full">
            <div className="mx-auto flex h-full max-w-[300px] flex-col items-center justify-center gap-1  text-left">
                <p className="truncate text-[20px] font-medium tracking-tight">
                    {config.title.value}
                </p>
                <div className="truncate text-4xl font-bold tracking-tight">
                    {formatNumber(Number(data.value))}
                </div>
                {data.compareValue && (
                    <p className="truncate text-xs text-muted-foreground">
                        <span
                            className={
                                val > 0 ? "text-green-600" : "text-red-600"
                            }
                        >
                            {val > 0 && "+"}
                            {formatNumber(val)}%
                        </span>{" "}
                        {data.textValue}
                    </p>
                )}
            </div>
        </div>
    );
};
