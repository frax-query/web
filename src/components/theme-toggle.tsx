"use client";

import { useTheme } from "next-themes";
import * as React from "react";
import { Icon } from "@tremor/react";
import { RiSunLine, RiMoonLine } from "@remixicon/react";

const ThemeChanger = () => {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);
    React.useEffect(() => {
        setMounted(true);
    }, []);
    return (
        mounted && (
            <div
                className="w-fit cursor-pointer"
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            >
                {theme === "light" && (
                    <Icon icon={RiSunLine} variant="shadow" size="xs" />
                )}
                {theme === "dark" && (
                    <Icon icon={RiMoonLine} variant="shadow" size="xs" />
                )}
            </div>
        )
    );
};

export default ThemeChanger;
