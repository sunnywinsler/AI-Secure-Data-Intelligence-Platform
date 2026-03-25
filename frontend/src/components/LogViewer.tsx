"use client";
import React from "react";

type Finding = { type: string; risk: string; line: number; value?: string };

export default function LogViewer({ content, findings }: { content: string; findings: Finding[] }) {
  const lines = content.split('\n');
  
  const getRiskColor = (risk: string) => {
    switch(risk) {
      case "critical": return "bg-red-500/20 text-red-500 border-red-500/50 block w-full";
      case "high": return "bg-orange-500/20 text-orange-400 border-orange-500/50 block w-full";
      case "medium": return "bg-yellow-500/20 text-yellow-500 border-yellow-500/50 block w-full";
      case "low": return "bg-blue-500/20 text-blue-400 border-blue-500/50 block w-full";
      default: return "";
    }
  };

  const getLineStatus = (lineNum: number) => {
    const f = findings.find(f => f.line === lineNum);
    return f ? { risk: f.risk, color: getRiskColor(f.risk) } : null;
  };

  return (
    <div className="w-full bg-[#0d1117] rounded-xl overflow-hidden border border-slate-700 font-mono text-sm leading-6 shadow-xl relative mt-8">
      <div className="flex items-center gap-2 px-4 py-2 bg-slate-800/80 border-b border-slate-700">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-slate-600"></div>
          <div className="w-3 h-3 rounded-full bg-slate-600"></div>
          <div className="w-3 h-3 rounded-full bg-slate-600"></div>
        </div>
        <span className="text-slate-400 text-xs ml-2 font-sans font-medium">Log Visualization</span>
      </div>
      <div className="p-4 overflow-x-auto max-h-[500px]">
        {lines.map((line, idx) => {
          const status = getLineStatus(idx + 1);
          return (
            <div key={idx} className={`flex ${status ? `border-l-4 ${status.color.replace('block w-full','').trim()}` : 'border-l-4 border-transparent hover:bg-slate-800/30'} px-2 relative group`}>
              <span className="text-slate-600 w-12 inline-block select-none text-right pr-4 border-r border-slate-700 mr-4 tabular-nums flex-shrink-0">
                {idx + 1}
              </span>
              <span className={`whitespace-pre ${status ? 'text-slate-200' : 'text-slate-400'}`}>
                {line || " "}
              </span>
              {status && (
                <div className="absolute right-4 top-1 text-xs px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity uppercase font-bold tracking-wider" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
                  <span className={status.color.split(' ')[1]}>{status.risk} RISK</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
