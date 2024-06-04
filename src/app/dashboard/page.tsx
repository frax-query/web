"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
    AreaChartIcon,
    BarChart3Icon,
    CaseSensitiveIcon,
    CheckIcon,
    Edit2Icon,
    EyeIcon,
    FilePieChartIcon,
    HeartIcon,
    LayoutDashboardIcon,
    LineChartIcon,
    PieChartIcon,
    SaveIcon,
    ScatterChartIcon,
    SmartphoneIcon,
    TabletIcon,
    Trash2Icon,
} from "lucide-react";
import Markdown from "react-markdown";
import type ReactGridLayout from "react-grid-layout";
import { Responsive, WidthProvider } from "react-grid-layout";
import type { Dispatch, SetStateAction } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { DesktopIcon } from "@radix-ui/react-icons";
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command";
import { useDashboard } from "@/hooks/useDashboard";
import type {
    CardType,
    DeviceMode,
    DeviceModeSize,
    ICharts,
    IDataDashboard,
    IDataMetrics,
    IDataSeries,
    IListCharts,
    ITableCharts,
    ITableDashboard,
    ITableQuery,
    ResponseData,
} from "@/types";
import { v4 as uuidv4 } from "uuid";
import { useQuery } from "@/hooks/useQuery";
import ReactECharts from "echarts-for-react";
import * as echarts from "echarts";
import { CardMetrics } from "@/components/card-metrics";
import { useTheme } from "next-themes";
import { getDataSeries, optionCharts } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { Logo } from "@/components/logo";

const defaultValueCardText = "##### You can use standart markdown";

const charts: IListCharts[] = [
    {
        id: 0,
        name: "Bar Chart",
        value: "bar",
        icon: <BarChart3Icon className="mr-2 h-4 w-4" />,
    },
    {
        id: 1,
        name: "Line Chart",
        value: "line",
        icon: <LineChartIcon className="mr-2 h-4 w-4" />,
    },
    {
        id: 2,
        name: "Area Chart",
        value: "area",
        icon: <AreaChartIcon className="mr-2 h-4 w-4" />,
    },
    {
        id: 3,
        name: "Pie Chart",
        value: "pie",
        icon: <PieChartIcon className="mr-2 h-4 w-4" />,
    },
    {
        id: 4,
        name: "Scatter",
        value: "scatter",
        icon: <ScatterChartIcon className="mr-2 h-4 w-4" />,
    },
    {
        id: 5,
        name: "Metric",
        value: "metric",
        icon: <CaseSensitiveIcon className="mr-2 h-4 w-4" />,
    },
];

