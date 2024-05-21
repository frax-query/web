"use client";

import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { MonacoEditor } from "@/components/code-editor";
import { getQuery, saveQuery, useQuery } from "@/hooks/useQuery";
import { ResultAndChartSection } from "@/components/query/ResultAndChart";
import { ListQuery } from "@/components/query/ListQuery";
import { DatabaseSchema } from "@/components/query/DatabaseSchema";
import { HeaderCodeEditor } from "@/components/query/HeaderCodeEditor";
import { useToast } from "@/components/ui/use-toast";
import { useRouter, useSearchParams } from "next/navigation";
import type { ICharts, ITableCharts, ITableQuery } from "@/types";
import { v4 as uuidv4 } from "uuid";

const defaultQueryValue: ITableQuery & {
    charts: ITableCharts[];
    isSaved: boolean;
} = {
    created_at: "",
    id: "1",
    query: "-- select * from viction_mainnet.log_events limit 10",
    title: "Untitle query",
    update_at: "",
    user_id: "",
    charts: [],
    isSaved: false,
};

export default function Query() {
    const [formatCode, setFormatCode] = useState(() => () => {});
    const [listQuery, setListQuery] = useState<
        (ITableQuery & { charts: ITableCharts[]; isSaved: boolean })[]
    >([]);

    const {
        runQuery,
        loading,
        cancelQuery,
        loadingCancel,
        error,
        data,
        resetData,
    } = useQuery();

    const {
        loading: loadingSave,
        error: errSave,
        saveQuery: save,
        updateQuery,
        deleteQuery: delQuery,
    } = saveQuery();

    const {
        error: errorGetList,
        loading: loadingList,
        getData: getListQueries,
    } = getQuery();

    const { toast } = useToast();

    useEffect(() => {
        if (errSave) {
            toast({
                title: "Error saving query",
                variant: "destructive",
                description: errSave,
            });
        }
    }, [errSave]);

    useEffect(() => {
        if (errorGetList) {
            toast({
                title: "Error getting list of query",
                variant: "destructive",
                description: errorGetList,
            });
        }
    }, [errorGetList]);

    const searchParams = useSearchParams();
    const idQuery = useMemo(() => searchParams.get("id"), [searchParams]);
    const router = useRouter();

    const [activeQuery, setActiveQuery] = useState<
        (ITableQuery & { charts: ITableCharts[]; isSaved: boolean }) | null
    >(null);
    const [listTabs, setListTabs] = useState<
        { id: number; chart_id: string; config: ICharts; query_id: string }[]
    >([]);

    useEffect(() => {
        (async () => {
            const res = await getListQueries();
            const data = res.map((item) => {
                return {
                    ...item,
                    isSaved: true,
                };
            });
            setListQuery(data);
            if (String(idQuery)) {
                if (String(idQuery)) {
                    const indexData = data.findIndex(
                        (x) => x.id === String(idQuery)
                    );
                    if (indexData > -1) {
                        setActiveQuery(data[indexData]);
                        setListTabs(
                            data[indexData].charts.map((item, index) => {
                                return {
                                    chart_id: item.id,
                                    config: JSON.parse(item.config),
                                    id: index + 1,
                                    query_id: item.query_id,
                                };
                            })
                        );
                    }
                    router.push("/query");
                }
            }
        })();
    }, []);

    const handleChangeQuery = useCallback(
        (e: string) => {
            setListQuery((prev) => {
                const newArr = [...prev];
                if (activeQuery) {
                    const indexData = newArr.findIndex(
                        (x) => x.id === activeQuery.id
                    );
                    newArr[indexData] = activeQuery;
                    newArr[indexData].charts = listTabs.map((y) => {
                        return {
                            config: JSON.stringify(y.config),
                            id: y.chart_id,
                            query_id: y.query_id,
                        };
                    });
                }
                return newArr;
            });
            const indexData = listQuery.findIndex((x) => x.id === e);
            setActiveQuery(listQuery[indexData]);
            setListTabs(
                listQuery[indexData].charts.map((item, index) => {
                    return {
                        chart_id: item.id,
                        config: JSON.parse(item.config),
                        id: index + 1,
                        query_id: item.query_id,
                    };
                })
            );
            resetData();
        },
        [
            activeQuery,
            listTabs,
            listQuery,
            setListQuery,
            setActiveQuery,
            setListTabs,
            resetData,
        ]
    );

    const setTitle = useCallback(
        (e: string) => {
            setActiveQuery((prev) => {
                if (prev) return { ...prev, title: e };
                return prev;
            });
        },
        [setActiveQuery]
    );

    const setQuery = useCallback(
        (e: string) => {
            setActiveQuery((prev) => {
                if (prev) return { ...prev, query: e };
                return prev;
            });
        },
        [setActiveQuery]
    );

    const addNewQuery = useCallback(() => {
        const newQuery = { ...defaultQueryValue, id: uuidv4() };
        setListQuery((prev) => [newQuery, ...prev]);
        setActiveQuery(newQuery);
        setListTabs([]);
    }, [defaultQueryValue, setListQuery, setActiveQuery, setListTabs, router]);

    const saveDataQuery = useCallback(async () => {
        if (activeQuery) {
            if (!activeQuery.isSaved) {
                const result = await save(
                    activeQuery?.query,
                    activeQuery?.title
                );
                if (result) {
                    setListQuery((prev) => {
                        const newArr = [...prev];
                        const indexData = newArr.findIndex(
                            (x) => x.id === activeQuery.id
                        );
                        if (indexData > -1) {
                            newArr[indexData] = {
                                ...activeQuery,
                                id: result.id,
                                query: result.query,
                                title: result.title,
                                isSaved: true,
                            };
                        }
                        return newArr;
                    });
                    setActiveQuery((prev) => {
                        if (prev)
                            return {
                                ...prev,
                                id: result.id,
                                query: result.query,
                                title: result.title,
                                isSaved: true,
                            };
                        return prev;
                    });
                    toast({
                        title: "Success saving query",
                        description: "Your query has been saved",
                        variant: "default",
                    });
                }
            } else {
                const isSuccessUpdate = await updateQuery(
                    activeQuery?.title,
                    activeQuery?.query,
                    activeQuery?.id
                );
                if (isSuccessUpdate) {
                    toast({
                        title: "Success saving query",
                        description: "Your query has been saved",
                        variant: "default",
                    });
                }
            }
        }
    }, [activeQuery, save, setActiveQuery, handleChangeQuery, updateQuery]);

    const deleteQuery = useCallback(
        async (e: string[]): Promise<string> => {
            const res = await delQuery(e);
            if (res) {
                toast({
                    title: "Failed to delete queries",
                    variant: "destructive",
                    description: res,
                });
                return res;
            }
            setActiveQuery(null);
            setListQuery((prev) => {
                const newArr = [...prev];
                return newArr.filter((item) => !e.includes(item.id));
            });
            toast({
                title: "Success",
                description: "Your query(s) has been deleted.",
            });
            return res;
        },
        [delQuery, setActiveQuery, setListQuery, toast]
    );

    return (
        <div className="mx-auto h-[calc(100vh_-_65px)] max-w-[1800px]">
            <div className="flex h-full text-sm">
                <div className="w-80 flex-none border-r">
                    <ResizablePanelGroup direction="vertical">
                        <ResizablePanel>
                            <ListQuery
                                listQuery={listQuery}
                                loading={loadingList}
                                queryDetail={activeQuery}
                                addNewQuery={addNewQuery}
                                handleChangeQuery={handleChangeQuery}
                                deleteQuery={deleteQuery}
                            />
                        </ResizablePanel>
                        <ResizableHandle withHandle={true} />
                        <ResizablePanel>
                            <DatabaseSchema />
                        </ResizablePanel>
                    </ResizablePanelGroup>
                </div>
                <div className="flex-1 border-r">
                    <ResizablePanelGroup direction="vertical">
                        {activeQuery && (
                            <HeaderCodeEditor
                                cancelQuery={cancelQuery}
                                formatCode={formatCode}
                                loading={loading}
                                loadingCancel={loadingCancel}
                                query={activeQuery.query}
                                runQuery={runQuery}
                                setTitle={setTitle}
                                title={activeQuery.title}
                                loadingSave={loadingSave}
                                saveDataQuery={saveDataQuery}
                            />
                        )}
                        <ResizablePanel>
                            <MonacoEditor
                                setFormatCode={setFormatCode}
                                setQuery={setQuery}
                                loading={loadingSave || loadingList}
                                query={activeQuery ? activeQuery.query : null}
                                activeQuery={!!activeQuery}
                            />
                        </ResizablePanel>
                        <ResizableHandle withHandle={true} />
                        <ResizablePanel>
                            {activeQuery && (
                                <ResultAndChartSection
                                    error={error}
                                    loadingQuery={loading || loadingCancel}
                                    result={data}
                                    key={activeQuery?.id}
                                    listTabs={listTabs}
                                    idQuery={activeQuery?.id ?? ""}
                                    setListTabs={setListTabs}
                                />
                            )}
                        </ResizablePanel>
                    </ResizablePanelGroup>
                </div>
            </div>
        </div>
    );
}
