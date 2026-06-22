import { Search, BarChart2, LayoutDashboard, Settings, Moon, Sun, Menu, X, Activity } from 'lucide-react';
import { View } from '../App';
import { useState } from 'react';

interface NavbarProps {
  currentView: View;
  navigate: (view: View) => void;
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
}

export default function Navbar({ currentView, navigate, darkMode, setDarkMode }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'competitors', label: 'Competitor Analysis', icon: Activity },
  ] as const;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 shrink-0 transition-colors">
      <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('home')}>
        <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center text-white font-bold text-sm">
          SG
        </div>
        <span className="text-xl font-bold tracking-tight text-slate-800 dark:text-white hidden sm:block">
          KOLO SEO Genius <span className="text-indigo-600 font-extrabold">AI</span>
        </span>
      </div>

      <nav className="hidden md:flex flex-1 justify-center items-center space-x-6 text-sm font-medium text-slate-500 dark:text-slate-400">
        {navItems.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => navigate(id as View)}
            className={`transition-colors py-1 ${
              currentView === id
                ? 'text-indigo-600 dark:text-indigo-400 font-semibold shadow-[0_2px_0_0_currentColor]'
                : 'hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            {label}
          </button>
        ))}
        {currentView === 'report' && (
           <span className="text-indigo-600 dark:text-indigo-400 font-semibold shadow-[0_2px_0_0_currentColor] py-1">
             Report Details
           </span>
        )}
      </nav>

      <div className="flex items-center space-x-4 md:space-x-6">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
          aria-label="Toggle dark mode"
        >
          {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
        
        <div className="hidden md:flex items-center space-x-4">
          <div className="h-4 w-px bg-slate-200 dark:bg-slate-700"></div>
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-[10px] text-slate-500 dark:text-slate-400 border border-slate-300 dark:border-slate-700">
              U
            </div>
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300 hidden lg:block">User</span>
          </div>
        </div>

        <button
          className="md:hidden p-2 text-slate-500"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="absolute top-14 left-0 right-0 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 md:hidden shadow-lg">
          <div className="px-4 py-3 space-y-2 flex flex-col">
            {navItems.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => {
                  navigate(id as View);
                  setMobileMenuOpen(false);
                }}
                className={`text-left px-3 py-2 rounded-md text-sm font-medium ${
                  currentView === id
                    ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
