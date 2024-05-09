"use client";

import type { QueryResult, ICharts } from "@/types";
import { PieChartIcon, X, PlusCircleIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import DataGrid from "react-data-grid";
import * as echarts from "echarts/core";
import {
    TitleComponent,
    TooltipComponent,
    LegendComponent,
} from "echarts/components";
import { BarChart, LineChart } from "echarts/charts";
import { UniversalTransition } from "echarts/features";
import { CanvasRenderer } from "echarts/renderers";
import { Badge } from "../ui/badge";
import { ChartConfig } from "./ChartConfig";
import { useTheme } from "next-themes";
import { defaultConfigChart } from "@/lib/utils";

echarts.use([
    TitleComponent,
    TooltipComponent,
    LegendComponent,
    BarChart,
    LineChart,
    CanvasRenderer,
    UniversalTransition,
]);

export const ResultAndChartSection: React.FC<{
    error: string;
    result: QueryResult | null;
    loadingQuery: boolean;
}> = ({ error, result, loadingQuery }) => {
    const [columns, setColumns] = useState<
        {
            key: string;
            name: string;
            width?: number;
            resizable?: boolean;
            frozen?: boolean;
        }[]
    >([]);
    const [rows, setRows] = useState<QueryResult>([]);
    const [listTabs, setListTabs] = useState<{ id: number; config: ICharts }[]>(
        []
    );
    const [activeTab, setActiveTab] = useState(0);

    const { theme } = useTheme();

    useEffect(() => {
        if (result) {
            if (result.length > 0) {
                setColumns(
                    Object.keys(result ? result[0] : {}).map((item) => {
                        return {
                            key: item,
                            name: item,
                            resizable: true,
                            frozen: true,
                        };
                    })
                );
                setRows(result);
            }
        }
    }, [result]);

    const addChart = () => {
        setListTabs((prev) => [
            ...prev,
            {
                id: listTabs.length + 1,
                config: JSON.parse(JSON.stringify(defaultConfigChart)),
            },
        ]);
        setActiveTab(listTabs.length + 1);
    };
    return (
        <div className="h-full">
            <ScrollArea className="grid w-full whitespace-nowrap border-b">
                <div className="flex w-max items-center">
                    <div
                        className={`flex w-40 shrink-0 items-center truncate whitespace-nowrap border-r px-2 py-2 text-left ${activeTab !== 0 && "text-muted-foreground"} transition-all hover:text-foreground`}
                        onClick={() => setActiveTab(0)}
                    >
                        <div className="flex-1">Result</div>
                    </div>
                    {listTabs.map((item) => {
                        return (
                            <div
                                className={`flex w-64 shrink-0 items-center gap-2 border-r px-2 py-2 text-left ${item.id !== activeTab && "text-muted-foreground"} transition-all hover:text-foreground`}
                                key={item.id}
                                onClick={() => setActiveTab(item.id)}
                            >
                                <div className="flex flex-1 items-center gap-1">
                                    <PieChartIcon size={14} />
                                    <div className="w-40 truncate whitespace-nowrap">
                                        Add chart Add chart Add chart Add chart
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-5 w-5 flex-none"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        console.log("ini disini");
                                    }}
                                >
                                    <X size={14} />
                                </Button>
                            </div>
                        );
                    })}
                    <button
                        className={`flex w-max shrink-0 items-center border-r px-2 py-2 text-left text-muted-foreground transition-all hover:text-foreground`}
                        onClick={addChart}
                    >
                        <div className="flex flex-1 items-center gap-1 text-xs">
                            <PlusCircleIcon size={14} />
                            Add chart
                        </div>
                    </button>
                </div>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
            <div
                className={`${activeTab !== 0 && "hidden"} h-[calc(100%_-_30px)]`}
            >
                {!result && !loadingQuery && (
                    <div className="bg-accent p-4 text-muted-foreground">
                        Click <Badge variant="default">Run</Badge> to execute
                        query
                    </div>
                )}
                {result && !loadingQuery && !error && (
                    <ScrollArea className="grid h-full w-full whitespace-nowrap">
                        <DataGrid
                            columns={columns}
                            rows={rows}
                            className={`h-full text-sm ${theme === "light" && "rdg-light"}`}
                        />
                        <ScrollBar
                            orientation="horizontal"
                            className="top-0 h-2.5"
                        />
                    </ScrollArea>
                )}
                {error && !loadingQuery && (
                    <div className="bg-accent p-4 text-muted-foreground">
                        {error}
                    </div>
                )}
                {loadingQuery && (
                    <div className="bg-accent p-4 text-muted-foreground">
                        loading...
                    </div>
                )}
            </div>
            <ChartConfig
                columns={columns}
                data={result}
                config={
                    listTabs.filter((x) => x.id === activeTab).length > 0
                        ? listTabs.filter((x) => x.id === activeTab)[0].config
                        : JSON.parse(JSON.stringify(defaultConfigChart))
                }
                idConfig={listTabs.findIndex((x) => x.id === activeTab)}
                setListTabs={setListTabs}
            />
        </div>
    );
};
