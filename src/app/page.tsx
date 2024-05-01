import CardDashboard from "@/components/discover/card-dashboard";
import { Combobox } from "@/components/discover/combobox";
import ModalSearch from "@/components/discover/modal-search";
import { Button } from "@/components/ui/button";

const orderList = [
    {
        value: "trending",
        label: "🔥 Trending",
    },
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
    return (
        <main>
            <div className="mx-auto grid max-w-[1800px] grid-cols-1 gap-4 p-4 text-sm">
                <div className=" py-8 text-center lg:py-16">
                    <h3 className="text-4xl font-bold">
                        Get Insight On{" "}
                        <span className="text-tremor-brand dark:text-tremor-brand">
                            Viction
                        </span>{" "}
                        Network
                    </h3>
                    <p className="text-lg text-muted-foreground">
                        Comprehensive Analysis on Our Advanced Discovery
                        Dashboard
                    </p>
                    <div className="mt-4 flex items-center justify-center gap-1">
                        <Button variant="outline">Create Now</Button>
                        <ModalSearch />
                    </div>
                </div>
                <div className="flex items-center justify-end py-4">
                    <div>
                        <Combobox
                            orderList={orderList}
                            defaultValue="trending"
                        />
                    </div>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {Array(100)
                        .fill(0)
                        .map((index) => {
                            return <CardDashboard key={`dashboard-${index}`} />;
                        })}
                </div>
            </div>
        </main>
    );
}
