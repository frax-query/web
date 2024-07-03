"use client";

import { Handle, Position, type NodeProps } from "reactflow";
import type { NodeData } from "@/types";
import { Card } from "../ui/card";
import { formatAddress } from "@/lib/utils";
import { WalletIcon } from "lucide-react";

const CustomNode = ({ data }: NodeProps<NodeData>) => {
    return (
        <Card className="p-4">
            <div className="flex items-center gap-2">
                <WalletIcon className="h-5 w-5" />
                <div>{formatAddress(data.id)}</div>
            </div>
            <Handle position={Position.Right} type="source" />
            <Handle position={Position.Left} type="target" />
        </Card>
    );
};

export default CustomNode;
