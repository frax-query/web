"use client";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DashboardIcon, FrameIcon } from "@radix-ui/react-icons";

import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
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
                            <CommandItem>
                                <DashboardIcon className="mr-2 h-4 w-4" />
                                <span>Calendar</span>
                            </CommandItem>
                            <CommandItem>
                                <DashboardIcon className="mr-2 h-4 w-4" />
                                <span>Search Emoji</span>
                            </CommandItem>
                            <CommandItem>
                                <DashboardIcon className="mr-2 h-4 w-4" />
                                <span>Launch</span>
                            </CommandItem>
                        </CommandGroup>
                        <CommandSeparator />
                        <CommandGroup heading="Queries">
                            <CommandItem>
                                <FrameIcon className="mr-2 h-4 w-4" />
                                <span>Profile</span>
                                <CommandShortcut>⌘P</CommandShortcut>
                            </CommandItem>
                            <CommandItem>
                                <FrameIcon className="mr-2 h-4 w-4" />
                                <span>Mail</span>
                                <CommandShortcut>⌘B</CommandShortcut>
                            </CommandItem>
                            <CommandItem>
                                <FrameIcon className="mr-2 h-4 w-4" />
                                <span>Settings</span>
                                <CommandShortcut>⌘S</CommandShortcut>
                            </CommandItem>
                        </CommandGroup>
                    </CommandList>
                </Command>
            </DialogContent>
        </Dialog>
    );
};

export default ModalSearch;
