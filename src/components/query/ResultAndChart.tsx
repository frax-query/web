"use client";

import type { QueryResult, ICharts } from "@/types";
import { PieChartIcon, X, PlusCircleIcon } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { Button } from "../ui/button";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import DataGrid from "react-data-grid";
import { Badge } from "../ui/badge";
import { ChartConfig } from "./ChartConfig";
import { useTheme } from "next-themes";
import { defaultConfigChart } from "@/lib/utils";

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

    useEffect(() => {
        console.log(listTabs);
    }, [listTabs]);

    const addChart = useCallback(() => {
        setListTabs((prev) => [
            ...prev,
            {
                id: listTabs.length + 1,
                config: JSON.parse(JSON.stringify(defaultConfigChart)),
            },
        ]);
        setActiveTab((prev) => prev + 1);
    }, [setListTabs, setActiveTab, listTabs]);

    const removeChart = useCallback(
        (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, id: number) => {
            e.stopPropagation();
            setListTabs((prev) => {
                const newArr = [...prev];
                return newArr.filter((x) => x.id !== id);
            });
            if (activeTab === id) setActiveTab((prev) => prev - 1);
        },
        [setListTabs, setActiveTab]
    );
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
                                        {item.config.title.value}
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-5 w-5 flex-none"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        removeChart(e, item.id);
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
                key={listTabs.findIndex((x) => x.id === activeTab)}
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
