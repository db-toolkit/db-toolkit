import { useState, useEffect, lazy, Suspense } from 'react';
import { HashRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useWorkspaceShortcuts } from './hooks/workspace/useWorkspaceShortcuts';
import { useBackupWebSocket } from './websockets/useBackupWebSocket';
import { useTelemetry } from './hooks/system/useTelemetry';
import { useToast } from './contexts/ToastContext';
import Layout from './components/common/Layout';
import SplashScreen from './components/common/SplashScreen';
import { Spinner } from './components/common/Spinner';
import { useMenuActions } from './hooks/system/useMenuActions';
import { WorkspaceProvider } from './components/workspace/WorkspaceProvider';
import { OnboardingModal } from './components/onboarding/OnboardingModal';
import { onboardingUtils } from './utils/onboarding';
import './styles/App.css';
import './styles/split.css';

// Lazy load pages to reduce initial bundle size
const OverviewPage = lazy(() => import('./pages/OverviewPage'));
const ConnectionsPage = lazy(() => import('./pages/ConnectionsPage'));
const ConnectionGroupPage = lazy(() => import('./pages/ConnectionGroupPage'));
const SchemaPage = lazy(() => import('./pages/SchemaPage'));
const QueryPage = lazy(() => import('./pages/QueryPage'));
const QueryEditorSelectPage = lazy(() => import('./pages/QueryEditorSelectPage'));
const DataExplorerPage = lazy(() => import('./pages/DataExplorerPage'));
const MigrationsPage = lazy(() => import('./pages/MigrationsPage'));
const BackupsPage = lazy(() => import('./pages/BackupsPage'));
const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage'));
const DocumentationPage = lazy(() => import('./pages/DocumentationPage'));

function WorkspaceWrapper() {
  useWorkspaceShortcuts();
  return null;
}

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const { trackFeature } = useTelemetry();
  const toast = useToast();
  const [showOnboarding, setShowOnboarding] = useState(false);
  
  useMenuActions();
  useBackupWebSocket(() => {}); // Global listener for backup notifications

  // Check onboarding on mount
  useEffect(() => {
    if (!onboardingUtils.isCompleted()) {
      setShowOnboarding(true);
    }
  }, []);

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    navigate('/connections', { replace: true });
  };

  // Track feature/page usage
  useEffect(() => {
    const routeToFeature = {
      '/': 'dashboard',
      '/connections': 'connections',
      '/query-editor': 'query_editor_select',
      '/data-explorer': 'data_explorer',
      '/migrations': 'migrations',
      '/backups': 'backups',
      '/analytics': 'analytics',
      '/docs': 'documentation'
    };

    const path = location.pathname;
    let feature = routeToFeature[path];
    
    // Handle dynamic routes
    if (!feature) {
      if (path.startsWith('/query/')) feature = 'query_editor';
      else if (path.startsWith('/schema/')) feature = 'schema_explorer';
    }

    if (feature) {
      trackFeature(feature, 'view');
    }
  }, [location.pathname, trackFeature]);

  useEffect(() => {
    const sessionState = JSON.parse(localStorage.getItem('session-state') || '{}');
    if (!sessionState.has_opened_before) {
      localStorage.setItem('session-state', JSON.stringify({
        ...sessionState,
        has_opened_before: true,
        last_active: new Date().toISOString()
      }));
      navigate('/', { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    const handleUpdateAvailable = (event, data) => {
      if (!data?.latestVersion) return;
      toast.info(`Update available: ${data.latestVersion}. Check Help → Check for Updates.`);
    };

    if (window.electron?.ipcRenderer?.on) {
      window.electron.ipcRenderer.on('update:available', handleUpdateAvailable);
    }

    return () => {
      if (window.electron?.ipcRenderer?.removeAllListeners) {
        window.electron.ipcRenderer.removeAllListeners('update:available');
      }
    };
  }, [toast]);

  return (
    <WorkspaceProvider>
      <WorkspaceWrapper />
      {showOnboarding && <OnboardingModal onComplete={handleOnboardingComplete} />}
      <Layout>
        <Suspense fallback={
          <div className="flex items-center justify-center h-screen">
            <div className="flex flex-col items-center">
              <Spinner size={20} className="text-green-500" />
              <span className="mt-2 text-sm text-gray-500">Loading...</span>
            </div>
          </div>
        }>
          <Routes>
            <Route path="/" element={<OverviewPage />} />
            <Route path="/connections" element={<ConnectionsPage />} />
            <Route path="/connections/group/:groupName" element={<ConnectionGroupPage />} />
            <Route path="/schema/:connectionId" element={<SchemaPage />} />
            <Route path="/query-editor" element={<QueryEditorSelectPage />} />
            <Route path="/query/:connectionId" element={<QueryPage />} />
            <Route path="/data-explorer" element={<DataExplorerPage />} />
            <Route path="/migrations" element={<MigrationsPage />} />
            <Route path="/backups" element={<BackupsPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/docs" element={<DocumentationPage />} />
          </Routes>
        </Suspense>
      </Layout>
    </WorkspaceProvider>
  );
}

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Remove artificial delay - app is ready when React renders
    setLoading(false);

    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  if (loading) return <SplashScreen />;

  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
