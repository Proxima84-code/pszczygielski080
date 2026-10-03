import React from 'react';
import { 
  ShoppingBag, 
  Terminal, 
  Sliders, 
  ToggleLeft, 
  BarChart2, 
  Code2, 
  RefreshCw, 
  ShieldCheck, 
  Layers
} from 'lucide-react';
import { UserAttributes } from '../types/flags';

interface NavbarProps {
  activeTab: 'store' | 'build-analyzer' | 'targeting' | 'flags-manager' | 'analytics' | 'code';
  setActiveTab: (tab: 'store' | 'build-analyzer' | 'targeting' | 'flags-manager' | 'analytics' | 'code') => void;
  userAttributes: UserAttributes;
  onRandomizeUser: () => void;
  overrideCount: number;
  onClearOverrides: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  userAttributes,
  onRandomizeUser,
  overrideCount,
  onClearOverrides,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800 text-zinc-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Product Title */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 shadow-md shadow-indigo-500/20">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold tracking-tight text-white text-base">GrowthBook</span>
                <span className="text-zinc-400 text-sm font-normal">×</span>
                <span className="font-semibold text-zinc-200 text-sm">Vercel Flags SDK</span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <ShieldCheck className="w-3 h-3 mr-1" /> SDK Ready
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 hidden sm:block">
                Example Template: <span className="font-mono text-zinc-300">growthbook-flags-sdk-example</span>
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-1 bg-zinc-900/80 p-1 rounded-lg border border-zinc-800/80">
            <button
              onClick={() => setActiveTab('store')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                activeTab === 'store'
                  ? 'bg-zinc-800 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Live App Demo</span>
            </button>

            <button
              onClick={() => setActiveTab('build-analyzer')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all relative ${
                activeTab === 'build-analyzer'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
              }`}
            >
              <Terminal className="w-3.5 h-3.5 text-amber-400" />
              <span>Vercel Build Inspector</span>
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            </button>

            <button
              onClick={() => setActiveTab('targeting')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                activeTab === 'targeting'
                  ? 'bg-zinc-800 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Targeting Sandbox</span>
            </button>

            <button
              onClick={() => setActiveTab('flags-manager')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                activeTab === 'flags-manager'
                  ? 'bg-zinc-800 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
              }`}
            >
              <ToggleLeft className="w-3.5 h-3.5" />
              <span>Flags Explorer</span>
              {overrideCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-indigo-500 text-white font-mono">
                  {overrideCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                activeTab === 'analytics'
                  ? 'bg-zinc-800 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
              }`}
            >
              <BarChart2 className="w-3.5 h-3.5" />
              <span>Telemetry</span>
            </button>

            <button
              onClick={() => setActiveTab('code')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                activeTab === 'code'
                  ? 'bg-zinc-800 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>Code Setup</span>
            </button>
          </nav>

          {/* User ID & Override Pill */}
          <div className="flex items-center space-x-2">
            <div className="hidden lg:flex items-center space-x-2 bg-zinc-900 border border-zinc-800 px-2.5 py-1 rounded-md text-xs">
              <span className="text-zinc-500">ID:</span>
              <span className="font-mono text-zinc-300 font-semibold">{userAttributes.id}</span>
              <span className="text-zinc-600">•</span>
              <span className="text-zinc-400 capitalize">{userAttributes.tier}</span>
              <span className="text-zinc-600">•</span>
              <span className="text-zinc-400">{userAttributes.country}</span>
              <button
                onClick={onRandomizeUser}
                title="Reroll Visitor ID to test deterministic bucketing"
                className="ml-1 p-1 hover:bg-zinc-800 rounded text-zinc-400 hover:text-zinc-200 transition-colors"
              >
                <RefreshCw className="w-3 h-3" />
              </button>
            </div>

            {overrideCount > 0 && (
              <button
                onClick={onClearOverrides}
                className="px-2.5 py-1 text-xs rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 transition-colors font-medium flex items-center space-x-1"
                title="Reset all manual overrides"
              >
                <span>Reset {overrideCount} Overrides</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="flex md:hidden overflow-x-auto py-2 space-x-1 no-scrollbar border-t border-zinc-900">
          <button
            onClick={() => setActiveTab('store')}
            className={`px-3 py-1 rounded text-xs whitespace-nowrap ${
              activeTab === 'store' ? 'bg-zinc-800 text-white' : 'text-zinc-400'
            }`}
          >
            Store Demo
          </button>
          <button
            onClick={() => setActiveTab('build-analyzer')}
            className={`px-3 py-1 rounded text-xs whitespace-nowrap flex items-center space-x-1 ${
              activeTab === 'build-analyzer' ? 'bg-amber-500/20 text-amber-300' : 'text-zinc-400'
            }`}
          >
            <span>Build Inspector</span>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          </button>
          <button
            onClick={() => setActiveTab('targeting')}
            className={`px-3 py-1 rounded text-xs whitespace-nowrap ${
              activeTab === 'targeting' ? 'bg-zinc-800 text-white' : 'text-zinc-400'
            }`}
          >
            Targeting
          </button>
          <button
            onClick={() => setActiveTab('flags-manager')}
            className={`px-3 py-1 rounded text-xs whitespace-nowrap ${
              activeTab === 'flags-manager' ? 'bg-zinc-800 text-white' : 'text-zinc-400'
            }`}
          >
            Flags ({overrideCount})
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-3 py-1 rounded text-xs whitespace-nowrap ${
              activeTab === 'analytics' ? 'bg-zinc-800 text-white' : 'text-zinc-400'
            }`}
          >
            Telemetry
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`px-3 py-1 rounded text-xs whitespace-nowrap ${
              activeTab === 'code' ? 'bg-zinc-800 text-white' : 'text-zinc-400'
            }`}
          >
            Code
          </button>
        </div>
      </div>
    </header>
  );
};
