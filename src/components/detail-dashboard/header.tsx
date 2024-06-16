"use client";

import { HeartIcon, EyeIcon, CopyIcon, RefreshCcwIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import type { Dispatch, SetStateAction } from "react";
import { useEffect, useState } from "react";
import type { ILikesDashboard, ResponseData } from "@/types";
import { useAuthStore } from "@/hooks/store/authStore";
import { useCopyToClipboard, useIsClient } from "usehooks-ts";
import { ModalLogin } from "../discover/modal-login";
import { useToast } from "../ui/use-toast";

interface IHeaderDetailDashboard {
    fullname: string;
    username: string;
    likes: number;
    views: number;
    id: string;
    setLikes: Dispatch<SetStateAction<number>>;
    setIsRefresh: Dispatch<SetStateAction<boolean>>;
}
export const Header: React.FC<IHeaderDetailDashboard> = ({
    fullname,
    username,
    likes,
    views,
    id,
    setLikes,
    setIsRefresh,
}) => {
    const [isLikes, setIsLikes] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [copiedText, copy] = useCopyToClipboard();

    const user = useAuthStore((state) => state.user);
    const isClient = useIsClient();
    const { toast } = useToast();

    const handleCopy = () => {
        console.log("ini disini");
        copy(window.location.href)
            .then(() => {
                toast({
                    title: "Copied!",
                    description: "Dashboard URL copied to clipboard",
                });
            })
            .catch((error) => {
                toast({
                    title: "Copy failed!",
                    variant: "destructive",
                    description: error,
                });
            });
    };

    const getLikesDashboard = async (id: string) => {
        try {
            const raw = await fetch("/api/likes-dashboard/get-by-id", {
                method: "POST",
                body: JSON.stringify({ dashboard_id: id }),
            });
            const res: ResponseData<ILikesDashboard[] | null> =
                await raw.json();
            console.log(res);
            if (res.data && res.data.length > 0) {
                setIsLikes(true);
            } else setIsLikes(false);
        } catch (error) {
            console.log(error);
            setIsLikes(false);
        }
    };

    // if (isClient) {
    //     setFullUrl(window.location.href);
    // }

    const insertDashboard = async (id: string) => {
        try {
            const raw = await fetch("/api/likes-dashboard/insert", {
                method: "POST",
                body: JSON.stringify({ dashboard_id: id }),
            });
            const res: ResponseData<number | null> = await raw.json();
            if (res.message) {
                setIsLikes(false);
            } else setIsLikes(true);
            if (res.data) {
                console.log(res.data);
                setLikes(res.data);
            }
        } catch (error) {
            setIsLikes(false);
        }
    };

    const deleteDashboard = async (id: string) => {
        try {
            const raw = await fetch("/api/likes-dashboard/delete", {
                method: "POST",
                body: JSON.stringify({ dashboard_id: id }),
            });
            const res: ResponseData<number | null> = await raw.json();
            if (res.message) {
                setIsLikes(true);
            } else setIsLikes(false);
            if (res.data) {
                console.log(res.data);
                setLikes(res.data);
            }
        } catch (error) {
            setIsLikes(true);
        }
    };

    const likeDashboard = async (like: boolean, id: string) => {
        setIsLikes((prev) => !prev);
        if (!like) insertDashboard(id);
        else deleteDashboard(id);
    };

    useEffect(() => {
        if (id) {
            getLikesDashboard(id);
        }
    }, [id]);

    return (
        <div className="sticky top-[64px] z-[2] h-full border-b bg-background p-4">
            <div className="mx-auto h-full max-w-[1800px]">
                <div className="flex h-full items-center justify-between">
                    <div className="flex items-center gap-1">
                        <Avatar>
                            <AvatarImage></AvatarImage>
                            <AvatarFallback className="uppercase">
                                {username.slice(0, 2) ?? ""}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <div className="text-sm capitalize">{fullname}</div>
                            <div className="text-xs text-muted-foreground">
                                {username ? `@${username}` : ""}
                            </div>
                        </div>
                    </div>
                    <div className="flex h-full items-center gap-4">
                        <div className="flex items-center gap-1">
                            {!user && isClient && (
                                <ModalLogin>
                                    <HeartIcon
                                        className={`h-[1rem] w-[1rem] transition-all hover:fill-red-600 hover:stroke-red-600 ${isLikes ? "fill-red-600 stroke-red-600" : ""}`}
                                    />
                                </ModalLogin>
                            )}
                            {user && isClient && (
                                <HeartIcon
                                    className={`h-[1rem] w-[1rem] transition-all hover:fill-red-600 hover:stroke-red-600 ${isLikes ? "fill-red-600 stroke-red-600" : ""}`}
                                    onClick={() => likeDashboard(isLikes, id)}
                                />
                            )}
                            <div className="text-sm">
                                {new Intl.NumberFormat().format(likes)}
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            <EyeIcon className="h-[1rem] w-[1rem]" />
                            <div className="text-sm">
                                {new Intl.NumberFormat().format(views)}
                            </div>
                        </div>
                        <Separator orientation="vertical" className="h-6" />
                        <div className="flex items-center gap-1">
                            <Button
                                className="flex h-6 items-center gap-1 px-2 text-xs"
                                variant="secondary"
                                onClick={() => handleCopy()}
                            >
                                <CopyIcon className="h-3 w-3" />
                                <div>Copy link</div>
                            </Button>
                            <Button
                                className="flex h-6 items-center gap-1 px-2 text-xs"
                                variant="secondary"
                                onClick={() => setIsRefresh((prev) => !prev)}
                            >
                                <RefreshCcwIcon className="h-3 w-3" />
                                <div>Refresh</div>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
