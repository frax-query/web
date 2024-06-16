"use client";

import { FullLoadingScreen } from "@/components/dashboard/FullLoadingScreen";
import CardDashboard from "@/components/discover/card-dashboard";
import { DialogProfile } from "@/components/profile/DialogProfile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAuthStore } from "@/hooks/store/authStore";
import { useProfile } from "@/hooks/useProfile";
import { GitHubLogoIcon, TwitterLogoIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Profile() {
    const pathname = usePathname();
    const username = pathname.split("/")[2];

    const user = useAuthStore((state) => state.user);

    const {
        profile,
        totalStats,
        loadingProfile,
        errorProfile,
        loadingDashboard,
        listDashboard,
        updateUserData,
    } = useProfile(username.replaceAll("@", ""));

    if (errorProfile) {
        return (
            <div className="py-8 text-center">
                sorry, we can't find the profile
            </div>
        );
    }

    return (
        <>
            {loadingProfile && (
                <FullLoadingScreen text="Loading the profile..." />
            )}
            <div className="mx-auto max-w-[800px] space-y-4 p-4">
                <div className="flex flex-col items-center justify-center gap-2">
                    <Avatar className="h-24 w-24">
                        <AvatarImage></AvatarImage>
                        <AvatarFallback className="text-4xl uppercase">
                            {profile ? profile.username.slice(0, 2) : ""}
                        </AvatarFallback>
                    </Avatar>
                    <div className="text-center">
                        <div className="tracking-light text-xl font-semibold capitalize">
                            {profile?.full_name}
                        </div>
                        <div className="text-muted-foreground">
                            {profile ? `@${profile.username}` : ""}
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link
                            href={`https://x.com/${profile?.twitter}`}
                            className={`${!profile?.twitter && "pointer-events-none"}`}
                            target="_blank"
                        >
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-7 w-7"
                                disabled={!profile?.twitter}
                            >
                                <TwitterLogoIcon />
                            </Button>
                        </Link>
                        <Link
                            href={`https://github.com/${profile?.github}`}
                            className={`${!profile?.github && "pointer-events-none"}`}
                            target="_blank"
                        >
                            <Button
                                variant="outline"
                                size="icon"
                                className="h-7 w-7"
                                disabled={!profile?.github}
                            >
                                <GitHubLogoIcon />
                            </Button>
                        </Link>
                        {user &&
                            user?.user_metadata?.username ===
                                profile?.username && (
                                <DialogProfile
                                    fullname={profile?.full_name ?? ""}
                                    github={profile?.github ?? ""}
                                    twitter={profile?.twitter ?? ""}
                                    updateUserData={updateUserData}
                                />
                            )}
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-2">
                        <Badge variant="outline">
                            {totalStats.total_likes} Likes
                        </Badge>
                        <Badge variant="outline">
                            {totalStats.total_views} Page views
                        </Badge>
                        <Badge variant="outline">
                            {totalStats.total_dashboard} Dashboards
                        </Badge>
                    </div>
                </div>
                <Separator />
                <div>
                    <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
                        {loadingDashboard &&
                            Array(4)
                                .fill(1)
                                .map((_, index) => {
                                    return (
                                        <CardDashboard
                                            key={`loading-dashboard-profile,${index} `}
                                            data={{
                                                date: "",
                                                description: "",
                                                likes: 0,
                                                slug: "",
                                                title: "",
                                                username: "",
                                                views: 0,
                                            }}
                                            loading={true}
                                        />
                                    );
                                })}
                        {!loadingDashboard &&
                            listDashboard.map((item) => {
                                return (
                                    <CardDashboard
                                        key={item.title_slug}
                                        data={{
                                            date: new Date(
                                                item.updated_at
                                            ).toDateString(),
                                            description: item.description,
                                            likes: item.likes,
                                            slug: item.title_slug,
                                            title: item.title,
                                            username: "@" + item.username,
                                            views: item.views,
                                        }}
                                        loading={false}
                                    />
                                );
                            })}
                    </div>
                </div>
            </div>
        </>
    );
}
