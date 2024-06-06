"use client";

import type { IDataDashboard } from "@/types";
import { useMemo } from "react";
import { Card } from "../ui/card";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import gfm from "remark-gfm";

interface ICardText {
    data: IDataDashboard[];
    id: string;
}

export const CardText: React.FC<ICardText> = ({ id, data }) => {
    const dataText = useMemo(() => {
        return data.filter((item) => item.id === id)[0] ?? undefined;
    }, [data, id]);

    return (
        <Card className="relative h-full w-full p-4">
            <Markdown remarkPlugins={[gfm]} rehypePlugins={[rehypeRaw]}>
                {dataText.value}
            </Markdown>
        </Card>
    );
};
