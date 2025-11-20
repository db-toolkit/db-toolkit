import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import DocContent from '../components/DocContent';
import {
  gettingStartedData,
  connectionsData,
  queryEditorData,
  schemaExplorerData,
  dataExplorerData,
  backupRestoreData,
  migrationsData,
  settingsData,
} from '../data';

const sections = [
  { id: 'getting-started', label: 'Getting Started', data: gettingStartedData },
  { id: 'connections', label: 'Connections', data: connectionsData },
  { id: 'query-editor', label: 'Query Editor', data: queryEditorData },
  { id: 'schema-explorer', label: 'Schema Explorer', data: schemaExplorerData },
  { id: 'data-explorer', label: 'Data Explorer', data: dataExplorerData },
  { id: 'backup-restore', label: 'Backup & Restore', data: backupRestoreData },
  { id: 'migrations', label: 'Migrations', data: migrationsData },
  { id: 'settings', label: 'Settings', data: settingsData },
];

const docMap: Record<string, any> = {
  'getting-started': gettingStartedData,
  'connections': connectionsData,
  'query-editor': queryEditorData,
  'schema-explorer': schemaExplorerData,
  'data-explorer': dataExplorerData,
  'backup-restore': backupRestoreData,
  'migrations': migrationsData,
  'settings': settingsData,
};

export default function GuidePage() {
  const [activeSection, setActiveSection] = useState('getting-started');
  
  const currentIndex = sections.findIndex(s => s.id === activeSection);
  const prevSection = currentIndex > 0 ? sections[currentIndex - 1] : undefined;
  const nextSection = currentIndex < sections.length - 1 ? sections[currentIndex + 1] : undefined;

  return (
    <div className="flex w-full">
      <div className="w-72 flex-shrink-0" />
      <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
      <DocContent 
        data={docMap[activeSection]} 
        prevSection={prevSection}
        nextSection={nextSection}
        onNavigate={setActiveSection}
      />
    </div>
  );
}
