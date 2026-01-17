/**
 * Combined app providers for optimized initialization
 */
import { ErrorBoundary } from '../components/common/ErrorBoundary';
import { SettingsProvider } from './SettingsContext';
import { ThemeProvider } from './ThemeContext';
import { NotificationProvider } from './NotificationContext';
import { ToastProvider } from './ToastContext';

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
