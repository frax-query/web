"use client";

import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card";

import { Icon } from "@tremor/react";
import { RiHeart3Fill, RiEye2Fill, RiArrowRightLine } from "@remixicon/react";

export const CardDashboard = () => {
    return (
        <Card>
            <CardHeader className="overflow-hidden rounded-t-lg bg-tremor-brand p-0">
                <img
                    src="./logo.png"
                    alt=""
                    className="aspect-video transform rounded-t-lg  object-contain transition duration-200 hover:scale-110"
                />
            </CardHeader>
            <CardContent className="p-4">
                <p className="mb-2 truncate font-bold">
                    Uniswap V2 and V3 Volumes
                </p>
                <p className="mb-2 text-xs text-muted-foreground">
                    Jan 20, 2024 by{" "}
                    <span className="text-tremor-brand">@akbaridria</span>
                </p>
                <div className="mb-2 flex items-center gap-2">
                    <p className="flex items-center gap-1 text-xs">
                        <Icon
                            icon={RiHeart3Fill}
                            variant="simple"
                            size="xs"
                            className="p-0"
                        />
                        <span>130</span>
                    </p>
                    <p className="flex items-center gap-1 text-xs">
                        <Icon
                            icon={RiEye2Fill}
                            variant="simple"
                            size="xs"
                            className="p-0"
                        />
                        <span>130</span>
                    </p>
                </div>
                <p className="line-clamp-3 text-xs text-muted-foreground">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                    do eiusmod tempor incididunt ut labore et dolore magna
                    aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                    ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    Duis aute irure dolor in reprehenderit in voluptate velit
                    esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
                    occaecat cupidatat non proident, sunt in culpa qui officia
                    deserunt mollit anim id est laborum
                </p>
            </CardContent>
            <CardFooter className="p-4">
                <div className="flex items-center text-tremor-brand">
                    Read More
                    <Icon icon={RiArrowRightLine} variant="simple" size="sm" />
                </div>
            </CardFooter>
        </Card>
    );
};

export default CardDashboard;
