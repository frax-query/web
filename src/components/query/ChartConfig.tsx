"use client";

import {
    Collapsible,
    CollapsibleTrigger,
    CollapsibleContent,
} from "@/components/ui/collapsible";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
    BarChart3Icon,
    LineChartIcon,
    AreaChartIcon,
    PieChartIcon,
    ScatterChartIcon,
    CaseSensitiveIcon,
    ChevronsUpDownIcon,
} from "lucide-react";
import { ColorPicker } from "../color-picker";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import {
    useCallback,
    useEffect,
    useMemo,
    useState,
    type Dispatch,
    type SetStateAction,
} from "react";
import type {
    QueryResult,
    ICharts,
    IDataSeries,
    IAllCharts,
    IListCharts,
} from "@/types";
import ReactECharts from "echarts-for-react";
import { optionCharts } from "@/lib/utils";

const charts: IListCharts[] = [
    {
        id: 0,
        name: "Bar Chart",
        value: "bar",
        icon: <BarChart3Icon />,
    },
    {
        id: 1,
        name: "Line Chart",
        value: "line",
        icon: <LineChartIcon />,
    },
    {
        id: 2,
        name: "Area Chart",
        value: "area",
        icon: <AreaChartIcon />,
    },
    {
        id: 3,
        name: "Pie Chart",
        value: "pie",
        icon: <PieChartIcon />,
    },
    {
        id: 4,
        name: "Scatter",
        value: "scatter",
        icon: <ScatterChartIcon />,
    },
    {
        id: 5,
        name: "Metric",
        value: "metric",
        icon: <CaseSensitiveIcon />,
    },
];