export default function Dashboard() {
    const {
        device,
        deviceModeSize,
        listGrid,
        layouts,
        breakpoint,
        data,
        listCharts,
        listDashboard,
        title,
        description,
        laodingDashboard,
        errorDashboard,
        loadDashboard,
        setTitle,
        setDescription,
        getAllDashboard,
        setData,
        setDevice,
        handleAddCard,
        setBreakpoint,
        handleChangeLayout,
        handleRemoveCard,
        handleSaveDashboard,
        createNewDashboard,
    } = useDashboard();

    const { toast } = useToast();
    const [loadingSave, setLoadingSave] = useState(false);
    const saveDashboard = async () => {
        setLoadingSave(true);
        const res = await handleSaveDashboard();
        if (res.isError) {
            toast({
                title: "Failed to save dashboard",
                variant: "destructive",
                description: res.message,
            });
        } else {
            toast({
                title: "Dashboard saved",
                description: "your dashboard has been saved!",
            });
        }
        setLoadingSave(false);
    };
    return (
        <div className="max-w-full">
            {laodingDashboard && (
                <FullLoadingScreen text="Preparing your dashboard..." />
            )}
            {errorDashboard && <ErrorLoadingDashboard />}
            <div className="sticky top-[64px] z-[2] border-b bg-background p-4">
                <div className="mx-auto max-w-[1800px]">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                            <Avatar>
                                <AvatarImage></AvatarImage>
                                <AvatarFallback className="uppercase">
                                    AK
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <div className="text-sm">@akbaridria</div>
                                <div className="text-xs text-muted-foreground">
                                    Akbar Idria
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1 rounded-lg border p-[2px]">
                                <Button
                                    size="icon"
                                    variant={
                                        device === "Desktop"
                                            ? "secondary"
                                            : "ghost"
                                    }
                                    className="h-[22px] w-[22px]"
                                    onClick={() => setDevice("Desktop")}
                                >
                                    <DesktopIcon className="h-[1rem] w-[1rem]" />
                                </Button>
                                <Button
                                    size="icon"
                                    variant={
                                        device === "Tablet"
                                            ? "secondary"
                                            : "ghost"
                                    }
                                    className="h-[22px] w-[22px]"
                                    onClick={() => setDevice("Tablet")}
                                >
                                    <TabletIcon className="h-[1rem] w-[1rem]" />
                                </Button>
                                <Button
                                    size="icon"
                                    variant={
                                        device === "Smartphone"
                                            ? "secondary"
                                            : "ghost"
                                    }
                                    className="h-[22px] w-[22px]"
                                    onClick={() => setDevice("Smartphone")}
                                >
                                    <SmartphoneIcon className="h-[1rem] w-[1rem]" />
                                </Button>
                            </div>
                            {false && (
                                <>
                                    <div className="flex items-center gap-1">
                                        <HeartIcon className="h-[1rem] w-[1rem]" />
                                        <div className="text-xs">1k</div>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <EyeIcon className="h-[1rem] w-[1rem]" />
                                        <div className="text-xs">1k</div>
                                    </div>
                                </>
                            )}
                            <Separator orientation="vertical" />
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="default"
                                        className="flex h-7 items-center gap-1 text-sm"
                                    >
                                        <FilePieChartIcon className="h-[0.875rem] w-[0.875rem]" />
                                        Add card
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <SearchChart
                                        listCharts={listCharts}
                                        handleAddCard={handleAddCard}
                                        layouts={layouts}
                                    />
                                    <DropdownMenuItem
                                        className="flex items-center gap-2"
                                        onClick={() =>
                                            handleAddCard(
                                                "text",
                                                layouts,
                                                uuidv4(),
                                                defaultValueCardText
                                            )
                                        }
                                    >
                                        <CaseSensitiveIcon className="h-[0.875rem] w-[0.875rem]" />
                                        <div>Add Text</div>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <Button
                                variant="outline"
                                className="flex h-7 items-center gap-1 text-sm"
                                disabled={loadingSave}
                                onClick={() => saveDashboard()}
                            >
                                <SaveIcon className="h-[0.875rem] w-[0.875rem]" />
                                Save
                            </Button>
                            <ListDashboard
                                data={listDashboard}
                                getAllDashboard={getAllDashboard}
                                createNewDashboard={createNewDashboard}
                                loadDashboard={loadDashboard}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <LayoutChart
                device={device}
                deviceModeSize={deviceModeSize}
                listGrid={listGrid}
                layouts={layouts}
                breakpoint={breakpoint}
                data={data}
                title={title}
                description={description}
                setTitle={setTitle}
                setDescription={setDescription}
                setData={setData}
                setBreakpoint={setBreakpoint}
                handleChangeLayout={handleChangeLayout}
                handleRemoveCard={handleRemoveCard}
            />
        </div>
    );
}

const ResponsiveGridLayout = WidthProvider(Responsive);

interface ILayoutChart {
    device: DeviceMode;
    deviceModeSize: DeviceModeSize;
    listGrid: ReactGridLayout.Layout[];
    layouts: ReactGridLayout.Layouts;
    breakpoint: string;
    data: IDataDashboard[];
    title: string;
    description: string;
    setBreakpoint: Dispatch<SetStateAction<string>>;
    handleChangeLayout: (
        layout: ReactGridLayout.Layout[],
        layouts: ReactGridLayout.Layouts
    ) => void;
    handleRemoveCard: (id: string) => void;
    setData: Dispatch<SetStateAction<IDataDashboard[]>>;
    setTitle: Dispatch<SetStateAction<string>>;
    setDescription: Dispatch<SetStateAction<string>>;
}

