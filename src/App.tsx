/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomeView from './views/HomeView';
import DashboardView from './views/DashboardView';
import ReportView from './views/ReportView';
import CompetitorsView from './views/CompetitorsView';
import { useLocalStorage } from './hooks/useLocalStorage';
import { AuditReport } from './types';
import { motion, AnimatePresence } from 'motion/react';

export type View = 'home' | 'dashboard' | 'report' | 'competitors';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('home');
  const [reports, setReports] = useLocalStorage<AuditReport[]>('seo-genius-reports', []);
  const [activeReportUrl, setActiveReportUrl] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useLocalStorage<boolean>('seo-genius-theme', false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const navigate = (view: View, data?: { url?: string }) => {
    if (data?.url) {
      setActiveReportUrl(data.url);
    }
    setCurrentView(view);
    window.scrollTo(0, 0);
  };

  const handleAuditComplete = (report: AuditReport) => {
    setReports((prev) => [report, ...prev.filter(r => r.url !== report.url)]);
    navigate('report', { url: report.url });
  };

  const activeReport = reports.find(r => r.url === activeReportUrl) || reports[0];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 flex flex-col font-sans selection:bg-indigo-500/30">
      <Navbar currentView={currentView} navigate={navigate} darkMode={darkMode} setDarkMode={setDarkMode} />
      
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 mt-14 flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col flex-1"
          >
            {currentView === 'home' && <HomeView onAuditComplete={handleAuditComplete} />}
            {currentView === 'dashboard' && <DashboardView reports={reports} navigate={navigate} />}
            {currentView === 'report' && <ReportView report={activeReport} />}
            {currentView === 'competitors' && <CompetitorsView baseReport={activeReport} />}
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}
