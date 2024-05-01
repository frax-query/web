"use client";

import { Card } from "@/components/ui/card";

export default function Dashboard() {
    return (
        <div>
            <div className="sticky top-[64px] z-[2] border-b bg-background p-4">
                <div className="mx-auto max-w-[1800px]">
                    <div>this is title and </div>
                </div>
            </div>
            <div className="border-b p-4">
                <div className="mx-auto max-w-[1800px]">
                    <div className="text-balance text-3xl font-semibold leading-tight tracking-tighter">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                        sed do eiusmod tempor incididunt ut labore et dolore
                        magna aliqua.
                    </div>
                    <div className="text-muted-foreground">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                        sed do eiusmod tempor incididunt ut labore et dolore
                        magna aliqua. Ut enim ad minim veniam, quis nostrud
                        exercitation ullamco laboris nisi ut aliquip ex ea
                        commodo consequat. Duis aute irure dolor in
                        reprehenderit in voluptate velit esse cillum dolore eu
                        fugiat nulla pariatur. Excepteur sint occaecat cupidatat
                        non proident, sunt in culpa qui officia deserunt mollit
                        anim id est laborum
                    </div>
                </div>
            </div>
            <LayoutChart />
        </div>
    );
}

import { Responsive, WidthProvider } from "react-grid-layout";

const ResponsiveGridLayout = WidthProvider(Responsive);
const LayoutChart = () => {
    return (
        <div className="min-h-screen bg-muted p-4">
            <ResponsiveGridLayout
                className="layout z-[1] mx-auto max-w-[1800px]"
                breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
                isResizable={false}
                isDraggable={true}
            >
                <Card key="a">oke gan disini</Card>
                <Card key="b"></Card>
                <Card key="c"></Card>
            </ResponsiveGridLayout>
        </div>
    );
};
