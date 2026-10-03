import React, { useState } from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Info, 
  Terminal, 
  Copy, 
  Check, 
  Play, 
  FileCode, 
  ExternalLink, 
  Sparkles, 
  Layers, 
  HelpCircle,
  Clock,
  HardDrive,
  Cpu
} from 'lucide-react';
import { ORIGINAL_VERCEL_BUILD_LOG, analyzeBuildLog } from '../utils/growthbook-helpers';

export const VercelBuildAnalyzer: React.FC = () => {
  const [logText, setLogText] = useState(ORIGINAL_VERCEL_BUILD_LOG);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [simulationRunning, setSimulationRunning] = useState(false);
  const [simulationComplete, setSimulationComplete] = useState(false);

  const analyses = analyzeBuildLog(logText);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const runSimulation = () => {
    setSimulationRunning(true);
    setSimulationComplete(false);

    const simulationLines = [
      '00:27:50.120 \n> growthbook-flags-sdk-example@0.1.0 build',
      '00:27:50.121 \n> next build',
      '00:27:50.840 \n▲ Next.js 15.1.0',
      '00:27:51.200 \n- Environments: .env.local',
      '00:27:51.520 \n- Experiments: GrowthBook Flags SDK enabled',
      '00:27:52.100 \nCreating an optimized production build...',
      '00:27:54.340 \n✓ Compiled successfully',
      '00:27:54.410 \n✓ Linting and checking validity of types',
      '00:27:55.100 \n✓ Collecting page data',
      '00:27:55.620 \n✓ Generating static pages (6/6)',
      '00:27:55.900 \n✓ Collecting build traces',
      '00:27:56.200 \n✓ Finalizing page optimization',
      '00:27:56.400 \n',
      'Route (app)                              Size     First Load JS',
      '┌ ○ /                                    5.4 kB         94 kB',
      '├ ○ /_not-found                          882 B          89 kB',
      '└ ƒ /api/flags (Vercel Flags Discovery)  1.2 kB         90 kB',
      '+ First Load JS shared by all            88.6 kB',
      '00:27:57.100 \nTraced Next.js server files: 12.4ms',
      '00:27:57.800 \nCreated all serverless functions in: 240ms',
      '00:27:58.200 \nUploading build outputs [4.12 MB]...',
      '00:27:59.050 \nDeployment completed: https://growthbook-flags-sdk-example-alpha.vercel.app',
      '00:27:59.100 \n✓ Vercel Flags Toolbar enabled for preview deployments',
    ];

    let currentLog = logText;
    let index = 0;

    const interval = setInterval(() => {
      if (index < simulationLines.length) {
        currentLog += '\n' + simulationLines[index];
        setLogText(currentLog);
        index++;
      } else {
        clearInterval(interval);
        setSimulationRunning(false);
        setSimulationComplete(true);
      }
    }, 280);
  };

  const handleResetLog = () => {
    setLogText(ORIGINAL_VERCEL_BUILD_LOG);
    setSimulationComplete(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-6">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <Terminal className="w-5 h-5" />
            </span>
            <h2 className="text-2xl font-bold text-white">Vercel Build Inspector & Diagnostics</h2>
            <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700 font-mono">
              iad1 • East US
            </span>
          </div>
          <p className="text-sm text-zinc-400 mt-1">
            Analyzing build execution for <code className="text-zinc-200">github.com/Proxima84-code/growthbook-flags-sdk-example</code> (Commit <code className="text-amber-400 font-mono">4a6af4b</code>)
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {!simulationComplete && (
            <button
              onClick={runSimulation}
              disabled={simulationRunning}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-semibold shadow-md transition-all ${
                simulationRunning
                  ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-500/20'
              }`}
            >
              <Play className="w-3.5 h-3.5" />
              <span>{simulationRunning ? 'Simulating Build Output...' : 'Simulate Success Run'}</span>
            </button>
          )}

          <button
            onClick={handleResetLog}
            className="px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 text-xs font-mono transition-colors"
          >
            Reset Original Log
          </button>
        </div>
      </div>

      {/* Build Environment Hardware & Metadata Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-3.5 flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] text-zinc-500">Architecture</div>
            <div className="text-xs font-bold text-zinc-200">4 Cores, 8 GB RAM</div>
          </div>
        </div>

        <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-3.5 flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-pink-500/10 text-pink-400">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] text-zinc-500">Region</div>
            <div className="text-xs font-bold text-zinc-200">iad1 (Washington, D.C.)</div>
          </div>
        </div>

        <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-3.5 flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
            <HardDrive className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] text-zinc-500">Package Manager</div>
            <div className="text-xs font-bold text-amber-300">pnpm 10.x (Lockfile 9)</div>
          </div>
        </div>

        <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-3.5 flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <div className="text-[11px] text-zinc-500">Dependencies</div>
            <div className="text-xs font-bold text-emerald-400">432 Packages installed</div>
          </div>
        </div>
      </div>

      {/* Automated Diagnostic Cards */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400 flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span>Automated Root Cause Diagnostics</span>
        </h3>

        <div className="grid grid-cols-1 gap-4">
          {analyses.map((item, idx) => {
            const isWarning = item.status === 'warning';
            const isError = item.status === 'error';
            const isInfo = item.status === 'info';

            const borderColor = isError
              ? 'border-rose-500/40'
              : isWarning
              ? 'border-amber-500/40'
              : 'border-indigo-500/30';

            const bgGlow = isError
              ? 'bg-rose-950/20'
              : isWarning
              ? 'bg-amber-950/20'
              : 'bg-indigo-950/20';

            const iconColor = isError
              ? 'text-rose-400'
              : isWarning
              ? 'text-amber-400'
              : 'text-indigo-400';

            return (
              <div
                key={idx}
                className={`border ${borderColor} ${bgGlow} rounded-xl p-5 space-y-4 shadow-lg backdrop-blur-sm`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <div className={`mt-0.5 ${iconColor}`}>
                      {isError ? (
                        <AlertTriangle className="w-5 h-5" />
                      ) : isWarning ? (
                        <AlertTriangle className="w-5 h-5" />
                      ) : (
                        <Info className="w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-white">{item.title}</h4>
                      <p className="text-xs text-zinc-300 mt-0.5">{item.summary}</p>
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold uppercase ${
                      isError
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : isWarning
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                {/* Bullet points */}
                <div className="bg-zinc-950/60 rounded-lg p-3 border border-zinc-800/80 text-xs space-y-1.5 text-zinc-400">
                  {item.details.map((detail, dIdx) => (
                    <div key={dIdx} className="flex items-start space-x-2">
                      <span className="text-zinc-600 font-mono">•</span>
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>

                {/* Recommendation & Snippets */}
                <div className="space-y-2 pt-1">
                  <div className="text-xs font-semibold text-zinc-200">
                    Recommended Fix: <span className="font-normal text-zinc-300">{item.recommendation}</span>
                  </div>

                  {item.commandSnippet && (
                    <div className="relative group bg-zinc-950 rounded-lg p-3 border border-zinc-800 font-mono text-xs flex items-center justify-between text-emerald-400">
                      <code>{item.commandSnippet}</code>
                      <button
                        onClick={() => handleCopy(item.commandSnippet!, `cmd-${idx}`)}
                        className="px-2 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded text-[11px] flex items-center space-x-1"
                      >
                        {copiedKey === `cmd-${idx}` ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}

                  {item.fileSnippet && (
                    <div className="bg-zinc-950 rounded-lg border border-zinc-800 overflow-hidden text-xs">
                      <div className="bg-zinc-900/80 px-3 py-1.5 border-b border-zinc-800 flex items-center justify-between text-zinc-400 font-mono text-[11px]">
                        <span className="flex items-center space-x-1.5">
                          <FileCode className="w-3.5 h-3.5 text-indigo-400" />
                          <span>{item.fileSnippet.filename}</span>
                        </span>
                        <button
                          onClick={() => handleCopy(item.fileSnippet!.code, `file-${idx}`)}
                          className="hover:text-white flex items-center space-x-1"
                        >
                          {copiedKey === `file-${idx}` ? (
                            <span className="text-emerald-400">Copied</span>
                          ) : (
                            <span>Copy code</span>
                          )}
                        </button>
                      </div>
                      <pre className="p-3 font-mono text-zinc-300 overflow-x-auto text-[11px] leading-relaxed">
                        {item.fileSnippet.code}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Raw Terminal Log Viewer */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-zinc-300 font-mono">
              Raw Build Output Log (Vercel Console)
            </span>
          </div>
          <button
            onClick={() => handleCopy(logText, 'raw-log')}
            className="text-xs text-zinc-400 hover:text-white flex items-center space-x-1"
          >
            {copiedKey === 'raw-log' ? (
              <span className="text-emerald-400">Copied Full Log</span>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>Copy Full Log</span>
              </>
            )}
          </button>
        </div>

        <div className="bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden shadow-2xl">
          <div className="bg-zinc-900/90 px-4 py-2 border-b border-zinc-800 flex items-center justify-between text-xs text-zinc-400 font-mono">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
              <span className="ml-2 text-zinc-400">vercel build logs – 4 cores, 8 GB</span>
            </div>
            <span className="text-[11px] text-zinc-500">
              Lines: {logText.split('\n').length}
            </span>
          </div>

          <pre className="p-4 font-mono text-xs text-zinc-300 leading-relaxed overflow-x-auto max-h-[380px] overflow-y-auto selection:bg-indigo-500/40">
            {logText.split('\n').map((line, lIdx) => {
              const isTimestamp = /^\d{2}:\d{2}:\d{2}\.\d{3}/.test(line);
              const isWarning = line.includes('pnpm@10.x') || line.includes('manually opt in');
              const isSuccess = line.includes('✓') || line.includes('Completed') || line.includes('completed');
              const isProgress = line.includes('Progress:');

              let lineClass = 'text-zinc-400';
              if (isTimestamp) lineClass = 'text-zinc-600 font-semibold';
              if (isWarning) lineClass = 'text-amber-300 font-semibold';
              if (isSuccess) lineClass = 'text-emerald-400 font-semibold';
              if (isProgress) lineClass = 'text-cyan-400';

              return (
                <div key={lIdx} className={`${lineClass} hover:bg-zinc-900/60 px-1 rounded`}>
                  {line || ' '}
                </div>
              );
            })}
          </pre>
        </div>
      </div>

      {/* Step-by-Step Vercel Deployment Checklist for GrowthBook Flags SDK */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center space-x-2">
          <CheckCircle2 className="w-5 h-5 text-indigo-400" />
          <span>Complete Vercel Setup Checklist for this Template</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="bg-zinc-950/70 border border-zinc-800/80 rounded-xl p-4 space-y-2">
            <span className="text-xs font-mono font-bold text-indigo-400">Step 1</span>
            <h4 className="text-sm font-semibold text-zinc-200">Pin pnpm version</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Add <code className="text-zinc-300">"packageManager": "pnpm@9.15.4"</code> to <code className="text-zinc-300">package.json</code> so Vercel does not auto-upgrade to pnpm 10.
            </p>
          </div>

          <div className="bg-zinc-950/70 border border-zinc-800/80 rounded-xl p-4 space-y-2">
            <span className="text-xs font-mono font-bold text-indigo-400">Step 2</span>
            <h4 className="text-sm font-semibold text-zinc-200">Configure GrowthBook Key</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Add <code className="text-zinc-300">GROWTHBOOK_CLIENT_KEY</code> and <code className="text-zinc-300">FLAGS_SECRET</code> into Vercel Project Settings &gt; Environment Variables.
            </p>
          </div>

          <div className="bg-zinc-950/70 border border-zinc-800/80 rounded-xl p-4 space-y-2">
            <span className="text-xs font-mono font-bold text-indigo-400">Step 3</span>
            <h4 className="text-sm font-semibold text-zinc-200">Verify Vercel Flags Discovery</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              The <code className="text-zinc-300">/api/flags</code> route publishes available flags to the Vercel Toolbar on Preview environments automatically.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
