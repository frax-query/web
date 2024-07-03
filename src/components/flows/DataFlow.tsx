"use client";

import { BookOpenTextIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../ui/table";
import { ScrollArea } from "../ui/scroll-area";

export const DataFlow = () => {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" className="flex items-center">
                    <BookOpenTextIcon className="mr-2 h-4 w-4" />
                    <div>Data Flow</div>
                </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-[600px]">
                <ScrollArea className="h-72">
                    <Table className="border">
                        <TableHeader>
                            <TableRow>
                                <TableHead>Timestamp</TableHead>
                                <TableHead>From Address</TableHead>
                                <TableHead>To Address</TableHead>
                                <TableHead>Transfers</TableHead>
                                <TableHead></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow>
                                <TableCell className="font-medium">
                                    INV001
                                </TableCell>
                                <TableCell>Paid</TableCell>
                                <TableCell>Credit Card</TableCell>
                                <TableCell className="text-right">
                                    $250.00
                                </TableCell>
                                <TableCell>
                                    <Button variant="link">Delete node</Button>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </ScrollArea>
            </PopoverContent>
        </Popover>
    );
};

export default DataFlow;