export const ChartConfig: React.FC<{
    columns: {
        key: string;
        name: string;
        width?: number | undefined;
        resizable?: boolean | undefined;
        frozen?: boolean | undefined;
    }[];
    data: QueryResult | null;
    config: ICharts;
    idConfig: number;
    setListTabs: Dispatch<
        SetStateAction<
            {
                id: number;
                config: ICharts;
            }[]
        >
    >;
}> = ({ columns, data, config, idConfig, setListTabs }) => {
    const [dataX, setDataX] = useState<(string | number | null)[]>([]);
    const [dataSeries, setDataSeries] = useState<IDataSeries>([]);

    const getOptionsChart = useMemo(() => {
        return optionCharts(config, dataX, dataSeries);
    }, [config, dataX, dataSeries]);

    const setCharts = useCallback(
        (e: IAllCharts) => {
            setListTabs((prev) => {
                const newArr = [...prev];
                newArr[idConfig].config.selectedChart = e;
                newArr[idConfig].config.xaxis.value = "";
                newArr[idConfig].config.yaxis.value = "";
                newArr[idConfig].config.group.value = "";
                return newArr;
            });
            setDataSeries(() => []);
        },
        [setDataSeries, idConfig, setListTabs]
    );

    const handleXAxis = useCallback(
        (e: string) => {
            setListTabs((prev) => {
                const newArr = [...prev];
                newArr[idConfig].config.xaxis.value = e === "none" ? "" : e;
                return newArr;
            });
            if (e === "none" || e === "" || config.selectedChart === "pie") {
                setDataX([]);
                return;
            }
            setDataX(data?.map((item) => item[e]) ?? []);
        },
        [
            config.xaxis.value,
            setDataX,
            idConfig,
            setListTabs,
            config.selectedChart,
        ]
    );

    const handleYAxis = useCallback(
        (e: string) => {
            if (e === "" || e === "none") {
                setListTabs((prev) => {
                    const newArr = [...prev];
                    newArr[idConfig].config.yaxis.value = "";
                    return newArr;
                });
                setDataSeries(() => []);
                return;
            }
            setListTabs((prev) => {
                const newArr = [...prev];
                newArr[idConfig].config.yaxis.value = e === "none" ? "" : e;
                if (e === "none") {
                    newArr[idConfig].config.y2axis.value = "";
                    newArr[idConfig].config.group.value = "";
                }
                return newArr;
            });
            if (config.selectedChart === "metric" || e === "none") {
                setDataSeries([]);
                return;
            }
            if (config.selectedChart === "pie") {
                setDataX([]);
                setDataSeries([
                    {
                        type: "pie",
                        data: data?.map((item) => {
                            return {
                                value: item[e] ?? null,
                                name: item[config.xaxis.value] ?? "",
                            };
                        }),
                    },
                ]);
                return;
            }
            setDataSeries([
                {
                    type:
                        config.selectedChart === "area"
                            ? "line"
                            : config.selectedChart,
                    data: data?.map((item) => item[e]) ?? [],
                    name: e,
                    areaStyle: config.selectedChart === "area" ? {} : undefined,
                    smooth: true,
                },
            ]);
        },
        [
            config.yaxis.value,
            config.xaxis.value,
            setDataSeries,
            config.selectedChart,
            idConfig,
            setListTabs,
            setDataX,
        ]
    );

    const handleY2Axis = useCallback(
        (e: string) => {
            if (e === "" || e === "none") {
                setListTabs((prev) => {
                    const newArr = prev;
                    newArr[idConfig].config.y2axis.value = "";
                    return newArr;
                });
                handleXAxis(config.xaxis.value);
                handleYAxis(config.yaxis.value);
                return;
            }
            setListTabs((prev) => {
                const newArr = prev;
                newArr[idConfig].config.y2axis.value = e;
                newArr[idConfig].config.group.value = "";
                return newArr;
            });
            setDataSeries([]);
            handleXAxis(config.xaxis.value);
            handleYAxis(config.yaxis.value);
            setDataSeries((prev) => {
                const newObj = {
                    type:
                        config.selectedChart === "area"
                            ? "line"
                            : config.selectedChart,
                    data: data?.map((item) => item[e]) ?? [],
                    name: e,
                    yAxisIndex: 1,
                    areaStyle: config.selectedChart === "area" ? {} : undefined,
                    smooth: true,
                };

                return [...prev, newObj];
            });
        },
        [
            setListTabs,
            idConfig,
            setDataSeries,
            config.selectedChart,
            handleXAxis,
            handleYAxis,
            config.xaxis.value,
            config.yaxis.value,
        ]
    );

    const handleGroup = useCallback(
        (e: string) => {
            if (e === "none") {
                handleXAxis(config.xaxis.value);
                handleYAxis(config.yaxis.value);
                handleY2Axis(config.y2axis.value);
                setListTabs((prev) => {
                    const newArr = [...prev];
                    newArr[idConfig].config.group.value = "";
                    return newArr;
                });
                return;
            }
            setListTabs((prev) => {
                const newArr = [...prev];
                newArr[idConfig].config.y2axis.value = "";
                newArr[idConfig].config.group.value = e;
                return newArr;
            });
            const uniqueX = Array.from(
                new Set(data?.map((x) => x[config.xaxis.value]))
            );
            const uniqueY = Object.fromEntries(
                Array.from(new Set(data?.map((item) => item[e]))).map((key) => [
                    key,
                    Array(uniqueX.length).fill(null),
                ])
            );

            for (const x of data ?? []) {
                const dataIndex = uniqueX.indexOf(x[config.xaxis.value]);
                if (dataIndex !== -1) {
                    uniqueY[x[e]][dataIndex] = x[config.yaxis.value];
                }
            }
            setDataSeries(() => {
                return Object.keys(uniqueY).map((item) => {
                    return {
                        type:
                            config.selectedChart === "area"
                                ? "line"
                                : config.selectedChart,
                        data: uniqueY[item],
                        name: item,
                        areaStyle:
                            config.selectedChart === "area" ? {} : undefined,
                        smooth: true,
                    };
                });
            });
        },
        [
            handleXAxis,
            config.xaxis.value,
            handleYAxis,
            config.yaxis.value,
            handleY2Axis,
            config.y2axis.value,
            setListTabs,
            idConfig,
        ]
    );

    useEffect(() => {
        console.log(dataSeries);
    }, [dataSeries]);

    useEffect(() => {
        if (idConfig > -1) {
            handleXAxis(config.xaxis.value);
            handleYAxis(config.yaxis.value);
            handleY2Axis(config.y2axis.value);
        }
    }, [
        idConfig,
        config.xaxis.value,
        config.yaxis.value,
        config.y2axis.value,
        handleXAxis,
        handleYAxis,
        handleY2Axis,
    ]);
    return (
        <div className="relative h-full w-full">
            <div className="absolute inset-0 -z-10 h-full w-full bg-muted bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
            <div className="flex h-[calc(100%_-_30px)] gap-4">
                <Card className="m-4 h-[450px] w-full flex-1 p-4">
                    <ReactECharts
                        option={getOptionsChart}
                        notMerge={true}
                        style={{ height: "100%", width: "100%" }}
                        key={JSON.stringify(config) + idConfig}
                    />
                </Card>
                <Card className="h-full w-[30%] flex-none rounded-none p-4">
                    <div className="h-full space-y-4">
                        <div>
                            <div className="text-base font-semibold">
                                Chart Settings
                            </div>
                            <div className="text-muted-foreground">
                                Add configurations for your chart
                            </div>
                        </div>
                        <ScrollArea className="h-[calc(100%_-_60px)]">
                            <div className="space-y-4">
                                <div className="grid grid-cols-4 gap-2 px-2">
                                    {charts.map((item) => {
                                        return (
                                            <button
                                                className={`flex aspect-square flex-col items-center justify-center gap-2 rounded-md border-[3px] hover:bg-muted ${item.value === config.selectedChart && "border-foreground"}`}
                                                key={`chart-type-${item.id}`}
                                                onClick={() =>
                                                    setCharts(item.value)
                                                }
                                            >
                                                {item.icon}
                                                <span className="text-xs">
                                                    {item.name}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                                <div className="grid w-full items-center gap-1.5 px-2">
                                    <Label htmlFor="chart-title">
                                        Chart Title
                                    </Label>
                                    <Input
                                        type="text"
                                        id="chart-title"
                                        placeholder="Chart title"
                                    />
                                </div>
                                <Tabs defaultValue="series" className="px-2">
                                    <TabsList>
                                        <TabsTrigger value="series">
                                            Data Series
                                        </TabsTrigger>
                                        <TabsTrigger value="chart">
                                            Chart Config
                                        </TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="chart">
                                        <div className="mt-4 space-y-4">
                                            <Collapsible>
                                                <CollapsibleTrigger className="w-full">
                                                    <div className="flex items-center justify-between">
                                                        <div className="font-semibold">
                                                            Title
                                                        </div>
                                                        <ChevronsUpDownIcon
                                                            size={14}
                                                        />
                                                    </div>
                                                </CollapsibleTrigger>
                                                <CollapsibleContent className="mt-2 p-2">
                                                    <div className="space-y-2">
                                                        <div className="flex items-center gap-2">
                                                            <div className="text-muted-foreground">
                                                                Show
                                                            </div>
                                                            <div>
                                                                <Switch />
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <div className="text-muted-foreground">
                                                                Position
                                                            </div>
                                                            <div>
                                                                <Select>
                                                                    <SelectTrigger className="w-full">
                                                                        <SelectValue placeholder="Select legend position" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value="light">
                                                                            Light
                                                                        </SelectItem>
                                                                        <SelectItem value="dark">
                                                                            Dark
                                                                        </SelectItem>
                                                                        <SelectItem value="system">
                                                                            System
                                                                        </SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </CollapsibleContent>
                                            </Collapsible>
                                            <Collapsible>
                                                <CollapsibleTrigger className="w-full">
                                                    <div className="flex items-center justify-between">
                                                        <div className="font-semibold">
                                                            Legend
                                                        </div>
                                                        <ChevronsUpDownIcon
                                                            size={14}
                                                        />
                                                    </div>
                                                </CollapsibleTrigger>
                                                <CollapsibleContent className="mt-2 p-2">
                                                    <div className="space-y-2">
                                                        <div className="flex items-center gap-2">
                                                            <div className="text-muted-foreground">
                                                                Show
                                                            </div>
                                                            <div>
                                                                <Switch />
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <div className="text-muted-foreground">
                                                                Position
                                                            </div>
                                                            <div>
                                                                <Select>
                                                                    <SelectTrigger className="w-full">
                                                                        <SelectValue placeholder="Select legend position" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value="light">
                                                                            Light
                                                                        </SelectItem>
                                                                        <SelectItem value="dark">
                                                                            Dark
                                                                        </SelectItem>
                                                                        <SelectItem value="system">
                                                                            System
                                                                        </SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </CollapsibleContent>
                                            </Collapsible>
                                            <Collapsible>
                                                <CollapsibleTrigger className="w-full">
                                                    <div className="flex items-center justify-between">
                                                        <div className="font-semibold">
                                                            X-Axis
                                                        </div>
                                                        <ChevronsUpDownIcon
                                                            size={14}
                                                        />
                                                    </div>
                                                </CollapsibleTrigger>
                                                <CollapsibleContent className="mt-2 p-2">
                                                    <div className="space-y-2">
                                                        <div className="flex items-center gap-2">
                                                            <div className="text-muted-foreground">
                                                                Show
                                                            </div>
                                                            <div>
                                                                <Switch />
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <div className="text-muted-foreground">
                                                                Type
                                                            </div>
                                                            <div>
                                                                <div className="rounded-md bg-accent">
                                                                    <div className="grid grid-cols-2 gap-4 p-1 text-xs">
                                                                        <div className="rounded-md bg-background p-1 text-center transition-all">
                                                                            Category
                                                                        </div>
                                                                        <div className="rounded-md p-1 text-center transition-all">
                                                                            Time
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </CollapsibleContent>
                                            </Collapsible>
                                            <Collapsible>
                                                <CollapsibleTrigger className="w-full">
                                                    <div className="flex items-center justify-between">
                                                        <div className="font-semibold">
                                                            Y-Axis
                                                        </div>
                                                        <ChevronsUpDownIcon
                                                            size={14}
                                                        />
                                                    </div>
                                                </CollapsibleTrigger>
                                                <CollapsibleContent className="mt-2 p-2">
                                                    <div className="space-y-2">
                                                        <div className="flex items-center gap-2">
                                                            <div className="text-muted-foreground">
                                                                Show
                                                            </div>
                                                            <div>
                                                                <Switch />
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <div className="text-muted-foreground">
                                                                Type
                                                            </div>
                                                            <div>
                                                                <div className="rounded-md bg-accent">
                                                                    <div className="grid grid-cols-3 gap-4 p-1 text-xs">
                                                                        <div className="rounded-md bg-background p-1 text-center transition-all">
                                                                            Number
                                                                        </div>
                                                                        <div className="rounded-md p-1 text-center transition-all">
                                                                            Percentage
                                                                        </div>
                                                                        <div className="rounded-md p-1 text-center transition-all">
                                                                            Currency
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <div className="text-muted-foreground">
                                                                Format
                                                            </div>
                                                            <div>
                                                                <div className="rounded-md bg-accent">
                                                                    <div className="grid grid-cols-2 gap-4 p-1 text-xs">
                                                                        <div className="rounded-md bg-background p-1 text-center transition-all">
                                                                            Compact
                                                                        </div>
                                                                        <div className="rounded-md p-1 text-center transition-all">
                                                                            Loose
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </CollapsibleContent>
                                            </Collapsible>
                                        </div>
                                    </TabsContent>
                                    <TabsContent
                                        value="series"
                                        className="mt-4 space-y-4"
                                    >
                                        {[
                                            "bar",
                                            "line",
                                            "scatter",
                                            "area",
                                            "pie",
                                        ].includes(config.selectedChart) && (
                                            <>
                                                <div className="grid grid-cols-1 gap-1.5">
                                                    <Label>X axis</Label>
                                                    <Select
                                                        onValueChange={
                                                            handleXAxis
                                                        }
                                                        value={
                                                            config.xaxis.value
                                                        }
                                                        key={config.xaxis.value}
                                                    >
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Select X-Axis value" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="none">
                                                                None
                                                            </SelectItem>
                                                            {columns
                                                                .filter(
                                                                    (x) =>
                                                                        ![
                                                                            config
                                                                                .y2axis
                                                                                .value,
                                                                            config
                                                                                .yaxis
                                                                                .value,
                                                                            config
                                                                                .group
                                                                                .value,
                                                                        ].includes(
                                                                            x.name
                                                                        )
                                                                )
                                                                .map((item) => {
                                                                    return (
                                                                        <SelectItem
                                                                            value={
                                                                                item.name
                                                                            }
                                                                            key={
                                                                                item.key
                                                                            }
                                                                        >
                                                                            {
                                                                                item.name
                                                                            }
                                                                        </SelectItem>
                                                                    );
                                                                })}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="grid grid-cols-1 gap-1.5">
                                                    <Label>Y axis</Label>
                                                    <Select
                                                        onValueChange={
                                                            handleYAxis
                                                        }
                                                        value={
                                                            config.yaxis.value
                                                        }
                                                        disabled={
                                                            !config.xaxis
                                                                .value ||
                                                            config.xaxis
                                                                .value ===
                                                                "none"
                                                        }
                                                    >
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Select X-Axis value" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="none">
                                                                None
                                                            </SelectItem>
                                                            {columns
                                                                .filter(
                                                                    (x) =>
                                                                        ![
                                                                            config
                                                                                .xaxis
                                                                                .value,
                                                                            config
                                                                                .y2axis
                                                                                .value,
                                                                            config
                                                                                .group
                                                                                .value,
                                                                        ].includes(
                                                                            x.name
                                                                        )
                                                                )
                                                                .map((item) => {
                                                                    return (
                                                                        <SelectItem
                                                                            value={
                                                                                item.name
                                                                            }
                                                                            key={
                                                                                item.key
                                                                            }
                                                                        >
                                                                            {
                                                                                item.name
                                                                            }
                                                                        </SelectItem>
                                                                    );
                                                                })}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </>
                                        )}
                                        {[
                                            "bar",
                                            "line",
                                            "area",
                                            "scatter",
                                        ].includes(config.selectedChart) && (
                                            <div className="grid grid-cols-1 gap-1.5">
                                                <Label>Y2 axis</Label>
                                                <Select
                                                    onValueChange={handleY2Axis}
                                                    value={config.y2axis.value}
                                                    disabled={
                                                        !config.yaxis.value ||
                                                        config.yaxis.value ===
                                                            "none"
                                                    }
                                                >
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Select X-Axis value" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="none">
                                                            None
                                                        </SelectItem>
                                                        {columns
                                                            .filter(
                                                                (x) =>
                                                                    ![
                                                                        config
                                                                            .xaxis
                                                                            .value,
                                                                        config
                                                                            .yaxis
                                                                            .value,
                                                                        config
                                                                            .group
                                                                            .value,
                                                                    ].includes(
                                                                        x.name
                                                                    )
                                                            )
                                                            .map((item) => {
                                                                return (
                                                                    <SelectItem
                                                                        value={
                                                                            item.name
                                                                        }
                                                                        key={
                                                                            item.key
                                                                        }
                                                                    >
                                                                        {
                                                                            item.name
                                                                        }
                                                                    </SelectItem>
                                                                );
                                                            })}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        )}
                                        {[
                                            "bar",
                                            "line",
                                            "scatter",
                                            "area",
                                        ].includes(config.selectedChart) && (
                                            <div className="grid grid-cols-1 gap-1.5">
                                                <Label>Group</Label>
                                                <Select
                                                    onValueChange={handleGroup}
                                                    value={config.group.value}
                                                    disabled={
                                                        !config.yaxis.value ||
                                                        config.yaxis.value ===
                                                            "none"
                                                    }
                                                >
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Select X-Axis value" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="none">
                                                            None
                                                        </SelectItem>
                                                        {columns
                                                            .filter(
                                                                (x) =>
                                                                    ![
                                                                        config
                                                                            .xaxis
                                                                            .value,
                                                                        config
                                                                            .yaxis
                                                                            .value,
                                                                        config
                                                                            .y2axis
                                                                            .value,
                                                                    ].includes(
                                                                        x.name
                                                                    )
                                                            )
                                                            .map((item) => {
                                                                return (
                                                                    <SelectItem
                                                                        value={
                                                                            item.name
                                                                        }
                                                                        key={
                                                                            item.key
                                                                        }
                                                                    >
                                                                        {
                                                                            item.name
                                                                        }
                                                                    </SelectItem>
                                                                );
                                                            })}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        )}
                                        <Card className="space-y-4 px-4 py-2">
                                            <div className="flex items-center justify-between">
                                                <div>Date</div>
                                                <div className="flex items-center gap-1">
                                                    <Select>
                                                        <SelectTrigger className="w-[90%]">
                                                            <SelectValue placeholder="Chart type" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="light">
                                                                Light
                                                            </SelectItem>
                                                            <SelectItem value="dark">
                                                                Dark
                                                            </SelectItem>
                                                            <SelectItem value="system">
                                                                System
                                                            </SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                    <ColorPicker />
                                                </div>
                                            </div>
                                        </Card>
                                    </TabsContent>
                                </Tabs>
                            </div>
                        </ScrollArea>
                    </div>
                </Card>
            </div>
        </div>
    );
};
