import {
    type CardType,
    type DeviceMode,
    type DeviceModeSize,
    type IDataDashboard,
    type ITableCharts,
    type ResponseData,
    type ITableDashboard,
} from "@/types";
import { useCallback, useEffect, useMemo, useState } from "react";
import type ReactGridLayout from "react-grid-layout";

const deviceModeSize: DeviceModeSize = {
    Desktop: "1800px",
    Tablet: "996px",
    Smartphone: "450px",
};

const defaultLayouts = {
    lg: [],
    md: [],
    sm: [],
    xs: [],
    xxs: [],
};

export const useDashboard = () => {
    const [layouts, setLayouts] =
        useState<ReactGridLayout.Layouts>(defaultLayouts);
    const [device, setDevice] = useState<DeviceMode>("Desktop");
    const [data, setData] = useState<IDataDashboard[]>([]);
    const [readMode, setReadMode] = useState(true);
    const [breakpoint, setBreakpoint] = useState("lg");
    const [listCharts, setListCharts] = useState<ITableCharts[]>([]);
    const [listDashboard, setListDashboard] = useState<ITableDashboard[]>([]);
    const [title, setTitle] = useState("Click to edit the title");
    const [description, setDescription] = useState("Clicl to edit description");
    const [id, setId] = useState("");
    const [laodingDashboard, setLoadingDashboard] = useState(false);
    const [errorDashboard, setErrorDashboard] = useState(false);

    const getAllDashboard = useCallback(async () => {
        try {
            const raw = await fetch("/api/dashboard/get-all", {
                method: "POST",
            });
            const data: ResponseData<ITableDashboard[] | null> =
                await raw.json();
            if (data.data) setListDashboard(data.data);
            else setListDashboard([]);
        } catch (error) {
            setListDashboard([]);
        }
    }, []);

    const handleAddCard: (
        typeCard: CardType,
        listLayouts: ReactGridLayout.Layouts,
        id: string,
        value: string
    ) => void = (typeCard, listLayouts, id, value) => {
        const newCard: ReactGridLayout.Layout = {
            i: id,
            h: typeCard === "chart" ? 20 : 10,
            w: 4,
            x: 0,
            minH: 1,
            minW: 1,
            y: Infinity,
        };
        const newLayouts = {
            lg: [...listLayouts["lg"], newCard],
            md: [...listLayouts["md"], newCard],
            sm: [...listLayouts["sm"], newCard],
            xs: [...listLayouts["xs"], newCard],
            xxs: [...listLayouts["xxs"], newCard],
        };
        const newData = { type: typeCard, id: id, value: value };
        setLayouts(newLayouts);
        setData((prev) => {
            const newArr = [...prev];
            newArr.push(newData);
            return newArr;
        });
    };

    const handleRemoveCard = (id: string) => {
        setLayouts((prev) => {
            const newObj = { ...prev };
            const listKeys = Object.keys(newObj);
            listKeys.forEach((item) => {
                newObj[item] = newObj[item].filter((x) => x.i !== id);
            });
            return newObj;
        });
        setData((prev) => {
            const newArr = [...prev];
            return newArr.filter((item) => item.id !== id);
        });
    };

    const handleChangeLayout: (
        layout: ReactGridLayout.Layout[],
        layouts: ReactGridLayout.Layouts
    ) => void = useCallback((layout, layouts) => {
        setLayouts(layouts);
    }, []);

    const handleSaveDashboard = useCallback(async () => {
        try {
            if (id) {
                const raw = await fetch("/api/dashboard/update", {
                    method: "POST",
                    body: JSON.stringify({
                        title: title,
                        description: description,
                        data: JSON.stringify(data),
                        layouts: JSON.stringify(layouts),
                        id: id,
                    }),
                });
                const result: ResponseData<null> = await raw.json();
                if (result.message)
                    return { isError: true, message: result.message };
                else return { isError: false, message: "" };
            } else {
                const raw = await fetch("/api/dashboard/insert", {
                    method: "POST",
                    body: JSON.stringify({
                        title: title,
                        description: description,
                        data: JSON.stringify(data),
                        layouts: JSON.stringify(layouts),
                    }),
                });
                const result: ResponseData<ITableDashboard[] | null> =
                    await raw.json();
                if (result.data) {
                    setId(result.data[0].id);
                    return { isError: false, message: "" };
                }
                return { isError: true, message: result.message };
            }
        } catch (error) {
            const err = error instanceof Error ? error.message : "Unkwon error";
            return { isError: true, message: err };
        }
    }, [data, layouts, id, title, description]);

    const createNewDashboard = useCallback(() => {
        setId("");
        setData([]);
        setLayouts(defaultLayouts);
        setDevice("Desktop");
        setBreakpoint("lg");
    }, []);

    const listGrid = useMemo(() => {
        return layouts[breakpoint];
    }, [layouts, breakpoint]);

    const loadDashboard = useCallback(async (id: string) => {
        try {
            setLoadingDashboard(true);
            const raw = await fetch("/api/dashboard/get-by-id", {
                method: "POST",
                body: JSON.stringify({ dashboard_id: id }),
            });
            const res: ResponseData<ITableDashboard[] | null> =
                await raw.json();
            if (res.data) {
                setId(res.data[0].id);
                setData(JSON.parse(res.data[0].data));
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
                setDevice("Desktop");
                setTitle(res.data[0].title);
                setDescription(res.data[0].description);
                setBreakpoint("lg");
                setLoadingDashboard(false);
                setErrorDashboard(false);
            } else {
                setErrorDashboard(true);
                setLoadingDashboard(false);
            }
        } catch (error) {
            setLoadingDashboard(false);
            setErrorDashboard(true);
        }
    }, []);

    useEffect(() => {
        (async () => {
            const raw = await fetch("/api/chart/get", { method: "post" });
            const res: ResponseData<ITableCharts[] | null> = await raw.json();
            setListCharts(res.data ?? []);
        })();
    }, []);

    return {
        layouts,
        readMode,
        deviceModeSize,
        device,
        listGrid,
        data,
        breakpoint,
        listCharts,
        listDashboard,
        title,
        description,
        id,
        laodingDashboard,
        errorDashboard,
        setId,
        setTitle,
        setDescription,
        setListDashboard,
        setData,
        setBreakpoint,
        setDevice,
        setReadMode,
        setLayouts,
        handleAddCard,
        handleChangeLayout,
        handleRemoveCard,
        getAllDashboard,
        handleSaveDashboard,
        createNewDashboard,
        loadDashboard,
    };
};
