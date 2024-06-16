"use client";

import CardDashboard from "@/components/discover/card-dashboard";
import { Combobox } from "@/components/discover/combobox";
import { ModalLogin } from "@/components/discover/modal-login";
import ModalSearch from "@/components/discover/modal-search";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/hooks/store/authStore";
import { useDiscovery } from "@/hooks/useDiscovery";
import Link from "next/link";
import { useIsClient } from "usehooks-ts";

const orderList = [
    {
        value: "recently_created",
        label: "🆕 Recently Created",
    },
    {
        value: "most_loves",
        label: "😍 Most Loves",
    },
    {
        value: "most_views",
        label: "👁️ Most Views",
    },
];

export default function Home() {
    const user = useAuthStore((state) => state.user);

    const {
        loading,
        listDashboard,
        error,
        view,
        totalDashborads,
        page,
        limit,
        getAllDashboard,
        setView,
    } = useDiscovery();

    const isClient = useIsClient();

    return (
        <main>
            <div className="mx-auto grid max-w-[1800px] grid-cols-1 gap-4 p-4 text-sm">
                <div className=" py-8 text-center lg:py-16">
                    <h3 className="text-4xl font-bold">
                        Get Insight On{" "}
                        <span className="text-primary dark:text-primary">
                            Fraxtal
                        </span>{" "}
                        Network
                    </h3>
                    <p className="text-lg text-muted-foreground">
                        Comprehensive Analysis on Our Advanced Discovery
                        Dashboard
                    </p>
                    <div className="mt-4 flex items-center justify-center gap-1">
                        {isClient && !user && (
                            <ModalLogin>
                                <Button variant="outline">Query now</Button>
                            </ModalLogin>
                        )}
                        {user && (
                            <Link href={`/query`}>
                                <Button variant="outline">Query now</Button>
                            </Link>
                        )}
                        <ModalSearch />
                    </div>
                </div>
                <div className="flex items-center justify-end gap-4 py-4">
                    <div>
                        <Combobox
                            orderList={orderList}
                            value={view}
                            setValue={setView}
                        />
                    </div>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {listDashboard.map((item) => {
                        return (
                            <CardDashboard
                                key={`dashboard-${item.title_slug}`}
                                loading={false}
                                data={{
                                    date: new Date(
                                        item.updated_at
                                    ).toDateString(),
                                    description: item.description,
                                    likes: Number(item.likes),
                                    slug: item.title_slug,
                                    title: item.title,
                                    username: `@` + item.profiles.username,
                                    views: Number(item.views),
                                }}
                            />
                        );
                    })}
                    {loading &&
                        Array(50)
                            .fill(0)
                            .map((index) => {
                                return (
                                    <CardDashboard
                                        key={`dashboard-skeleton-${index}`}
                                        loading={loading}
                                        data={{
                                            date: "oke",
                                            description: "kk",
                                            likes: 0,
                                            slug: "asd-asd",
                                            title: "oke gan disini",
                                            username: "@ajsdasd",
                                            views: 0,
                                        }}
                                    />
                                );
                            })}
                </div>
                {!loading &&
                    !error &&
                    listDashboard.length < totalDashborads && (
                        <div
                            className="flex items-center justify-center"
                            onClick={() => getAllDashboard(page, view, limit)}
                        >
                            <Button variant="outline">Load more</Button>
                        </div>
                    )}
            </div>
        </main>
    );
}
