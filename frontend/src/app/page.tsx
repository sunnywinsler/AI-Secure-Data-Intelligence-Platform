"use client";
import React, { useState } from "react";
import axios from "axios";
import { Loader2, ShieldCheck } from "lucide-react";
import Uploader from "@/components/Uploader";
import LogViewer from "@/components/LogViewer";
import InsightsPanel from "@/components/InsightsPanel";

type Finding = { type: string; risk: string; line: number; value?: string };
type Result = { summary: string; risk_level: string; risk_score: number; insights: string[]; findings: Finding[] };

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState<string>("");
  const [result, setResult] = useState<Result | null>(null);

  const analyzeFile = async (file: File) => {
    setLoading(true);
    setResult(null);
    try {
      let payloadContent = "";
      let payloadType = "text";

      if (file.name.endsWith(".pdf")) {
        payloadType = "file";
        // Convert to base64
        const reader = new FileReader();
        payloadContent = await new Promise<string>((resolve, reject) => {
          reader.readAsDataURL(file);
          reader.onload = () => resolve((reader.result as string).split(',')[1]);
          reader.onerror = error => reject(error);
        });
        setContent(`Extracting PDF (${file.name})... please wait.`);
      } else {
        payloadType = file.name.endsWith(".log") || file.name.endsWith(".txt") ? "log" : "text";
        payloadContent = await file.text();
        setContent(payloadContent);
      }

      const payload = {
        input_type: payloadType,
        content: payloadContent,
        options: {
          mask: true,
          block_high_risk: false,
          log_analysis: true
        }
      };

      const res = await axios.post("http://localhost:8000/analyze", payload);
      setResult(res.data);
      if (res.data.extracted_text) {
         setContent(res.data.extracted_text);
      }
    } catch (error) {
      console.error(error);
      alert("Analysis failed. Ensure backend is running at http://localhost:8000");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8 md:p-16 max-w-6xl mx-auto font-[family-name:var(--font-geist-sans)]">
      <header className="mb-12 text-center flex flex-col items-center">
        <div className="p-4 bg-blue-500/10 rounded-full inline-block mb-6 ring-1 ring-blue-500/30">
          <ShieldCheck className="w-12 h-12 text-blue-400" />
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
          AI Secure Data Intelligence
        </h1>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto">
          Upload your logs and documents to instantly detect secrets, analyze anomalies, and generate AI insights.
        </p>
      </header>

      <main className="space-y-12">
        <section className="bg-slate-800/30 p-8 rounded-2xl border border-slate-700/50 backdrop-blur-sm">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <span className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center text-sm">1</span> 
            Upload Data Source
          </h2>
          <Uploader onAnalyze={analyzeFile} />
        </section>

        {loading && (
          <div className="flex flex-col items-center justify-center p-12">
            <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
            <p className="text-slate-400 font-medium">Analyzing logs and applying policies...</p>
          </div>
        )}

        {result && !loading && (
          <section className="space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-500">
            <div>
              <h2 className="text-xl font-semibold flex items-center gap-2 pt-6">
                <span className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center text-sm">2</span> 
                Analysis Results
              </h2>
              <InsightsPanel result={result} />
            </div>

            <div>
              <h2 className="text-xl font-semibold flex items-center gap-2 pt-6">
                <span className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center text-sm">3</span> 
                Log Visualization
              </h2>
              <LogViewer content={content} findings={result.findings} />
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
