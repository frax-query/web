"use client";

import { Logo } from "../logo";
import { Button } from "../ui/button";

export const ErrorDetailDashboard: React.FC<{
    getDashboard: () => Promise<void>;
}> = ({ getDashboard }) => {
    return (
        <div className="fixed z-[1000] h-full w-full bg-background">
            <div className="flex h-full w-full flex-col items-center justify-center gap-2">
                <Logo />
                <div className="text-center text-sm">
                    We encountered an error while fetching data for the <br />
                    dashboard. Please try again.
                </div>
                <Button
                    className="h-6"
                    variant="default"
                    onClick={() => getDashboard()}
                >
                    Retry
                </Button>
            </div>
        </div>
    );
};
