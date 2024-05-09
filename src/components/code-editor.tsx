"use client";

import type { OnMount } from "@monaco-editor/react";
import Editor, { loader, useMonaco } from "@monaco-editor/react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { format } from "sql-formatter";
import { language, schema_tables } from "./sql";

loader.config({
    paths: {
        vs: "https://www.unpkg.com/monaco-editor/min/vs",
    },
});

export const MonacoEditor: React.FC<{
    setFormatCode: React.Dispatch<React.SetStateAction<() => void>>;
    setQuery: React.Dispatch<React.SetStateAction<string | undefined>>;
}> = ({ setFormatCode, setQuery }) => {
    const { theme } = useTheme();
    const [isClient, setIsClient] = useState(false);
    useEffect(() => {
        setIsClient(true);
    }, []);
    const monaco = useMonaco();
    useEffect(() => {
        monaco?.languages.registerDocumentFormattingEditProvider("sql1", {
            provideDocumentFormattingEdits(model, options) {
                const formatted = format(model.getValue(), {
                    //@ts-expect-error exce
                    indent: " ".repeat(options.tabSize),
                });
                return [
                    {
                        range: model.getFullModelRange(),
                        text: formatted,
                    },
                ];
            },
        });
        monaco?.languages.registerDocumentRangeFormattingEditProvider("sql1", {
            provideDocumentRangeFormattingEdits(model, range, options) {
                const formatted = format(model.getValueInRange(range), {
                    //@ts-expect-error exce
                    indent: " ".repeat(options.tabSize),
                });
                return [
                    {
                        range: range,
                        text: formatted,
                    },
                ];
            },
        });
        monaco?.languages.register({ id: "sql1" });
        const sugsArr = [
            ...language.keywords,
            ...language.operators,
            ...language.builtinFunctions,
        ];
        // @ts-expect-error expect to be error here
        monaco?.languages.setMonarchTokensProvider("sql1", language);
        monaco?.languages.registerCompletionItemProvider("sql1", {
            triggerCharacters: ["."],
            // @ts-expect-error expect to be error here
            provideCompletionItems: function (model, position) {
                const sugs = sugsArr.map((sug) => {
                    return {
                        label: sug,
                        kind: monaco?.languages.CompletionItemKind.Property,
                        insertText: sug.toUpperCase(),
                    };
                });
                const sugs_database = language.databases.map((item) => {
                    return {
                        label: item,
                        kind: monaco?.languages.CompletionItemKind.Folder,
                        insertText: item,
                    };
                });
                const last_chars = model.getValueInRange({
                    startLineNumber: position.lineNumber,
                    startColumn: 0,
                    endLineNumber: position.lineNumber,
                    endColumn: position.column,
                });
                // const word = model.getWordUntilPosition(position);
                const words = last_chars.replace("\t", "").split(" ");
                const active_typing = words[words.length - 1];
                const number_of_dot = active_typing.split(".").length - 1;

                if (number_of_dot > 0 && number_of_dot <= 2) {
                    if (
                        number_of_dot === 1 &&
                        Object.keys(schema_tables).includes(
                            active_typing.split(".")[0]
                        )
                    ) {
                        const object_tables =
                            schema_tables[
                                active_typing.split(
                                    "."
                                )[0] as keyof typeof schema_tables
                            ];
                        const list_tables = Object.keys(object_tables);
                        const table_suggestions = list_tables.map((item) => {
                            return {
                                label: item,
                                kind: monaco.languages.CompletionItemKind.File,
                                insertText: item,
                            };
                        });
                        return {
                            suggestions: table_suggestions,
                        };
                    } else {
                        const split_data = active_typing.split(".");
                        const db_name = split_data[0];
                        const table_name = split_data[split_data.length - 2];
                        const list_columns =
                            schema_tables?.[db_name]?.[table_name];
                        const sugs_columns = list_columns.map((item) => {
                            return {
                                label: item,
                                kind: monaco.languages.CompletionItemKind.Field,
                                insertText: item,
                            };
                        });
                        return {
                            suggestions: sugs_columns,
                        };
                    }
                }
                const sugs_tables = [];
                const sugs_columns = [];

                for (const key of Object.keys(schema_tables)) {
                    for (const keyTable of Object.keys(schema_tables[key])) {
                        sugs_tables.push({
                            label: keyTable,
                            kind: monaco.languages.CompletionItemKind.File,
                            insertText: keyTable,
                        });
                        for (const keyColumn of schema_tables[key][keyTable]) {
                            if (
                                sugs_columns.filter(
                                    (x) => x?.label === keyColumn
                                ).length === 0
                            ) {
                                sugs_columns.push({
                                    label: keyColumn,
                                    kind: monaco.languages.CompletionItemKind
                                        .Field,
                                    insertText: keyColumn,
                                });
                            }
                        }
                    }
                }
                return {
                    suggestions: [
                        ...sugs,
                        ...sugs_database,
                        ...sugs_tables,
                        ...sugs_columns,
                    ],
                };
            },
        });
        monaco?.editor.addKeybindingRules([
            {
                keybinding: monaco.KeyMod.CtrlCmd + monaco.KeyCode.Slash,
                command: "editor.action.commentLine",
                when: "editorTextFocus && !editorReadonly",
            },
        ]);
        monaco?.languages.setLanguageConfiguration("sql1", {
            comments: { blockComment: ["/*", "*/"], lineComment: "--" },
        });
    }, [monaco]);
    const handleEditorDidMount: OnMount = (editor) => {
        setFormatCode(
            () => () =>
                editor.trigger("editor", "editor.action.formatDocument", "")
        );
    };
    if (!isClient) return null;
    return (
        <Editor
            defaultLanguage="sql1"
            defaultValue="-- select * from viction_mainnet.log_events limit 10"
            language="sql1"
            theme={`${theme === "light" ? "" : "vs-dark"}`}
            onMount={handleEditorDidMount}
            options={{ minimap: { enabled: false } }}
            onChange={(q) => setQuery(q)}
        />
    );
};
