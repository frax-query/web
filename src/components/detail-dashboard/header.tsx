"use client";

import { HeartIcon, EyeIcon, CopyIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";

interface IHeaderDetailDashboard {
    fullname: string;
    username: string;
}
export const Header: React.FC<IHeaderDetailDashboard> = ({
    fullname,
    username,
}) => {
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
                            <HeartIcon className="h-[1rem] w-[1rem] stroke-red-600 transition-all hover:fill-red-600" />
                            <div className="text-sm">1k</div>
                        </div>
                        <div className="flex items-center gap-1">
                            <EyeIcon className="h-[1rem] w-[1rem]" />
                            <div className="text-sm">1k</div>
                        </div>
                        <Separator orientation="vertical" className="h-6" />
                        <div className="flex items-center gap-1">
                            <Button
                                className="flex h-6 items-center gap-1 px-2 text-xs"
                                variant="secondary"
                            >
                                <CopyIcon className="h-3 w-3" />
                                <div>Copy link</div>
                            </Button>
                            <Button
                                className="flex h-6 items-center gap-1 px-2 text-xs"
                                variant="secondary"
                            >
                                <CopyIcon className="h-3 w-3" />
                                <div>Refresh</div>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
