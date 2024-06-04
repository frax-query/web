import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { createClient } from "@clickhouse/client";
import type { EChartsOption, ICharts, IDataSeries, QueryResult } from "@/types";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const createClientClickhouse = createClient({
    url: "http://" + process.env["DATABASE_HOST"] + ":8123", // defaults to 'http://localhost:8123'
    password: process.env["DATABASE_PASSWORD"], // defaults to an empty string,
    request_timeout: 300_000,
    clickhouse_settings: {
        max_result_rows: "10000",
        readonly: "1",
        result_overflow_mode: "break",
        max_block_size: "10000",
        cancel_http_readonly_queries_on_client_close: 1,
    },
});

export const colors = [
    "#c1232b",
    "#27727b",
    "#fcce10",
    "#e87c25",
    "#b5c334",
    "#fe8463",
    "#9bca63",
    "#fad860",
    "#f3a43b",
    "#60c0dd",
    "#d7504b",
    "#c6e579",
    "#f4e001",
    "#f0805a",
];

const darkTextColor = "#FAFAF9";
const lightTextrColor = "#0C0A09";

export const optionCharts = (
    config: ICharts,
    dataX: (string | number | null)[],
    dataSeries: IDataSeries,
    isDark: boolean
): EChartsOption => {
    if (config.selectedChart === "pie") {
        return {
            darkMode: isDark,
            // @ts-expect-error expect to be error for formatter
            tooltip: {
                trigger: "axis",
                type: "cross",
                valueFormatter: config.yaxis.formatter,
            },
            label: {
                show: config.label.show,
                formatter: config.label.formatter,
            },
            title: {
                show: config.title.show,
                text: config.title.value,
                top: "top",
                left: config.title.position,
                textStyle: {
                    color: isDark ? darkTextColor : lightTextrColor,
                    show: config.title.show,
                },
            },
            color: isDark ? themeChartDark.color : themeChartLight.color,
            backgroundColor: isDark
                ? themeChartDark.backgroundColor
                : themeChartLight.backgroundColor,
            legend: {
                show: config.legend.show,
                left: config.legend.position,
                bottom: "bottom",
                orient: "horizontal",
                type: "scroll",
                textStyle: {
                    color: isDark ? darkTextColor : lightTextrColor,
                },
            },
            // @ts-expect-error expect to be error;
            series: dataSeries,
        };
    }
    return {
        darkMode: isDark,
        // @ts-expect-error expect to be error for formatter
        tooltip: {
            trigger: "axis",
            type: "cross",
            valueFormatter: config.yaxis.formatter,
        },
        label: {
            show: config.label.show,
            formatter: config.label.formatter,
        },
        title: {
            show: config.title.show,
            text: config.title.value,
            top: "top",
            left: config.title.position,
            textStyle: {
                color: isDark ? darkTextColor : lightTextrColor,
                show: config.title.show,
            },
        },
        color: isDark ? themeChartDark.color : themeChartLight.color,
        backgroundColor: isDark
            ? themeChartDark.backgroundColor
            : themeChartLight.backgroundColor,
        legend: {
            show: config.legend.show,
            left: config.legend.position,
            bottom: "bottom",
            orient: "horizontal",
            type: "scroll",
            textStyle: {
                color: isDark ? darkTextColor : lightTextrColor,
            },
        },
        xAxis: [
            {
                type: config.xaxis.type,
                showGrid: false,
                data: dataX,
                show: config.xaxis.show,
                splitLine: {
                    show: false,
                },
                axisPointer: {
                    type: "shadow",
                },
                axisLine: { show: false },
                axisTick: { show: false },
                axisLabel: {
                    textStyle: {
                        color: isDark ? darkTextColor : lightTextrColor,
                    },
                },
            },
        ],
        yAxis: [
            {
                type: config.yaxis.type,
                show: config.yaxis.show,
                splitLine: {
                    show: false,
                },
                axisLabel: {
                    formatter: config.yaxis.formatter,
                    textStyle: {
                        color: isDark ? darkTextColor : lightTextrColor,
                    },
                },
            },
            {
                type: config.y2axis.type,
                show:
                    !config.y2axis.value || config.yaxis.value === "none"
                        ? false
                        : config.y2axis.show,
                splitLine: {
                    show: false,
                },
                axisLabel: {
                    formatter: config.y2axis.formatter,
                    textStyle: {
                        color: isDark ? darkTextColor : lightTextrColor,
                    },
                },
            },
        ],
        // @ts-expect-error expect to be error;
        series: dataSeries,
    };
};

