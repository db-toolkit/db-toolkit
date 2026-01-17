/**
 * Lazy-loaded Recharts wrapper
 */
import { lazy, Suspense } from 'react';
import { Spinner } from '../common/Spinner';

const LineChart = lazy(() => import('recharts').then(module => ({ default: module.LineChart })));
const Line = lazy(() => import('recharts').then(module => ({ default: module.Line })));
const BarChart = lazy(() => import('recharts').then(module => ({ default: module.BarChart })));
const Bar = lazy(() => import('recharts').then(module => ({ default: module.Bar })));
const XAxis = lazy(() => import('recharts').then(module => ({ default: module.XAxis })));
const YAxis = lazy(() => import('recharts').then(module => ({ default: module.YAxis })));
const CartesianGrid = lazy(() => import('recharts').then(module => ({ default: module.CartesianGrid })));
const Tooltip = lazy(() => import('recharts').then(module => ({ default: module.Tooltip })));
const Legend = lazy(() => import('recharts').then(module => ({ default: module.Legend })));
const ResponsiveContainer = lazy(() => import('recharts').then(module => ({ default: module.ResponsiveContainer })));

function ChartLoadingFallback() {
  return (
    <div className="flex items-center justify-center h-64 bg-gray-50 dark:bg-gray-900 rounded-lg">
      <div className="flex flex-col items-center">
        <Spinner size={16} className="text-green-500" />
        <span className="mt-2 text-sm text-gray-500">Loading chart...</span>
      </div>
    </div>
  );
}

export function LazyLineChart(props) {
  return (
    <Suspense fallback={<ChartLoadingFallback />}>
      <LineChart {...props} />
    </Suspense>
  );
}

export function LazyLine(props) {
  return (
    <Suspense fallback={null}>
      <Line {...props} />
    </Suspense>
  );
}

export function LazyBarChart(props) {
  return (
    <Suspense fallback={<ChartLoadingFallback />}>
      <BarChart {...props} />
    </Suspense>
  );
}

export function LazyBar(props) {
  return (
    <Suspense fallback={null}>
      <Bar {...props} />
    </Suspense>
  );
}

export function LazyXAxis(props) {
  return (
    <Suspense fallback={null}>
      <XAxis {...props} />
    </Suspense>
  );
}

export function LazyYAxis(props) {
  return (
    <Suspense fallback={null}>
      <YAxis {...props} />
    </Suspense>
  );
}

export function LazyCartesianGrid(props) {
  return (
    <Suspense fallback={null}>
      <CartesianGrid {...props} />
    </Suspense>
  );
}

export function LazyTooltip(props) {
  return (
    <Suspense fallback={null}>
      <Tooltip {...props} />
    </Suspense>
  );
}

export function LazyLegend(props) {
  return (
    <Suspense fallback={null}>
      <Legend {...props} />
    </Suspense>
  );
}

export function LazyResponsiveContainer(props) {
  return (
    <Suspense fallback={null}>
      <ResponsiveContainer {...props} />
    </Suspense>
  );
}
