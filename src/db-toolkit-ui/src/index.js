import ReactDOM from 'react-dom/client';
import './styles/index.css';
import App from './App';
import { ErrorBoundary } from './components/common/ErrorBoundary';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
