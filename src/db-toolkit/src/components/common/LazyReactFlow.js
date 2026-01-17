/**
 * Lazy-loaded ReactFlow wrapper
 */
import { lazy, Suspense } from 'react';
import { Spinner } from '../common/Spinner';

const ReactFlow = lazy(() => import('reactflow').then(module => ({ default: module.default })));
const MiniMap = lazy(() => import('reactflow').then(module => ({ default: module.MiniMap })));
const Controls = lazy(() => import('reactflow').then(module => ({ default: module.Controls })));
const Background = lazy(() => import('reactflow').then(module => ({ default: module.Background })));

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center h-full bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center">
        <Spinner size={16} className="text-green-500" />
        <span className="mt-2 text-sm text-gray-500">Loading diagram...</span>
      </div>
    </div>
  );
}

export function LazyReactFlow(props) {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ReactFlow {...props} />
    </Suspense>
  );
}

export function LazyMiniMap(props) {
  return (
    <Suspense fallback={null}>
      <MiniMap {...props} />
    </Suspense>
  );
}

export function LazyControls(props) {
  return (
    <Suspense fallback={null}>
      <Controls {...props} />
    </Suspense>
  );
}

export function LazyBackground(props) {
  return (
    <Suspense fallback={null}>
      <Background {...props} />
    </Suspense>
  );
}

// Re-export hooks and other utilities
export { useNodesState, useEdgesState, ReactFlowProvider, useReactFlow, Handle, Position, Panel } from 'reactflow';
