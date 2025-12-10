import ReactDOM from 'react-dom/client';
import './styles/index.css';
import App from './App';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { ThemeProvider } from './contexts/ThemeContext';
import { ToastProvider } from './contexts/ToastContext';
import { SettingsProvider } from './contexts/SettingsContext';
import { NotificationProvider } from './contexts/NotificationContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ErrorBoundary>
    <SettingsProvider>
      <ThemeProvider>
        <NotificationProvider>
          <ToastProvider>
            <App />
          </ToastProvider>
        </NotificationProvider>
      </ThemeProvider>
    </SettingsProvider>
  </ErrorBoundary>
);
