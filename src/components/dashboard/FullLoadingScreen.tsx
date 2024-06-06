"use client";

import { Logo } from "../logo";

export const FullLoadingScreen: React.FC<{ text: string }> = ({ text }) => {
    return (
        <div className="fixed z-[1000] h-full w-full bg-background">
            <div className="flex h-full w-full flex-col items-center justify-center gap-2">
                <Logo />
                <div className="text-center text-sm">{text}</div>
            </div>
        </div>
    );
};
