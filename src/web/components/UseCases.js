'use client';

import { Code, Database, LineChart, GitBranch, Shield, Zap } from 'lucide-react';

export default function UseCases() {
  const useCases = [
    {
      icon: <Code size={32} />,
      title: 'Developers',
      description: 'Build and test database schemas, run queries, and debug SQL with an intuitive interface.',
      scenarios: ['Local development', 'API testing', 'Schema design']
    },
    {
      icon: <Database size={32} />,
      title: 'Database Administrators',
      description: 'Manage multiple databases, monitor performance, and execute maintenance tasks efficiently.',
      scenarios: ['Multi-DB management', 'Performance tuning', 'User management']
    },
    {
      icon: <LineChart size={32} />,
      title: 'Data Analysts',
      description: 'Query data, export results, and analyze datasets without complex command-line tools.',
      scenarios: ['Data exploration', 'Report generation', 'CSV exports']
    },
    {
      icon: <GitBranch size={32} />,
      title: 'Migration Specialists',
      description: 'Plan, execute, and track database migrations with built-in version control.',
      scenarios: ['Schema migrations', 'Data transfers', 'Version tracking']
    },
    {
      icon: <Shield size={32} />,
      title: 'Backup Engineers',
      description: 'Automate backups, schedule retention policies, and restore data with confidence.',
      scenarios: ['Automated backups', 'Disaster recovery', 'Point-in-time restore']
    },
    {
      icon: <Zap size={32} />,
      title: 'DevOps Teams',
      description: 'Integrate database operations into CI/CD pipelines and automate deployments.',
      scenarios: ['CI/CD integration', 'Environment sync', 'Automated testing']
    }
  ];

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="animate-fade-in-up text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Built for Everyone
          </h2>
          <p className="animate-fade-in-up-delay-1 text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Whether you're a developer, DBA, or analyst, DB Toolkit adapts to your workflow
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {useCases.map((useCase, index) => (
            <div
              key={index}
              className="animate-fade-in-up bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-gray-700"
              style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'backwards' }}
            >
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-xl flex items-center justify-center text-white mb-6">
                {useCase.icon}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                {useCase.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {useCase.description}
              </p>
              <ul className="space-y-2">
                {useCase.scenarios.map((scenario, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="w-1.5 h-1.5 bg-cyan-600 dark:bg-cyan-400 rounded-full"></span>
                    {scenario}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
