import { useState, FormEvent } from 'react';
import { AuditReport, CompetitorAnalysis } from '../types';
import { Search, Loader2, ArrowRight, Target, ShieldAlert, FileText, TrendingUp, Map } from 'lucide-react';

interface CompetitorsViewProps {
  baseReport?: AuditReport;
}

export default function CompetitorsView({ baseReport }: CompetitorsViewProps) {
  const [competitorUrl, setCompetitorUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<CompetitorAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCompare = async (e: FormEvent) => {
    e.preventDefault();
    if (!baseReport || !competitorUrl) return;

    let targetUrl = competitorUrl;
    if (!/^https?:\/\//i.test(targetUrl)) {
      targetUrl = 'https://' + targetUrl;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const response = await fetch('/api/competitor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: baseReport.url, competitorUrl: targetUrl }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze competitor');
      }

      const data = await response.json();
      setAnalysis(data);
    } catch (err) {
      console.error(err);
      setError('Analysis failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (!baseReport) {
    return (
      <div className="text-center py-20 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">No Active Website</h2>
        <p className="text-slate-500">Run an audit on your website first to compare against competitors.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-1">Competitor Analysis</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm">Discover your competitive advantages and uncover content gaps against <span className="font-semibold text-slate-700 dark:text-slate-300">{baseReport.url}</span></p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-xl shadow-sm">
        <form onSubmit={handleCompare} className="max-w-2xl mx-auto relative">
          <div className="relative flex flex-col sm:flex-row items-center border border-slate-200 dark:border-slate-700 rounded-lg focus-within:border-indigo-400 dark:focus-within:border-indigo-500 overflow-hidden bg-slate-50 dark:bg-slate-950/50 shadow-sm transition-all p-1 gap-2">
            <div className="relative w-full flex items-center">
              <Search className="absolute left-3 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={competitorUrl}
                onChange={(e) => setCompetitorUrl(e.target.value)}
                placeholder="Enter competitor URL (e.g., competitor.com)"
                className="w-full pl-10 py-2.5 outline-none text-slate-600 dark:text-slate-200 bg-transparent text-sm"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isAnalyzing}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded font-bold text-xs uppercase tracking-wider transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 w-full sm:w-auto shrink-0"
            >
              {isAnalyzing ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing</>
              ) : (
                <>Compare <ArrowRight className="w-3.5 h-3.5" /></>
              )}
            </button>
          </div>
          {error && <p className="text-red-500 mt-2 text-sm text-center">{error}</p>}
        </form>
      </div>

      {analysis && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-xl shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2 uppercase tracking-wider">
              <Target className="w-4 h-4 text-green-500" /> Competitor Strengths
            </h3>
            <ul className="space-y-3">
              {analysis.strengths.map((s, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-3 rounded border border-slate-100 dark:border-slate-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 shrink-0" />
                  <span className="leading-relaxed">{s}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-xl shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2 uppercase tracking-wider">
              <ShieldAlert className="w-4 h-4 text-red-500" /> Competitor Weaknesses
            </h3>
            <ul className="space-y-3">
              {analysis.weaknesses.map((s, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-3 rounded border border-slate-100 dark:border-slate-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
                  <span className="leading-relaxed">{s}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-xl shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2 uppercase tracking-wider">
              <FileText className="w-4 h-4 text-blue-500" /> Content Gaps
            </h3>
            <ul className="space-y-3">
              {analysis.contentGaps.map((s, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-3 last:border-0 last:pb-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                  <span className="leading-relaxed">{s}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-xl shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 dark:text-white mb-4 flex items-center gap-2 uppercase tracking-wider">
              <TrendingUp className="w-4 h-4 text-purple-500" /> Keyword Opportunities
            </h3>
            <ul className="space-y-3">
              {analysis.keywordOpportunities.map((s, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-slate-600 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-3 last:border-0 last:pb-0">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5 shrink-0" />
                  <span className="leading-relaxed">{s}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2 bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-800 p-8 rounded-xl shadow-sm">
            <h3 className="text-sm font-bold text-indigo-900 dark:text-indigo-100 mb-6 flex items-center gap-2 uppercase tracking-wider">
              <Map className="w-4 h-4 text-indigo-500" /> Strategic Roadmap
            </h3>
            <div className="space-y-4">
              {analysis.roadmap.map((step, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-6 h-6 rounded bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                      {idx + 1}
                    </div>
                    {idx !== analysis.roadmap.length - 1 && (
                      <div className="w-px h-full bg-indigo-200 dark:bg-indigo-800/50 my-1" />
                    )}
                  </div>
                  <div className="pt-0.5 pb-4 text-sm text-indigo-900 dark:text-indigo-200 leading-relaxed font-medium">
                    {step}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
