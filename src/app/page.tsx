"use client";

import CardDashboard from "@/components/discover/card-dashboard";
import { Combobox } from "@/components/discover/combobox";
import ModalSearch from "@/components/discover/modal-search";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/hooks/store/authStore";
import { useDiscovery } from "@/hooks/useDiscovery";

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

    const { loading, listDashboard, error } = useDiscovery();

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
                        {user && <Button variant="outline">Query now</Button>}
                        <ModalSearch />
                    </div>
                </div>
                <div className="flex items-center justify-end gap-4 py-4">
                    <div>
                        <Combobox
                            orderList={orderList}
                            defaultValue="recently_created"
                        />
                    </div>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
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
                    {!loading &&
                        !!error &&
                        listDashboard.map((item) => {
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
                </div>
            </div>
        </main>
    );
}
