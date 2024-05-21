"use client";

import { Separator } from "@radix-ui/react-separator";
import { AlignLeftIcon, SquareTerminalIcon } from "lucide-react";
import { PulseLoading } from "../pulse-loading";
import { Button } from "../ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "../ui/tooltip";

export const HeaderCodeEditor: React.FC<{
    setTitle: (e: string) => void;
    formatCode: () => void;
    runQuery: (query: string | undefined) => Promise<void>;
    loading: boolean;
    loadingCancel: boolean;
    query: string | undefined;
    cancelQuery: () => Promise<void>;
    title: string;
    saveDataQuery: () => Promise<void>;
    loadingSave: boolean;
}> = ({
    setTitle,
    formatCode,
    runQuery,
    loading,
    loadingCancel,
    query,
    cancelQuery,
    title,
    saveDataQuery,
    loadingSave,
}) => {
    return (
        <div className="grid grid-cols-2 border-b p-4">
            <div
                className="text-md w-[50%] truncate whitespace-nowrap font-semibold"
                contentEditable={true}
                onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
                onFocus={(e) =>
                    e.currentTarget.classList.remove(
                        "whitespace-nowrap",
                        "truncate"
                    )
                }
                onBlur={(e) => {
                    const text = e.currentTarget.textContent;
                    if (text) setTitle(text);
                    else setTitle("new query");
                    e.currentTarget.classList.add(
                        "whitespace-nowrap",
                        "truncate"
                    );
                }}
            >
                {title}
            </div>
            <div className="flex h-full items-center justify-end gap-2">
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
                <Separator orientation="vertical" className="mr-2" />
                {!loading && !loadingCancel && (
                    <Button
                        className="h-6 text-sm"
                        onClick={() => runQuery(query)}
                    >
                        Run
                    </Button>
                )}
                {(loading || loadingCancel) && (
                    <Button
                        className="flex h-6 items-center gap-2 text-sm"
                        variant="destructive"
                        onClick={() => cancelQuery()}
                        disabled={loadingCancel}
                    >
                        {loadingCancel && <PulseLoading />}
                        Cancel
                    </Button>
                )}
                <Button
                    className="flex h-6 items-center gap-2 text-sm"
                    variant="outline"
                    onClick={saveDataQuery}
                    disabled={loadingSave}
                >
                    {loadingSave && <PulseLoading />}
                    Save
                </Button>
            </div>
        </div>
    );
};
