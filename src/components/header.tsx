"use client";
import ThemeChanger from "@/components/theme-toggle";
import { Button } from "./ui/button";

export const Header = () => {
    return (
        <div className="sticky top-0 z-40 border-b border-zinc-200 backdrop-blur-lg dark:border-zinc-800">
            <div className="container mx-auto">
                <div className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-8">
                        <div className="font-bold">
                            <span>Query\</span>
                            <span className="text-tremor-brand dark:text-dark-tremor-brand">
                                Viction
                            </span>
                        </div>
                        <div className="flex items-center gap-8 text-sm text-tremor-content-subtle dark:text-tremor-content-subtle">
                            <div className="text-tremor-brand">Discover</div>
                            <div>Create</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                        <Button variant="default" size="sm">
                            Login
                        </Button>
                        <ThemeChanger />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;
