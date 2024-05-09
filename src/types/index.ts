export * from "./store";

type DynamicObject = {
    [key: string]: string;
};

export type QueryResult = DynamicObject[];

export type ResponseData = {
    data: QueryResult | null;
    message: string;
    isError: boolean;
};

export type BodyRequestGetQuery = {
    query: string;
    queryId: string;
};

export interface IOrderListItem {
    label: string;
    value: string;
}

export interface IPropsComboBoxOrder {
    orderList: IOrderListItem[];
    defaultValue: string;
}
import type * as echarts from "echarts/core";
import type {
    BarSeriesOption,
    LineSeriesOption,
    ScatterSeriesOption,
    PieSeriesOption,
} from "echarts/charts";
import type {
    LegendComponentOption,
    TitleComponentOption,
    TooltipComponentOption,
} from "echarts/components";

export type EChartsOption = echarts.ComposeOption<
    | TitleComponentOption
    | TooltipComponentOption
    | LegendComponentOption
    | BarSeriesOption
    | LineSeriesOption
    | ScatterSeriesOption
    | PieSeriesOption
>;

export interface ICharts {
    xaxis: {
        value: string;
        show: boolean;
        type: "value" | "category" | "time";
    };
    yaxis: {
        value: string;
        show: boolean;
        type: "value" | "category" | "time";
        curencySymbol: "$";
        format: "standard" | "compact";
        formatter: (value: string | number | null) => string;
    };
    y2axis: {
        value: string;
        show: boolean;
        type: "value" | "category" | "time";
        curencySymbol: "$";
        format: "standard" | "compact";
        formatter: (value: string | number | null) => string;
    };
    group: {
        value: string;
    };
    legend: {
        show: boolean;
        position: "center" | "left" | "right";
    };
    title: {
        value: string;
        position: "center" | "left" | "right";
    };
    selectedChart: IAllCharts;
}

export type IDataSeries = echarts.ComposeOption<
    BarSeriesOption | LineSeriesOption | ScatterSeriesOption | PieSeriesOption
>[];

export type IAllCharts = "bar" | "area" | "line" | "scatter" | "pie" | "metric";

export interface IListCharts {
    id: number;
    value: IAllCharts;
    name: string;
    icon: JSX.Element;
}
