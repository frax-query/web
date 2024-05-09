"use client";

import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable";
import React, { useState } from "react";
import { MonacoEditor } from "@/components/code-editor";
import { useQuery } from "@/hooks/useQuery";
import { ResultAndChartSection } from "@/components/query/ResultAndChart";
import { ListQuery } from "@/components/query/ListQuery";
import { DatabaseSchema } from "@/components/query/DatabaseSchema";
import { HeaderCodeEditor } from "@/components/query/HeaderCodeEditor";

export default function Query() {
    const [formatCode, setFormatCode] = useState(() => () => {});
    const [title, setTitle] = useState("Click me to edit the title");
    const [query, setQuery] = useState<string | undefined>(
        "-- select * from viction_mainnet.log_events limit 10"
    );
    const { runQuery, loading, cancelQuery, loadingCancel, error, data } =
        useQuery();

    return (
        <div className="mx-auto h-[calc(100vh_-_65px)] max-w-[1800px]">
            <div className="flex h-full text-sm">
                <div className="w-80 flex-none border-r">
                    <ResizablePanelGroup direction="vertical">
                        <ResizablePanel>
                            <ListQuery />
                        </ResizablePanel>
                        <ResizableHandle withHandle={true} />
                        <ResizablePanel>
                            <DatabaseSchema />
                        </ResizablePanel>
                    </ResizablePanelGroup>
                </div>
                <div className="flex-1 border-r">
                    <ResizablePanelGroup direction="vertical">
                        <HeaderCodeEditor
                            cancelQuery={cancelQuery}
                            formatCode={formatCode}
                            loading={loading}
                            loadingCancel={loadingCancel}
                            query={query}
                            runQuery={runQuery}
                            setTitle={setTitle}
                            title={title}
                        />
                        <ResizablePanel>
                            <MonacoEditor
                                setFormatCode={setFormatCode}
                                setQuery={setQuery}
                            />
                        </ResizablePanel>
                        <ResizableHandle withHandle={true} />
                        <ResizablePanel>
                            <ResultAndChartSection
                                error={error}
                                loadingQuery={loading || loadingCancel}
                                result={data}
                            />
                        </ResizablePanel>
                    </ResizablePanelGroup>
                </div>
            </div>
        </div>
    );
}
