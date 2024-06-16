import type { IProfile, ResponseData } from "@/types";
import { useCallback, useEffect, useState } from "react";

interface IProfileStats {
    total_views: number | null;
    total_likes: number | null;
    total_dashboard: number | null;
}

interface IUserDashboard {
    updated_at: string;
    likes: number;
    views: number;
    username: string;
    title: string;
    description: string;
    title_slug: string;
}
export const useProfile = (username: string) => {
    const [profile, setProfile] = useState<IProfile | null>(null);
    const [loadingProfile, setLoadingProfile] = useState<boolean>(true);
    const [errorProfile, setErrorProfile] = useState("");
    const [totalStats, setTotalStats] = useState<IProfileStats>({
        total_likes: 0,
        total_views: 0,
        total_dashboard: 0,
    });
    const [loadingStats, setLoadingStats] = useState(true);
    const [listDashboard, setListdashboard] = useState<IUserDashboard[]>([]);
    const [loadingDashboard, setLoadingDashboard] = useState(true);

    const getProfile = useCallback(async () => {
        try {
            setLoadingProfile(true);
            setErrorProfile("");
            const raw = await fetch("/api/profile/get-by-username", {
                method: "POST",
                body: JSON.stringify({ username: username }),
            });
            const res: ResponseData<IProfile | null> = await raw.json();
            if (res.data) {
                setProfile(res.data);
            } else setErrorProfile(res.message);
        } catch (error) {
            if (error instanceof Error) setErrorProfile(error.message);
            else setErrorProfile("Unknown error");
        }
        setLoadingProfile(false);
    }, [username]);

    const getTotalStats = useCallback(async () => {
        try {
            setLoadingStats(true);
            const raw = await fetch("/api/profile/total-stats", {
                method: "POST",
                body: JSON.stringify({ username: username }),
            });
            const res: ResponseData<{
                total_views: number | null;
                total_likes: number | null;
                total_dashboard: number | null;
            } | null> = await raw.json();
            if (res.data) {
                setTotalStats({
                    total_likes: res.data.total_likes ?? 0,
                    total_views: res.data.total_views ?? 0,
                    total_dashboard: res.data.total_dashboard ?? 0,
                });
            }
        } catch (error) {
            console.log(error);
        }
        setLoadingStats(false);
    }, [username]);

    const getUserDashboard = useCallback(async () => {
        setLoadingDashboard(true);
        setListdashboard([]);
        try {
            const raw = await fetch("/api/dashboard/get-by-username", {
                method: "POST",
                body: JSON.stringify({ username: username }),
            });
            const res: ResponseData<IUserDashboard[] | null> = await raw.json();
            if (res.data) setListdashboard(res.data);
        } catch (error) {
            console.log(error);
        }
        setLoadingDashboard(false);
    }, [username]);

    useEffect(() => {
        if (username) {
            Promise.all([getProfile(), getTotalStats(), getUserDashboard()]);
        }
    }, [username]);

    const updateUserData = useCallback(
        async (fullname: string, github: string, twitter: string) => {
            try {
                const raw = await fetch("/api/profile/update-metadata", {
                    method: "POST",
                    body: JSON.stringify({
                        id: profile?.id,
                        metadata: {
                            fullname: fullname,
                            github: github,
                            twitter: twitter,
                        },
                    }),
                });
                const res: ResponseData<IProfile | null> = await raw.json();
                if (res.data) {
                    setProfile(res.data);
                    return true;
                } else return false;
            } catch (error) {
                return false;
            }
        },
        [profile]
    );

    return {
        profile,
        loadingProfile,
        errorProfile,
        totalStats,
        loadingStats,
        loadingDashboard,
        listDashboard,
        updateUserData,
    };
};
