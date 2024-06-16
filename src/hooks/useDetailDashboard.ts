import type { IDataDashboard, ITableDashboard, ResponseData } from "@/types";
import type { Dispatch, SetStateAction } from "react";
import { useCallback, useEffect, useState } from "react";

interface IHooksDetailDashboard {
    loadingDashboard: boolean;
    error: string;
    data: IDataDashboard[];
    layouts: ReactGridLayout.Layouts;
    fullname: string;
    username: string;
    title: string;
    description: string;
    id: string;
    views: number;
    likes: number;
    getDashboard: () => Promise<void>;
    setLikes: Dispatch<SetStateAction<number>>;
}

const defaultLayouts = {
    lg: [],
    md: [],
    sm: [],
    xs: [],
    xxs: [],
};

export const useDetailDashboard: (
    dashboard_id: string
) => IHooksDetailDashboard = (dashboard_id) => {
    const [loadingDashboard, setLoadingDashboard] = useState<boolean>(true);
    const [error, setError] = useState("");
    const [layouts, setLayouts] =
        useState<ReactGridLayout.Layouts>(defaultLayouts);
    const [data, setData] = useState<IDataDashboard[]>([]);
    const [username, setUsername] = useState("");
    const [fullname, setFullname] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [id, setId] = useState("");
    const [likes, setLikes] = useState(0);
    const [views, setViews] = useState(0);

    const getDashboard = useCallback(async () => {
        if (!dashboard_id) return;
        setLoadingDashboard(true);
        setError("");
        try {
            const raw = await fetch("/api/dashboard/get-by-slug", {
                method: "POST",
                body: JSON.stringify({ slug: dashboard_id }),
            });
            const res: ResponseData<
                | (ITableDashboard & {
                      profiles: { username: string; full_name: string };
                  })[]
                | null
            > = await raw.json();
            if (res.data && res?.data.length > 0) {
                const layout: ReactGridLayout.Layouts = JSON.parse(
                    res.data[0].layouts
                );
                Object.keys(layout).forEach((item) => {
                    layout[item] = layout[item].map((x) => {
                        return {
                            ...x,
                            y: x.y ?? Infinity,
                        };
                    });
                });
                setLayouts(layout);
                setViews(Number(res.data[0].views));
                setLikes(Number(res.data[0].likes));
                setData(JSON.parse(res.data[0].data));
                setUsername(res.data[0].profiles.username);
                setFullname(res.data[0].profiles.full_name);
                setTitle(res.data[0].title);
                setDescription(res.data[0].description);
                setId(res.data[0].id);
            } else setError(res.message);
        } catch (error) {
            if (error instanceof Error) setError(error.message);
            else setError("Unknown Error");
            console.log(error);
        }
        setLoadingDashboard(false);
    }, [dashboard_id]);

    useEffect(() => {
        getDashboard();
    }, [dashboard_id]);

    return {
        loadingDashboard,
        error,
        data,
        layouts,
        fullname,
        username,
        title,
        description,
        id,
        views,
        likes,
        getDashboard,
        setLikes,
    };
};
