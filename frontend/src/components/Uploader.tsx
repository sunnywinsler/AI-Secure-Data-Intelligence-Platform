"use client";
import React, { useState, useRef } from "react";
import { UploadCloud, CheckCircle } from "lucide-react";

export default function Uploader({ onAnalyze }: { onAnalyze: (file: File) => void }) {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <div className="w-full">
      <div
        className={`relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-xl transition-all duration-300 cursor-pointer ${
          dragActive ? "border-blue-500 bg-blue-500/10" : "border-slate-600 bg-slate-800/50 hover:border-slate-500"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <input ref={inputRef} type="file" className="hidden" onChange={handleChange} accept=".txt,.log,.pdf,.doc,.docx" />
        
        {file ? (
          <div className="flex flex-col items-center gap-2">
            <CheckCircle className="text-green-400 w-12 h-12" />
            <span className="text-slate-300 font-medium">{file.name}</span>
            <span className="text-slate-500 text-sm">{(file.size / 1024).toFixed(1)} KB</span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <UploadCloud className="text-slate-400 w-12 h-12 mb-2 group-hover:text-blue-400 transition-colors" />
            <p className="text-slate-300 font-medium text-lg">Click or drag and drop to upload</p>
            <p className="text-slate-500 text-sm">Log files (.log), Text (.txt), PDF or SQL</p>
          </div>
        )}
      </div>

      <button
        onClick={() => file && onAnalyze(file)}
        disabled={!file}
        className="mt-6 w-full bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 text-white font-semibold py-3 px-6 rounded-lg transition-colors shadow-lg shadow-blue-500/20 disabled:shadow-none"
      >
        Analyze Content
      </button>
    </div>
  );
}
