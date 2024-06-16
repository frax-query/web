"use client";

import ThemeChanger from "@/components/theme-toggle";
import { ModalLogin } from "./discover/modal-login";
import { Logo } from "./logo";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Link from "next/link";
import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "./ui/use-toast";
import { useAuthStore } from "@/hooks/store/authStore";
import * as Cookies from "js-cookie";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { useIsClient } from "usehooks-ts";

export const Header = () => {
    const setUser = useAuthStore((state) => state.setUser);
    const user = useAuthStore((state) => state.user);
    const pathname = usePathname();

    useEffect(() => {
        (async () => {
            const user = Cookies.default.get("user");
            setUser(user ? JSON.parse(user) : null);
        })();
    }, []);

    const isClient = useIsClient();
    return (
        <div className="sticky top-0 z-40 h-[64px] border-b border-zinc-200 bg-background dark:border-zinc-800">
            <div className="mx-auto h-full max-w-[1800px] px-4">
                <div className="flex h-full items-center justify-between">
                    <div className="flex items-center gap-8">
                        <Link href={"/"}>
                            <Logo />
                        </Link>
                        {user && (
                            <div className="flex items-center gap-8 text-sm">
                                <Link
                                    href={"/query"}
                                    className={`${pathname.split("/")[1] === "query" ? "text-primary" : "text-foreground"} transition-all`}
                                >
                                    Query
                                </Link>
                                <Link
                                    href={"/dashboard"}
                                    className={`${pathname.split("/")[1] === "dashboard" ? "text-primary" : "text-foreground"} transition-all`}
                                >
                                    Dashboard
                                </Link>
                            </div>
                        )}
                        {isClient && !user && (
                            <ModalLogin key={0}>
                                <div className="cursor-pointer text-sm">
                                    Query
                                </div>
                            </ModalLogin>
                        )}
                        {isClient && !user && (
                            <ModalLogin key={1}>
                                <div className="cursor-pointer text-sm">
                                    Dashboard
                                </div>
                            </ModalLogin>
                        )}
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                        {!!user && <ProfileAccount />}
                        {isClient && !user && (
                            <ModalLogin key={3}>
                                <Button
                                    variant="default"
                                    size="sm"
                                    className="max-h-7"
                                >
                                    Login
                                </Button>
                            </ModalLogin>
                        )}
                        <ThemeChanger />
                    </div>
                </div>
            </div>
        </div>
    );
};

const ProfileAccount = () => {
    const { toast } = useToast();
    const user = useAuthStore((state) => state.user);

    const handleLogout = async () => {
        const client = createClient();
        const { error } = await client.auth.signOut();
        if (error) {
            toast({
                variant: "destructive",
                title: error.code,
                description: error.message,
            });
            return;
        }
        window.location.reload();
    };
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Avatar>
                    <AvatarImage></AvatarImage>
                    <AvatarFallback className="uppercase">
                        {user?.user_metadata?.username.slice(0, 2)}
                    </AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[200px] text-sm">
                <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                        <div className="text-sm font-medium capitalize leading-none">
                            {user?.user_metadata?.full_name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                            @{user?.user_metadata?.username}
                        </div>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <Link href={`/profile/${user?.user_metadata?.username}`}>
                    <DropdownMenuItem>Profile</DropdownMenuItem>
                </Link>
                <Link href={`/query`}>
                    <DropdownMenuItem>Create Query</DropdownMenuItem>
                </Link>
                <Link href={`/dashboard`}>
                    <DropdownMenuItem>Create Dashboard</DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleLogout()}>
                    Log out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default Header;
