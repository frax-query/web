"use client";

import { RiSearchLine } from "@remixicon/react";
import { PackageOpenIcon, SquarePlusIcon, Trash2Icon } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import type { ITableCharts, ITableQuery } from "@/types";
import { Checkbox } from "../ui/checkbox";
import type { Dispatch, SetStateAction } from "react";
import { useCallback, useState } from "react";
import { Skeleton } from "../ui/skeleton";
// import Link from "next/link";
import { ScrollArea } from "../ui/scroll-area";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../ui/dialog";
import { PulseLoading } from "../pulse-loading";
// import { v4 as uuidv4 } from "uuid";

export const ListQuery: React.FC<{
    listQuery: (ITableQuery & { charts: ITableCharts[] })[];
    loading: boolean;
    queryDetail: (ITableQuery & { charts: ITableCharts[] }) | null;
    addNewQuery: () => void;
    handleChangeQuery: (e: string) => void;
    deleteQuery: (ids: string[]) => Promise<string>;
}> = ({
    listQuery,
    loading,
    queryDetail,
    addNewQuery,
    handleChangeQuery,
    deleteQuery,
}) => {
    const [selectedQuery, setSelectedQuery] = useState<string[]>([]);

    const handleSelectedQuery = useCallback(
        (e: boolean, id: string) => {
            setSelectedQuery((prev) => {
                const newArr = [...prev];
                if (e) return [...newArr, id];
                return newArr.filter((x) => x !== id);
            });
        },
        [setSelectedQuery]
    );

    return (
        <div className="h-full space-y-4 p-4">
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
                    <DeleteQueryModal
                        selectedQuery={selectedQuery}
                        deleteQuery={deleteQuery}
                        setSelectedQuery={setSelectedQuery}
                    />
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        disabled={loading}
                        onClick={() => addNewQuery()}
                    >
                        <SquarePlusIcon size={14} />
                    </Button>
                </div>
            </div>
            <ScrollArea className="h-[calc(100%_-_75px)] space-y-1 py-1">
                <div className="space-y-1">
                    {loading &&
                        Array(10)
                            .fill(0)
                            .map((_, i) => i + 1)
                            .map((item) => {
                                return (
                                    <Skeleton
                                        className="h-[28px] w-full"
                                        key={`loading-list-query-${item}`}
                                    />
                                );
                            })}
                    {!loading &&
                        listQuery.map((item) => {
                            return (
                                <div
                                    key={item.id}
                                    className={`flex items-center gap-2 rounded-md p-1 ${queryDetail?.id !== item.id ? "text-muted-foreground" : "font-semibold"} transition-all hover:bg-accent hover:text-foreground`}
                                >
                                    <Checkbox
                                        checked={selectedQuery.includes(
                                            item.id
                                        )}
                                        onCheckedChange={(e) =>
                                            handleSelectedQuery(
                                                e as boolean,
                                                item.id
                                            )
                                        }
                                    />
                                    <button
                                        className="truncate"
                                        onClick={() =>
                                            handleChangeQuery(item.id)
                                        }
                                    >
                                        {item.title}
                                    </button>
                                </div>
                            );
                        })}
                    {!loading && listQuery.length === 0 && (
                        <div className="flex h-52 flex-col items-center justify-center gap-2">
                            <PackageOpenIcon
                                size={46}
                                className="stroke-muted-foreground stroke-1"
                            />
                            <div className="text-muted-foreground">
                                Empty Query
                            </div>
                        </div>
                    )}
                </div>
            </ScrollArea>
        </div>
    );
};

const DeleteQueryModal: React.FC<{
    selectedQuery: string[];
    deleteQuery: (e: string[]) => Promise<string>;
    setSelectedQuery: Dispatch<SetStateAction<string[]>>;
}> = ({ selectedQuery, deleteQuery, setSelectedQuery }) => {
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const handleDeleteQuery = useCallback(async () => {
        setLoading(true);
        const res = await deleteQuery(selectedQuery);
        if (!res) setSelectedQuery([]);
        setLoading(false);
        setOpen(false);
    }, [selectedQuery, deleteQuery]);
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    disabled={selectedQuery.length === 0}
                >
                    <Trash2Icon size={14} />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Are you sure delete query(s) ?</DialogTitle>
                    <DialogDescription>
                        This action cannot be undone. This will permanently
                        delete your query on our server.
                    </DialogDescription>
                    <DialogFooter className="grid grid-cols-2">
                        <DialogClose asChild>
                            <Button
                                type="button"
                                variant="secondary"
                                disabled={loading}
                            >
                                Close
                            </Button>
                        </DialogClose>
                        <Button
                            variant="destructive"
                            className="flex gap-1"
                            disabled={loading}
                            onClick={() => handleDeleteQuery()}
                        >
                            {loading && <PulseLoading />}
                            <div>Delete</div>
                        </Button>
                    </DialogFooter>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
};
