import React, { useState } from 'react';
import { 
  X, 
  RotateCcw, 
  Copy, 
  Check, 
  Sliders, 
  ChevronDown, 
  ChevronUp, 
  ExternalLink,
  Shield,
  Layers
} from 'lucide-react';
import { FlagDefinition } from '../types/flags';

interface VercelFlagsToolbarProps {
  isOpen: boolean;
  onToggleOpen: () => void;
  flags: FlagDefinition[];
  overrides: Record<string, any>;
  onSetOverride: (flagId: string, value: any) => void;
  onClearOverride: (flagId: string) => void;
  onClearAllOverrides: () => void;
}

export const VercelFlagsToolbar: React.FC<VercelFlagsToolbarProps> = ({
  isOpen,
  onToggleOpen,
  flags,
  overrides,
  onSetOverride,
  onClearOverride,
  onClearAllOverrides,
}) => {
  const [copiedCookie, setCopiedCookie] = useState(false);
  const [minimized, setMinimized] = useState(false);

  const overrideKeys = Object.keys(overrides);
  const overrideCount = overrideKeys.length;

  const cookieString = `vercel-flag-overrides=${encodeURIComponent(JSON.stringify(overrides))}`;

  const handleCopyCookie = () => {
    navigator.clipboard.writeText(cookieString);
    setCopiedCookie(true);
    setTimeout(() => setCopiedCookie(false), 2000);
  };

  return (
    <>
      {/* Floating Vercel Toolbar Pill (fixed at bottom center) */}
      <aside 
        aria-label="Vercel Flags Toolbar" 
        className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-300"
      >
        <button
          onClick={onToggleOpen}
          aria-expanded={isOpen}
          aria-label={isOpen ? "Close Vercel Flags Toolbar" : `Open Vercel Flags Toolbar${overrideCount > 0 ? `, ${overrideCount} active overrides` : ''}`}
          className={`flex items-center space-x-2.5 px-4 py-2 rounded-full font-mono text-xs shadow-2xl transition-all border ${
            isOpen
              ? 'bg-zinc-900 border-zinc-700 text-white ring-2 ring-indigo-500/50'
              : 'bg-black/90 hover:bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white backdrop-blur-lg'
          }`}
        >
          {/* Authentic Vercel Triangle Logo */}
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 76 65" fill="none">
            <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" />
          </svg>
          <span className="font-semibold tracking-tight">Flags</span>
          
          <div className="flex items-center space-x-1.5 pl-1.5 border-l border-zinc-700 text-[11px]">
            <span className="text-zinc-400">GrowthBook</span>
            {overrideCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-indigo-500 text-white font-bold text-[10px]">
                {overrideCount} active
              </span>
            )}
          </div>
          {isOpen ? <ChevronDown className="w-3.5 h-3.5 text-zinc-400" /> : <ChevronUp className="w-3.5 h-3.5 text-zinc-400" />}
        </button>
      </aside>

      {/* Expanded Vercel Toolbar Modal / Drawer */}
      {isOpen && (
        <div 
          role="dialog" 
          aria-modal="true" 
          aria-label="Vercel Flags Explorer"
          className="fixed bottom-16 left-1/2 -translate-x-1/2 z-50 w-[95vw] max-w-xl max-h-[82vh] bg-zinc-950/95 border border-zinc-800 rounded-2xl shadow-2xl backdrop-blur-xl flex flex-col overflow-hidden text-zinc-100 animate-in fade-in slide-in-from-bottom-4 duration-200"
        >
          
          {/* Header */}
          <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/60">
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4 fill-white" viewBox="0 0 76 65">
                <path d="M37.5274 0L75.0548 65H0L37.5274 0Z" />
              </svg>
              <h3 className="font-bold text-sm tracking-tight text-white">Vercel Flags Explorer</h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
                @flags-sdk/growthbook
              </span>
            </div>

            <div className="flex items-center space-x-2">
              {overrideCount > 0 && (
                <button
                  onClick={onClearAllOverrides}
                  className="text-xs text-amber-400 hover:text-amber-300 flex items-center space-x-1 px-2 py-1 rounded bg-amber-500/10 border border-amber-500/20"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset All</span>
                </button>
              )}
              <button
                onClick={onToggleOpen}
                aria-label="Close dialog"
                className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Subheader info */}
          <div className="px-4 py-2 bg-zinc-900/30 border-b border-zinc-800/60 text-xs text-zinc-400 flex items-center justify-between">
            <span>Override flags to preview variants locally without changing code or redeploying.</span>
            <span className="font-mono text-[11px] text-zinc-500">Origin: Edge Previews</span>
          </div>

          {/* Flag Rows List */}
          <div className="overflow-y-auto p-4 space-y-3 flex-1 max-h-[50vh]">
            {flags.map((flag) => {
              const isOverridden = overrides[flag.id] !== undefined;
              const currentVal = isOverridden ? overrides[flag.id] : flag.currentValue;

              return (
                <div
                  key={flag.id}
                  className={`p-3 rounded-xl border transition-all ${
                    isOverridden
                      ? 'bg-indigo-950/20 border-indigo-500/40 ring-1 ring-indigo-500/20'
                      : 'bg-zinc-900/40 border-zinc-800/70 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center space-x-2">
                        <code className="text-xs font-mono font-bold text-white">
                          {flag.id}
                        </code>
                        <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400">
                          {flag.type}
                        </span>
                        {isOverridden && (
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-indigo-500 text-white font-medium">
                            Overridden
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-zinc-400 mt-0.5 line-clamp-1">
                        {flag.name}
                      </p>
                    </div>

                    {isOverridden && (
                      <button
                        onClick={() => onClearOverride(flag.id)}
                        className="text-[11px] text-zinc-400 hover:text-white flex items-center space-x-1"
                        title="Revert to evaluated value"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Revert</span>
                      </button>
                    )}
                  </div>

                  {/* Interactive Controls based on Flag Type */}
                  <div className="mt-3 pt-2 border-t border-zinc-800/60 flex items-center justify-between">
                    <span className="text-xs text-zinc-500">Value:</span>

                    {/* Boolean Flags Toggle */}
                    {flag.type === 'boolean' && (
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => onSetOverride(flag.id, false)}
                          className={`px-2.5 py-1 rounded text-xs font-mono transition-colors ${
                            currentVal === false
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold'
                              : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
                          }`}
                        >
                          false
                        </button>
                        <button
                          onClick={() => onSetOverride(flag.id, true)}
                          className={`px-2.5 py-1 rounded text-xs font-mono transition-colors ${
                            currentVal === true
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold'
                              : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
                          }`}
                        >
                          true
                        </button>
                      </div>
                    )}

                    {/* Multivariate Experiments (e.g. checkout-button-color) */}
                    {flag.variants && flag.variants.length > 0 && (
                      <div className="flex items-center space-x-1.5 flex-wrap justify-end">
                        {flag.variants.map((v) => {
                          const isSelected = currentVal === v.value;
                          return (
                            <button
                              key={v.id}
                              onClick={() => onSetOverride(flag.id, v.value)}
                              className={`px-2 py-0.5 rounded text-xs font-mono flex items-center space-x-1.5 transition-all ${
                                isSelected
                                  ? 'bg-indigo-600 text-white font-bold shadow'
                                  : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
                              }`}
                            >
                              {v.color && (
                                <span
                                  className="w-2 h-2 rounded-full inline-block"
                                  style={{ backgroundColor: v.color }}
                                />
                              )}
                              <span>{v.id}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* Number Flags (e.g. discount-percentage) */}
                    {flag.type === 'number' && !flag.variants && (
                      <div className="flex items-center space-x-2">
                        {[0, 15, 20, 30, 50].map((num) => (
                          <button
                            key={num}
                            onClick={() => onSetOverride(flag.id, num)}
                            className={`px-2 py-0.5 rounded text-xs font-mono transition-colors ${
                              currentVal === num
                                ? 'bg-indigo-600 text-white font-bold'
                                : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
                            }`}
                          >
                            {num}%
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer with Vercel Protocol Cookie String */}
          <div className="p-3 bg-zinc-900 border-t border-zinc-800 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono text-zinc-400">
                Cookie: <code className="text-zinc-300">vercel-flag-overrides</code>
              </span>
              <button
                onClick={handleCopyCookie}
                className="text-zinc-400 hover:text-white flex items-center space-x-1 text-[11px]"
              >
                {copiedCookie ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy Cookie</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-2 bg-zinc-950 rounded border border-zinc-800 font-mono text-[10px] text-zinc-400 truncate">
              {cookieString}
            </pre>
          </div>
        </div>
      )}
    </>
  );
};
