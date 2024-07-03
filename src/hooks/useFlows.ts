import type { ITokenTransfers, ResponseData } from "@/types";
import { useState } from "react";

export const useFlows = () => {
    const [txHash, setTxHash] = useState("");
    const [listData, setListData] = useState<ITokenTransfers[]>([]);
    const [loading, setLoading] = useState(false);

    const getData = async () => {
        const query = `select * from fraxtal_mainnet.token_transfers where transaction_hash = '${txHash}'`;
        setLoading(true);
        await fetch("/api/query", {
            method: "POST",
            body: JSON.stringify({ query: query }),
        })
            .then(async (res) => {
                if (res.ok) {
                    const data: ResponseData<ITokenTransfers[] | null> =
                        await res.json();
                    setListData(data?.data ?? []);
                }
            })
            .finally(() => setLoading(false));
    };
    return {
        txHash,
        listData,
        loading,
        setTxHash,
        getData,
    };
};
