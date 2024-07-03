"use client";

import CustomEdge from "@/components/flows/CustomEdge";
import CustomNode from "@/components/flows/CustomNode";
import DataFlow from "@/components/flows/DataFlow";
import SearchData from "@/components/flows/Search";
import { Button } from "@/components/ui/button";
import { useFlows } from "@/hooks/useFlows";
// import { getLayoutedElements } from "@/lib/utils";
import type { ITokenTransfers } from "@/types";
import { AlignCenterVerticalIcon, DownloadIcon } from "lucide-react";
import type { Edge, EdgeTypes, NodeTypes } from "reactflow";
import ReactFlow, {
    Background,
    MarkerType,
    Panel,
    Position,
    useEdgesState,
    useNodesState,
} from "reactflow";
import "reactflow/dist/style.css";
// import dagre from "dagre";
// import type { Node } from "reactflow";

const nodeTypes: NodeTypes = {
    custom: CustomNode,
};

const edgeTypes: EdgeTypes = {
    custom: CustomEdge,
};

// const imageWidth = 1024;
// const imageHeight = 768;

// function downloadImage(dataUrl: string) {
//     const a = document.createElement("a");

//     a.setAttribute("download", "reactflow.png");
//     a.setAttribute("href", dataUrl);
//     a.click();
// }

// export const getLayoutedElements = (nodes: Node[], edges: Edge[]) => {
//     const dagreGraph = new dagre.graphlib.Graph();
//     dagreGraph.setDefaultEdgeLabel(() => ({}));

//     const nodeWidth = 300;
//     const nodeHeight = 100;
//     dagreGraph.setGraph({ rankdir: "LR" });

//     nodes.forEach((node) => {
//         dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
//     });

//     edges.forEach((edge) => {
//         dagreGraph.setEdge(edge.source, edge.target);
//     });

//     dagre.layout(dagreGraph);

//     nodes.forEach((node) => {
//         const nodeWithPosition = dagreGraph.node(node.id);
//         node.targetPosition = Position.Left;
//         node.sourcePosition = Position.Right;
//         node.position = {
//             x: nodeWithPosition.x - nodeWidth / 2,
//             y: nodeWithPosition.y - nodeHeight / 2,
//         };

//         return node;
//     });

//     return { nodes, edges };
// };

export default function Flows() {
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges] = useEdgesState<ITokenTransfers[]>([]);
    const { setTxHash, getData, loading, listData } = useFlows();

    const checkIfNodeExist = (val: string) => {
        return nodes.findIndex((v) => v.id === val);
    };

    const checkIfEdgeExist = (val: string) => {
        return edges.findIndex((v) => v.id === val);
    };

    const autoFlow = () => {
        // const d = getLayoutedElements(nodes, edges);
        // setNodes([...d.nodes]);
        // setEdges([...d.edges]);
    };

    const addNodes = (
        data: ITokenTransfers,
        id: string,
        isAddress: boolean
    ) => {
        setNodes((prev) => [
            ...prev,
            {
                data: { data: data, isAddress: isAddress, id: id },
                id: id,
                position: { x: 0, y: 0 },
                sourcePosition: Position.Right,
                targetPosition: Position.Left,
                type: "custom",
            },
        ]);
    };

    const addFlow = (value: ITokenTransfers) => {
        if (checkIfNodeExist(value.from_address) === -1)
            addNodes(value, value.from_address, true);
        if (checkIfNodeExist(value.to_address) === -1)
            addNodes(value, value.to_address, true);
        const edge: Edge = {
            id: value.from_address + value.to_address,
            source: value.from_address,
            target: value.to_address,
            animated: true,
            data: [value],
            type: "custom",
            markerEnd: { type: MarkerType.Arrow, width: 20, height: 20 },
        };
        const edgeIndex = checkIfEdgeExist(
            value.from_address + value.to_address
        );
        if (edgeIndex === -1) setEdges((prev) => [...prev, edge]);
        else {
            edges[edgeIndex].data?.push(value);
        }
    };

    return (
        <div className="mx-auto h-[calc(100vh_-_65px)] max-w-[1800px]">
            <ReactFlow
                className="h-full"
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                fitView
            >
                <Background />
                <Panel position="top-left">
                    <div className="flex items-center gap-2">
                        <SearchData
                            setTxHash={setTxHash}
                            getData={getData}
                            loading={loading}
                            listData={listData}
                            addFlow={addFlow}
                        />
                        <DataFlow />
                        <Button
                            variant="outline"
                            className="flex items-center gap-2"
                            onClick={() => autoFlow()}
                        >
                            <AlignCenterVerticalIcon className="h-4 w-4" />
                            <div>Auto Align Layout</div>
                        </Button>
                        <Button
                            variant="outline"
                            className="flex items-center gap-2"
                        >
                            <DownloadIcon className="h-4 w-4" />
                            <div>Export Flow</div>
                        </Button>
                    </div>
                </Panel>
            </ReactFlow>
        </div>
    );
}