const LayoutChart: React.FC<ILayoutChart> = ({
    device,
    deviceModeSize,
    listGrid,
    layouts,
    data,
    title,
    description,
    setData,
    setBreakpoint,
    handleChangeLayout,
    handleRemoveCard,
    setTitle,
    setDescription,
}) => {
    const changeLayout = (
        e: ReactGridLayout.Layout[],
        a: ReactGridLayout.Layouts
    ) => {
        handleChangeLayout(e, a);
    };

    const handleBreakpointChange = (e: string) => {
        setBreakpoint(e);
    };

    return (
        <div>
            <div className="border-x border-b p-4">
                <div className="mx-auto max-w-[1800px]">
                    <div
                        className="text-balance text-3xl font-semibold leading-tight tracking-tighter"
                        contentEditable={true}
                        onKeyDown={(e) =>
                            e.key === "Enter" && e.currentTarget.blur()
                        }
                        onBlur={(e) => {
                            const text = e.currentTarget.textContent;
                            if (text) setTitle(text);
                            else setTitle("Click to edit title");
                        }}
                    >
                        {title}
                    </div>
                    <div
                        className="text-muted-foreground"
                        contentEditable={true}
                        onKeyDown={(e) =>
                            e.key === "Enter" && e.currentTarget.blur()
                        }
                        onBlur={(e) => {
                            const text = e.currentTarget.textContent;
                            if (text) setDescription(text);
                            else setDescription("Click to edit description");
                        }}
                    >
                        {description}
                    </div>
                </div>
            </div>
            <div
                className="min-h-screen border-x bg-muted p-4"
                style={{ maxWidth: deviceModeSize[device] }}
            >
                <ResponsiveGridLayout
                    className="layout z-[1] mx-auto w-full"
                    breakpoints={{
                        lg: 1200,
                        md: 996,
                        sm: 768,
                        xs: 480,
                        xxs: 0,
                    }}
                    cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
                    layouts={layouts}
                    isResizable={true}
                    isDraggable={true}
                    onLayoutChange={changeLayout}
                    onBreakpointChange={handleBreakpointChange}
                    rowHeight={10}
                    margin={[5, 5]}
                >
                    {listGrid.map((item) => {
                        const typeCard =
                            data.filter((x) => x.id === item.i)[0].type ?? "";
                        if (typeCard) {
                            if (typeCard === "text")
                                return (
                                    <div key={item.i} data-grid={item}>
                                        <CardText
                                            handleRemoveCard={handleRemoveCard}
                                            data={data}
                                            setData={setData}
                                            id={item.i}
                                        />
                                    </div>
                                );
                            else
                                return (
                                    <div key={item.i} data-grid={item}>
                                        <CardChart
                                            handleRemoveCard={handleRemoveCard}
                                            id={item.i}
                                            config={JSON.parse(
                                                data.filter(
                                                    (x) => x.id === item.i
                                                )[0].value
                                            )}
                                        />
                                    </div>
                                );
                        } else {
                            return (
                                <Card
                                    key={item.i}
                                    className="relative h-full w-full p-4"
                                >
                                    <div>Can't find the text</div>
                                </Card>
                            );
                        }
                    })}
                </ResponsiveGridLayout>
            </div>
        </div>
    );
};

interface ICardText {
    handleRemoveCard: (id: string) => void;
    data: IDataDashboard[];
    setData: Dispatch<SetStateAction<IDataDashboard[]>>;
    id: string;
}
const CardText: React.FC<ICardText> = ({
    id,
    data,
    setData,
    handleRemoveCard,
}) => {
    const [editText, setEditText] = useState(false);

    const dataText = useMemo(() => {
        return data.filter((item) => item.id === id)[0] ?? undefined;
    }, [data, id]);

    const handleDataText = useCallback((text: string) => {
        setData((prev) => {
            const newArr = prev.map((item) => {
                if (item.id === id) return { ...item, value: text };
                else return item;
            });
            return newArr;
        });
    }, []);

    return (
        <Card className="relative h-full w-full p-4">
            <Card className="absolute right-[0.5rem] top-[0.5rem] p-2">
                <div className="flex items-center gap-2">
                    <Trash2Icon
                        className="h-[0.875rem] w-[0.875rem]"
                        onMouseDown={(e) => {
                            e.preventDefault(),
                                e.stopPropagation(),
                                handleRemoveCard(id);
                        }}
                    />
                    {!editText && (
                        <Edit2Icon
                            className="h-[0.875rem] w-[0.875rem]"
                            onMouseDown={(e) => {
                                e.stopPropagation(),
                                    setEditText((prev) => !prev);
                            }}
                        />
                    )}
                    {editText && (
                        <CheckIcon
                            className="h-[0.875rem] w-[0.875rem]"
                            onMouseDown={(e) => {
                                e.stopPropagation(),
                                    setEditText((prev) => !prev);
                            }}
                        />
                    )}
                </div>
            </Card>
            {editText && (
                <textarea
                    className="h-full w-full"
                    placeholder="You can use standard markdown like bold, italic and etc.."
                    value={dataText.value}
                    onChange={(e) => handleDataText(e.target.value)}
                ></textarea>
            )}
            {!editText && <Markdown>{dataText.value}</Markdown>}
        </Card>
    );
};

