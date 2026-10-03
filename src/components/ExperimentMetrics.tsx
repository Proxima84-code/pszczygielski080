import React, { useState } from 'react';
import { 
  BarChart2, 
  TrendingUp, 
  Send, 
  Trash2, 
  CheckCircle2, 
  MousePointerClick, 
  Activity,
  Layers,
  Sparkles
} from 'lucide-react';
import { ExposureEvent } from '../types/flags';

interface ExperimentMetricsProps {
  events: ExposureEvent[];
  onClearEvents: () => void;
  checkoutCounts: Record<string, number>;
  onSimulateBulkTraffic: () => void;
}

export const ExperimentMetrics: React.FC<ExperimentMetricsProps> = ({
  events,
  onClearEvents,
  checkoutCounts,
  onSimulateBulkTraffic,
}) => {
  const [selectedEvent, setSelectedEvent] = useState<ExposureEvent | null>(null);

  // Variant stats
  const variantData = [
    { id: 'emerald', label: 'Emerald Green', color: '#10b981', baseline: 120 },
    { id: 'indigo', label: 'Royal Indigo (Control)', color: '#6366f1', baseline: 120 },
    { id: 'rose', label: 'Vibrant Rose', color: '#f43f5e', baseline: 120 },
    { id: 'amber', label: 'Sun Amber', color: '#f59e0b', baseline: 120 },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-zinc-800 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
              <BarChart2 className="w-5 h-5" />
            </span>
            <h2 className="text-2xl font-bold text-white">GrowthBook Telemetry & A/B Metrics</h2>
          </div>
          <p className="text-sm text-zinc-400 mt-1">
            Tracking exposure events dispatched to analytics destinations via <code className="text-zinc-200">growthbook.setTrackingCallback()</code>.
          </p>
        </div>

        <div className="flex items-center space-x-2 self-start sm:self-center">
          <button
            onClick={onSimulateBulkTraffic}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-500/20 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Simulate 500 Visitors Traffic</span>
          </button>

          {events.length > 0 && (
            <button
              onClick={onClearEvents}
              className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-rose-400 transition-colors"
              title="Clear event logs"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Experiment Results Overview */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center space-x-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            <span>Experiment: checkout-button-color Conversion Rates</span>
          </span>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-semibold">
            Statistical Confidence: 97.4% (Winner: Emerald)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {variantData.map((v) => {
            const clicks = (checkoutCounts[v.id] || 0) + 18;
            const impressions = v.baseline + (checkoutCounts[v.id] || 0) * 4;
            const cr = ((clicks / impressions) * 100).toFixed(1);
            const isWinner = v.id === 'emerald';

            return (
              <div
                key={v.id}
                className={`p-4 rounded-xl border bg-zinc-900/60 backdrop-blur-sm space-y-3 relative overflow-hidden ${
                  isWinner ? 'border-emerald-500/50 ring-1 ring-emerald-500/20' : 'border-zinc-800'
                }`}
              >
                {isWinner && (
                  <div className="absolute top-0 right-0 bg-emerald-500 text-zinc-950 font-bold text-[9px] px-2 py-0.5 rounded-bl">
                    WINNING VARIANT
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: v.color }}
                  />
                  <h4 className="text-xs font-bold text-zinc-200">{v.label}</h4>
                </div>

                <div className="flex items-baseline space-x-2">
                  <span className="text-2xl font-extrabold text-white">{cr}%</span>
                  <span className="text-[11px] text-zinc-500">Conv. Rate</span>
                </div>

                <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(100, Number(cr) * 4)}%`,
                      backgroundColor: v.color,
                    }}
                  />
                </div>

                <div className="flex justify-between text-[11px] text-zinc-400 font-mono pt-1">
                  <span>Conversions: {clicks}</span>
                  <span>Visitors: {impressions}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Real-time Tracking Dispatches Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Stream List */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Live Exposure & Action Stream ({events.length})
            </span>
            <span className="text-[11px] text-zinc-500 font-mono">Real-time callbacks</span>
          </div>

          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-2 max-h-[380px] overflow-y-auto space-y-2">
            {events.length === 0 ? (
              <div className="p-8 text-center text-xs text-zinc-500 space-y-2">
                <MousePointerClick className="w-6 h-6 mx-auto text-zinc-600" />
                <p>No exposure events logged yet.</p>
                <p className="text-[11px] text-zinc-600">
                  Switch to the Store Demo tab, click the Checkout button or randomize the Visitor ID to trigger events.
                </p>
              </div>
            ) : (
              events.map((evt) => (
                <div
                  key={evt.id}
                  onClick={() => setSelectedEvent(evt)}
                  className={`p-3 rounded-lg border text-xs cursor-pointer transition-all ${
                    selectedEvent?.id === evt.id
                      ? 'bg-zinc-800 border-indigo-500/50 text-white'
                      : 'bg-zinc-900/60 border-zinc-800/80 text-zinc-300 hover:bg-zinc-900 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <code className="font-mono font-bold text-indigo-300">
                        {evt.flagId}
                      </code>
                    </div>
                    <span className="font-mono text-[10px] text-zinc-500">
                      {evt.timestamp.split('T')[1].slice(0, 8)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-1 text-[11px] text-zinc-400">
                    <span>
                      User: <code className="text-zinc-300 font-mono">{evt.userId}</code>
                    </span>
                    <span className="font-mono text-emerald-400 font-bold">
                      Value: {JSON.stringify(evt.value)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: Selected Event Payload Inspector */}
        <div className="lg:col-span-5 bg-zinc-900/60 border border-zinc-800 rounded-2xl p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Payload Inspector
            </span>
            <span className="text-[10px] font-mono text-zinc-500">Analytics Destination</span>
          </div>

          {selectedEvent ? (
            <div className="space-y-3">
              <div className="space-y-1">
                <span className="text-[11px] text-zinc-400">Dispatched Event ID:</span>
                <div className="text-xs font-mono font-bold text-white">
                  {selectedEvent.id}
                </div>
              </div>

              <div className="bg-zinc-950 rounded-xl p-3 border border-zinc-800 text-[11px] font-mono text-zinc-300 overflow-x-auto max-h-[250px]">
                <pre>{JSON.stringify(selectedEvent, null, 2)}</pre>
              </div>

              <div className="text-[11px] text-zinc-400 space-y-1 bg-zinc-950/60 p-3 rounded-lg border border-zinc-800/80">
                <div className="font-semibold text-zinc-300">Tracking Hook Implementation:</div>
                <code className="block text-indigo-300 font-mono text-[10px]">
                  growthbook.setTrackingCallback((experiment, result) =&gt; &#123;
                  <br />
                  &nbsp;&nbsp;analytics.track('Experiment Viewed', &#123; ... &#125;);
                  <br />
                  &#125;);
                </code>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-zinc-500 space-y-1">
              <Send className="w-5 h-5 mx-auto text-zinc-600 mb-2" />
              <p>Select any event on the left to inspect its raw telemetry payload.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
