import { useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import DocContent from './components/DocContent';
import {
  gettingStartedData,
  connectionsData,
  queryEditorData,
  schemaExplorerData,
  dataExplorerData,
  backupRestoreData,
  settingsData,
} from './data';
import './App.css';

const docMap: Record<string, any> = {
  'getting-started': gettingStartedData,
  'connections': connectionsData,
  'query-editor': queryEditorData,
  'schema-explorer': schemaExplorerData,
  'data-explorer': dataExplorerData,
  'backup-restore': backupRestoreData,
  'settings': settingsData,
};

function App() {
  const [activeSection, setActiveSection] = useState('getting-started');

  return (
    <div className="app">
      <Header />
      <div className="main-container">
        <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
        <DocContent data={docMap[activeSection]} />
      </div>
    </div>
  );
}

export default App;
