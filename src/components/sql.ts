export type NestedObject = {
    [key: string]: {
        [key: string]: string[];
    };
};

export const schema_tables: NestedObject = {
    fraxtal_mainnet: {
        blocks: [
            "block_number",
            "transaction_hash",
            "timestamp",
            "parent_hash",
            "parent_beacon_block_root",
            "nonce",
            "difficulty",
            "gas_limit",
            "gas_used",
            "state_root",
            "receipts_root",
            "blob_gas_used",
            "excess_blob_gas_used",
            "miner",
            "extra_data",
            "base_fee_per_gas",
            "transaction",
        ],
        log_events: [
            "transaction_hash",
            "block_hash",
            "block_number",
            "timestamp",
            "address",
            "data",
            "topics",
            "index",
            "transaction_index",
        ],
        transactions: [
            "transaction_hash",
            "timestamp",
            "from_address",
            "to_address",
            "contract_address",
            "index",
            "block_hash",
            "block_number",
            "logsbloom",
            "gas_used",
            "blob_gas_used",
            "cummulative_gas_used",
            "gas_price",
            "blob_gas_price",
            "type",
            "status",
            "root",
            "value",
        ],
        erc20: ["decimals", "token_address", "name", "symbol"],
    },
};

export const language = {
    defaultToken: "invalid",
    tokenPostfix: ".sql",
    ignoreCase: true,

    brackets: [
        { open: "[", close: "]", token: "delimiter.square" },
        { open: "(", close: ")", token: "delimiter.parenthesis" },
    ],
    databases: Object.keys(schema_tables),

    keywords: [
        "select",
        "from",
        "group",
        "by",
        "order",
        "with",
        "join",
        "left",
        "right",
        "inner",
        "outer",
        "distinc",
        "except",
        "having",
        "limit",
        "offset",
        "union",
        "as",
    ],
    operators: [
        // Logical
        "all",
        "and",
        "any",
        "between",
        "exists",
        "in",
        "like",
        "null",
        "is",
        "not",
        "or",
        "some",
        "arrayElement",
        "negate",
        "multiply",
        "divide",
        "modulo",
        "plus",
        "minus",
        "uquals",
        "notEquals",
        "lessOrEquals",
        "greaterOrEquals",
        "less",
        "greater",
        "notLike",
        "ilike",
        "extract",
    ],
    builtinFunctions: [
        // Aggregate
        "avg",
        "count",
        "max",
        "min",
        "sum",
        "uniq",
        "toDate",
        "toDateTime",
        "toYear",
        "toMonth",
        "toDayOfMonth",
        "toHour",
        "toMinute",
        "toSecond",
        "isNull",
        "isNotNull",
    ],
    builtinVariables: [],
    pseudoColumns: ["$ACTION", "$IDENTITY", "$ROWGUID", "$PARTITION"],
    tokenizer: {
        root: [
            { include: "@comments" },
            { include: "@whitespace" },
            { include: "@pseudoColumns" },
            { include: "@numbers" },
            { include: "@strings" },
            { include: "@complexIdentifiers" },
            { include: "@scopes" },
            [/[;,.]/, "delimiter"],
            [/[()]/, "@brackets"],
            [
                /[\w@#$]+/,
                {
                    cases: {
                        "@keywords": "keyword",
                        "@operators": "operator",
                        "@builtinVariables": "predefined",
                        "@builtinFunctions": "predefined",
                        "@default": "identifier",
                    },
                },
            ],
            [/[<>=!%&+\-*/|~^]/, "operator"],
        ],
        whitespace: [[/\s+/, "white"]],
        comments: [
            [/--+.*/, "comment"],
            [/\/\*/, { token: "comment.quote", next: "@comment" }],
        ],
        comment: [
            [/[^*/]+/, "comment"],
            // Not supporting nested comments, as nested comments seem to not be standard?
            // i.e. http://stackoverflow.com/questions/728172/are-there-multiline-comment-delimiters-in-sql-that-are-vendor-agnostic
            // [/\/\*/, { token: 'comment.quote', next: '@push' }],    // nested comment not allowed :-(
            [/\*\//, { token: "comment.quote", next: "@pop" }],
            [/./, "comment"],
        ],
        pseudoColumns: [
            [
                /[$][A-Za-z_][\w@#$]*/,
                {
                    cases: {
                        "@pseudoColumns": "predefined",
                        "@default": "identifier",
                    },
                },
            ],
        ],
        numbers: [
            [/0[xX][0-9a-fA-F]*/, "number"],
            [/[$][+-]*\d*(\.\d*)?/, "number"],
            [/((\d+(\.\d*)?)|(\.\d+))([eE][-+]?\d+)?/, "number"],
        ],
        strings: [
            [/N'/, { token: "string", next: "@string" }],
            [/'/, { token: "string", next: "@string" }],
        ],
        string: [
            [/[^']+/, "string"],
            [/''/, "string"],
            [/'/, { token: "string", next: "@pop" }],
        ],
        complexIdentifiers: [
            [/\[/, { token: "identifier.quote", next: "@bracketedIdentifier" }],
            [/"/, { token: "identifier.quote", next: "@quotedIdentifier" }],
        ],
        bracketedIdentifier: [
            [/[^\]]+/, "identifier"],
            [/]]/, "identifier"],
            [/]/, { token: "identifier.quote", next: "@pop" }],
        ],
        quotedIdentifier: [
            [/[^"]+/, "identifier"],
            [/""/, "identifier"],
            [/"/, { token: "identifier.quote", next: "@pop" }],
        ],
        scopes: [
            [/BEGIN\s+(DISTRIBUTED\s+)?TRAN(SACTION)?\b/i, "keyword"],
            [/BEGIN\s+TRY\b/i, { token: "keyword.try" }],
            [/END\s+TRY\b/i, { token: "keyword.try" }],
            [/BEGIN\s+CATCH\b/i, { token: "keyword.catch" }],
            [/END\s+CATCH\b/i, { token: "keyword.catch" }],
            [/(BEGIN|CASE)\b/i, { token: "keyword.block" }],
            [/END\b/i, { token: "keyword.block" }],
            [/WHEN\b/i, { token: "keyword.choice" }],
            [/THEN\b/i, { token: "keyword.choice" }],
        ],
    },
};

export default language;