export const defaultConfigChart: ICharts = {
    group: { value: "" },
    legend: { show: true, position: "center" },
    label: { show: false, formatter: undefined },
    title: {
        position: "center",
        value: "Your beautiful chart",
        show: true,
    },
    xaxis: {
        show: true,
        type: "category",
        value: "",
    },
    yaxis: {
        show: true,
        formatType: "number",
        format: "standard",
        type: "value",
        value: "",
        formatter: (v: number | string | null) => {
            return new Intl.NumberFormat("en-IN", {
                notation: "compact",
            }).format(Number(v));
        },
    },
    y2axis: {
        show: true,
        formatType: "number",
        format: "standard",
        type: "value",
        value: "",
        formatter: (v: number | string | null) => {
            return v as string;
        },
        chart: "bar",
    },
    selectedChart: "bar",
    metricConfig: {
        compareValue: "",
        textCompare: "",
        value: "",
    },
    stacked: false,
    normalized: false,
};

export const themeChartLight = {
    seriesCnt: "4",
    backgroundColor: "rgba(0,0,0,0)",
    titleColor: "#27727b",
    subtitleColor: "#aaaaaa",
    textColorShow: false,
    textColor: "#333",
    markTextColor: "#eeeeee",
    color: [
        "#c1232b",
        "#27727b",
        "#fcce10",
        "#e87c25",
        "#b5c334",
        "#fe8463",
        "#9bca63",
        "#fad860",
        "#f3a43b",
        "#60c0dd",
        "#d7504b",
        "#c6e579",
        "#f4e001",
        "#f0805a",
        "#26c0c0",
    ],
    borderColor: "#ccc",
    borderWidth: 0,
    visualMapColor: ["#c1232b", "#fcce10"],
    legendTextColor: "#333333",
    kColor: "#c1232b",
    kColor0: "#b5c334",
    kBorderColor: "#c1232b",
    kBorderColor0: "#b5c334",
    kBorderWidth: 1,
    lineWidth: "3",
    symbolSize: "5",
    symbol: "emptyCircle",
    symbolBorderWidth: 1,
    lineSmooth: false,
    graphLineWidth: 1,
    graphLineColor: "#aaaaaa",
    mapLabelColor: "#c1232b",
    mapLabelColorE: "rgb(100,0,0)",
    mapBorderColor: "#eeeeee",
    mapBorderColorE: "#444",
    mapBorderWidth: 0.5,
    mapBorderWidthE: 1,
    mapAreaColor: "#dddddd",
    mapAreaColorE: "#fe994e",
    axes: [
        {
            type: "all",
            name: "通用坐标轴",
            axisLineShow: true,
            axisLineColor: "#333",
            axisTickShow: true,
            axisTickColor: "#333",
            axisLabelShow: true,
            axisLabelColor: "#333",
            splitLineShow: true,
            splitLineColor: ["#ccc"],
            splitAreaShow: false,
            splitAreaColor: ["rgba(250,250,250,0.3)", "rgba(200,200,200,0.3)"],
        },
        {
            type: "category",
            name: "类目坐标轴",
            axisLineShow: true,
            axisLineColor: "#27727b",
            axisTickShow: true,
            axisTickColor: "#27727b",
            axisLabelShow: true,
            axisLabelColor: "#333",
            splitLineShow: false,
            splitLineColor: ["#ccc"],
            splitAreaShow: false,
            splitAreaColor: ["rgba(250,250,250,0.3)", "rgba(200,200,200,0.3)"],
        },
        {
            type: "value",
            name: "数值坐标轴",
            axisLineShow: false,
            axisLineColor: "#333",
            axisTickShow: false,
            axisTickColor: "#333",
            axisLabelShow: true,
            axisLabelColor: "#333",
            splitLineShow: true,
            splitLineColor: ["#ccc"],
            splitAreaShow: false,
            splitAreaColor: ["rgba(250,250,250,0.3)", "rgba(200,200,200,0.3)"],
        },
        {
            type: "log",
            name: "对数坐标轴",
            axisLineShow: true,
            axisLineColor: "#27727b",
            axisTickShow: true,
            axisTickColor: "#333",
            axisLabelShow: true,
            axisLabelColor: "#333",
            splitLineShow: true,
            splitLineColor: ["#ccc"],
            splitAreaShow: false,
            splitAreaColor: ["rgba(250,250,250,0.3)", "rgba(200,200,200,0.3)"],
        },
        {
            type: "time",
            name: "时间坐标轴",
            axisLineShow: true,
            axisLineColor: "#27727b",
            axisTickShow: true,
            axisTickColor: "#333",
            axisLabelShow: true,
            axisLabelColor: "#333",
            splitLineShow: true,
            splitLineColor: ["#ccc"],
            splitAreaShow: false,
            splitAreaColor: ["rgba(250,250,250,0.3)", "rgba(200,200,200,0.3)"],
        },
    ],
    axisSeperateSetting: true,
    toolboxColor: "#c1232b",
    toolboxEmphasisColor: "#e87c25",
    tooltipAxisColor: "#27727b",
    tooltipAxisWidth: 1,
    timelineLineColor: "#293c55",
    timelineLineWidth: 1,
    timelineItemColor: "#27727b",
    timelineItemColorE: "#72d4e0",
    timelineCheckColor: "#c1232b",
    timelineCheckBorderColor: "#c23531",
    timelineItemBorderWidth: 1,
    timelineControlColor: "#27727b",
    timelineControlBorderColor: "#27727b",
    timelineControlBorderWidth: 0.5,
    timelineLabelColor: "#293c55",
    datazoomBackgroundColor: "rgba(0,0,0,0)",
    datazoomDataColor: "rgba(181,195,52,0.3)",
    datazoomFillColor: "rgba(181,195,52,0.2)",
    datazoomHandleColor: "#27727b",
    datazoomHandleWidth: "100",
    datazoomLabelColor: "#999999",
};

