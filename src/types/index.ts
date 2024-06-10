export * from "./store";

type DynamicObject = {
    [key: string]: string;
};

export type QueryResult = DynamicObject[];

export type ResponseData<T> = {
    data: T;
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
    DatasetComponentOption,
    LegendComponentOption,
    TitleComponentOption,
    TooltipComponentOption,
} from "echarts/components";

export type EChartsOption = echarts.ComposeOption<
    | DatasetComponentOption
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
        type: "category" | "time";
    };
    yaxis: {
        value: string;
        show: boolean;
        type: "value";
        formatType: "number" | "percentage" | "usd";
        format: "standard" | "compact";
        formatter:
            | ((value: string | number | null) => string | number | null)
            | undefined;
    };
    y2axis: {
        value: string;
        show: boolean;
        type: "value";
        formatType: "number" | "percentage" | "usd";
        format: "standard" | "compact";
        formatter:
            | ((value: string | number | null) => string | number | null)
            | undefined;
        chart: IAllCharts;
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
        show: boolean;
    };
    label: {
        show: boolean;
        formatter:
            | ((params: {
                  name: string;
                  value: number | string | null;
              }) => string | number | null)
            | undefined;
    };
    selectedChart: IAllCharts;
    metricConfig: {
        value: string;
        compareValue: string;
        textCompare: string;
    };
    stacked: boolean;
    normalized: boolean;
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

export interface IDataMetrics {
    value: number | string | null | undefined;
    textValue: string;
    compareValue: number | string | null | undefined;
}

export interface ITableQuery {
    id: string;
    update_at: string;
    query: string;
    title: string;
    user_id: string;
    created_at: string;
}

export interface ITableCharts {
    id: string;
    updated_at?: string;
    config: string;
    query_id: string;
}

export type DeviceMode = "Desktop" | "Tablet" | "Smartphone";
export type DeviceModeSize = {
    [key in DeviceMode]: string;
};

export type CardType = "text" | "chart";

export interface IDataDashboard {
    type: CardType;
    id: string;
    value: string;
}

export interface ITableDashboard {
    id: string;
    updated_at: string;
    title: string;
    description: string;
    layouts: string;
    data: string;
    user_id: string;
    title_slug: string;
    views: string;
    likes: string;
}
