import { Database } from 'lucide-react';

export default function SplashScreen() {
  return (
    <div className="fixed inset-0 bg-gray-900 flex items-center justify-center z-50">
      <div className="text-center">
        <div className="inline-block animate-spin">
          <Database className="w-16 h-16 text-blue-500" />
        </div>
        <h1 className="mt-4 text-2xl font-bold text-white">DB Toolkit</h1>
      </div>
    </div>
  );
}
