"use client";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DashboardIcon } from "@radix-ui/react-icons";

import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { useDiscovery } from "@/hooks/useDiscovery";
import { useEffect, useState } from "react";
import type { ITableDashboard } from "@/types";
import { useDebounceValue } from "usehooks-ts";

export const ModalSearch = () => {
    const [listDashboard, setListDashboard] = useState<ITableDashboard[]>([]);
    const [debouncedValue, setValue] = useDebounceValue("", 500);

    const { searchDashboard } = useDiscovery();

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        (async () => {
            if (debouncedValue) {
                const res = await searchDashboard(debouncedValue, signal);
                setListDashboard(res);
            }
        })();

        return () => {
            controller.abort();
        };
    }, [debouncedValue]);

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost">Search Dashboard</Button>
            </DialogTrigger>
            <DialogContent className="top-[28%] border-none bg-transparent p-4 text-sm sm:top-[50%]">
                <Command
                    className="rounded-lg border shadow-md"
                    shouldFilter={false}
                >
                    <CommandInput
                        placeholder="Type a command or search..."
                        onValueChange={(e) => setValue(e)}
                    />
                    <CommandList>
                        <CommandEmpty>No results found.</CommandEmpty>
                        {listDashboard.length > 0 && (
                            <CommandGroup heading="Dashboards">
                                {listDashboard.map((item) => {
                                    return (
                                        <CommandItem
                                            key={`dashboard-serch-${item.title_slug}`}
                                        >
                                            <DashboardIcon className="mr-2 h-4 w-4" />
                                            <div className="flex w-full items-center justify-between">
                                                <div>
                                                    <div>{item.title}</div>
                                                    <p className="line-clamp-1 text-xs text-muted-foreground">
                                                        {item.description}
                                                    </p>
                                                </div>
                                            </div>
                                        </CommandItem>
                                    );
                                })}
                            </CommandGroup>
                        )}
                    </CommandList>
                </Command>
            </DialogContent>
        </Dialog>
    );
};

export default ModalSearch;
