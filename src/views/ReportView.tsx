import { AuditReport } from '../types';
import { Download, AlertTriangle, CheckCircle2, ChevronRight, Activity, Smartphone, Settings, Sparkles, CheckSquare, X } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useState } from 'react';
import jsPDF from 'jspdf';

interface ReportViewProps {
  report?: AuditReport;
}

export default function ReportView({ report }: ReportViewProps) {
  const safeReportUrl = report?.url || 'default';
  const [completedTasks, setCompletedTasks] = useLocalStorage<string[]>(`completed-tasks-${safeReportUrl}`, []);
  const [isDownloading, setIsDownloading] = useState(false);
  const [activeScoreCategory, setActiveScoreCategory] = useState<string | null>(null);

  const handleDownloadPdf = () => {
    if (!report) return;
    setIsDownloading(true);
    setTimeout(() => {
      try {
        const doc = new jsPDF();
        
        doc.setFontSize(20);
        doc.text(`KOLO SEO Genius AI - Audit Report`, 20, 20);
        
        doc.setFontSize(14);
        doc.text(`URL: ${report.url}`, 20, 30);
        doc.text(`Date: ${new Date(report.date).toLocaleDateString()}`, 20, 40);
        
        doc.setFontSize(16);
        doc.text(`Scores`, 20, 55);
        doc.setFontSize(12);
        doc.text(`Overall Score: ${report.overallScore}`, 20, 65);
        doc.text(`Performance: ${report.performanceScore}`, 20, 75);
        doc.text(`Content Quality: ${report.contentQualityScore}`, 20, 85);
        doc.text(`Mobile Optimization: ${report.mobileOptimizationScore}`, 20, 95);
        doc.text(`User Experience: ${report.userExperienceScore}`, 20, 105);
        doc.text(`Technical SEO: ${report.technicalSEOScore}`, 20, 115);

        doc.setFontSize(16);
        doc.text(`Recommendations`, 20, 135);
        
        doc.setFontSize(10);
        let yPos = 145;
        report.recommendations.forEach((rec, index) => {
          if (yPos > 270) {
            doc.addPage();
            yPos = 20;
          }
          const recText = `[${rec.priority.toUpperCase()}] ${rec.title}`;
          doc.text(recText, 20, yPos);
          yPos += 7;
          
          const descLines = doc.splitTextToSize(rec.description, 170);
          doc.text(descLines, 25, yPos);
          yPos += (7 * descLines.length) + 5;
        });

        doc.save(`KOLO_SEO_Report_${report.url.replace(/[^a-z0-9]/gi, '_')}.pdf`);
      } catch (err) {
        console.error('Failed to generate PDF', err);
      } finally {
        setIsDownloading(false);
      }
    }, 1500);
  };

  const toggleTask = (taskTitle: string) => {
    setCompletedTasks(prev => 
      prev.includes(taskTitle) ? prev.filter(t => t !== taskTitle) : [...prev, taskTitle]
    );
  };

  const quickWins = report?.recommendations.filter(r => r.priority === 'quick-win') || [];
  const otherRecommendations = report?.recommendations.filter(r => r.priority !== 'quick-win') || [];

  if (!report) {
    return (
      <div className="text-center py-20 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">No Report Found</h2>
        <p className="text-slate-500">Run an audit from the home page to view the report.</p>
      </div>
    );
  }

  const scores = [
    { name: 'Performance', score: report.performanceScore, color: 'text-green-500', border: 'border-green-500' },
    { name: 'Content', score: report.contentQualityScore, color: 'text-amber-500', border: 'border-amber-400' },
    { name: 'Mobile', score: report.mobileOptimizationScore, color: 'text-green-500', border: 'border-green-500' },
    { name: 'UX Score', score: report.userExperienceScore, color: 'text-indigo-500', border: 'border-indigo-400' },
    { name: 'Technical', score: report.technicalSEOScore, color: 'text-slate-500', border: 'border-slate-300 border-t-indigo-600' }
  ];

  const scoreDetails: Record<string, { title: string, items: { label: string, value: string }[] }> = {
    'Performance': {
      title: 'Performance Insights',
      items: [
        { label: 'Page Speed', value: report.insights.pageSpeed }
      ]
    },
    'Content': {
      title: 'Content Quality',
      items: [
        { label: 'Heading Structure', value: report.insights.headingStructure },
        { label: 'Keyword Optimization', value: report.insights.keywordOptimization },
        { label: 'Readability', value: report.insights.contentReadability }
      ]
    },
    'Mobile': {
      title: 'Mobile Optimization',
      items: [
        { label: 'Mobile Responsiveness', value: report.insights.mobileResponsiveness }
      ]
    },
    'UX Score': {
      title: 'User Experience',
      items: [
        { label: 'Accessibility', value: report.insights.accessibility },
        { label: 'Call to Action', value: report.insights.callToAction }
      ]
    },
    'Technical': {
      title: 'Technical SEO',
      items: [
        { label: 'Meta Title', value: report.insights.metaTitle },
        { label: 'Meta Description', value: report.insights.metaDescription },
        { label: 'Internal Linking', value: report.insights.internalLinking }
      ]
    }
  };

  const getPriorityStyle = (priority: string) => {
    switch(priority) {
      case 'critical': return 'bg-red-50 border-red-100 text-red-800 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-400';
      case 'important': return 'bg-amber-50 border-amber-100 text-amber-800 dark:bg-amber-500/10 dark:border-amber-500/20 dark:text-amber-400';
      case 'quick-win': return 'bg-indigo-50 border-indigo-100 text-indigo-800 dark:bg-indigo-500/10 dark:border-indigo-500/20 dark:text-indigo-400';
      default: return 'bg-slate-50 border-slate-200 text-slate-800 dark:bg-slate-800/50 dark:border-slate-700 dark:text-slate-300';
    }
  };

  const getPriorityLabel = (priority: string) => {
    if (priority === 'quick-win') return 'QUICK WIN';
    if (priority === 'long-term') return 'GROWTH';
    return priority.toUpperCase();
  };

  const getPriorityDot = (priority: string) => {
    switch(priority) {
      case 'critical': return 'bg-red-500';
      case 'important': return 'bg-amber-500';
      case 'quick-win': return 'bg-indigo-500';
      default: return 'bg-slate-500';
    }
  };

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white">Audit Report</h1>
          </div>
          <p className="text-slate-500 dark:text-slate-400 flex items-center gap-3 text-sm">
            <span className="font-semibold text-slate-700 dark:text-slate-300">{report.url}</span>
            <span className="text-slate-300 hidden sm:inline">•</span>
            <span>{new Date(report.date).toLocaleDateString()}</span>
          </p>
        </div>
        <button 
          onClick={handleDownloadPdf}
          disabled={isDownloading}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded font-bold text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm uppercase tracking-wider disabled:opacity-50"
        >
          {isDownloading ? (
            <><div className="w-3.5 h-3.5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" /> Generating...</>
          ) : (
            <><Download className="w-3.5 h-3.5" /> Export PDF</>
          )}
        </button>
      </div>

      {/* Score Grid Matching Theme */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 shrink-0">
        {/* Overall Card */}
        <div className="col-span-1 lg:col-span-1 bg-indigo-600 rounded-xl p-5 text-white flex flex-col items-center justify-center space-y-2 shadow-sm min-h-[160px]">
          <div className="text-xs font-bold uppercase tracking-widest opacity-80 text-center">Overall SEO Score</div>
          <div className="text-6xl font-black">{report.overallScore}</div>
          <div className="text-[10px] py-1 px-3 bg-white/20 rounded-full font-bold uppercase tracking-wider">
            {report.overallScore >= 80 ? 'Good Health' : report.overallScore >= 50 ? 'Needs Work' : 'Critical Issues'}
          </div>
        </div>
        
        {/* Metrics Summary */}
        <div className="col-span-1 lg:col-span-3 grid grid-cols-2 md:grid-cols-5 gap-4">
          {scores.map((s, i) => (
            <button 
              key={i} 
              onClick={() => setActiveScoreCategory(s.name)}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col items-center justify-center space-y-4 shadow-sm min-h-[160px] hover:border-indigo-400 dark:hover:border-indigo-500 hover:shadow-md transition-all group relative"
            >
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <Sparkles className="w-3 h-3 text-indigo-400" />
              </div>
              <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider text-center flex-1 transition-colors group-hover:text-indigo-600 dark:group-hover:text-indigo-400">{s.name}</span>
              <div className={`w-14 h-14 rounded-full border-4 ${s.border} flex items-center justify-center font-bold text-slate-700 dark:text-slate-200 text-lg mb-2 group-hover:scale-105 transition-transform`}>
                {s.score}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Insight Modal */}
      {activeScoreCategory && scoreDetails[activeScoreCategory] && (
        <div className="fixed inset-0 bg-slate-900/50 dark:bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setActiveScoreCategory(null)}>
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-lg shadow-xl overflow-hidden border border-slate-200 dark:border-slate-800" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
              <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-500" />
                {scoreDetails[activeScoreCategory].title}
              </h3>
              <button 
                onClick={() => setActiveScoreCategory(null)}
                className="text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 p-1.5 rounded-full transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              {scoreDetails[activeScoreCategory].items.map((item, idx) => (
                <div key={idx} className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    {item.label}
                  </h4>
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg border border-slate-100 dark:border-slate-800">
                    {item.value || "No insights discovered."}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Wins Actionable Checklist */}
        {quickWins.length > 0 && (
          <div className="col-span-1 lg:col-span-3 bg-white dark:bg-slate-900 rounded-xl border border-indigo-200 dark:border-indigo-500/30 overflow-hidden flex flex-col shadow-sm">
             <div className="px-4 py-3 border-b border-indigo-100 dark:border-indigo-500/20 flex items-center justify-between bg-indigo-50/50 dark:bg-indigo-900/20">
               <h2 className="font-bold text-indigo-700 dark:text-indigo-300 text-sm flex items-center">
                 <CheckSquare className="w-4 h-4 mr-2" />
                 Quick Wins Actionable Checklist
               </h2>
               <span className="text-[10px] bg-indigo-200 dark:bg-indigo-800 text-indigo-800 dark:text-indigo-200 px-2 py-0.5 rounded font-bold uppercase">
                 {completedTasks.length} / {quickWins.length} COMPLETED
               </span>
             </div>
             <div className="p-4 space-y-3">
               {quickWins.map((rec, idx) => {
                 const isCompleted = completedTasks.includes(rec.title);
                 return (
                   <div key={idx} className={`flex items-start p-3 rounded-lg border transition-all ${isCompleted ? 'bg-slate-50 border-slate-200 opacity-60 dark:bg-slate-800/50 dark:border-slate-700' : getPriorityStyle(rec.priority)}`}>
                     <button 
                       onClick={() => toggleTask(rec.title)}
                       className={`mt-0.5 mr-3 shrink-0 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors ${isCompleted ? 'text-indigo-600 dark:text-indigo-400' : ''}`}
                     >
                       <CheckCircle2 className="w-5 h-5" />
                     </button>
                     <div className="flex-1 mr-4">
                       <p className={`font-bold ${isCompleted ? 'line-through text-slate-500 dark:text-slate-400' : ''}`}>{rec.title}</p>
                       <p className={`opacity-80 text-xs mt-1 leading-relaxed ${isCompleted ? 'line-through text-slate-400 dark:text-slate-500' : ''}`}>{rec.description}</p>
                     </div>
                     <span className="text-[10px] font-bold bg-white dark:bg-slate-950/50 px-2 py-1 rounded shadow-sm shrink-0 uppercase mt-0.5">
                       QUICK WIN
                     </span>
                   </div>
                 );
               })}
             </div>
          </div>
        )}

        {/* AI Recommendations */}
        <div className="col-span-1 lg:col-span-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col shadow-sm">
          <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
            <h2 className="font-bold text-slate-700 dark:text-slate-300 text-sm flex items-center">
              <Sparkles className="w-4 h-4 mr-2 text-indigo-500" />
              AI-Generated Recommendations
            </h2>
            <span className="text-[10px] bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded font-bold uppercase">
              {otherRecommendations.length} OTHER ISSUES
            </span>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3 text-sm max-h-[600px]">
            {otherRecommendations.map((rec, idx) => (
              <div key={idx} className={`flex items-start p-3 rounded-lg border ${getPriorityStyle(rec.priority)}`}>
                <span className={`w-2 h-2 rounded-full mt-1.5 mr-3 shrink-0 ${getPriorityDot(rec.priority)}`}></span>
                <div className="flex-1 mr-4">
                  <p className="font-bold">{rec.title}</p>
                  <p className="opacity-80 text-xs mt-1 leading-relaxed">{rec.description}</p>
                </div>
                <span className="text-[10px] font-bold bg-white dark:bg-slate-950/50 px-2 py-1 rounded shadow-sm shrink-0 uppercase">
                  {getPriorityLabel(rec.priority)}
                </span>
              </div>
            ))}
            {otherRecommendations.length === 0 && (
              <div className="text-center py-8 text-slate-500 text-sm">
                No recommendations found. Your SEO is looking perfect!
              </div>
            )}
          </div>
        </div>

        {/* AI Insights List replacing the Competitor comparison box from theme to preserve functionality */}
        <div className="col-span-1 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col shadow-sm">
          <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center gap-2">
            <Activity className="w-4 h-4 text-slate-500" />
            <h2 className="font-bold text-slate-700 dark:text-slate-300 text-sm">Technical Insights</h2>
          </div>
          <div className="p-4 flex-1 overflow-y-auto max-h-[600px] flex flex-col space-y-4">
            {Object.entries(report.insights).slice(0, 5).map(([key, value], idx) => (
              <div key={idx} className="space-y-1 pb-4 border-b border-slate-100 dark:border-slate-800 last:border-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  {value as string}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Footer Status Bar matching theme */}
      <footer className="flex items-center justify-between py-2 text-[10px] text-slate-400 dark:text-slate-500 border-t border-slate-200 dark:border-slate-800 mt-6 pt-4 font-bold uppercase tracking-wider">
        <div className="flex flex-wrap items-center gap-4">
          <span>LAST AUDIT: JUST NOW</span>
          <span className="flex items-center"><span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"></span> SYSTEM ONLINE</span>
          <span className="hidden sm:inline">MODEL: GEMINI-PRO-SEO</span>
        </div>
      </footer>
    </div>
  );
}