export const themeChartDark = {
    seriesCnt: "4",
    backgroundColor: "rgba(0,0,0,0)",
    contrastColor: "#fafaf9",
    titleColor: "#eeeeee",
    subtitleColor: "#aaaaaa",
    textColorShow: false,
    textColor: "#333",
    markTextColor: "#eeeeee",
    color: [
        "#dd6b66",
        "#759aa0",
        "#e69d87",
        "#8dc1a9",
        "#ea7e53",
        "#eedd78",
        "#73a373",
        "#73b9bc",
        "#7289ab",
        "#91ca8c",
        "#f49f42",
    ],
    borderColor: "#ccc",
    borderWidth: 0,
    visualMapColor: ["#bf444c", "#d88273", "#f6efa6"],
    legendTextColor: "#eeeeee",
    kColor: "#fd1050",
    kColor0: "#0cf49b",
    kBorderColor: "#fd1050",
    kBorderColor0: "#0cf49b",
    kBorderWidth: 1,
    lineWidth: 2,
    symbolSize: 4,
    symbol: "circle",
    symbolBorderWidth: 1,
    lineSmooth: false,
    graphLineWidth: 1,
    graphLineColor: "#aaaaaa",
    mapLabelColor: "#000",
    mapLabelColorE: "rgb(100,0,0)",
    mapBorderColor: "#444",
    mapBorderColorE: "#444",
    mapBorderWidth: 0.5,
    mapBorderWidthE: 1,
    mapAreaColor: "#eee",
    mapAreaColorE: "rgba(255,215,0,0.8)",
    axes: [
        {
            type: "all",
            name: "通用坐标轴",
            axisLineShow: true,
            axisLineColor: "#eeeeee",
            axisTickShow: true,
            axisTickColor: "#eeeeee",
            axisLabelShow: true,
            axisLabelColor: "#eeeeee",
            splitLineShow: true,
            splitLineColor: ["#aaaaaa"],
            splitAreaShow: false,
            splitAreaColor: ["#eeeeee"],
        },
        {
            type: "category",
            name: "类目坐标轴",
            axisLineShow: true,
            axisLineColor: "#333",
            axisTickShow: true,
            axisTickColor: "#333",
            axisLabelShow: true,
            axisLabelColor: "#333",
            splitLineShow: false,
            splitLineColor: ["#ccc"],
            splitAreaShow: false,
            splitAreaColor: ["rgba(250,250,250,0.3)", "rgba(200,200,200,0.3)"],
        },
        {
            type: "value",
            name: "数值坐标轴",
            axisLineShow: true,
            axisLineColor: "#333",
            axisTickShow: true,
            axisTickColor: "#333",
            axisLabelShow: true,
            axisLabelColor: "#333",
            splitLineShow: true,
            splitLineColor: ["#ccc"],
            splitAreaShow: false,
            splitAreaColor: ["rgba(250,250,250,0.3)", "rgba(200,200,200,0.3)"],
        },
        {
            type: "log",
            name: "对数坐标轴",
            axisLineShow: true,
            axisLineColor: "#333",
            axisTickShow: true,
            axisTickColor: "#333",
            axisLabelShow: true,
            axisLabelColor: "#333",
            splitLineShow: true,
            splitLineColor: ["#ccc"],
            splitAreaShow: false,
            splitAreaColor: ["rgba(250,250,250,0.3)", "rgba(200,200,200,0.3)"],
        },
        {
            type: "time",
            name: "时间坐标轴",
            axisLineShow: true,
            axisLineColor: "#333",
            axisTickShow: true,
            axisTickColor: "#333",
            axisLabelShow: true,
            axisLabelColor: "#333",
            splitLineShow: true,
            splitLineColor: ["#ccc"],
            splitAreaShow: false,
            splitAreaColor: ["rgba(250,250,250,0.3)", "rgba(200,200,200,0.3)"],
        },
    ],
    axisSeperateSetting: false,
    toolboxColor: "#999999",
    toolboxEmphasisColor: "#666666",
    tooltipAxisColor: "#eeeeee",
    tooltipAxisWidth: "1",
    timelineLineColor: "#eeeeee",
    timelineLineWidth: 1,
    timelineItemColor: "#dd6b66",
    timelineItemColorE: "#a9334c",
    timelineCheckColor: "#e43c59",
    timelineCheckBorderColor: "#c23531",
    timelineItemBorderWidth: 1,
    timelineControlColor: "#eeeeee",
    timelineControlBorderColor: "#eeeeee",
    timelineControlBorderWidth: 0.5,
    timelineLabelColor: "#eeeeee",
    datazoomBackgroundColor: "rgba(47,69,84,0)",
    datazoomDataColor: "rgba(255,255,255,0.3)",
    datazoomFillColor: "rgba(167,183,204,0.4)",
    datazoomHandleColor: "#a7b7cc",
    datazoomHandleWidth: "100",
    datazoomLabelColor: "#eeeeee",
};

