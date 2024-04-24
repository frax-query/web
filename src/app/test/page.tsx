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
    TableIcon,
    Trash2Icon,
    Type,
} from "lucide-react";
import { RiSearchLine } from "@remixicon/react";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import Editor from "@monaco-editor/react";
import { useTheme } from "next-themes";

export default function Test() {
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
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6"
                                >
                                    <AlignLeftIcon size={14} />
                                </Button>
                                <Button className="h-6 text-sm">Run</Button>
                            </div>
                        </div>
                        <ResizablePanel>
                            <MonacoEditor />
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
        <div>
            <div className="flex items-center border-b px-4 py-3">
                {Array.from(Array(5).keys()).map((item) => {
                    return (
                        <button
                            className={`truncate whitespace-nowrap rounded-full transition-all hover:text-foreground ${item === 0 ? "bg-muted text-foreground" : "text-muted-foreground"} px-4 py-1`}
                            key={item}
                        >
                            test 123123
                        </button>
                    );
                })}
            </div>
            <div className="mt-4">this is the result</div>
        </div>
    );
};

const MonacoEditor = () => {
    const { theme } = useTheme();
    return (
        <Editor
            defaultLanguage="sql"
            defaultValue=""
            theme={`${theme === "light" ? "" : "vs-dark"}`}
        />
    );
};

const DatabaseSchema = () => {
    return (
        <div className="h-full space-y-1 p-4">
            <div className="text-muted-foreground">Database Schema</div>
            <ScrollArea className="h-[calc(100%_-_20px)] space-y-2 py-1">
                <div className="flex items-center gap-2">
                    <DatabaseZapIcon size={14} />
                    <div>viction_mainnet</div>
                </div>
                <div>
                    <TableSchema />
                    <TableSchema />
                    <TableSchema />
                    <TableSchema />
                </div>
            </ScrollArea>
        </div>
    );
};

const TableSchema = () => {
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
                    <div>transactions</div>
                </div>
            </div>
            <div className={`${open ? "" : "hidden"}`}>
                <div className="flex items-center gap-2 px-2 py-1 pl-14">
                    <span className="relative flex h-3 w-3">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-foreground opacity-75"></span>
                        <span className="relative inline-flex h-3 w-3 rounded-full bg-accent"></span>
                    </span>
                    <span className="text-muted-foreground">loading...</span>
                </div>
                <div className="flex items-center gap-2 px-2 py-1 pl-14 hover:bg-accent ">
                    <Type size={14} />
                    <div>transaction_index (String)</div>
                </div>
                <div className="flex items-center gap-2 px-2 py-1 pl-14 hover:bg-accent">
                    <Type size={14} />
                    <div>transaction_index (String)</div>
                </div>
                <div className="flex items-center gap-2 px-2 py-1 pl-14 hover:bg-accent">
                    <Type size={14} />
                    <div>transaction_index (String)</div>
                </div>
                <div className="flex items-center gap-2 px-2 py-1 pl-14 hover:bg-accent">
                    <Type size={14} />
                    <div>transaction_index (String)</div>
                </div>
                <div className="flex items-center gap-2 px-2 py-1 pl-14 hover:bg-accent">
                    <Type size={14} />
                    <div>transaction_index (String)</div>
                </div>
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
