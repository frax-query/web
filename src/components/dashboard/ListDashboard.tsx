"use client";

import type { ITableDashboard } from "@/types";
import { LayoutDashboardIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "../ui/command";

interface IListdashboard {
    data: ITableDashboard[];
    getAllDashboard: () => Promise<void>;
    createNewDashboard: () => void;
    loadDashboard: (id: string) => Promise<void>;
}
export const ListDashboard: React.FC<IListdashboard> = ({
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