interface ICardChart {
    handleRemoveCard: (id: string) => void;
    id: string;
    config: ICharts;
}
const CardChart: React.FC<ICardChart> = ({ handleRemoveCard, id, config }) => {
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

interface IListdashboard {
    data: ITableDashboard[];
    getAllDashboard: () => Promise<void>;
    createNewDashboard: () => void;
    loadDashboard: (id: string) => Promise<void>;
}
const ListDashboard: React.FC<IListdashboard> = ({
    data,
    getAllDashboard,
    createNewDashboard,
    loadDashboard,
}) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            setLoading(true);
            await getAllDashboard();
            setLoading(false);
        })();
    }, []);

    return (
        <>
            <Button
                variant="ghost"
                className="flex h-7 items-center gap-1"
                onClick={() => setOpen(true)}
            >
                <LayoutDashboardIcon className="h-[1rem] w-[1rem]" />
                Change Dashboard
            </Button>
            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput placeholder="Search charts..." />
                <CommandList>
                    {!loading && (
                        <>
                            <CommandEmpty>No results found.</CommandEmpty>
                            <CommandGroup heading="Create">
                                <CommandItem
                                    className="!py-1.5"
                                    onSelect={() => {
                                        createNewDashboard();
                                        setOpen(false);
                                    }}
                                >
                                    Create new dashboard
                                </CommandItem>
                            </CommandGroup>
                            <CommandSeparator />
                            {data.length > 0 && (
                                <CommandGroup heading="List Dashboards">
                                    {data.map((item) => {
                                        return (
                                            <CommandItem
                                                key={item.id}
                                                className="!py-1.5"
                                                onSelect={() => {
                                                    loadDashboard(item.id);
                                                    setOpen(false);
                                                }}
                                            >
                                                {item.title}
                                            </CommandItem>
                                        );
                                    })}
                                </CommandGroup>
                            )}
                        </>
                    )}
                    {loading && <CommandItem>loading...</CommandItem>}
                </CommandList>
            </CommandDialog>
        </>
    );
};

interface ISearchChart {
    listCharts: ITableCharts[];
    handleAddCard: (
        typeCard: CardType,
        listLayouts: ReactGridLayout.Layouts,
        id: string,
        value: string
    ) => void;
    layouts: ReactGridLayout.Layouts;
}
const SearchChart: React.FC<ISearchChart> = ({
    listCharts,
    handleAddCard,
    layouts,
}) => {
    const [open, setOpen] = useState(false);
    return (
        <>
            <DropdownMenuItem
                className="flex items-center gap-2"
                onMouseDown={() => setOpen(true)}
            >
                <PieChartIcon className="h-[0.875rem] w-[0.875rem]" />
                <div>Add chart</div>
            </DropdownMenuItem>
            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput placeholder="Search charts..." />
                <CommandList>
                    <CommandEmpty>No results found.</CommandEmpty>
                    {listCharts.length > 0 && (
                        <CommandGroup heading="List Charts">
                            {listCharts.map((item) => {
                                return (
                                    <CommandItem
                                        key={item.id}
                                        className="!py-1.5"
                                        onSelect={() => {
                                            handleAddCard(
                                                "chart",
                                                layouts,
                                                item.query_id,
                                                item.config
                                            );
                                            setOpen(false);
                                        }}
                                    >
                                        {
                                            charts.filter(
                                                (x) =>
                                                    x.value ===
                                                    (
                                                        JSON.parse(
                                                            item.config
                                                        ) as ICharts
                                                    ).selectedChart
                                            )[0].icon
                                        }
                                        {
                                            (JSON.parse(item.config) as ICharts)
                                                .title.value
                                        }
                                    </CommandItem>
                                );
                            })}
                        </CommandGroup>
                    )}
                </CommandList>
            </CommandDialog>
        </>
    );
};

const FullLoadingScreen: React.FC<{ text: string }> = ({ text }) => {
    return (
        <div className="fixed z-[1000] h-full w-full bg-background">
            <div className="flex h-full w-full flex-col items-center justify-center gap-2">
                <Logo />
                <div className="text-center text-sm">{text}</div>
            </div>
        </div>
    );
};

const ErrorLoadingDashboard = () => {
    return (
        <div className="fixed z-[1000] h-full w-full bg-background">
            <div className="flex h-full w-full flex-col items-center justify-center gap-2">
                <Logo />
                <div className="text-center text-sm">
                    We encountered an error while fetching data for your <br />
                    dashboard. Please try again.
                </div>
                <Button
                    className="h-6"
                    variant="default"
                    onClick={() => location.reload()}
                >
                    Reload
                </Button>
            </div>
        </div>
    );
};
