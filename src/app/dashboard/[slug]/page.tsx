"use client";

import { FullLoadingScreen } from "@/components/dashboard/FullLoadingScreen";
import { ErrorDetailDashboard } from "@/components/detail-dashboard/ErrorDetailDashboard";
import { LayoutDashboardDetail } from "@/components/detail-dashboard/LayoutDashboardDetail";
import { Header } from "@/components/detail-dashboard/header";
import { useDetailDashboard } from "@/hooks/useDetailDashboard";
import { useState } from "react";

export default function DashboardDetail({
    params,
}: {
    params: { slug: string };
}) {
    const {
        loadingDashboard,
        username,
        fullname,
        error,
        data,
        layouts,
        title,
        description,
        id,
        views,
        likes,
        getDashboard,
        setLikes,
    } = useDetailDashboard(params.slug);

    const [isRefresh, setIsRefresh] = useState(false);
    return (
        <div className="max-w-full">
            {loadingDashboard && (
                <FullLoadingScreen text="Preparing the dashboard..." />
            )}
            {error && <ErrorDetailDashboard getDashboard={getDashboard} />}
            <Header
                username={username}
                fullname={fullname}
                id={id}
                views={views}
                likes={likes}
                setLikes={setLikes}
                setIsRefresh={setIsRefresh}
            />
            <LayoutDashboardDetail
                key={String(isRefresh)}
                data={data}
                layouts={layouts}
                title={title}
                description={description}
            />
        </div>
    );
}
