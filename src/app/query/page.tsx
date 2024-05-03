"use client";

import { Input } from "@/components/ui/input";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable";
import {
    AlignLeftIcon,
    ChevronRightIcon,
    DatabaseZapIcon,
    PackageOpenIcon,
    SquarePlusIcon,
    SquareTerminalIcon,
    TableIcon,
    Trash2Icon,
    Type,
} from "lucide-react";
import { RiSearchLine } from "@remixicon/react";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { MonacoEditor } from "@/components/code-editor";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { schema_tables } from "@/components/sql";
import { Badge } from "@/components/ui/badge";

export default function Query() {
    const [formatCode, setFormatCode] = useState(() => () => {});

    return (
        <div className="mx-auto h-[calc(100vh_-_65px)] max-w-[1800px]">
            <div className="flex h-full text-sm">
                <div className="w-80 flex-none border-r">
                    <ResizablePanelGroup direction="vertical">
                        <ResizablePanel>
                            <ListQuery />
                        </ResizablePanel>
                        <ResizableHandle withHandle={true} />
                        <ResizablePanel>
                            <DatabaseSchema />
                        </ResizablePanel>
                    </ResizablePanelGroup>
                </div>
                <div className="flex-1 border-r">
                    <ResizablePanelGroup direction="vertical">
                        <div className="flex items-center justify-between border-b p-4">
                            <div>ini title</div>
                            <div className="flex h-full items-center gap-2">
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-6 w-6"
                                                onClick={formatCode}
                                            >
                                                <AlignLeftIcon size={16} />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent className="bg-accent">
                                            Prettify SQL
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-6 w-6"
                                                onClick={formatCode}
                                            >
                                                <SquareTerminalIcon size={16} />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent className="bg-accent">
                                            SQL Syntax
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                                <Separator
                                    orientation="vertical"
                                    className="mr-2"
                                />
                                <Button className="h-6 text-sm">Run</Button>
                                <Button
                                    className="h-6 text-sm"
                                    variant="outline"
                                >
                                    Save
                                </Button>
                            </div>
                        </div>
                        <ResizablePanel>
                            <MonacoEditor setFormatCode={setFormatCode} />
                        </ResizablePanel>
                        <ResizableHandle withHandle={true} />
                        <ResizablePanel>
                            <ResultAndChartSection />
                        </ResizablePanel>
                    </ResizablePanelGroup>
                </div>
            </div>
        </div>
    );
}

const ResultAndChartSection = () => {
    return (
        <div className="h-full">
            <ScrollArea className="grid w-full whitespace-nowrap rounded-md border-b">
                <div className="flex w-max items-center px-4 py-3">
                    {Array.from(Array(4).keys()).map((item) => {
                        return (
                            <button
                                className={`truncate whitespace-nowrap rounded-md transition-all hover:text-foreground ${item === 0 ? "bg-muted text-foreground" : "text-muted-foreground"} w-40 shrink-0 px-4 py-1`}
                                key={item}
                            >
                                test 123123
                            </button>
                        );
                    })}
                </div>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
            <div className="h-full">
                <div className="bg-accent p-4 text-muted-foreground">
                    Click <Badge variant="default">Run</Badge> to execute query
                </div>
            </div>
        </div>
    );
};

const DatabaseSchema = () => {
    return (
        <div className="h-full space-y-1 p-4">
            <div className="text-muted-foreground">Database Schema</div>
            <ScrollArea className="h-[calc(100%_-_20px)] space-y-2 py-1">
                {Object.keys(schema_tables).map((item) => {
                    return (
                        <>
                            <div className="flex items-center gap-2">
                                <DatabaseZapIcon size={14} />
                                <div>{item}</div>
                            </div>
                            <div>
                                {Object.keys(schema_tables[item]).map(
                                    (item2) => {
                                        return (
                                            <TableSchema
                                                key={item2}
                                                tableName={item2}
                                                data={
                                                    schema_tables[item][item2]
                                                }
                                            />
                                        );
                                    }
                                )}
                            </div>
                        </>
                    );
                })}
            </ScrollArea>
        </div>
    );
};

const TableSchema: React.FC<{ data: string[]; tableName: string }> = ({
    data,
    tableName,
}) => {
    const [open, setOpen] = useState(false);
    return (
        <>
            <div
                className="flex items-center gap-2 rounded-md py-1 pl-5 hover:bg-accent"
                onClick={() => setOpen(!open)}
            >
                <ChevronRightIcon
                    className={`${open ? "rotate-[90deg]" : "rotate-[0deg]"} transition-all`}
                    size={14}
                />
                <div className="flex items-center gap-1">
                    <TableIcon size={14} />
                    <div>{tableName}</div>
                </div>
            </div>
            <div className={`${open ? "" : "hidden"}`}>
                {data.map((item) => {
                    return (
                        <div
                            className="flex items-center gap-2 px-2 py-1 pl-14 hover:bg-accent "
                            key={item + " " + tableName}
                        >
                            <Type size={14} />
                            <div>{item}</div>
                        </div>
                    );
                })}
            </div>
        </>
    );
};

const ListQuery = () => {
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
                    <Button variant="ghost" size="icon" className="h-6 w-6">
                        <SquarePlusIcon size={14} />
                    </Button>
                </div>
            </div>
            <div className="flex h-52 flex-col items-center justify-center gap-2">
                <PackageOpenIcon
                    size={46}
                    className="stroke-muted-foreground stroke-1"
                />
                <div className="text-muted-foreground">Empty Query</div>
                <Button variant="secondary" className="h-6 text-xs">
                    Create new query
                </Button>
            </div>
        </div>
    );
};
