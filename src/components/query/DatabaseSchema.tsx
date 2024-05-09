"use client";

import {
    ChevronRightIcon,
    DatabaseZapIcon,
    TableIcon,
    Type,
} from "lucide-react";
import { schema_tables } from "../sql";
import { ScrollArea } from "../ui/scroll-area";
import { useState } from "react";

export const DatabaseSchema = () => {
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
                            className="flex items-center gap-2 rounded-md px-2 py-1 pl-14 hover:bg-accent "
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
