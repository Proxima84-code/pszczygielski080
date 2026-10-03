import React, { useState, useMemo, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { DemoStore } from './components/DemoStore';
import { VercelBuildAnalyzer } from './components/VercelBuildAnalyzer';
import { TargetingSimulator } from './components/TargetingSimulator';
import { FlagInspector } from './components/FlagInspector';
import { ExperimentMetrics } from './components/ExperimentMetrics';
import { CodeExplorer } from './components/CodeExplorer';
import { VercelFlagsToolbar } from './components/VercelFlagsToolbar';
import { 
  INITIAL_FLAGS, 
  INITIAL_USER_ATTRIBUTES, 
  evaluateFlag 
} from './utils/growthbook-helpers';
import { FlagDefinition, UserAttributes, ExposureEvent } from './types/flags';

export default function App() {
  const [activeTab, setActiveTab] = useState<
    'store' | 'build-analyzer' | 'targeting' | 'flags-manager' | 'analytics' | 'code'
  >('store');

  const [flags, setFlags] = useState<FlagDefinition[]>(INITIAL_FLAGS);
  const [userAttributes, setUserAttributes] = useState<UserAttributes>(INITIAL_USER_ATTRIBUTES);
  const [overrides, setOverrides] = useState<Record<string, any>>({});
  const [isToolbarOpen, setIsToolbarOpen] = useState(false);
  const [events, setEvents] = useState<ExposureEvent[]>([]);
  const [checkoutCounts, setCheckoutCounts] = useState<Record<string, number>>({
    emerald: 14,
    indigo: 8,
    rose: 11,
    amber: 7,
  });

  // Evaluate flags dynamically
  const evaluatedFlags = useMemo(() => {
    const results: Record<
      string,
      { value: any; reason: string; variantId?: string; bucketScore?: number }
    > = {};

    flags.forEach((flag) => {
      results[flag.id] = evaluateFlag(flag, userAttributes, overrides);
    });

    return results;
  }, [flags, userAttributes, overrides]);

  // Log exposure event when experiment flag evaluates
  useEffect(() => {
    const checkoutEval = evaluatedFlags['checkout-button-color'];
    if (checkoutEval) {
      const newEvent: ExposureEvent = {
        id: `exp_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
        timestamp: new Date().toISOString(),
        flagId: 'checkout-button-color',
        experimentKey: 'checkout-button-color',
        variantId: checkoutEval.variantId,
        value: checkoutEval.value,
        userId: userAttributes.id,
        userAttributes: {
          country: userAttributes.country,
          tier: userAttributes.tier,
          device: userAttributes.device,
          betaTester: userAttributes.betaTester,
        },
        hashBucket: checkoutEval.bucketScore,
      };

      setEvents((prev) => [newEvent, ...prev.slice(0, 39)]);
    }
  }, [userAttributes.id, userAttributes.country, userAttributes.tier, overrides]);

  // Randomize stable visitor ID
  const handleRandomizeUser = () => {
    const randomHex = Math.random().toString(16).substring(2, 10);
    const newId = `usr_${randomHex}`;
    setUserAttributes((prev) => ({
      ...prev,
      id: newId,
      anonymousId: `anon_${randomHex}`,
    }));
  };

  // Set override for a specific flag
  const handleSetOverride = (flagId: string, value: any) => {
    setOverrides((prev) => ({
      ...prev,
      [flagId]: value,
    }));
  };

  // Clear single override
  const handleClearOverride = (flagId: string) => {
    setOverrides((prev) => {
      const next = { ...prev };
      delete next[flagId];
      return next;
    });
  };

  // Clear all overrides
  const handleClearAllOverrides = () => {
    setOverrides({});
  };

  // Track checkout click conversion
  const handleTrackCheckout = (buttonColor: string, variantId: string) => {
    setCheckoutCounts((prev) => ({
      ...prev,
      [variantId]: (prev[variantId] || 0) + 1,
    }));

    const conversionEvent: ExposureEvent = {
      id: `conv_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      timestamp: new Date().toISOString(),
      flagId: 'checkout-completed',
      experimentKey: 'checkout-button-color',
      variantId,
      value: buttonColor,
      userId: userAttributes.id,
      userAttributes: {
        country: userAttributes.country,
        tier: userAttributes.tier,
        device: userAttributes.device,
      },
    };

    setEvents((prev) => [conversionEvent, ...prev.slice(0, 39)]);
  };

  // Simulate bulk traffic
  const handleSimulateBulkTraffic = () => {
    setCheckoutCounts((prev) => ({
      emerald: prev.emerald + 24,
      indigo: prev.indigo + 12,
      rose: prev.rose + 18,
      amber: prev.amber + 10,
    }));

    const mockEvt: ExposureEvent = {
      id: `bulk_${Date.now()}`,
      timestamp: new Date().toISOString(),
      flagId: 'checkout-button-color',
      variantId: 'emerald',
      value: 'emerald',
      userId: 'batch_traffic_simulation',
      userAttributes: { tier: 'pro', country: 'US' },
    };

    setEvents((prev) => [mockEvt, ...prev.slice(0, 39)]);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-indigo-500/30">
      {/* Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userAttributes={userAttributes}
        onRandomizeUser={handleRandomizeUser}
        overrideCount={Object.keys(overrides).length}
        onClearOverrides={handleClearAllOverrides}
      />

      {/* Main Tab Content */}
      <main className="flex-1 pb-24">
        {activeTab === 'store' && (
          <DemoStore
            flags={flags}
            evaluatedFlags={evaluatedFlags}
            userAttributes={userAttributes}
            onRandomizeUser={handleRandomizeUser}
            onTrackCheckout={handleTrackCheckout}
            onOpenFlagsToolbar={() => setIsToolbarOpen(true)}
            onOpenBuildAnalyzer={() => setActiveTab('build-analyzer')}
          />
        )}

        {activeTab === 'build-analyzer' && <VercelBuildAnalyzer />}

        {activeTab === 'targeting' && (
          <TargetingSimulator
            userAttributes={userAttributes}
            setUserAttributes={setUserAttributes}
            onRandomizeUser={handleRandomizeUser}
            flags={flags}
            evaluatedFlags={evaluatedFlags}
          />
        )}

        {activeTab === 'flags-manager' && (
          <FlagInspector
            flags={flags}
            evaluatedFlags={evaluatedFlags}
            overrides={overrides}
            onSetOverride={handleSetOverride}
            onClearOverride={handleClearOverride}
            userAttributes={userAttributes}
          />
        )}

        {activeTab === 'analytics' && (
          <ExperimentMetrics
            events={events}
            onClearEvents={() => setEvents([])}
            checkoutCounts={checkoutCounts}
            onSimulateBulkTraffic={handleSimulateBulkTraffic}
          />
        )}

        {activeTab === 'code' && <CodeExplorer />}
      </main>

      {/* Floating Authentic Vercel Flags Toolbar */}
      <VercelFlagsToolbar
        isOpen={isToolbarOpen}
        onToggleOpen={() => setIsToolbarOpen(!isToolbarOpen)}
        flags={flags}
        overrides={overrides}
        onSetOverride={handleSetOverride}
        onClearOverride={handleClearOverride}
        onClearAllOverrides={handleClearAllOverrides}
      />
    </div>
  );
}
