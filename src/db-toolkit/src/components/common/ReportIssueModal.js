import { useState } from 'react';
import { X, Bug, Lightbulb, HelpCircle, FileText, Github} from 'lucide-react';
import { Button } from './Button';
import { useToast } from '../../contexts/ToastContext';
import { useIssues } from '../../hooks/useIssues';

export function ReportIssueModal({ isOpen, onClose }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [issueType, setIssueType] = useState('bug');
  const toast = useToast();
  const { createIssue, loading } = useIssues();

  if (!isOpen) return null;

  const handleSubmit = async () => {
    try {
      await createIssue({
        title,
        description,
        issue_type: issueType,
        environment: {
          os: navigator.platform,
          version: '0.1.0',
          user_agent: navigator.userAgent
        }
      });
      
      toast.success('Issue submitted successfully');
      setTitle('');
      setDescription('');
      setIssueType('bug');
      onClose();
    } catch (err) {
      toast.error(err.message || 'Failed to submit issue');
    }
  };

  const issueTypeIcons = {
    bug: <Bug size={16} className="text-red-500" />,
    feature: <Lightbulb size={16} className="text-yellow-500" />,
    question: <HelpCircle size={16} className="text-green-500" />,
    documentation: <FileText size={16} className="text-green-500" />
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <Github size={20} className="text-gray-700 dark:text-gray-300" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Report an Issue
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Issue Type
            </label>
            <select
              value={issueType}
              onChange={(e) => setIssueType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="bug">🐛 Bug Report</option>
              <option value="feature">💡 Feature Request</option>
              <option value="question">❓ Question</option>
              <option value="documentation">📄 Documentation</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Brief description of the issue"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide detailed information about the issue..."
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <p className="text-sm text-green-800 dark:text-green-200">
              Your issue will be recorded and reviewed by the development team.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-2 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSubmit}
            disabled={!title.trim() || !description.trim() || loading}
            loading={loading}
          >
            {loading ? 'Submitting...' : 'Submit'}
          </Button>
        </div>
      </div>
    </div>
  );
}