export const getDataSeries = (
    config: ICharts,
    data: QueryResult | null
): { dataX: (string | number | null)[]; dataY: IDataSeries } => {
    if (config.selectedChart === "pie") {
        const dataX = data?.map((item) => item[config.xaxis.value]) ?? [];
        const newSeries = [];
        if (config.label.show) {
            newSeries.push({
                type: "pie",
                data: data?.map((item) => {
                    return {
                        value: item[config.yaxis.value] ?? null,
                        name: item[config.xaxis.value] ?? "",
                    };
                }),
                label: {
                    show: config.label.show,
                    position: "inside",
                    formatter: "{d}%",
                },
            });
        }
        const dataY = [
            {
                type: "pie",
                data: data?.map((item) => {
                    return {
                        value: item[config.yaxis.value] ?? null,
                        name: item[config.xaxis.value] ?? "",
                    };
                }),
            },
            ...newSeries,
        ];
        return {
            dataX,
            dataY,
        };
    }
    if (config.group.value) {
        const uniqueX = Array.from(
            new Set(data?.map((x) => x[config.xaxis.value]))
        );
        const uniqueY = Object.fromEntries(
            Array.from(
                new Set(data?.map((item) => item[config.group.value]))
            ).map((key) => [key, Array(uniqueX.length).fill(null)])
        );

        for (const x of data ?? []) {
            const dataIndex = uniqueX.indexOf(x[config.xaxis.value]);
            if (dataIndex !== -1) {
                uniqueY[x[config.group.value]][dataIndex] =
                    x[config.yaxis.value];
            }
        }

        const dataS = Object.keys(uniqueY).map((item) => {
            return {
                type:
                    config.selectedChart === "area"
                        ? "line"
                        : config.selectedChart,
                data: uniqueY[item].map((xx, index) => [uniqueX[index], xx]),
                name: item,
                areaStyle: config.selectedChart === "area" ? {} : undefined,
                smooth: true,
                stack: config.stacked ? config.yaxis.value : undefined,
                label: { show: config.label.show },
            };
        });

        if (config.normalized) {
            const totalPerCol = dataS.reduce((acc: number[], obj) => {
                if (Array.isArray(obj.data)) {
                    obj.data.forEach((value, index) => {
                        acc[index] = (acc[index] || 0) + (value[1] ?? 0);
                    });
                }
                return acc;
            }, []);
            return {
                dataX: uniqueX,
                dataY: dataS.map((item) => {
                    if (Array.isArray(item.data)) {
                        const changeResult = item.data.map((x, index) => [
                            x[0],
                            x[1] / totalPerCol[index],
                        ]);
                        return {
                            ...item,
                            data: changeResult,
                        };
                    } else return item;
                }),
            };
        }
        return {
            dataX: uniqueX,
            dataY: dataS,
        };
    }

    if (config.y2axis.value) {
        const dataX = data?.map((item) => item[config.xaxis.value]) ?? [];
        const dataY = [
            {
                type:
                    config.selectedChart === "area"
                        ? "line"
                        : config.selectedChart,
                data:
                    data?.map((item, index) => [
                        dataX[index],
                        item[config.yaxis.value],
                    ]) ?? [],
                name: config.yaxis.value,
                areaStyle: config.selectedChart === "area" ? {} : undefined,
                smooth: true,
                stack: config.stacked ? config.yaxis.value : undefined,
                label: { show: config.label.show },
            },
            {
                type:
                    config.y2axis.chart === "area"
                        ? "line"
                        : config.y2axis.chart,
                data:
                    data?.map((item, index) => [
                        dataX[index],
                        item[config.y2axis.value],
                    ]) ?? [],
                name: config.y2axis.value,
                areaStyle: config.y2axis.chart === "area" ? {} : undefined,
                smooth: true,
                yAxisIndex: 1,
                stack: config.stacked ? config.y2axis.value : undefined,
                label: { show: config.label.show },
            },
        ];
        return {
            dataX,
            dataY,
        };
    }

    if (config.yaxis.value) {
        const dataX = data?.map((item) => item[config.xaxis.value]) ?? [];
        const dataY = [
            {
                type:
                    config.selectedChart === "area"
                        ? "line"
                        : config.selectedChart,
                data:
                    data?.map((item, index) => [
                        dataX[index],
                        item[config.yaxis.value],
                    ]) ?? [],
                name: config.yaxis.value,
                areaStyle: config.selectedChart === "area" ? {} : undefined,
                smooth: true,
                stack: config.stacked ? config.yaxis.value : undefined,
                label: { show: config.label.show },
            },
        ];
        return {
            dataX,
            dataY,
        };
    }

    return {
        dataX: data?.map((item) => item[config.xaxis.value]) ?? [],
        dataY: [],
    };
};

export const currentDateTime = new Date()
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");

export const buildSlug = (text: string) => {
    const a = text.trim().replace(/\s+/g, " ");
    const b = a
        .toLowerCase()
        .replace(/ /g, "-")
        .replace(/[^\w-]+/g, "");
    return b;
};
