import React, { useState } from 'react';
import { 
  ToggleLeft, 
  Layers, 
  Code, 
  Copy, 
  Check, 
  RotateCcw, 
  CheckCircle, 
  AlertCircle,
  Eye,
  Sliders
} from 'lucide-react';
import { FlagDefinition, UserAttributes } from '../types/flags';

interface FlagInspectorProps {
  flags: FlagDefinition[];
  evaluatedFlags: Record<string, { value: any; reason: string; variantId?: string; bucketScore?: number }>;
  overrides: Record<string, any>;
  onSetOverride: (flagId: string, value: any) => void;
  onClearOverride: (flagId: string) => void;
  userAttributes: UserAttributes;
}

export const FlagInspector: React.FC<FlagInspectorProps> = ({
  flags,
  evaluatedFlags,
  overrides,
  onSetOverride,
  onClearOverride,
  userAttributes,
}) => {
  const [selectedFlagId, setSelectedFlagId] = useState<string>(flags[0]?.id || 'banner-top');
  const [viewMode, setViewMode] = useState<'cards' | 'json'>('cards');
  const [copiedJson, setCopiedJson] = useState(false);

  const selectedFlag = flags.find((f) => f.id === selectedFlagId) || flags[0];
  const selectedEval = evaluatedFlags[selectedFlag.id];
  const isOverridden = overrides[selectedFlag.id] !== undefined;

  // Format features JSON payload in standard GrowthBook schema
  const growthBookPayload = {
    status: 200,
    features: flags.reduce((acc, f) => {
      acc[f.id] = {
        defaultValue: f.defaultValue,
        rules: f.rules?.map((r) => ({
          condition: { [r.attribute]: { [`$${r.operator}`]: r.value } },
          force: r.servedValue,
        })) || [],
      };
      if (f.variants) {
        acc[f.id].rules.push({
          variations: f.variants.map((v) => v.value),
          weights: f.variants.map((v) => v.weight || 0.25),
        });
      }
      return acc;
    }, {} as Record<string, any>),
    dateUpdated: new Date().toISOString(),
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(growthBookPayload, null, 2));
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-zinc-800 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
              <ToggleLeft className="w-5 h-5" />
            </span>
            <h2 className="text-2xl font-bold text-white">Feature Flags Explorer & Rules</h2>
          </div>
          <p className="text-sm text-zinc-400 mt-1">
            Browse flag definitions, multivariate weight splits, targeting rules, and remote configuration schema.
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex items-center space-x-1 bg-zinc-900 p-1 rounded-lg border border-zinc-800 self-start sm:self-center">
          <button
            onClick={() => setViewMode('cards')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              viewMode === 'cards' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            Rules & Variants
          </button>
          <button
            onClick={() => setViewMode('json')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors flex items-center space-x-1 ${
              viewMode === 'json' ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
            <span>GrowthBook JSON</span>
          </button>
        </div>
      </div>

      {viewMode === 'json' ? (
        /* GrowthBook Raw Schema View */
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>
              Matches <code className="text-zinc-300">GET https://cdn.growthbook.io/api/features/client-key</code>
            </span>
            <button
              onClick={handleCopyJson}
              className="text-zinc-300 hover:text-white flex items-center space-x-1"
            >
              {copiedJson ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Payload</span>
                </>
              )}
            </button>
          </div>
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 overflow-x-auto font-mono text-xs text-zinc-300 shadow-2xl">
            <pre>{JSON.stringify(growthBookPayload, null, 2)}</pre>
          </div>
        </div>
      ) : (
        /* Split view: Flags list on left, detail on right */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Flags Sidebar */}
          <div className="lg:col-span-5 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 block mb-2">
              Registered Flags ({flags.length})
            </span>

            {flags.map((flag) => {
              const isSelected = flag.id === selectedFlagId;
              const hasOverride = overrides[flag.id] !== undefined;
              const currentVal = hasOverride ? overrides[flag.id] : flag.currentValue;

              return (
                <button
                  key={flag.id}
                  onClick={() => setSelectedFlagId(flag.id)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center justify-between group ${
                    isSelected
                      ? 'bg-zinc-800/90 border-indigo-500/50 shadow-md ring-1 ring-indigo-500/20'
                      : 'bg-zinc-900/50 border-zinc-800/80 hover:bg-zinc-900 hover:border-zinc-700'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <code className="text-xs font-mono font-bold text-white group-hover:text-indigo-300">
                        {flag.id}
                      </code>
                      {hasOverride && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] bg-indigo-500 text-white font-mono font-bold">
                          Override
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-zinc-400 line-clamp-1">
                      {flag.name}
                    </div>
                  </div>

                  <div className="text-right font-mono text-xs text-zinc-300">
                    <span className="text-zinc-500 text-[10px] block uppercase">{flag.type}</span>
                    <span className="font-semibold text-emerald-400">
                      {String(currentVal)}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Flag Detail Card */}
          <div className="lg:col-span-7 bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 space-y-6 shadow-xl">
            <div className="flex items-start justify-between border-b border-zinc-800 pb-4">
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-bold text-white font-mono">{selectedFlag.id}</h3>
                  <span className="text-[10px] font-mono uppercase bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded border border-zinc-700">
                    {selectedFlag.type}
                  </span>
                </div>
                <p className="text-xs text-zinc-400 mt-1">{selectedFlag.description}</p>
              </div>

              {isOverridden && (
                <button
                  onClick={() => onClearOverride(selectedFlag.id)}
                  className="px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-medium hover:bg-amber-500/20 transition-colors flex items-center space-x-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset Override</span>
                </button>
              )}
            </div>

            {/* Current Evaluation Status */}
            <div className="bg-zinc-950 rounded-xl p-4 border border-zinc-800 text-xs space-y-3">
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                Evaluation Result for current visitor
              </span>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs text-zinc-400">Resolved Value:</div>
                  <div className="text-lg font-bold font-mono text-emerald-400">
                    {JSON.stringify(selectedEval?.value)}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs text-zinc-400">Evaluation Source:</div>
                  <div className="text-xs font-medium text-zinc-300">
                    {selectedEval?.reason}
                  </div>
                </div>
              </div>
            </div>

            {/* Multivariate Variants (if any) */}
            {selectedFlag.variants && selectedFlag.variants.length > 0 && (
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Multivariate Variants ({selectedFlag.variants.length})
                </span>
                <div className="space-y-2">
                  {selectedFlag.variants.map((v) => {
                    const isCurrent = selectedEval?.variantId === v.id || selectedEval?.value === v.value;
                    return (
                      <div
                        key={v.id}
                        className={`p-3 rounded-lg border text-xs flex items-center justify-between transition-all ${
                          isCurrent
                            ? 'bg-indigo-950/30 border-indigo-500/40 text-white'
                            : 'bg-zinc-950/60 border-zinc-800/80 text-zinc-400'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          {v.color && (
                            <span
                              className="w-3 h-3 rounded-full inline-block shrink-0"
                              style={{ backgroundColor: v.color }}
                            />
                          )}
                          <span className="font-bold font-mono text-zinc-200">{v.label}</span>
                          <span className="text-zinc-500 font-mono">({v.value})</span>
                        </div>

                        <div className="flex items-center space-x-3">
                          <span className="font-mono text-zinc-400">
                            Weight: {((v.weight || 0.25) * 100).toFixed(0)}%
                          </span>
                          <button
                            onClick={() => onSetOverride(selectedFlag.id, v.value)}
                            className="px-2 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded text-[11px] font-mono transition-colors"
                          >
                            Force
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Targeting Rules */}
            {selectedFlag.rules && selectedFlag.rules.length > 0 && (
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                  Targeting Rules ({selectedFlag.rules.length})
                </span>
                <div className="space-y-2">
                  {selectedFlag.rules.map((rule) => (
                    <div
                      key={rule.id}
                      className="bg-zinc-950/60 border border-zinc-800/80 rounded-xl p-3.5 text-xs space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-zinc-200">{rule.description}</span>
                        <code className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded">
                          {rule.attribute} {rule.operator} {JSON.stringify(rule.value)}
                        </code>
                      </div>
                      <div className="text-[11px] text-zinc-400 flex items-center justify-between border-t border-zinc-900 pt-2">
                        <span>When matched: Serves value:</span>
                        <code className="font-mono text-emerald-400 font-bold">
                          {JSON.stringify(rule.servedValue)}
                        </code>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Manual Override Form */}
            <div className="pt-4 border-t border-zinc-800 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Direct Value Override
              </span>
              {selectedFlag.type === 'boolean' && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => onSetOverride(selectedFlag.id, true)}
                    className="flex-1 py-2 rounded-lg bg-emerald-600/20 border border-emerald-500/40 text-emerald-300 font-mono text-xs font-bold hover:bg-emerald-600/30 transition-colors"
                  >
                    Force TRUE
                  </button>
                  <button
                    onClick={() => onSetOverride(selectedFlag.id, false)}
                    className="flex-1 py-2 rounded-lg bg-rose-600/20 border border-rose-500/40 text-rose-300 font-mono text-xs font-bold hover:bg-rose-600/30 transition-colors"
                  >
                    Force FALSE
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
