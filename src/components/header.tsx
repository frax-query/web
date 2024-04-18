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

export const Header = () => {
    return (
        <div className="sticky top-0 z-40 border-b border-zinc-200 backdrop-blur-lg dark:border-zinc-800">
            <div className="container mx-auto">
                <div className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-8">
                        <Logo />
                        <div className="flex items-center gap-8 text-sm text-tremor-content-subtle dark:text-tremor-content-subtle">
                            <div className="text-tremor-brand">Discover</div>
                            <div>Create</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                        <ProfileAccount />
                        <ModalLogin />
                        <ThemeChanger />
                    </div>
                </div>
            </div>
        </div>
    );
};

const ProfileAccount = () => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Avatar>
                    <AvatarImage></AvatarImage>
                    <AvatarFallback>AI</AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="text-sm">
                <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                        <div className="text-sm font-medium leading-none">
                            akbaridria
                        </div>
                        <div className="text-xs text-muted-foreground">
                            akbaridria@gmail.com
                        </div>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Create Query</DropdownMenuItem>
                <DropdownMenuItem>Create Dashboard</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Log out</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default Header;
