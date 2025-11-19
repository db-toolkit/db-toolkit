import { useState, useEffect } from 'react';
import { Plus, Trash2, Folder } from 'lucide-react';
import { Button } from '../common/Button';

export function MigrationSettings() {
  const [projects, setProjects] = useState([]);
  const [newProject, setNewProject] = useState({ name: '', path: '' });

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('migration-projects') || '[]');
    setProjects(saved);
  }, []);

  const saveProjects = (updatedProjects) => {
    localStorage.setItem('migration-projects', JSON.stringify(updatedProjects));
    setProjects(updatedProjects);
  };

  const handleBrowse = async () => {
    const path = await window.electron.ipcRenderer.invoke('select-folder');
    if (path) {
      setNewProject(prev => ({ ...prev, path }));
    }
  };

  const handleAdd = () => {
    if (!newProject.name || !newProject.path) return;
    
    const updated = [...projects, newProject];
    saveProjects(updated);
    setNewProject({ name: '', path: '' });
  };

  const handleDelete = (index) => {
    const updated = projects.filter((_, i) => i !== index);
    saveProjects(updated);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Migration Projects
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Add project directories where your migration files are located.
        </p>
      </div>

      <div className="space-y-4">
        <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
            Add New Project
          </h4>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Project name"
              value={newProject.name}
              onChange={(e) => setNewProject(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Project path"
                value={newProject.path}
                onChange={(e) => setNewProject(prev => ({ ...prev, path: e.target.value }))}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <button
                onClick={handleBrowse}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white"
              >
                <Folder size={18} />
              </button>
            </div>
            <Button onClick={handleAdd} disabled={!newProject.name || !newProject.path}>
              <Plus size={16} className="mr-1" /> Add Project
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white">
            Saved Projects
          </h4>
          {projects.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No projects added yet
            </p>
          ) : (
            projects.map((project, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
              >
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {project.name}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {project.path}
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(index)}
                  className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
