import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  Tag, 
  ArrowRight, 
  Check, 
  Flame, 
  Cpu, 
  Shield, 
  Zap, 
  Globe, 
  Lock, 
  Unlock,
  RefreshCw,
  ExternalLink,
  Code2
} from 'lucide-react';
import { FlagDefinition, UserAttributes } from '../types/flags';

interface DemoStoreProps {
  flags: FlagDefinition[];
  evaluatedFlags: Record<string, { value: any; reason: string; variantId?: string; bucketScore?: number }>;
  userAttributes: UserAttributes;
  onRandomizeUser: () => void;
  onTrackCheckout: (buttonColor: string, variantId: string) => void;
  onOpenFlagsToolbar: () => void;
  onOpenBuildAnalyzer: () => void;
}

export const DemoStore: React.FC<DemoStoreProps> = ({
  evaluatedFlags,
  userAttributes,
  onRandomizeUser,
  onTrackCheckout,
  onOpenFlagsToolbar,
  onOpenBuildAnalyzer,
}) => {
  const [topBannerDismissed, setTopBannerDismissed] = useState(false);
  const [hasPurchased, setHasPurchased] = useState(false);

  // Evaluate flags
  const showTopBanner = Boolean(evaluatedFlags['banner-top']?.value) && !topBannerDismissed;
  const showBottomBanner = Boolean(evaluatedFlags['banner-bottom']?.value);
  const buttonColorVariant = evaluatedFlags['checkout-button-color']?.value || 'indigo';
  const buttonVariantId = evaluatedFlags['checkout-button-color']?.variantId || 'indigo';
  const discountRate = Number(evaluatedFlags['discount-percentage']?.value || 15);
  const proAnalyticsUnlocked = Boolean(evaluatedFlags['pro-analytics-feature']?.value);
  const aiRecommendationsOn = Boolean(evaluatedFlags['ai-smart-recommendations']?.value);

  const basePrice = 99;
  const finalPrice = Math.round(basePrice * (1 - discountRate / 100));

  const handleCheckoutClick = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#6366f1', '#10b981', '#f43f5e', '#f59e0b'],
    });
    setHasPurchased(true);
    onTrackCheckout(buttonColorVariant, buttonVariantId);
    setTimeout(() => setHasPurchased(false), 3000);
  };

  // Button color mapping for Tailwind
  const getButtonStyles = (variant: string) => {
    switch (variant) {
      case 'emerald':
        return {
          bg: 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/25',
          border: 'border-emerald-500/50',
          text: 'Get Edge License Now (Emerald)',
          badge: 'Variant A: Emerald Green (High Intent)',
        };
      case 'rose':
        return {
          bg: 'bg-rose-600 hover:bg-rose-500 shadow-rose-500/25',
          border: 'border-rose-500/50',
          text: 'Claim Instant Access (Rose)',
          badge: 'Variant C: Vibrant Rose (Urgency)',
        };
      case 'amber':
        return {
          bg: 'bg-amber-600 hover:bg-amber-500 shadow-amber-500/25',
          border: 'border-amber-500/50',
          text: 'Upgrade Workspace Today (Amber)',
          badge: 'Variant D: Warm Amber (Action)',
        };
      case 'indigo':
      default:
        return {
          bg: 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-500/25',
          border: 'border-indigo-500/50',
          text: 'Complete Checkout (Indigo)',
          badge: 'Variant B: Royal Indigo (Baseline)',
        };
    }
  };

  const currentBtn = getButtonStyles(buttonColorVariant);

  return (
    <div className="relative min-h-[calc(100vh-4rem)] bg-zinc-950 text-zinc-100 flex flex-col">
      {/* 1. Flag-controlled TOP ANNOUNCEMENT BANNER */}
      {showTopBanner && (
        <div className="bg-gradient-to-r from-indigo-900/90 via-purple-900/90 to-pink-900/90 border-b border-indigo-700/40 text-white text-xs py-2 px-4 transition-all">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              <span className="font-semibold tracking-wide">GrowthBook Flag active [banner-top]:</span>
              <span className="text-zinc-200">
                Exclusive {discountRate}% discount unlocked for {userAttributes.country} visitors!
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={onOpenFlagsToolbar}
                className="text-[11px] underline hover:text-white flex items-center space-x-1"
              >
                <span>Override in Toolbar</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </button>
              <button
                onClick={() => setTopBannerDismissed(true)}
                className="text-zinc-400 hover:text-white p-0.5"
                title="Dismiss banner"
              >
                ✕
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12 flex-1 w-full space-y-10">
        
        {/* Vercel Build Notice Banner if user came from the build log */}
        <div className="bg-gradient-to-r from-amber-950/40 to-zinc-900 border border-amber-500/30 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
          <div className="flex items-start space-x-3">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 mt-0.5">
              <Flame className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h4 className="text-sm font-semibold text-zinc-100">
                  Build Log Diagnostic Available
                </h4>
                <span className="text-[10px] font-mono bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded border border-zinc-700">
                  commit 4a6af4b
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                We inspected your Vercel deployment log (<code className="text-amber-300">iad1</code> Washington, D.C.). Check the diagnosis for pnpm 10 and Next.js Flags SDK configuration.
              </p>
            </div>
          </div>
          <button
            onClick={onOpenBuildAnalyzer}
            className="px-3.5 py-1.5 rounded-lg bg-amber-500 text-zinc-950 font-medium text-xs hover:bg-amber-400 transition-colors whitespace-nowrap self-start sm:self-center font-mono"
          >
            Inspect Build Logs →
          </button>
        </div>

        {/* Hero Section */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs bg-zinc-900 border border-zinc-800 text-zinc-300">
            <Cpu className="w-3.5 h-3.5 text-indigo-400" />
            <span>@flags-sdk/growthbook + Vercel Flags Protocol</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Next.js Feature Flags <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent">
              & Experimentation Demo
            </span>
          </h1>
          <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
            This live storefront reads flags from GrowthBook and evaluates them in real-time. 
            Change visitor attributes, click variations, or open the Vercel Toolbar to toggle overrides.
          </p>
        </div>

        {/* Feature Comparison / Product Showcase Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Main Product Card with Dynamic Checkout Button (Experiment) */}
          <div className="md:col-span-2 bg-zinc-900/70 border border-zinc-800 rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-xl relative overflow-hidden backdrop-blur-sm">
            {/* Ambient background glow */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="space-y-6 relative">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded">
                      Featured License
                    </span>
                    {discountRate > 0 && (
                      <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded flex items-center">
                        <Tag className="w-3 h-3 mr-1" />
                        Save {discountRate}% with coupon
                      </span>
                    )}
                  </div>
                  <h3 className="text-2xl font-bold text-white mt-2">
                    Edge Flags & Feature Mesh Enterprise
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1">
                    Multi-variant evaluation, sub-millisecond edge resolution, and instant rollback.
                  </p>
                </div>

                <div className="text-right">
                  <div className="text-3xl font-extrabold text-white">
                    ${finalPrice}
                    <span className="text-xs font-normal text-zinc-500">/mo</span>
                  </div>
                  {discountRate > 0 && (
                    <div className="text-xs text-zinc-500 line-through">
                      ${basePrice}/mo
                    </div>
                  )}
                </div>
              </div>

              {/* Feature Checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-2 text-xs text-zinc-300">
                <div className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>GrowthBook Context Caching</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Vercel Toolbar Flag Overrides</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Deterministic Hash Murmur3 Buckets</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Real-time Exposure Telemetry</span>
                </div>
              </div>

              {/* AI Recommendation Canary Box if active */}
              {aiRecommendationsOn && (
                <div className="bg-purple-950/30 border border-purple-800/40 rounded-xl p-3 text-xs flex items-center space-x-3">
                  <div className="p-1.5 rounded-lg bg-purple-500/20 text-purple-300">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-purple-200">
                      AI Smart Recommendation [ai-smart-recommendations: ON]:
                    </span>
                    <p className="text-zinc-400 text-[11px]">
                      Based on your team size, adding GrowthBook Edge Cache saves 48% on cold-start latency.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Experiment Checkout Button & Meta */}
            <div className="pt-6 mt-6 border-t border-zinc-800/80 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2 text-zinc-400">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span className="font-mono text-[11px] text-zinc-300">
                    Flag: checkout-button-color
                  </span>
                </div>
                <span className="text-[11px] font-medium text-zinc-300 bg-zinc-800 px-2 py-0.5 rounded border border-zinc-700">
                  {currentBtn.badge}
                </span>
              </div>

              <button
                onClick={handleCheckoutClick}
                className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm text-white shadow-lg transition-all duration-200 flex items-center justify-center space-x-2 ${currentBtn.bg}`}
              >
                {hasPurchased ? (
                  <>
                    <Check className="w-5 h-5 text-white animate-bounce" />
                    <span>Order Simulated! (Tracking event logged)</span>
                  </>
                ) : (
                  <>
                    <span>{currentBtn.text}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="flex items-center justify-between text-[11px] text-zinc-500 pt-1">
                <span>Evaluated reason: {evaluatedFlags['checkout-button-color']?.reason}</span>
                <span className="font-mono text-zinc-400">Bucket: {evaluatedFlags['checkout-button-color']?.bucketScore ?? 42}%</span>
              </div>
            </div>
          </div>

          {/* Card 2: Feature-Gated Pro Telemetry Card */}
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 flex flex-col justify-between shadow-xl backdrop-blur-sm">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-zinc-800 text-zinc-400 border border-zinc-700 rounded">
                  Gated Feature
                </span>
                {proAnalyticsUnlocked ? (
                  <span className="text-emerald-400 text-xs font-semibold flex items-center">
                    <Unlock className="w-3 h-3 mr-1" /> Unlocked
                  </span>
                ) : (
                  <span className="text-zinc-500 text-xs font-semibold flex items-center">
                    <Lock className="w-3 h-3 mr-1" /> Locked
                  </span>
                )}
              </div>

              <div>
                <h4 className="text-lg font-bold text-white">Live Query Telemetry</h4>
                <p className="text-xs text-zinc-400 mt-1">
                  Controlled by <code className="text-zinc-300 font-mono">pro-analytics-feature</code> (Tier = Pro/Enterprise).
                </p>
              </div>

              {proAnalyticsUnlocked ? (
                <div className="bg-zinc-950/80 rounded-xl p-3 border border-emerald-500/20 text-xs space-y-2">
                  <div className="flex justify-between text-[11px] text-zinc-400">
                    <span>Edge Flag Cache Hit</span>
                    <span className="text-emerald-400 font-mono font-bold">99.8%</span>
                  </div>
                  <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full w-[99.8%]" />
                  </div>
                  <div className="flex justify-between text-[11px] text-zinc-400 pt-1">
                    <span>SDK Latency (p99)</span>
                    <span className="text-zinc-200 font-mono">0.42 ms</span>
                  </div>
                </div>
              ) : (
                <div className="bg-zinc-950/50 rounded-xl p-4 border border-zinc-800 text-xs text-center space-y-2 text-zinc-500">
                  <Lock className="w-6 h-6 mx-auto text-zinc-600" />
                  <p className="text-[11px]">
                    This module is hidden for Free tier. Switch your tier to Pro in the Targeting Sandbox to unlock.
                  </p>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-zinc-800/80 text-[11px] text-zinc-400">
              <span className="text-zinc-500">User Tier: </span>
              <span className="font-semibold text-zinc-200 capitalize">{userAttributes.tier}</span>
            </div>
          </div>
        </div>

        {/* 2. Flag-controlled BOTTOM PROMO BANNER */}
        {showBottomBanner && (
          <div className="bg-gradient-to-r from-emerald-950/70 via-teal-900/50 to-zinc-900 border border-emerald-500/30 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="space-y-1 text-center sm:text-left">
              <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Sparkles className="w-3 h-3" />
                <span>Active Flag [banner-bottom]: Free Tier Upgrade Promo</span>
              </div>
              <h3 className="text-xl font-bold text-white">
                Summer Pro Special: 50% Off First 3 Months
              </h3>
              <p className="text-xs text-zinc-300 max-w-xl">
                Targeting rule matched: Served only to <span className="font-mono text-emerald-300">tier === "free"</span> visitors. Includes unlimited feature flags and A/B test experiments.
              </p>
            </div>
            <button
              onClick={handleCheckoutClick}
              className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs transition-colors shrink-0 shadow-lg shadow-emerald-500/20"
            >
              Claim Pro Discount
            </button>
          </div>
        )}

        {/* Embedded Template Dev Tools Panel (Directly replicating the Vercel Example Footer Panel) */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-xs space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-3">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="font-bold text-zinc-200">Template Dev Tools (GrowthBook Flags SDK)</span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={onRandomizeUser}
                className="flex items-center space-x-1.5 px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded text-xs font-mono transition-colors"
                title="Reset stable visitor ID to simulate another visitor"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Reset Stable ID</span>
              </button>
              <button
                onClick={onOpenFlagsToolbar}
                className="flex items-center space-x-1.5 px-2.5 py-1 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 rounded text-xs transition-colors"
              >
                <span>Vercel Toolbar Overrides</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 font-mono text-[11px] text-zinc-400">
            <div>
              <span className="text-zinc-500">Visitor ID: </span>
              <span className="text-zinc-200">{userAttributes.id}</span>
            </div>
            <div>
              <span className="text-zinc-500">Checkout Variant: </span>
              <span className="text-indigo-400 font-bold">{buttonColorVariant}</span>
            </div>
            <div>
              <span className="text-zinc-500">Banners Active: </span>
              <span className="text-zinc-200">
                Top: {showTopBanner ? 'YES' : 'NO'} | Bottom: {showBottomBanner ? 'YES' : 'NO'}
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
