import { Clock, ExternalLink, ArrowRight, Activity, TrendingUp, CheckSquare, Square, X, BarChart2, Search } from 'lucide-react';
import { AuditReport } from '../types';
import { View } from '../App';
import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

interface DashboardViewProps {
  reports: AuditReport[];
  navigate: (view: View, data?: { url?: string }) => void;
}

export default function DashboardView({ reports, navigate }: DashboardViewProps) {
  const [selectedForComparison, setSelectedForComparison] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('all');

  const filteredReports = reports.filter(r => {
    const matchesSearch = r.url.toLowerCase().includes(searchQuery.toLowerCase());
    let matchesDate = true;
    if (dateFilter === '7days') {
      matchesDate = new Date(r.date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    } else if (dateFilter === '30days') {
      matchesDate = new Date(r.date) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    }
    return matchesSearch && matchesDate;
  });

  const chartData = [...reports].reverse().map(r => ({
    date: new Date(r.date).toLocaleDateString(),
    score: r.overallScore,
    url: r.url
  }));

  const handleSelect = (url: string) => {
    setSelectedForComparison(prev => {
      if (prev.includes(url)) return prev.filter(u => u !== url);
      if (prev.length >= 2) return [prev[1], url];
      return [...prev, url];
    });
  };

  const report1 = reports.find(r => r.url === selectedForComparison[0]);
  const report2 = reports.find(r => r.url === selectedForComparison[1]);

  if (reports.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-12 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
          <Activity className="w-8 h-8 text-slate-400" />
        </div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-2">No Audits Yet</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-sm text-sm">
          You haven't run any website audits. Return to the home page to run your first AI-powered analysis.
        </p>
        <button
          onClick={() => navigate('home')}
          className="bg-indigo-600 text-white px-6 py-2.5 rounded hover:bg-indigo-700 font-semibold text-sm transition-colors"
        >
          Run First Audit
        </button>
      </div>
    );
  }

  const avgScore = Math.round(reports.reduce((acc, r) => acc + r.overallScore, 0) / reports.length);
  const totalItemsToFix = reports.reduce((acc, r) => acc + r.recommendations.length, 0);

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-1">Dashboard Overview</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Manage and review your saved reports.</p>
        </div>
        <button
          onClick={() => navigate('home')}
          className="bg-indigo-600 text-white px-4 py-2 rounded font-semibold hover:bg-indigo-700 text-sm transition-colors shadow-sm"
        >
          New Audit
        </button>
      </div>

      {report1 && report2 && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-indigo-200 dark:border-indigo-500/30 p-6 shadow-sm flex flex-col relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500"></div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-indigo-500" />
              Side-by-Side Comparison
            </h2>
            <button 
              onClick={() => setSelectedForComparison([])}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-6 relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-slate-200 dark:bg-slate-800 -translate-x-1/2"></div>
            
            {/* Report 1 */}
            <div className="flex flex-col items-center pr-4">
              <div className="font-bold text-slate-700 dark:text-slate-300 mb-2 truncate max-w-full text-center" title={report1.url}>
                {report1.url}
              </div>
              <div className="text-5xl font-black mb-4 text-slate-800 dark:text-white">
                {report1.overallScore}
              </div>
              <div className="w-full space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Performance</span>
                  <span className="font-bold">{report1.performanceScore}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Content Quality</span>
                  <span className="font-bold">{report1.contentQualityScore}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Mobile</span>
                  <span className="font-bold">{report1.mobileOptimizationScore}</span>
                </div>
              </div>
            </div>

            {/* Report 2 */}
            <div className="flex flex-col items-center pl-4">
              <div className="font-bold text-slate-700 dark:text-slate-300 mb-2 truncate max-w-full text-center" title={report2.url}>
                {report2.url}
              </div>
              <div className="text-5xl font-black mb-4 text-slate-800 dark:text-white">
                {report2.overallScore}
              </div>
              <div className="w-full space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Performance</span>
                  <span className={`font-bold ${report2.performanceScore > report1.performanceScore ? 'text-green-500' : report2.performanceScore < report1.performanceScore ? 'text-red-500' : ''}`}>{report2.performanceScore}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Content Quality</span>
                  <span className={`font-bold ${report2.contentQualityScore > report1.contentQualityScore ? 'text-green-500' : report2.contentQualityScore < report1.contentQualityScore ? 'text-red-500' : ''}`}>{report2.contentQualityScore}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Mobile</span>
                  <span className={`font-bold ${report2.mobileOptimizationScore > report1.mobileOptimizationScore ? 'text-green-500' : report2.mobileOptimizationScore < report1.mobileOptimizationScore ? 'text-red-500' : ''}`}>{report2.mobileOptimizationScore}</span>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 shrink-0">
        <div className="col-span-1 md:col-span-1 bg-indigo-600 rounded-xl p-5 text-white flex flex-col items-center justify-center space-y-2 shadow-sm">
          <div className="text-xs font-bold uppercase tracking-widest opacity-80 text-center">Avg SEO Score</div>
          <div className="text-5xl md:text-6xl font-black">{avgScore}</div>
          <div className="text-[10px] py-1 px-3 bg-white/20 rounded-full uppercase tracking-wider font-bold">Good Health</div>
        </div>

        <div className="col-span-1 md:col-span-3 grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 flex flex-col items-center justify-center shadow-sm">
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">Total Scans</span>
            <div className="text-4xl font-black text-slate-700 dark:text-slate-200">{reports.length}</div>
          </div>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 flex flex-col items-center justify-center shadow-sm">
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">Items to Fix</span>
            <div className="text-4xl font-black text-slate-700 dark:text-slate-200">{totalItemsToFix}</div>
          </div>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 flex flex-col items-center justify-center shadow-sm col-span-2 md:col-span-1">
            <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">Recent Score</span>
            <div className={`w-14 h-14 rounded-full border-4 flex items-center justify-center font-bold text-slate-700 dark:text-slate-200 text-lg ${
               (reports[0]?.overallScore || 0) >= 80 ? 'border-green-500' :
               (reports[0]?.overallScore || 0) >= 50 ? 'border-amber-400' :
               'border-red-500'
            }`}>
              {reports[0]?.overallScore || 0}
            </div>
          </div>
        </div>
      </div>

      {reports.length > 1 && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
          <h2 className="font-bold text-slate-700 dark:text-slate-300 text-sm mb-4">SEO Health Trend</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                <XAxis dataKey="date" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis domain={[0, 100]} stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ color: '#818cf8' }}
                />
                <Line type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={3} dot={{ r: 4, fill: '#6366f1', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col">
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h2 className="font-bold text-slate-700 dark:text-slate-300 text-sm flex items-center">
              Recent Audits <span className="text-slate-400 font-normal ml-2 text-xs hidden md:inline">(Select 2 for comparison)</span>
            </h2>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Filter by URL..." 
                  className="pl-9 pr-3 py-1.5 w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-sm outline-none focus:border-indigo-500 dark:focus:border-indigo-400 transition-colors"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <select 
                className="py-1.5 px-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md text-sm outline-none w-full sm:w-auto appearance-none"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              >
                <option value="all">All Time</option>
                <option value="7days">Last 7 Days</option>
                <option value="30days">Last 30 Days</option>
              </select>
            </div>
        </div>
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {filteredReports.map((report, idx) => {
            const isSelected = selectedForComparison.includes(report.url);
            return (
              <div key={idx} className={`p-5 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors gap-4 ${isSelected ? 'bg-indigo-50/30 dark:bg-indigo-900/10' : ''}`}>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => handleSelect(report.url)}
                    className="text-slate-400 hover:text-indigo-600 transition-colors shrink-0"
                  >
                    {isSelected ? <CheckSquare className="w-5 h-5 text-indigo-600 dark:text-indigo-400" /> : <Square className="w-5 h-5" />}
                  </button>
                  <div className={`w-12 h-12 rounded flex items-center justify-center text-lg font-bold shrink-0 ${
                    report.overallScore >= 80 ? 'bg-green-50 border border-green-200 text-green-700 dark:bg-green-500/10 dark:border-green-500/20 dark:text-green-400' :
                    report.overallScore >= 50 ? 'bg-amber-50 border border-amber-200 text-amber-700 dark:bg-amber-500/10 dark:border-amber-500/20 dark:text-amber-400' :
                    'bg-red-50 border border-red-200 text-red-700 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-400'
                  }`}>
                    {report.overallScore}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 dark:text-white text-sm flex items-center gap-2">
                      {report.url}
                      <a href={report.url} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-indigo-600 transition-colors">
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-slate-500 dark:text-slate-400 font-medium">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(report.date).toLocaleDateString()}</span>
                      <span className="flex items-center gap-1"><TrendingUp className="w-3 h-3" /> {report.recommendations.length} Recs</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => navigate('report', { url: report.url })}
                  className="flex items-center justify-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors w-full sm:w-auto"
                >
                  View Report
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
