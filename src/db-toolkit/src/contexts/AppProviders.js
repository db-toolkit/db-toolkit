/**
 * Combined app providers for optimized initialization
 */
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { SettingsProvider } from './contexts/SettingsContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { ToastProvider } from './contexts/ToastContext';

export function AppProviders({ children }) {
  return (
    <ErrorBoundary>
      <SettingsProvider>
        <ThemeProvider>
          <NotificationProvider>
            <ToastProvider>
              {children}
            </ToastProvider>
          </NotificationProvider>
        </ThemeProvider>
      </SettingsProvider>
    </ErrorBoundary>
  );
}
