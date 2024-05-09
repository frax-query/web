import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { createClient } from "@clickhouse/client";
import type { EChartsOption, ICharts, IDataSeries } from "@/types";

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

export const optionCharts = (
    config: ICharts,
    dataX: (string | number | null)[],
    dataSeries: IDataSeries
): EChartsOption => {
    return {
        tooltip: {
            trigger: "axis",
            axisPointer: {
                type: "cross",
            },
        },
        title: {
            text: config.title.value,
            top: "top",
            left: config.title.position,
        },
        legend: {
            show: config.legend.show,
            left: config.legend.position,
            bottom: "bottom",
            orient: "horizontal",
            type: "scroll",
        },
        xAxis: [
            {
                type: config.xaxis.type,
                showGrid: false,
                data: dataX,
                show:
                    config.selectedChart === "pie" ? false : config.xaxis.show,
                splitLine: {
                    show: false,
                },
                axisPointer: {
                    type: "shadow",
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
    title: {
        position: "center",
        value: "Your beautiful chart",
    },
    xaxis: {
        show: true,
        type: "category",
        value: "",
    },
    yaxis: {
        show: true,
        curencySymbol: "$",
        format: "standard",
        type: "value",
        value: "",
        formatter: (v: number | string | null) => {
            return v as string;
        },
    },
    y2axis: {
        show: true,
        curencySymbol: "$",
        format: "standard",
        type: "value",
        value: "",
        formatter: (v: number | string | null) => {
            return v as string;
        },
    },
    selectedChart: "bar",
};
