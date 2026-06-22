import { useState, FormEvent } from 'react';
import { ArrowRight, Search, Zap, BarChart3, Smartphone, Code2, Sparkles, AlertCircle } from 'lucide-react';
import { AuditReport } from '../types';

interface HomeViewProps {
  onAuditComplete: (report: AuditReport) => void;
}

export default function HomeView({ onAuditComplete }: HomeViewProps) {
  const [url, setUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (e: FormEvent) => {
    e.preventDefault();
    if (!url) return;
    
    let targetUrl = url;
    if (!/^https?:\/\//i.test(targetUrl)) {
      targetUrl = 'https://' + targetUrl;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const response = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: targetUrl }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze website');
      }

      const data = await response.json();
      
      const report: AuditReport = {
        url: targetUrl,
        date: new Date().toISOString(),
        ...data
      };

      onAuditComplete(report);
    } catch (err) {
      console.error(err);
      setError('Analysis failed. Please ensure the URL is correct or try again in a moment.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const features = [
    { icon: BarChart3, title: 'SEO Analysis', desc: 'Identify critical on-page and off-page SEO issues instantly.' },
    { icon: Sparkles, title: 'AI Recommendations', desc: 'Get AI-driven, actionable steps to improve your rankings.' },
    { icon: Zap, title: 'Performance Audit', desc: 'Analyze page load speeds and Core Web Vitals.' },
    { icon: Smartphone, title: 'Mobile Friendliness', desc: 'Ensure your site is perfectly optimized for mobile devices.' },
  ];

  return (
    <div className="flex flex-col space-y-6 flex-1 w-full max-w-4xl mx-auto">
      {/* Hero / Input Section */}
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-8 md:p-12 flex flex-col justify-center items-center text-center space-y-6 shrink-0 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-indigo-50 dark:bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>
        
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white max-w-2xl relative z-10">
          Get an Instant AI-Powered SEO Audit of Any Website
        </h1>
        <p className="text-slate-500 dark:text-slate-400 max-w-xl text-sm leading-relaxed relative z-10">
          Enter a URL to analyze search visibility, performance, content quality, and deep optimization opportunities with our proprietary Gemini-powered analysis engine.
        </p>
        
        <form onSubmit={handleAnalyze} className="w-full max-w-2xl mt-2 relative z-10">
          <div className="flex flex-col sm:flex-row border-2 border-indigo-100 dark:border-indigo-900/40 rounded-lg sm:rounded-xl overflow-hidden focus-within:border-indigo-400 dark:focus-within:border-indigo-500 transition-all bg-white dark:bg-slate-950 shadow-sm">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter any website URL (e.g., example.com)"
              className="flex-1 px-4 py-4 outline-none text-slate-600 dark:text-slate-200 bg-transparent text-sm sm:text-base border-b-2 sm:border-b-0 border-indigo-50 sm:border-r-2 sm:border-indigo-50 dark:border-slate-800 w-full"
              required
            />
            <button
              type="submit"
              disabled={isAnalyzing}
              className={`bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 font-semibold transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base w-full sm:w-auto shrink-0 ${url.length > 0 && !isAnalyzing ? 'animate-pulse shadow-[0_0_15px_rgba(79,70,229,0.5)]' : ''}`}
            >
              {isAnalyzing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Analyzing
                </>
              ) : (
                <>Analyze Website</>
              )}
            </button>
          </div>
          {error && (
            <div className="absolute -bottom-8 left-0 w-full flex justify-center text-red-500 dark:text-red-400 text-sm">
              <span className="flex items-center gap-1"><AlertCircle className="w-4 h-4" /> {error}</span>
            </div>
          )}
        </form>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 shrink-0">
        {features.map((f, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 flex flex-col shadow-sm">
            <div className="w-10 h-10 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg flex items-center justify-center mb-4 text-slate-700 dark:text-slate-300">
              <f.icon className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-2">{f.title}</h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
