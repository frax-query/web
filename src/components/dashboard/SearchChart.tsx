"use client";

import type { CardType, ICharts, IListCharts, ITableCharts } from "@/types";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import {
    AreaChartIcon,
    BarChart3Icon,
    CaseSensitiveIcon,
    LineChartIcon,
    PieChartIcon,
    ScatterChartIcon,
} from "lucide-react";
import { useState } from "react";
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "../ui/command";

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
export const SearchChart: React.FC<ISearchChart> = ({
    listCharts,
    handleAddCard,
    layouts,
}) => {
    const [open, setOpen] = useState(false);
    return (
        <>
            <DropdownMenuItem
                className="flex items-center gap-2 px-2 py-1.5"
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
