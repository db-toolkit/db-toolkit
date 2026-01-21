'use client';

import { Database, Users, Target, Sparkles } from 'lucide-react';
import Footer from '@/components/Footer';
import { GITHUB_URL } from '@/utils/constants';

export default function About() {
  return (
    <main className="min-h-screen bg-white dark:bg-gray-900 pt-24">
      <div className="container mx-auto px-6 py-12">
        <h1 className="animate-fade-in-up text-5xl font-bold text-center text-gray-900 dark:text-white mb-6">
          About DB Toolkit
        </h1>
        <p className="animate-fade-in-up-delay-2 text-xl text-center text-gray-600 dark:text-gray-300 mb-16 max-w-3xl mx-auto">
          A modern, cross-platform database management application built with passion and precision.
        </p>

        <div className="grid md:grid-cols-2 gap-12 mb-20">
          <div className="animate-fade-in-up-delay-3 bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 hover:shadow-2xl hover:scale-105 transition-all duration-300">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Our Mission</h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              To provide developers and database administrators with a powerful, intuitive, and free tool 
              that simplifies database management across multiple platforms and database systems.
            </p>
          </div>
          <div className="animate-fade-in-up-delay-4 bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 hover:shadow-2xl hover:scale-105 transition-all duration-300">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Our Vision</h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              To become the go-to database management tool for developers worldwide, making database 
              operations accessible, efficient, and enjoyable for everyone.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-8 mb-20">
          <div className="animate-fade-in-up-delay-5 bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 text-center hover:shadow-xl hover:scale-105 transition-all duration-300">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                <Database className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Multi-Database</h3>
            <p className="text-gray-600 dark:text-gray-300">Support for PostgreSQL, MySQL, SQLite, MongoDB</p>
          </div>
          <div className="animate-fade-in-up-delay-6 bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 text-center hover:shadow-xl hover:scale-105 transition-all duration-300">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-green-100 dark:bg-green-900/20 rounded-full">
                <Users className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Open Source</h3>
            <p className="text-gray-600 dark:text-gray-300">Free and open for everyone to use and contribute</p>
          </div>
          <div className="animate-fade-in-up-delay-7 bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 text-center hover:shadow-xl hover:scale-105 transition-all duration-300">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-purple-100 dark:bg-purple-900/20 rounded-full">
                <Target className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Cross-Platform</h3>
            <p className="text-gray-600 dark:text-gray-300">Available on macOS, Windows, and Linux</p>
          </div>
          <div className="animate-fade-in-up bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 text-center hover:shadow-xl hover:scale-105 transition-all duration-300" style={{ animationDelay: '0.8s', animationFillMode: 'backwards' }}>
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-yellow-100 dark:bg-yellow-900/20 rounded-full">
                <Sparkles className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Feature Packed</h3>
            <p className="text-gray-600 dark:text-gray-300">Query editor, backups, data explorer and editing, real-time analytics</p>
          </div>
        </div>

        <div className="animate-fade-in-up bg-gradient-to-r from-cyan-50 to-teal-50 dark:from-gray-800 dark:to-gray-800 rounded-2xl p-12 text-center" style={{ animationDelay: '0.9s', animationFillMode: 'backwards' }}>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Join Our Community
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
            DB Toolkit is open source and welcomes contributions from developers around the world.
          </p>
          <a
            href={GITHUB_URL}
            className="inline-block px-8 py-3 bg-gradient-to-r from-cyan-600 to-teal-600 text-white rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300 font-semibold"
          >
            Contribute on GitHub
          </a>
        </div>
      </div>
      <Footer />
    </main>
  );
}
