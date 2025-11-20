import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import DocContent from '../components/DocContent';
import CommandPalette from '../components/CommandPalette';
import {
  gettingStartedData,
  connectionsData,
  queryEditorData,
  schemaExplorerData,
  dataExplorerData,
  backupRestoreData,
  settingsData,
} from '../data';

const docMap: Record<string, any> = {
  'getting-started': gettingStartedData,
  'connections': connectionsData,
  'query-editor': queryEditorData,
  'schema-explorer': schemaExplorerData,
  'data-explorer': dataExplorerData,
  'backup-restore': backupRestoreData,
  'settings': settingsData,
};

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState('getting-started');
  const [isCommandOpen, setIsCommandOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandOpen(true);
      }
      if (e.key === 'Escape') {
        setIsCommandOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <div className="flex w-full">
        <div className="w-72 flex-shrink-0" />
        <Sidebar activeSection={activeSection} onSectionChange={setActiveSection} />
        <DocContent data={docMap[activeSection]} />
      </div>
      <CommandPalette 
        isOpen={isCommandOpen} 
        onClose={() => setIsCommandOpen(false)}
        onNavigate={setActiveSection}
      />
    </>
  );
}
