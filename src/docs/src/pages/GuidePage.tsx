import { useState, useMemo, useCallback, useEffect } from 'react';
import { BookOpen, Database, Code } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import DocContent from '../components/DocContent';
import ScrollToTop from '../components/ScrollToTop';
import BottomBar from '../components/BottomBar';
import { useMDXDoc } from '../hooks/useMDXDoc';
import RightToc from '../components/RightToc';

const getMDXFilename = (section: string) => {
  return `${section}.mdx`;
};

const sections = [
  { id: 'getting-started', label: 'Getting Started' },
  { id: 'connections', label: 'Connections' },
  { id: 'workspaces', label: 'Workspaces' },
  { id: 'query-editor', label: 'Query Editor' },
  { id: 'schema-explorer', label: 'Schema Explorer' },
  { id: 'data-explorer', label: 'Data Explorer' },
  { id: 'backup-restore', label: 'Backup & Restore' },
  { id: 'migrations', label: 'Migrations' },
  { id: 'settings', label: 'Settings' },
];

interface GuidePageProps {
  navigateToSection?: string | null;
}

export default function GuidePage({ navigateToSection }: GuidePageProps) {
  const [activeSection, setActiveSection] = useState('getting-started');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const { data: currentData, loading, error } = useMDXDoc(getMDXFilename(activeSection));

  useEffect(() => {
    if (navigateToSection) {
      setActiveSection(navigateToSection);
    }
  }, [navigateToSection]);
  
  const { prevSection, nextSection } = useMemo(() => {
    const currentIndex = sections.findIndex(s => s.id === activeSection);
    return {
      prevSection: currentIndex > 0 ? sections[currentIndex - 1] : undefined,
      nextSection: currentIndex < sections.length - 1 ? sections[currentIndex + 1] : undefined
    };
  }, [activeSection]);
  
  const handleSectionChange = useCallback((section: string) => {
    setActiveSection(section);
  }, []);

  return (
    <>
      <div className="flex w-full h-auto pb-20 lg:pb-0">
        <div className="hidden lg:block w-72 flex-shrink-0" />
        <Sidebar 
          activeSection={activeSection} 
          onSectionChange={handleSectionChange}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
        <div className="flex w-full">
          {currentData && <DocContent 
            data={currentData} 
            prevSection={prevSection}
            nextSection={nextSection}
            onNavigate={setActiveSection}
          />}
          {currentData && (
            <RightToc items={currentData.sections.map((s) => ({ heading: s.heading }))} />
          )}
        </div>
      </div>
      
      <BottomBar
        items={[
          {
            label: 'Start',
            icon: <BookOpen size={20} />,
            onClick: () => setActiveSection('getting-started'),
            isActive: activeSection === 'getting-started'
          },
          {
            label: 'Connect',
            icon: <Database size={20} />,
            onClick: () => setActiveSection('connections'),
            isActive: activeSection === 'connections'
          },
          {
            label: 'Query',
            icon: <Code size={20} />,
            onClick: () => setActiveSection('query-editor'),
            isActive: activeSection === 'query-editor'
          }
        ]}
        onMenuClick={() => setIsSidebarOpen(true)}
      />
      
      <ScrollToTop />
    </>
  );
}
