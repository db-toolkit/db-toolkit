/**
 * Canvas area component for query builder
 */
import ReactFlow, { Background, Controls, MiniMap } from 'reactflow';
import Split from 'react-split';
import { ErrorDisplay } from './ErrorDisplay';
import { SQLPreview } from './SQLPreview';

export function QueryCanvas({
    nodes,
    edges,
    nodeTypes,
    validationErrors,
    sql,
    isExecuting,
    onNodesChange,
    onEdgesChange,
    onConnect,
    onEdgeClick,
    onDismissErrors,
    onExecute
}) {
    return (
        <div className="flex-1 flex flex-col">
            <Split
                direction="vertical"
                sizes={[70, 30]}
                minSize={[300, 150]}
                gutterSize={8}
                className="flex flex-col h-full"
            >
                <div className="overflow-hidden">
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
                        onEdgeClick={onEdgeClick}
                        nodeTypes={nodeTypes}
                        fitView
                        minZoom={0.2}
                        maxZoom={1.5}
                    >
                        <Background />
                        <Controls />
                        <MiniMap />
                    </ReactFlow>
                </div>

                <div className="overflow-hidden">
                    <ErrorDisplay
                        errors={validationErrors}
                        onDismiss={onDismissErrors}
                    />
                    <SQLPreview
                        sql={sql}
                        onExecute={onExecute}
                        isExecuting={isExecuting}
                    />
                </div>
            </Split>
        </div>
    );
}
