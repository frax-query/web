"use client";

import { AppProgressBar as ProgressBar } from "next-nprogress-bar";
import React from "react";

const ProgressBarProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    return (
        <>
            {children}
            <ProgressBar
                height="2px"
                color="#ea580c"
                options={{ showSpinner: false }}
            />
        </>
    );
};

export default ProgressBarProvider;
