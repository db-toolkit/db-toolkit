import ReactDOM from 'react-dom/client';
import './styles/index.css';
import App from './App';
import { AppProviders } from './contexts/AppProviders';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AppProviders>
    <App />
  </AppProviders>
);
