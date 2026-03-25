"use client";
import React from "react";
import { AlertTriangle, ShieldAlert, ShieldCheck, Activity } from "lucide-react";

type Finding = { type: string; risk: string; line: number; value?: string };
type Result = { summary: string; risk_level: string; risk_score: number; insights: string[]; findings: Finding[] };

export default function InsightsPanel({ result }: { result: Result }) {
  const getRiskIcon = () => {
    switch (result.risk_level) {
      case "critical": return <ShieldAlert className="w-8 h-8 text-red-500" />;
      case "high": return <AlertTriangle className="w-8 h-8 text-orange-500" />;
      case "medium": return <Activity className="w-8 h-8 text-yellow-500" />;
      default: return <ShieldCheck className="w-8 h-8 text-green-500" />;
    }
  };

  const getRiskBg = () => {
    switch (result.risk_level) {
      case "critical": return "bg-red-500/10 border-red-500/30";
      case "high": return "bg-orange-500/10 border-orange-500/30";
      case "medium": return "bg-yellow-500/10 border-yellow-500/30";
      default: return "bg-green-500/10 border-green-500/30";
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
      {/* Overview Card */}
      <div className={`col-span-1 md:col-span-3 lg:col-span-1 rounded-xl border p-6 flex flex-col items-center justify-center text-center ${getRiskBg()}`}>
        {getRiskIcon()}
        <h3 className="text-xl font-bold mt-4 uppercase tracking-wider text-slate-200">{result.risk_level} RISK</h3>
        <p className="text-slate-400 text-sm mt-1">Score: {result.risk_score}/100</p>
        <p className="text-slate-300 font-medium mt-4">{result.summary}</p>
      </div>

      {/* AI Insights Card */}
      <div className="col-span-1 md:col-span-3 lg:col-span-2 rounded-xl border border-slate-700 bg-slate-800/50 p-6">
        <h3 className="text-lg font-bold text-slate-200 mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-400" /> AI Insights
        </h3>
        <ul className="space-y-3">
          {result.insights.map((insight, idx) => (
            <li key={idx} className="flex items-start gap-3">
              <div className="mt-1 w-2 h-2 rounded-full bg-blue-500 flex-shrink-0"></div>
              <p className="text-slate-300 leading-relaxed">{insight}</p>
            </li>
          ))}
          {result.insights.length === 0 && (
            <li className="text-slate-500 italic">No AI insights generated.</li>
          )}
        </ul>
        
        {result.findings.length > 0 && (
          <div className="mt-6 pt-6 border-t border-slate-700">
            <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Detected Entities</h4>
            <div className="flex flex-wrap gap-2">
              {Array.from(new Set(result.findings.map(f => f.type))).map(type => {
                const count = result.findings.filter(f => f.type === type).length;
                return (
                  <span key={type} className="px-3 py-1 rounded-full bg-slate-700 text-slate-300 text-sm font-medium">
                    {count} {type.replace('_', ' ')}
                  </span>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
