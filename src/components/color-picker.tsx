"use client";

import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { colors } from "@/lib/utils";

export const ColorPicker = () => {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <button className="rounded-md border p-2">
                    <div className="aspect-square w-4 rounded-md bg-primary"></div>
                </button>
            </PopoverTrigger>
            <PopoverContent side="left" className="max-w-[80px]" align="end">
                <div className="grid grid-cols-2 gap-2">
                    {colors
                        .map((x) => `bg-[${x}]`)
                        .map((item) => {
                            return (
                                <button
                                    className={`${item} h-4 w-4 rounded-md`}
                                    key={`color-picker-${item}`}
                                ></button>
                            );
                        })}
                </div>
            </PopoverContent>
        </Popover>
    );
};
