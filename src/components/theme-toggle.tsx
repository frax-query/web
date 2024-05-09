"use client";

import * as React from "react";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

export default function ThemeChanger() {
    const { theme, setTheme } = useTheme();

    return (
        <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 rounded-full"
            onClick={() => {
                theme === "dark" ? setTheme("light") : setTheme("dark");
            }}
        >
            <SunIcon className="h-[0.875rem] w-[0.875rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <MoonIcon className="absolute h-[0.875rem] w-[0.875rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
        </Button>
    );
}
