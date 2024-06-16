"use client";

import {
    Card,
    CardContent,
    CardFooter,
    // CardHeader,
} from "@/components/ui/card";

import { ArrowRight, EyeIcon, HeartIcon } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import Link from "next/link";

interface ICard {
    title: string;
    description: string;
    date: string;
    views: number;
    likes: number;
    username: string;
    slug: string;
}

export const CardDashboard: React.FC<{ loading: boolean; data: ICard }> = ({
    loading,
    data,
}) => {
    return (
        <Card>
            {/* <CardHeader className="overflow-hidden rounded-t-lg p-0">
                <img
                    src="./logo.png"
                    alt=""
                    className="aspect-video transform rounded-t-lg  object-contain transition duration-200 hover:scale-110"
                />
            </CardHeader> */}
            {!loading && (
                <CardContent className="p-4">
                    <p className="mb-2 truncate font-bold">{data.title}</p>
                    <p className="mb-2 text-xs text-muted-foreground">
                        {data.date}{" "}
                        <Link href={`/profile/${data.username}`}>
                            <span className="text-primary">
                                {data.username}
                            </span>
                        </Link>
                    </p>
                    <div className="mb-2 flex items-center gap-2">
                        <p className="flex items-center gap-1 text-xs">
                            <HeartIcon
                                size={12}
                                className="fill-primary stroke-primary"
                            />
                            <span>{data.likes}</span>
                        </p>
                        <p className="flex items-center gap-1 text-xs">
                            <EyeIcon size={12} className="stroke-primary" />
                            <span>{data.views}</span>
                        </p>
                    </div>
                    <p className="line-clamp-1 h-[18px] text-xs text-muted-foreground">
                        {data.description}
                    </p>
                </CardContent>
            )}
            {!loading && (
                <CardFooter className="px-4">
                    <Link
                        href={`/dashboard/${data.slug}`}
                        className="flex items-center gap-1 text-sm text-primary"
                    >
                        Read More
                        <ArrowRight size={18} />
                    </Link>
                </CardFooter>
            )}
            {loading && (
                <CardContent className="p-4">
                    <Skeleton className="mb-2 h-[20px] w-[60%]" />
                    <Skeleton className="mb-2 h-[16px] w-[50%]" />
                    <Skeleton className="mb-2 h-[16px] w-[30%]" />
                    <Skeleton className="h-[20px] w-full" />
                </CardContent>
            )}
            {loading && (
                <CardFooter className="px-4">
                    <Skeleton className="h-[20px] w-[25%]" />
                </CardFooter>
            )}
        </Card>
    );
};

export default CardDashboard;
