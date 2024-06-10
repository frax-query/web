"use client";

import type { IDataDashboard } from "@/types";
import { useMemo, useState } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import { Card } from "../ui/card";
import { CardText } from "@/components/detail-dashboard/CardText";
import { CardChart } from "@/components/detail-dashboard/CardChart";
const ResponsiveGridLayout = WidthProvider(Responsive);

interface ILayoutChart {
    layouts: ReactGridLayout.Layouts;
    data: IDataDashboard[];
    title: string;
    description: string;
}

export const LayoutDashboardDetail: React.FC<ILayoutChart> = ({
    layouts,
    data,
    title,
    description,
}) => {
    const [breakpoint, setBreakpoint] = useState("lg");

    const handleBreakpointChange = (e: string) => {
        setBreakpoint(e);
    };

    const listGrid = useMemo(() => {
        return layouts[breakpoint];
    }, [breakpoint, layouts]);

    return (
        <div>
            <div className="border-x border-b p-4">
                <div className="mx-auto max-w-[1800px]">
                    <div className="text-balance text-3xl font-semibold leading-tight tracking-tighter">
                        {title}
                    </div>
                    <div className="text-muted-foreground">{description}</div>
                </div>
            </div>
            <div className="min-h-screen border-x bg-muted p-4">
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
                    isResizable={false}
                    isDraggable={false}
                    rowHeight={10}
                    margin={[5, 5]}
                    onBreakpointChange={handleBreakpointChange}
                >
                    {listGrid.map((item) => {
                        const typeCard =
                            data.filter((x) => x.id === item.i)[0].type ?? "";
                        if (typeCard) {
                            if (typeCard === "text")
                                return (
                                    <div key={item.i} data-grid={item}>
                                        <CardText data={data} id={item.i} />
                                    </div>
                                );
                            else
                                return (
                                    <div key={item.i} data-grid={item}>
                                        <CardChart
                                            id={item.i}
                                            query_id={
                                                data.filter(
                                                    (x) => x.id === item.i
                                                )[0].value
                                            }
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
