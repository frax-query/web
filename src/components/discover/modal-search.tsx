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

export const ModalSearch = () => {
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
                    <CommandInput placeholder="Type a command or search..." />
                    <CommandList>
                        <CommandEmpty>No results found.</CommandEmpty>
                        <CommandGroup heading="Dashboards">
                            {Array(200)
                                .fill(0)
                                .map((item, index) => {
                                    return (
                                        <CommandItem key={`dashboard-${index}`}>
                                            <DashboardIcon className="mr-2 h-4 w-4" />
                                            <div className="flex w-full items-center justify-between">
                                                <div>
                                                    <div>
                                                        Uniswap V2 and V3
                                                        Volumes
                                                    </div>
                                                    <p className="line-clamp-1 text-xs text-muted-foreground">
                                                        Lorem ipsum dolor sit
                                                        amet, consectetur
                                                        adipiscing elit, sed do
                                                        eiusmod tempor
                                                        incididunt ut labore et
                                                        dolore magna aliqua. Ut
                                                        enim ad minim veniam,
                                                        quis nostrud
                                                        exercitation ullamco
                                                        laboris nisi ut aliquip
                                                        ex ea commodo consequat.
                                                        Duis aute irure dolor in
                                                        reprehenderit in
                                                        voluptate velit esse
                                                        cillum dolore eu fugiat
                                                        nulla pariatur.
                                                        Excepteur sint occaecat
                                                        cupidatat non proident,
                                                        sunt in culpa qui
                                                        officia deserunt mollit
                                                        anim id est laborum{" "}
                                                        {index}
                                                    </p>
                                                </div>
                                                {/* <div>oke gan disana</div> */}
                                            </div>
                                        </CommandItem>
                                    );
                                })}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </DialogContent>
        </Dialog>
    );
};

export default ModalSearch;
