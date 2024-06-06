"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
    CaseSensitiveIcon,
    EyeIcon,
    FilePieChartIcon,
    HeartIcon,
    SaveIcon,
    SmartphoneIcon,
    TabletIcon,
} from "lucide-react";
import { DesktopIcon } from "@radix-ui/react-icons";
import { useDashboard } from "@/hooks/useDashboard";
import { v4 as uuidv4 } from "uuid";
import { useToast } from "@/components/ui/use-toast";
import { useAuthStore } from "@/hooks/store/authStore";
import { LayoutChart } from "@/components/dashboard/LayoutDashboard";
import { FullLoadingScreen } from "@/components/dashboard/FullLoadingScreen";
import { ErrorLoadingDashboard } from "@/components/dashboard/ErrorLoadingDashboard";
import { ListDashboard } from "@/components/dashboard/ListDashboard";
import { SearchChart } from "@/components/dashboard/SearchChart";
import { useState } from "react";

const defaultValueCardText = "##### You can use standart markdown, gfm or html";

export default function Dashboard() {
    const {
        device,
        deviceModeSize,
        listGrid,
        layouts,
        breakpoint,
        data,
        listCharts,
        listDashboard,
        title,
        description,
        laodingDashboard,
        errorDashboard,
        loadDashboard,
        setTitle,
        setDescription,
        getAllDashboard,
        setData,
        setDevice,
        handleAddCard,
        setBreakpoint,
        handleChangeLayout,
        handleRemoveCard,
        handleSaveDashboard,
        createNewDashboard,
    } = useDashboard();

    const user = useAuthStore((state) => state.user);

    const { toast } = useToast();
    const [loadingSave, setLoadingSave] = useState(false);
    const saveDashboard = async () => {
        setLoadingSave(true);
        const res = await handleSaveDashboard();
        if (res.isError) {
            toast({
                title: "Failed to save dashboard",
                variant: "destructive",
                description: res.message,
            });
        } else {
            toast({
                title: "Dashboard saved",
                description: "your dashboard has been saved!",
            });
        }
        setLoadingSave(false);
    };
    return (
        <div className="max-w-full">
            {laodingDashboard && (
                <FullLoadingScreen text="Preparing your dashboard..." />
            )}
            {errorDashboard && <ErrorLoadingDashboard />}
            <div className="sticky top-[64px] z-[2] border-b bg-background p-4">
                <div className="mx-auto max-w-[1800px]">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                            <Avatar>
                                <AvatarImage></AvatarImage>
                                <AvatarFallback className="uppercase">
                                    {user?.user_metadata?.username.slice(0, 2)}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <div className="text-sm capitalize">
                                    {user?.user_metadata?.full_name}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                    @{user?.user_metadata?.username}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1 rounded-lg border p-[2px]">
                                <Button
                                    size="icon"
                                    variant={
                                        device === "Desktop"
                                            ? "secondary"
                                            : "ghost"
                                    }
                                    className="h-[22px] w-[22px]"
                                    onClick={() => setDevice("Desktop")}
                                >
                                    <DesktopIcon className="h-[1rem] w-[1rem]" />
                                </Button>
                                <Button
                                    size="icon"
                                    variant={
                                        device === "Tablet"
                                            ? "secondary"
                                            : "ghost"
                                    }
                                    className="h-[22px] w-[22px]"
                                    onClick={() => setDevice("Tablet")}
                                >
                                    <TabletIcon className="h-[1rem] w-[1rem]" />
                                </Button>
                                <Button
                                    size="icon"
                                    variant={
                                        device === "Smartphone"
                                            ? "secondary"
                                            : "ghost"
                                    }
                                    className="h-[22px] w-[22px]"
                                    onClick={() => setDevice("Smartphone")}
                                >
                                    <SmartphoneIcon className="h-[1rem] w-[1rem]" />
                                </Button>
                            </div>
                            {false && (
                                <>
                                    <div className="flex items-center gap-1">
                                        <HeartIcon className="h-[1rem] w-[1rem]" />
                                        <div className="text-xs">1k</div>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <EyeIcon className="h-[1rem] w-[1rem]" />
                                        <div className="text-xs">1k</div>
                                    </div>
                                </>
                            )}
                            <Separator orientation="vertical" />
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="default"
                                        className="flex h-7 items-center gap-1 text-sm"
                                    >
                                        <FilePieChartIcon className="h-[0.875rem] w-[0.875rem]" />
                                        Add card
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <SearchChart
                                        listCharts={listCharts}
                                        handleAddCard={handleAddCard}
                                        layouts={layouts}
                                    />
                                    <DropdownMenuItem
                                        className="flex items-center gap-2"
                                        onClick={() =>
                                            handleAddCard(
                                                "text",
                                                layouts,
                                                uuidv4(),
                                                defaultValueCardText
                                            )
                                        }
                                    >
                                        <CaseSensitiveIcon className="h-[0.875rem] w-[0.875rem]" />
                                        <div>Add Text</div>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <Button
                                variant="outline"
                                className="flex h-7 items-center gap-1 text-sm"
                                disabled={loadingSave}
                                onClick={() => saveDashboard()}
                            >
                                <SaveIcon className="h-[0.875rem] w-[0.875rem]" />
                                Save
                            </Button>
                            <ListDashboard
                                data={listDashboard}
                                getAllDashboard={getAllDashboard}
                                createNewDashboard={createNewDashboard}
                                loadDashboard={loadDashboard}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <LayoutChart
                device={device}
                deviceModeSize={deviceModeSize}
                listGrid={listGrid}
                layouts={layouts}
                breakpoint={breakpoint}
                data={data}
                title={title}
                description={description}
                setTitle={setTitle}
                setDescription={setDescription}
                setData={setData}
                setBreakpoint={setBreakpoint}
                handleChangeLayout={handleChangeLayout}
                handleRemoveCard={handleRemoveCard}
            />
        </div>
    );
}
