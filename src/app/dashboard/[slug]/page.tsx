"use client";

import { FullLoadingScreen } from "@/components/dashboard/FullLoadingScreen";
import { ErrorDetailDashboard } from "@/components/detail-dashboard/ErrorDetailDashboard";
import { LayoutDashboardDetail } from "@/components/detail-dashboard/LayoutDashboardDetail";
import { Header } from "@/components/detail-dashboard/header";
import { useDetailDashboard } from "@/hooks/useDetailDashboard";

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
        getDashboard,
    } = useDetailDashboard(params.slug);
    return (
        <div className="max-w-full">
            {loadingDashboard && (
                <FullLoadingScreen text="Preparing the dashboard..." />
            )}
            {error && <ErrorDetailDashboard getDashboard={getDashboard} />}
            <Header username={username} fullname={fullname} />
            <LayoutDashboardDetail
                data={data}
                layouts={layouts}
                title={title}
                description={description}
            />
        </div>
    );
}
