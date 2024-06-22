"use client";

import type { QueryResult } from "@/types";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "./ui/table";

interface IProps {
    title: string;
    data: QueryResult | null;
    columns: string[];
}
export const CardTable: React.FC<IProps> = ({ title, columns, data }) => {
    return (
        <Table title={title}>
            <TableCaption>{title}</TableCaption>
            <TableHeader>
                <TableRow>
                    {columns.map((item) => {
                        return <TableHead key={item}>{item}</TableHead>;
                    })}
                </TableRow>
            </TableHeader>
            <TableBody>
                {data?.map((item, index) => {
                    return (
                        <TableRow key={`card-table-${index}`}>
                            {columns.map((x, index) => {
                                return (
                                    <TableCell key={`row-${x}-${index}`}>
                                        {item[x]}
                                    </TableCell>
                                );
                            })}
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>
    );
};
