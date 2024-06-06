"use client";

import type { DeviceMode, DeviceModeSize, IDataDashboard } from "@/types";
import type { Dispatch, SetStateAction } from "react";
import { Responsive, WidthProvider } from "react-grid-layout";
import { Card } from "../ui/card";
import { CardText } from "./CardText";
import { CardChart } from "./CardChart";
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

export const LayoutChart: React.FC<ILayoutChart> = ({
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
