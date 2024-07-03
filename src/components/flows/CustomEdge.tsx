"use client";

import type { ITokenTransfers } from "@/types";
import type { FC } from "react";
import React from "react";
import type { EdgeProps } from "reactflow";
import { getBezierPath, EdgeLabelRenderer, BaseEdge } from "reactflow";

const CustomEdge: FC<EdgeProps<ITokenTransfers[]>> = ({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    data,
}) => {
    const [edgePath, labelX, labelY] = getBezierPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
    });

    return (
        <>
            <BaseEdge id={id} path={edgePath} />
            <EdgeLabelRenderer>
                <div
                    style={{
                        position: "absolute",
                        transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
                    }}
                    className="nodrag nopan rounded-sm border border-primary bg-muted px-4 py-1 text-[8px]"
                >
                    {data?.map((item) => {
                        return (
                            <div key={JSON.stringify(item)}>
                                {item.amount} {item.token_symbol}
                            </div>
                        );
                    })}
                </div>
            </EdgeLabelRenderer>
        </>
    );
};

export default CustomEdge;
