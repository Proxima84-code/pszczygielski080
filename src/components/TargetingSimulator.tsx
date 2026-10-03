import React from 'react';
import { 
  User, 
  Sliders, 
  RefreshCw, 
  Hash, 
  Sparkles, 
  Globe, 
  Smartphone, 
  ShieldCheck, 
  Lock,
  ArrowRight
} from 'lucide-react';
import { UserAttributes, FlagDefinition } from '../types/flags';
import { hashToFloat } from '../utils/growthbook-helpers';

interface TargetingSimulatorProps {
  userAttributes: UserAttributes;
  setUserAttributes: React.Dispatch<React.SetStateAction<UserAttributes>>;
  onRandomizeUser: () => void;
  flags: FlagDefinition[];
  evaluatedFlags: Record<string, { value: any; reason: string; variantId?: string; bucketScore?: number }>;
}

export const TargetingSimulator: React.FC<TargetingSimulatorProps> = ({
  userAttributes,
  setUserAttributes,
  onRandomizeUser,
  flags,
  evaluatedFlags,
}) => {
  // Calculate deterministic bucket for checkout-button-color experiment
  const experimentHashFloat = hashToFloat(userAttributes.id, 'checkout-button-color');
  const bucketPercentage = Math.round(experimentHashFloat * 100);

  const presets = [
    {
      name: 'US Free Visitor',
      desc: 'Free tier in USA, sees bottom promo banner and discount',
      attrs: {
        id: 'usr_us_free_01',
        country: 'US',
        tier: 'free' as const,
        device: 'desktop' as const,
        betaTester: false,
      },
    },
    {
      name: 'UK Pro Member',
      desc: 'Pro tier in UK, telemetry dashboard unlocked',
      attrs: {
        id: 'usr_uk_pro_44',
        country: 'GB',
        tier: 'pro' as const,
        device: 'desktop' as const,
        betaTester: false,
      },
    },
    {
      name: 'VIP Beta Tester',
      desc: 'Beta program member, qualifies for 30% discount rule',
      attrs: {
        id: 'usr_beta_vip_99',
        country: 'CA',
        tier: 'enterprise' as const,
        device: 'mobile' as const,
        betaTester: true,
      },
    },
    {
      name: 'Japan Mobile User',
      desc: 'International shopper on mobile device',
      attrs: {
        id: 'usr_jp_mob_12',
        country: 'JP',
        tier: 'free' as const,
        device: 'mobile' as const,
        betaTester: false,
      },
    },
  ];

  const applyPreset = (preset: (typeof presets)[0]) => {
    setUserAttributes((prev) => ({
      ...prev,
      ...preset.attrs,
      anonymousId: `anon_${preset.attrs.id.slice(4)}`,
    }));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-zinc-800 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
              <Sliders className="w-5 h-5" />
            </span>
            <h2 className="text-2xl font-bold text-white">Targeting Attributes & Hash Sandbox</h2>
          </div>
          <p className="text-sm text-zinc-400 mt-1">
            GrowthBook evaluates targeting rules and experiment hash buckets against these user attributes.
          </p>
        </div>

        <button
          onClick={onRandomizeUser}
          className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-200 text-xs font-mono transition-all self-start sm:self-center"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reroll Random Visitor ID</span>
        </button>
      </div>

      {/* Preset Personas */}
      <div className="space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">
          Quick Preset Personas
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {presets.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => applyPreset(preset)}
              className="text-left p-3.5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 hover:border-indigo-500/50 hover:bg-zinc-900 transition-all space-y-1.5 group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white group-hover:text-indigo-300">
                  {preset.name}
                </span>
                <span className="text-[10px] font-mono text-zinc-500">{preset.attrs.country}</span>
              </div>
              <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">
                {preset.desc}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Attributes Form vs Hash Visualizer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Attributes Editor */}
        <div className="lg:col-span-5 bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 space-y-5 shadow-xl">
          <h3 className="text-base font-bold text-white flex items-center space-x-2">
            <User className="w-4 h-4 text-indigo-400" />
            <span>Visitor Context Attributes</span>
          </h3>

          <div className="space-y-4 text-xs">
            {/* User ID */}
            <div>
              <label className="block text-zinc-400 font-medium mb-1 font-mono">
                Stable Visitor ID (hash key)
              </label>
              <input
                type="text"
                value={userAttributes.id}
                onChange={(e) => setUserAttributes({ ...userAttributes, id: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 font-mono text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Country */}
            <div>
              <label className="block text-zinc-400 font-medium mb-1 flex items-center space-x-1">
                <Globe className="w-3.5 h-3.5 text-zinc-500" />
                <span>Country (geo-targeting)</span>
              </label>
              <select
                value={userAttributes.country}
                onChange={(e) => setUserAttributes({ ...userAttributes, country: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 text-xs focus:outline-none focus:border-indigo-500"
              >
                <option value="US">United States (US)</option>
                <option value="GB">United Kingdom (GB)</option>
                <option value="CA">Canada (CA)</option>
                <option value="DE">Germany (DE)</option>
                <option value="FR">France (FR)</option>
                <option value="JP">Japan (JP)</option>
                <option value="BR">Brazil (BR)</option>
                <option value="AU">Australia (AU)</option>
              </select>
            </div>

            {/* Tier */}
            <div>
              <label className="block text-zinc-400 font-medium mb-1">
                Subscription Tier
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['free', 'pro', 'enterprise'] as const).map((tier) => (
                  <button
                    key={tier}
                    type="button"
                    onClick={() => setUserAttributes({ ...userAttributes, tier })}
                    className={`py-2 rounded-lg font-medium capitalize text-xs transition-colors ${
                      userAttributes.tier === tier
                        ? 'bg-indigo-600 text-white font-bold'
                        : 'bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {tier}
                  </button>
                ))}
              </div>
            </div>

            {/* Device */}
            <div>
              <label className="block text-zinc-400 font-medium mb-1 flex items-center space-x-1">
                <Smartphone className="w-3.5 h-3.5 text-zinc-500" />
                <span>Device Category</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['desktop', 'mobile', 'tablet'] as const).map((device) => (
                  <button
                    key={device}
                    type="button"
                    onClick={() => setUserAttributes({ ...userAttributes, device })}
                    className={`py-2 rounded-lg font-medium capitalize text-xs transition-colors ${
                      userAttributes.device === device
                        ? 'bg-zinc-800 text-white font-bold border border-zinc-600'
                        : 'bg-zinc-950 border border-zinc-800 text-zinc-400 hover:text-zinc-200'
                    }`}
                  >
                    {device}
                  </button>
                ))}
              </div>
            </div>

            {/* Toggles: Beta Tester & Logged In */}
            <div className="pt-2 border-t border-zinc-800 space-y-3">
              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <span className="text-zinc-300 font-medium">Beta Tester Program</span>
                  <p className="text-[11px] text-zinc-500">Unlocks 30% discount rule and canary flags</p>
                </div>
                <input
                  type="checkbox"
                  checked={userAttributes.betaTester}
                  onChange={(e) =>
                    setUserAttributes({ ...userAttributes, betaTester: e.target.checked })
                  }
                  className="w-4 h-4 accent-indigo-600 rounded"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <div>
                  <span className="text-zinc-300 font-medium">Logged In Session</span>
                  <p className="text-[11px] text-zinc-500">Uses ID vs anonymous cookie fallback</p>
                </div>
                <input
                  type="checkbox"
                  checked={userAttributes.loggedIn}
                  onChange={(e) =>
                    setUserAttributes({ ...userAttributes, loggedIn: e.target.checked })
                  }
                  className="w-4 h-4 accent-indigo-600 rounded"
                />
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Deterministic MurmurHash3 Bucket Visualizer */}
        <div className="lg:col-span-7 bg-zinc-900/60 border border-zinc-800 rounded-2xl p-6 space-y-6 shadow-xl flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <Hash className="w-4 h-4 text-emerald-400" />
                <span>Deterministic Hash Bucketing</span>
              </h3>
              <span className="text-xs font-mono text-zinc-400 bg-zinc-950 px-2 py-1 rounded border border-zinc-800">
                MurmurHash3 (GrowthBook Standard)
              </span>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed">
              GrowthBook hashes the visitor's stable ID combined with the experiment key to produce a deterministic float between 0.00 and 1.00. This ensures the same visitor always sees the exact same variant across page reloads and edge servers!
            </p>

            {/* Live Formula Box */}
            <div className="bg-zinc-950 rounded-xl p-4 border border-zinc-800 font-mono text-xs space-y-2">
              <div className="text-zinc-500 text-[11px]">Calculation:</div>
              <div className="text-zinc-300">
                hash(<span className="text-amber-400">"{userAttributes.id}"</span> + <span className="text-indigo-400">"checkout-button-color"</span>)
              </div>
              <div className="flex items-center space-x-2 text-emerald-400 font-bold pt-1 border-t border-zinc-900">
                <span>= Bucket Score: {bucketPercentage}%</span>
                <span className="text-zinc-500 font-normal">({experimentHashFloat.toFixed(4)})</span>
              </div>
            </div>

            {/* Visual Bucket Slider Bar */}
            <div className="space-y-2 pt-2">
              <div className="flex justify-between text-xs font-mono text-zinc-400">
                <span>0%</span>
                <span className="text-emerald-400 font-bold">Variant Bucket: {bucketPercentage}%</span>
                <span>100%</span>
              </div>

              {/* 4 Colored Variant Slices */}
              <div className="relative w-full h-8 rounded-lg overflow-hidden flex border border-zinc-700 shadow-inner">
                <div 
                  className="h-full bg-emerald-600/80 hover:bg-emerald-500/90 flex items-center justify-center text-[10px] font-mono text-white font-bold transition-all"
                  style={{ width: '25%' }}
                  title="Variant A: Emerald Green (0% - 25%)"
                >
                  Emerald (0-25%)
                </div>
                <div 
                  className="h-full bg-indigo-600/80 hover:bg-indigo-500/90 flex items-center justify-center text-[10px] font-mono text-white font-bold transition-all"
                  style={{ width: '25%' }}
                  title="Variant B: Royal Indigo (25% - 50%)"
                >
                  Indigo (25-50%)
                </div>
                <div 
                  className="h-full bg-rose-600/80 hover:bg-rose-500/90 flex items-center justify-center text-[10px] font-mono text-white font-bold transition-all"
                  style={{ width: '25%' }}
                  title="Variant C: Vibrant Rose (50% - 75%)"
                >
                  Rose (50-75%)
                </div>
                <div 
                  className="h-full bg-amber-600/80 hover:bg-amber-500/90 flex items-center justify-center text-[10px] font-mono text-white font-bold transition-all"
                  style={{ width: '25%' }}
                  title="Variant D: Sun Amber (75% - 100%)"
                >
                  Amber (75-100%)
                </div>

                {/* Vertical Indicator Pin */}
                <div
                  className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_10px_rgba(255,255,255,1)] z-10 transition-all duration-300"
                  style={{ left: `${bucketPercentage}%` }}
                >
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-white rotate-45" />
                </div>
              </div>
            </div>

            {/* Evaluated Outcome summary */}
            <div className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800 text-xs flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-zinc-500">Selected Checkout Variant:</span>
                <div className="text-sm font-bold text-white capitalize">
                  {evaluatedFlags['checkout-button-color']?.variantId || 'indigo'}
                </div>
              </div>
              <span className="text-xs px-2.5 py-1 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-medium">
                {evaluatedFlags['checkout-button-color']?.reason}
              </span>
            </div>
          </div>

          <div className="text-[11px] text-zinc-500 border-t border-zinc-800/80 pt-3">
            Tip: Click "Reroll Random Visitor ID" or type a custom string in the ID box to see the pin slide in real-time.
          </div>
        </div>

      </div>
    </div>
  );
};
