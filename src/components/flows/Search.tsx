"use client";

import { SearchIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Input } from "../ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../ui/table";
import { ScrollArea } from "../ui/scroll-area";
import type { Dispatch, SetStateAction } from "react";
import React from "react";
import type { ITokenTransfers } from "@/types";
import { formatAddress } from "@/lib/utils";

export const SearchData: React.FC<{
    setTxHash: Dispatch<SetStateAction<string>>;
    getData: () => Promise<void>;
    listData: ITokenTransfers[];
    loading: boolean;
    addFlow: (value: ITokenTransfers) => void;
}> = ({ setTxHash, getData, listData, loading, addFlow }) => {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" className="flex items-center">
                    <SearchIcon className="mr-2 h-4 w-4" />
                    <div>Search Data</div>
                </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-[950px] p-0">
                <div className="border-b p-4">
                    <div className="flex gap-2 pt-2">
                        <Input
                            type="text"
                            placeholder="input transaction hash here..."
                            className="flex-1"
                            onChange={(e) => setTxHash(e.target.value)}
                        />
                        <Button
                            className="h-8"
                            onClick={() => getData()}
                            disabled={loading}
                        >
                            Search
                        </Button>
                    </div>
                    {/* <Tabs defaultValue="manual">
                        <TabsList>
                            <TabsTrigger value="manual">Manual</TabsTrigger>
                            <TabsTrigger value="tx">From TxHash</TabsTrigger>
                        </TabsList>
                        <TabsContent value="manual">
                            <div className="flex items-center gap-2 pt-2">
                                <div className="grid grid-cols-1 gap-2">
                                    <Label htmlFor="fromAddress">
                                        From address
                                    </Label>
                                    <Input
                                        type="text"
                                        placeholder="From address"
                                        id="fromAddress"
                                    />
                                </div>
                                <div className="grid grid-cols-1 gap-2">
                                    <Label htmlFor="toAddress">
                                        To address
                                    </Label>
                                    <Input
                                        type="text"
                                        placeholder="To address"
                                        id="toAddress"
                                    />
                                </div>
                                <div className="grid grid-cols-1 gap-2">
                                    <Label htmlFor="tokenAddress">
                                        Token Address
                                    </Label>
                                    <Input
                                        type="text"
                                        placeholder="Token address"
                                        id="tokenAddress"
                                    />
                                </div>
                                <div className="grid grid-cols-1 gap-2">
                                    <Label htmlFor="tokenAddress">
                                        Date range
                                    </Label>
                                    <DatePickerWithRange />
                                </div>
                                <div className="grid grid-cols-1 gap-2">
                                    <Label htmlFor="">&nbsp; </Label>
                                    <Button className="h-8">Search</Button>
                                </div>
                            </div>
                        </TabsContent>
                        <TabsContent value="tx">
                            <div className="flex gap-2 pt-2">
                                <Input
                                    type="text"
                                    placeholder="input transaction hash here..."
                                    className="flex-1"
                                />
                                <Button className="h-8">Search</Button>
                            </div>
                        </TabsContent>
                    </Tabs> */}
                </div>
                <ScrollArea className="h-72 p-4">
                    <Table className="rounded-md border">
                        <TableHeader>
                            <TableRow>
                                <TableHead>Tx Hash</TableHead>
                                <TableHead>Timestamp</TableHead>
                                <TableHead>From Address</TableHead>
                                <TableHead>To Address</TableHead>
                                <TableHead>Raw Amount</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Symbol</TableHead>
                                <TableHead></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading && (
                                <TableRow>
                                    <TableCell colSpan={7}>
                                        loading...
                                    </TableCell>
                                </TableRow>
                            )}
                            {!loading &&
                                listData.map((item) => {
                                    return (
                                        <TableRow
                                            key={`item-table-transfer-${item.index}`}
                                        >
                                            <TableCell>
                                                {formatAddress(
                                                    item.transaction_hash
                                                )}
                                            </TableCell>
                                            <TableCell className="max-w-7 truncate">
                                                {item.timestamp}
                                            </TableCell>
                                            <TableCell>
                                                {formatAddress(
                                                    item.from_address
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {formatAddress(item.to_address)}
                                            </TableCell>
                                            <TableCell className="max-w-7 truncate">
                                                {item.raw_amount}
                                            </TableCell>
                                            <TableCell className="max-w-7 truncate">
                                                {item.amount}
                                            </TableCell>
                                            <TableCell>
                                                {item.token_symbol}
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="link"
                                                    onClick={() =>
                                                        addFlow(item)
                                                    }
                                                >
                                                    Add node
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                        </TableBody>
                    </Table>
                </ScrollArea>
            </PopoverContent>
        </Popover>
    );
};

export default SearchData;
