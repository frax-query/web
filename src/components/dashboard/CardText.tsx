"use client";

import type { IDataDashboard } from "@/types";
import {
    useCallback,
    useMemo,
    useState,
    type Dispatch,
    type SetStateAction,
} from "react";
import { Card } from "../ui/card";
import { Trash2Icon, Edit2Icon, CheckIcon } from "lucide-react";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import gfm from "remark-gfm";

interface ICardText {
    handleRemoveCard: (id: string) => void;
    data: IDataDashboard[];
    setData: Dispatch<SetStateAction<IDataDashboard[]>>;
    id: string;
}

export const CardText: React.FC<ICardText> = ({
    id,
    data,
    setData,
    handleRemoveCard,
}) => {
    const [editText, setEditText] = useState(false);

    const dataText = useMemo(() => {
        return data.filter((item) => item.id === id)[0] ?? undefined;
    }, [data, id]);

    const handleDataText = useCallback((text: string) => {
        setData((prev) => {
            const newArr = prev.map((item) => {
                if (item.id === id) return { ...item, value: text };
                else return item;
            });
            return newArr;
        });
    }, []);

    return (
        <Card className="relative h-full w-full p-4">
            <Card className="absolute right-[0.5rem] top-[0.5rem] p-2">
                <div className="flex items-center gap-2">
                    <Trash2Icon
                        className="h-[0.875rem] w-[0.875rem]"
                        onMouseDown={(e) => {
                            e.preventDefault(),
                                e.stopPropagation(),
                                handleRemoveCard(id);
                        }}
                    />
                    {!editText && (
                        <Edit2Icon
                            className="h-[0.875rem] w-[0.875rem]"
                            onMouseDown={(e) => {
                                e.stopPropagation(),
                                    setEditText((prev) => !prev);
                            }}
                        />
                    )}
                    {editText && (
                        <CheckIcon
                            className="h-[0.875rem] w-[0.875rem]"
                            onMouseDown={(e) => {
                                e.stopPropagation(),
                                    setEditText((prev) => !prev);
                            }}
                        />
                    )}
                </div>
            </Card>
            {editText && (
                <textarea
                    className="h-full w-full"
                    placeholder="You can use standard markdown, gfm or html"
                    value={dataText.value}
                    onChange={(e) => handleDataText(e.target.value)}
                ></textarea>
            )}
            {!editText && (
                <Markdown remarkPlugins={[gfm]} rehypePlugins={[rehypeRaw]}>
                    {dataText.value}
                </Markdown>
            )}
        </Card>
    );
};
