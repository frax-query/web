"use client";

import { RiSearchLine } from "@remixicon/react";
import { Trash2Icon, PackageOpenIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export const ListQuery = () => {
    return (
        <div className="space-y-4 p-4">
            <div className="relative ml-auto">
                <RiSearchLine className="lucide lucide-search absolute left-2.5 top-2 h-3 w-3 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Search query"
                    className="h-7 w-full px-8 text-xs"
                />
            </div>
            <div className="flex items-center justify-between">
                <div className="text-muted-foreground">Your Queries</div>
                <div className="flex items-center">
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                        <Trash2Icon
                            className="stroke-muted-foreground"
                            size={14}
                        />
                    </Button>
                    {/* <Button variant="ghost" size="icon" className="h-6 w-6">
                        <SquarePlusIcon size={14} />
                    </Button> */}
                </div>
            </div>
            <div className="flex h-52 flex-col items-center justify-center gap-2">
                <PackageOpenIcon
                    size={46}
                    className="stroke-muted-foreground stroke-1"
                />
                <div className="text-muted-foreground">Empty Query</div>
                {/* <Button variant="secondary" className="h-6 text-xs">
                    Create new query
                </Button> */}
            </div>
        </div>
    );
};
