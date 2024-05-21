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
    IDataMetrics,
} from "@/types";
import ReactECharts from "echarts-for-react";
import {
    getDataSeries,
    optionCharts,
    themeChartDark,
    themeChartLight,
} from "@/lib/utils";
import { CardMetrics } from "../card-metrics";
import { Checkbox } from "../ui/checkbox";
import * as echarts from "echarts";
import { useTheme } from "next-themes";
import { Button } from "../ui/button";

echarts.registerTheme("dark-theme", themeChartDark);
echarts.registerTheme("light-theme", themeChartLight);

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
                chart_id: string;
                config: ICharts;
                query_id: string;
            }[]
        >
    >;
    handleSaveChart: () => Promise<void>;
    loadingSave: boolean;
}> = ({
    columns,
    data,
    config,
    idConfig,
    setListTabs,
    handleSaveChart,
    loadingSave,
}) => {
    const [dataX, setDataX] = useState<(string | number | null)[]>([]);
    const [dataSeries, setDataSeries] = useState<IDataSeries>([]);
    const [dataMetrics, setDataMetrics] = useState<IDataMetrics>({
        textValue: "",
        value: null,
        compareValue: null,
    });

    const { theme } = useTheme();

    const getOptionsChart = useMemo(() => {
        return optionCharts(config, dataX, dataSeries, theme === "dark");
    }, [JSON.stringify(config), dataX, dataSeries, theme, config]);

    const setTitle = useCallback(
        (e: string) => {
            setListTabs((prev) => {
                const newArr = [...prev];
                newArr[idConfig].config.title.value = e;
                return newArr;
            });
        },
        [setListTabs, idConfig]
    );

    const SetShowTitle = useCallback(
        (e: boolean) => {
            setListTabs((prev) => {
                const newArr = [...prev];
                newArr[idConfig].config.title.show = e;
                return newArr;
            });
        },
        [setListTabs, idConfig]
    );

    const setPositionTitle = useCallback(
        (e: "center" | "left" | "right") => {
            setListTabs((prev) => {
                const newArr = [...prev];
                newArr[idConfig].config.title.position = e;
                return newArr;
            });
        },
        [setListTabs, idConfig]
    );

    const setLabelShow = useCallback(
        (e: boolean) => {
            setListTabs((prev) => {
                const newArr = [...prev];
                newArr[idConfig].config.label.show = e;
                return newArr;
            });
            setDataSeries((prev) => {
                const newArr = [...prev];
                return newArr.map((item) => {
                    return {
                        ...item,
                        label: { show: e },
                    };
                });
            });
        },
        [idConfig, setListTabs]
    );

    const setLegendShow = useCallback(
        (e: boolean) => {
            setListTabs((prev) => {
                const newArr = [...prev];
                newArr[idConfig].config.legend.show = e;
                return newArr;
            });
        },
        [idConfig, setListTabs]
    );

    const setLegendPosition = useCallback(
        (e: "left" | "center" | "right") => {
            setListTabs((prev) => {
                const newArr = [...prev];
                newArr[idConfig].config.legend.position = e;
                return newArr;
            });
        },
        [idConfig, setListTabs]
    );

    const setXAxisShow = useCallback(
        (e: boolean) => {
            setListTabs((prev) => {
                const newArr = [...prev];
                newArr[idConfig].config.xaxis.show = e;
                return newArr;
            });
        },
        [idConfig, setListTabs]
    );

    const setCharts = useCallback(
        (e: IAllCharts) => {
            setListTabs((prev) => {
                const newArr = [...prev];
                newArr[idConfig].config.selectedChart = e;
                newArr[idConfig].config.y2axis.chart = e;
                newArr[idConfig].config.xaxis.value = "";
                newArr[idConfig].config.yaxis.value = "";
                newArr[idConfig].config.y2axis.value = "";
                newArr[idConfig].config.group.value = "";
                newArr[idConfig].config.metricConfig.compareValue = "";
                newArr[idConfig].config.metricConfig.textCompare = "";
                newArr[idConfig].config.metricConfig.value = "";
                newArr[idConfig].config.stacked = false;
                newArr[idConfig].config.normalized = false;
                newArr[idConfig].config.yaxis.formatter = undefined;
                newArr[idConfig].config.label.formatter = undefined;
                return newArr;
            });
            setDataSeries(() => []);
            setDataMetrics({ compareValue: null, textValue: "", value: null });
        },
        [setDataSeries, idConfig, setListTabs]
    );

    const handleXAxis = useCallback(
        (e: string) => {
            setListTabs((prev) => {
                const newArr = [...prev];
                newArr[idConfig].config.xaxis.value =
                    e === "none" || !e ? "" : e;
                if (e === "none" || !e) {
                    newArr[idConfig].config.yaxis.value = "";
                    newArr[idConfig].config.y2axis.value = "";
                    newArr[idConfig].config.group.value = "";
                }
                return newArr;
            });
        },
        [idConfig, setListTabs]
    );

    const handleYAxis = useCallback(
        (e: string) => {
            setListTabs((prev) => {
                const newArr = [...prev];
                newArr[idConfig].config.yaxis.value = e === "none" ? "" : e;
                if (e === "none") {
                    newArr[idConfig].config.y2axis.value = "";
                    newArr[idConfig].config.group.value = "";
                }
                return newArr;
            });
        },
        [idConfig, setListTabs]
    );

    const setXAxisType = useCallback(
        (e: "time" | "category") => {
            setListTabs((prev) => {
                const newArr = [...prev];
                newArr[idConfig].config.xaxis.type = e;
                return newArr;
            });
            if (e === "time") {
                handleYAxis(config.yaxis.value);
                return;
            }
            handleXAxis(config.xaxis.value);
        },
        [
            idConfig,
            setListTabs,
            config.yaxis.value,
            handleYAxis,
            handleXAxis,
            config.xaxis.value,
        ]
    );

    const handleY2Axis = useCallback(
        (e: string) => {
            setListTabs((prev) => {
                const newArr = [...prev];
                newArr[idConfig].config.y2axis.value =
                    e === "none" || !e ? "" : e;
                if (e !== "none" || e) {
                    newArr[idConfig].config.group.value = "";
                    newArr[idConfig].config.normalized = false;
                    newArr[idConfig].config.stacked = false;
                    newArr[idConfig].config.yaxis.formatter = undefined;
                    newArr[idConfig].config.label.formatter = undefined;
                }
                return newArr;
            });
        },
        [setListTabs, idConfig]
    );

    const handleGroup = useCallback(
        (e: string) => {
            if (e === "none" || e === "") {
                setListTabs((prev) => {
                    const newArr = [...prev];
                    newArr[idConfig].config.group.value = "";
                    newArr[idConfig].config.stacked = false;
                    newArr[idConfig].config.normalized = false;
                    newArr[idConfig].config.yaxis.formatter = undefined;
                    newArr[idConfig].config.label.formatter = undefined;
                    return newArr;
                });
                return;
            }
            setListTabs((prev) => {
                const newArr = [...prev];
                newArr[idConfig].config.y2axis.value = "";
                newArr[idConfig].config.group.value = e;
                newArr[idConfig].config.yaxis.formatter = undefined;
                newArr[idConfig].config.label.formatter = undefined;
                return newArr;
            });
        },
        [idConfig, setListTabs]
    );

    const handleY2AxisChart = useCallback(
        (e: IAllCharts) => {
            setListTabs((prev) => {
                const newArr = [...prev];
                newArr[idConfig].config.y2axis.chart = e;
                return newArr;
            });
        },
        [idConfig, setListTabs]
    );

    const handleValueMetric = useCallback(
        (e: string) => {
            setListTabs((prev) => {
                const newArr = [...prev];
                newArr[idConfig].config.metricConfig.value = e;
                return newArr;
            });
            setDataMetrics((prev) => {
                return {
                    ...prev,
                    value: data && data?.length > 0 ? data[0][e] : null,
                };
            });
        },
        [setListTabs, idConfig, setDataMetrics, data]
    );

    const handleCompareValueMetric = useCallback(
        (e: string) => {
            setListTabs((prev) => {
                const newArr = [...prev];
                newArr[idConfig].config.metricConfig.compareValue = e;
                return newArr;
            });
            setDataMetrics((prev) => {
                return {
                    ...prev,
                    compareValue: data && data?.length > 0 ? data[0][e] : null,
                };
            });
        },
        [setListTabs, idConfig, setDataMetrics, data]
    );

    const handleTextCompareMetric = useCallback(
        (e: string) => {
            setListTabs((prev) => {
                const newArr = [...prev];
                newArr[idConfig].config.metricConfig.textCompare = e;
                return newArr;
            });
            setDataMetrics((prev) => {
                return {
                    ...prev,
                    textValue: e,
                };
            });
        },
        [setListTabs, idConfig, setDataMetrics, data]
    );

    const handleStacked = useCallback(
        (e: boolean) => {
            setListTabs((prev) => {
                const newArr = [...prev];
                newArr[idConfig].config.stacked = e;
                if (!e) {
                    newArr[idConfig].config.normalized = false;
                }
                return newArr;
            });
        },
        [setListTabs, idConfig]
    );

    const handleNormalized = useCallback(
        (e: boolean) => {
            setListTabs((prev) => {
                const newArr = [...prev];
                newArr[idConfig].config.normalized = e;
                if (e) {
                    newArr[idConfig].config.yaxis.formatter = function (value) {
                        return Math.floor(Number(value) * 1000) / 10 + "%";
                    };
                    newArr[idConfig].config.label.formatter = function (
                        params
                    ) {
                        return (
                            Math.floor(Number(params.value) * 1000) / 10 + "%"
                        );
                    };
                } else {
                    newArr[idConfig].config.yaxis.formatter = undefined;
                    newArr[idConfig].config.label.formatter = undefined;
                }
                return newArr;
            });
        },
        [setListTabs, idConfig]
    );

    useEffect(() => {
        if (
            idConfig > -1 &&
            (config.xaxis.value || config.selectedChart === "metric")
        ) {
            if (config.selectedChart === "metric")
                setDataMetrics({
                    value:
                        data && data?.length > 0
                            ? data[0][config.metricConfig.value]
                            : null,
                    compareValue:
                        data && data?.length > 0
                            ? data[0][config.metricConfig.compareValue]
                            : null,
                    textValue: config.metricConfig.textCompare,
                });

            const { dataX, dataY } = getDataSeries(config, data);
            setDataX(dataX);
            setDataSeries(dataY);
        }
    }, [
        idConfig,
        JSON.stringify(config),
        config,
        setDataX,
        setDataSeries,
        setDataMetrics,
    ]);

    return (
        <div className="relative h-full w-full">
            <div className="absolute inset-0 -z-10 h-full w-full bg-muted bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
            <div className="flex h-[calc(100%_-_30px)] gap-4">
                <Card className="m-4 h-[450px] w-full flex-1 p-4">
                    {config.selectedChart !== "metric" && (
                        <ReactECharts
                            echarts={echarts}
                            option={getOptionsChart}
                            notMerge={true}
                            style={{ height: "100%", width: "100%" }}
                            theme={
                                theme === "dark" ? "dark-theme" : "light-theme"
                            }
                            key={
                                JSON.stringify(config) +
                                idConfig +
                                theme +
                                String(config.title.show)
                            }
                        />
                    )}
                    {config.selectedChart === "metric" && (
                        <CardMetrics config={config} data={dataMetrics} />
                    )}
                </Card>
                <Card className="h-full w-[30%] flex-none rounded-none p-4">
                    <div className="h-full space-y-4">
                        <div>
                            <div className="flex items-center justify-between">
                                <div className="text-base font-semibold">
                                    Chart Settings
                                </div>
                                <Button
                                    className="h-6"
                                    variant="default"
                                    disabled={loadingSave}
                                    onClick={() => handleSaveChart()}
                                >
                                    Save
                                </Button>
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
                                        value={config.title.value}
                                        onChange={(e) =>
                                            setTitle(e.target.value)
                                        }
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
                                                            Chart
                                                        </div>
                                                        <ChevronsUpDownIcon
                                                            size={14}
                                                        />
                                                    </div>
                                                </CollapsibleTrigger>
                                                <CollapsibleContent className="mt-2 p-2">
                                                    <div className="space-y-2">
                                                        <div className="flex items-center gap-2">
                                                            <Checkbox
                                                                id="stacked"
                                                                checked={
                                                                    config.stacked
                                                                }
                                                                onCheckedChange={(
                                                                    e
                                                                ) =>
                                                                    handleStacked(
                                                                        e as boolean
                                                                    )
                                                                }
                                                                disabled={
                                                                    !config
                                                                        .group
                                                                        .value
                                                                }
                                                            />
                                                            <label
                                                                htmlFor="stacked"
                                                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                            >
                                                                Stacked
                                                            </label>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Checkbox
                                                                id="normalized"
                                                                checked={
                                                                    config.normalized
                                                                }
                                                                onCheckedChange={
                                                                    handleNormalized
                                                                }
                                                                disabled={
                                                                    !config.stacked
                                                                }
                                                            />
                                                            <label
                                                                htmlFor="normalized"
                                                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                            >
                                                                Normalized
                                                            </label>
                                                        </div>
                                                    </div>
                                                </CollapsibleContent>
                                            </Collapsible>
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
                                                            <Label
                                                                htmlFor="switch-show-title"
                                                                className="text-muted-foreground"
                                                            >
                                                                Show
                                                            </Label>
                                                            <div>
                                                                <Switch
                                                                    id="switch-show-title"
                                                                    checked={
                                                                        config
                                                                            .title
                                                                            .show
                                                                    }
                                                                    onCheckedChange={
                                                                        SetShowTitle
                                                                    }
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <div className="text-muted-foreground">
                                                                Position
                                                            </div>
                                                            <div>
                                                                <Select
                                                                    value={
                                                                        config
                                                                            .title
                                                                            .position
                                                                    }
                                                                    onValueChange={
                                                                        setPositionTitle
                                                                    }
                                                                >
                                                                    <SelectTrigger className="w-full">
                                                                        <SelectValue placeholder="Select legend position" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value="left">
                                                                            Left
                                                                        </SelectItem>
                                                                        <SelectItem value="center">
                                                                            Center
                                                                        </SelectItem>
                                                                        <SelectItem value="right">
                                                                            Right
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
                                                            Label
                                                        </div>
                                                        <ChevronsUpDownIcon
                                                            size={14}
                                                        />
                                                    </div>
                                                </CollapsibleTrigger>
                                                <CollapsibleContent className="mt-2 p-2">
                                                    <div className="space-y-2">
                                                        <div className="flex items-center gap-2">
                                                            <Label
                                                                htmlFor="config-label-chart-show"
                                                                className="text-muted-foreground"
                                                            >
                                                                Show
                                                            </Label>
                                                            <div>
                                                                <Switch
                                                                    id="config-label-chart-show"
                                                                    checked={
                                                                        config
                                                                            .label
                                                                            .show
                                                                    }
                                                                    onCheckedChange={
                                                                        setLabelShow
                                                                    }
                                                                />
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
                                                            <Label
                                                                htmlFor="config-legend-show"
                                                                className="text-muted-foreground"
                                                            >
                                                                Show
                                                            </Label>
                                                            <div>
                                                                <Switch
                                                                    id="config-legend-show"
                                                                    checked={
                                                                        config
                                                                            .legend
                                                                            .show
                                                                    }
                                                                    onCheckedChange={
                                                                        setLegendShow
                                                                    }
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <div className="text-muted-foreground">
                                                                Position
                                                            </div>
                                                            <div>
                                                                <Select
                                                                    value={
                                                                        config
                                                                            .legend
                                                                            .position
                                                                    }
                                                                    onValueChange={
                                                                        setLegendPosition
                                                                    }
                                                                >
                                                                    <SelectTrigger className="w-full">
                                                                        <SelectValue placeholder="Select legend position" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value="left">
                                                                            Left
                                                                        </SelectItem>
                                                                        <SelectItem value="center">
                                                                            Center
                                                                        </SelectItem>
                                                                        <SelectItem value="right">
                                                                            Right
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
                                                            <Label
                                                                htmlFor="config-xaxis-show"
                                                                className="text-muted-foreground"
                                                            >
                                                                Show
                                                            </Label>
                                                            <div>
                                                                <Switch
                                                                    id="config-xaxis-show"
                                                                    checked={
                                                                        config
                                                                            .xaxis
                                                                            .show
                                                                    }
                                                                    onCheckedChange={
                                                                        setXAxisShow
                                                                    }
                                                                />
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <Select
                                                                value={
                                                                    config.xaxis
                                                                        .type
                                                                }
                                                                onValueChange={
                                                                    setXAxisType
                                                                }
                                                            >
                                                                <SelectTrigger className="w-full">
                                                                    <SelectValue placeholder="Select legend position" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="category">
                                                                        Category
                                                                    </SelectItem>
                                                                    <SelectItem value="time">
                                                                        Time
                                                                    </SelectItem>
                                                                </SelectContent>
                                                            </Select>
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
                                        {config.selectedChart === "metric" && (
                                            <>
                                                <div className="grid grid-cols-1 gap-1.5">
                                                    <Label>Value</Label>
                                                    <Select
                                                        value={
                                                            config.metricConfig
                                                                .value
                                                        }
                                                        onValueChange={
                                                            handleValueMetric
                                                        }
                                                    >
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Select X-Axis value" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="none">
                                                                None
                                                            </SelectItem>
                                                            {columns.map(
                                                                (item) => {
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
                                                                }
                                                            )}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="grid grid-cols-1 gap-1.5">
                                                    <Label>Compare Value</Label>
                                                    <Select
                                                        value={
                                                            config.metricConfig
                                                                .compareValue
                                                        }
                                                        onValueChange={
                                                            handleCompareValueMetric
                                                        }
                                                    >
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Select X-Axis value" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="none">
                                                                None
                                                            </SelectItem>
                                                            {columns.map(
                                                                (item) => {
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
                                                                }
                                                            )}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="grid grid-cols-1 gap-1.5">
                                                    <Label htmlFor="text-compare">
                                                        Text Compare
                                                    </Label>
                                                    <Input
                                                        id="text-compare"
                                                        type="text"
                                                        placeholder="text compare ex: from last 30 days"
                                                        value={
                                                            config.metricConfig
                                                                .textCompare
                                                        }
                                                        onChange={(e) => {
                                                            handleTextCompareMetric(
                                                                e.target.value
                                                            );
                                                        }}
                                                    ></Input>
                                                </div>
                                            </>
                                        )}
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

                                        {config.y2axis.value && (
                                            <Card className="space-y-4 px-4 py-2">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        {config.y2axis.value}
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Select
                                                            value={
                                                                config.y2axis
                                                                    .chart
                                                            }
                                                            onValueChange={
                                                                handleY2AxisChart
                                                            }
                                                        >
                                                            <SelectTrigger className="w-[90%]">
                                                                <SelectValue placeholder="Chart type" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {[
                                                                    "bar",
                                                                    "line",
                                                                    "area",
                                                                    "scatter",
                                                                ].map(
                                                                    (item) => {
                                                                        return (
                                                                            <SelectItem
                                                                                value={
                                                                                    item
                                                                                }
                                                                                key={`config-y2axis-chart-${item}`}
                                                                            >
                                                                                {
                                                                                    item
                                                                                }
                                                                            </SelectItem>
                                                                        );
                                                                    }
                                                                )}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </div>
                                            </Card>
                                        )}
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
