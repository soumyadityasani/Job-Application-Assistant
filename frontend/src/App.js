import React, { useState } from 'react';
import axios from 'axios';
import './output.css';

function App() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('skills');

  // Parses the dual-output from the AI based on the prompt headers
  const parseResponse = (text) => {
    if (!text) return { cv: '', intelligence: '' };
    const intelligenceMarker = '[STRATEGIC CAREER INTELLIGENCE]';
    const parts = text.split(intelligenceMarker);

    return {
      cv: parts[0]?.replace('[PROFESSIONAL CV CONTENT]', '').trim(),
      intelligence: parts[1]?.trim() || ''
    };
  };

  const { cv, intelligence } = parseResponse(output);

  // Main processing function triggered by the Terminal Arrow
  const handleProcess = async () => {
    if (!input.trim()) return alert("Please enter your details first!");
    setLoading(true);
    try {
      const res = await axios.post(`http://localhost:5000/generate/${activeTab}`, { input });
      setOutput(res.data.result);
    } catch (err) {
      setOutput("Error: Backend connection failed. Ensure Flask (app.py) is running on port 5000.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-300 flex flex-col lg:flex-row font-sans">

      {/* Sidebar: Module Selection */}
      <aside className="w-full lg:w-72 bg-[#0f172a] border-r border-slate-800 p-8 flex flex-col">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20 text-xl">A</div>
          <h1 className="text-xl font-bold text-white tracking-tight">Architect<span className="text-indigo-500">AI</span></h1>
        </div>

        <nav className="space-y-2 flex-grow overflow-y-auto">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Resume Sections</p>
          {[
            { id: 'skills', label: 'Skills & Persona', icon: '⚡' },
            { id: 'objective', label: 'Pro Objective', icon: '🎯' },
            { id: 'projects', label: 'Key Projects', icon: '💻' },
            { id: 'education', label: 'Education Audit', icon: '🎓' },
            { id: 'awards', label: 'Awards & Certs', icon: '🏆' },
            { id: 'competencies', label: 'Soft Skills', icon: '🤝' },
            { id: 'languages', label: 'Languages', icon: '🌐' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setOutput(''); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium ${
                activeTab === tab.id
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
                : 'hover:bg-slate-800 text-slate-500'
              }`}
            >
              <span>{tab.icon}</span> {tab.label}
            </button>
          ))}
        </nav>

        <div className="mt-6 pt-6 border-t border-slate-800">
          <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800">
            <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Processing Mode</p>
            <p className="text-xs font-mono text-indigo-400">Local LLM: gpt-oss:120b</p>
          </div>
        </div>
      </aside>

      {/* Main Workspace */}
      <main className="flex-grow p-6 lg:p-10 max-w-7xl mx-auto w-full flex flex-col gap-8">

        {/* Input Terminal with Right-Corner Arrow */}
        <div className="relative bg-[#0f172a] border border-slate-800 rounded-3xl p-6 shadow-2xl">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 italic">
              Input Terminal // {activeTab.toUpperCase()}
            </h3>
          </div>
          <div className="relative">
            <textarea
              className="w-full h-44 bg-slate-950/40 border border-slate-800 rounded-2xl p-6 text-slate-200 focus:ring-1 focus:ring-indigo-500 outline-none transition-all resize-none pr-16 text-base leading-relaxed"
              placeholder={`Enter raw ${activeTab} details here...`}
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            {/* Direct Process Arrow */}
            <button
              onClick={handleProcess}
              disabled={loading}
              className="absolute bottom-6 right-6 w-12 h-12 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl flex items-center justify-center transition-all active:scale-90 shadow-xl disabled:opacity-50 group"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <svg className="w-6 h-6 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Dual Output Panels */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 flex-grow mb-10">

          {/* Left Panel: Professional CV Content */}
          <div className="bg-[#0f172a] border border-slate-800 rounded-3xl p-8 shadow-2xl flex flex-col min-h-[480px]">
            <div className="flex justify-between items-center mb-6 border-b border-slate-800/50 pb-4">
              <h4 className="text-xs font-bold uppercase tracking-widest text-indigo-400">Professional CV Content</h4>
              {cv && (
                <button
                  onClick={() => {navigator.clipboard.writeText(cv); alert("Copied to clipboard!")}}
                  className="text-[10px] bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 px-4 py-1.5 rounded-lg transition-colors font-bold uppercase tracking-tighter"
                >
                  Copy Content
                </button>
              )}
            </div>
            <div className="flex-grow font-mono text-sm leading-relaxed text-indigo-100/90 overflow-y-auto">
              {loading ? (
                <div className="h-full flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <pre className="whitespace-pre-wrap">{cv || "Ready to refine your professional data..."}</pre>
              )}
            </div>
          </div>

          {/* Right Panel: Strategic Career Intelligence */}
          <div className="bg-[#0f172a] border border-slate-800 rounded-3xl p-8 shadow-2xl flex flex-col min-h-[480px]">
            <div className="flex items-center gap-2 mb-6 border-b border-slate-800/50 pb-4">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-emerald-400">Strategic Intelligence</h4>
            </div>
            <div className="flex-grow font-sans text-sm leading-relaxed text-slate-400 overflow-y-auto">
              {loading ? (
                <div className="h-full flex flex-col items-center justify-center text-emerald-500">
                  <p className="animate-pulse text-[10px] font-black tracking-widest uppercase">Analyzing Career Path...</p>
                </div>
              ) : intelligence ? (
                <div className="space-y-4">
                   <pre className="whitespace-pre-wrap font-sans">{intelligence}</pre>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-center px-10">
                  <p className="text-slate-700 italic text-sm">Persona analysis, eligibility audits, and market trends will appear here based on the selected module.</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

export default App;