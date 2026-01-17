/**
 * Lazy-loaded Monaco Editor wrapper
 */
import { lazy, Suspense } from 'react';
import { Spinner } from '../common/Spinner';

const MonacoEditor = lazy(() => import('@monaco-editor/react'));

export default function LazyMonacoEditor(props) {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-full bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center">
          <Spinner size={16} className="text-green-500" />
          <span className="mt-2 text-sm text-gray-500">Loading editor...</span>
        </div>
      </div>
    }>
      <MonacoEditor {...props} />
    </Suspense>
  );
}
