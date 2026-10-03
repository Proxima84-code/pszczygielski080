import React, { useState } from 'react';
import { 
  Code2, 
  Copy, 
  Check, 
  FileCode, 
  ExternalLink, 
  CheckCircle2,
  Terminal,
  FolderTree
} from 'lucide-react';

export const CodeExplorer: React.FC = () => {
  const [activeFile, setActiveFile] = useState<string>('flags.ts');
  const [copied, setCopied] = useState(false);

  const files: Record<string, { desc: string; language: string; content: string }> = {
    'flags.ts': {
      desc: 'Central flag definitions using @flags-sdk/growthbook adapter',
      language: 'typescript',
      content: `import { flag } from '@vercel/flags/next';
import { growthbookAdapter } from '@flags-sdk/growthbook';

/**
 * Configure GrowthBook SDK adapter for Vercel Flags
 */
export const growthbook = growthbookAdapter({
  clientKey: process.env.GROWTHBOOK_CLIENT_KEY,
  apiHost: process.env.GROWTHBOOK_API_HOST || 'https://cdn.growthbook.io',
});

/**
 * Top Announcement Banner (Boolean)
 */
export const bannerTopFlag = flag<boolean>({
  key: 'banner-top',
  description: 'Controls the display of the top announcement banner on the home page.',
  defaultValue: true,
  adapter: growthbook,
});

/**
 * Bottom Summer Promo Banner (Boolean)
 */
export const bannerBottomFlag = flag<boolean>({
  key: 'banner-bottom',
  description: 'Controls the visibility of the secondary promo banner above the footer.',
  defaultValue: false,
  adapter: growthbook,
});

/**
 * Checkout Button Color (Multivariate Experiment)
 */
export const checkoutButtonColorFlag = flag<string>({
  key: 'checkout-button-color',
  description: 'A/B/C/D experiment testing conversion impact of button color and call-to-action.',
  defaultValue: 'indigo',
  options: [
    { label: 'Emerald Green', value: 'emerald' },
    { label: 'Royal Indigo', value: 'indigo' },
    { label: 'Vibrant Rose', value: 'rose' },
    { label: 'Sun Amber', value: 'amber' },
  ],
  adapter: growthbook,
});

/**
 * Helper to retrieve all flags for Vercel discovery endpoint
 */
export async function getFlags() {
  return [bannerTopFlag, bannerBottomFlag, checkoutButtonColorFlag];
}
`,
    },

    'app/page.tsx': {
      desc: 'Server component consuming flags and passing down to UI',
      language: 'typescript',
      content: `import { bannerTopFlag, bannerBottomFlag, checkoutButtonColorFlag } from '@/flags';
import { BannerTop } from '@/components/BannerTop';
import { BannerBottom } from '@/components/BannerBottom';
import { CheckoutButton } from '@/components/CheckoutButton';
import { DevToolsPanel } from '@/components/DevToolsPanel';

export default async function HomePage() {
  // Evaluate flags on the server with sub-millisecond edge resolution
  const showBannerTop = await bannerTopFlag();
  const showBannerBottom = await bannerBottomFlag();
  const checkoutColor = await checkoutButtonColorFlag();

  return (
    <main className="min-h-screen bg-black text-white">
      {showBannerTop && <BannerTop />}

      <section className="max-w-4xl mx-auto py-16 px-4 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl">
          GrowthBook Flags SDK Example
        </h1>
        <p className="mt-4 text-zinc-400">
          Evaluated checkout variant: <strong className="text-indigo-400">{checkoutColor}</strong>
        </p>

        <div className="mt-8 flex justify-center">
          <CheckoutButton color={checkoutColor} />
        </div>
      </section>

      {showBannerBottom && <BannerBottom />}

      {/* Embedded Dev tools matching template */}
      <DevToolsPanel activeColor={checkoutColor} />
    </main>
  );
}
`,
    },

    'app/api/flags/route.ts': {
      desc: 'Vercel Flags Discovery endpoint powering the Vercel Toolbar',
      language: 'typescript',
      content: `import { getFlags } from '@/flags';
import { createFlagsDiscoveryEndpoint } from '@flags-sdk/growthbook';

/**
 * Discovery endpoint for the Vercel Toolbar Flags tab.
 * Vercel automatically queries this endpoint when browsing Preview deployments.
 */
export const GET = createFlagsDiscoveryEndpoint(getFlags);
`,
    },

    'package.json': {
      desc: 'Fixed package.json with pinned pnpm version for Vercel',
      language: 'json',
      content: `{
  "name": "growthbook-flags-sdk-example",
  "version": "0.1.0",
  "private": true,
  "packageManager": "pnpm@9.15.4",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "@flags-sdk/growthbook": "^0.1.0",
    "@growthbook/growthbook-react": "^1.1.0",
    "@vercel/flags": "^2.6.1",
    "next": "^15.1.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@types/node": "^22.0.0",
    "@types/react": "^19.0.0",
    "typescript": "^5.6.0"
  }
}
`,
    },

    '.env.local': {
      desc: 'Environment variables required for GrowthBook and Vercel Toolbar',
      language: 'bash',
      content: `# GrowthBook Client API Key (from GrowthBook Dashboard > SDK Endpoints)
GROWTHBOOK_CLIENT_KEY="sdk-6b99446f2d919318"

# GrowthBook API Host (default: https://cdn.growthbook.io)
GROWTHBOOK_API_HOST="https://cdn.growthbook.io"

# Vercel Flags Toolbar Secret (Auto-generated by Vercel Integration or manually set)
FLAGS_SECRET="your-32-char-random-secret-for-toolbar-verification"
`,
    },

    '.npmrc': {
      desc: 'pnpm configuration for seamless dependency hoisting with Next.js',
      language: 'ini',
      content: `# Ensures peer dependencies and Flags SDK adapters hoist properly in Vercel CI
public-hoist-pattern[]=*
shamefully-hoist=true
strict-peer-dependencies=false
`,
    },
  };

  const current = files[activeFile] || files['flags.ts'];

  const handleCopy = () => {
    navigator.clipboard.writeText(current.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-zinc-800 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
              <Code2 className="w-5 h-5" />
            </span>
            <h2 className="text-2xl font-bold text-white">SDK Implementation & Templates</h2>
          </div>
          <p className="text-sm text-zinc-400 mt-1">
            Production-ready code architecture for connecting GrowthBook to Next.js using the Vercel Flags SDK.
          </p>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-mono transition-colors self-start sm:self-center"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied to Clipboard</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy {activeFile}</span>
            </>
          )}
        </button>
      </div>

      {/* File Browser Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: File Tabs */}
        <div className="lg:col-span-4 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 block mb-2">
            Project Files
          </span>

          {Object.entries(files).map(([filename, item]) => {
            const isActive = activeFile === filename;
            return (
              <button
                key={filename}
                onClick={() => setActiveFile(filename)}
                className={`w-full text-left p-3 rounded-xl border transition-all flex items-center space-x-3 group ${
                  isActive
                    ? 'bg-zinc-800 border-indigo-500/50 shadow-md text-white'
                    : 'bg-zinc-900/50 border-zinc-800/80 hover:bg-zinc-900 hover:border-zinc-700 text-zinc-400'
                }`}
              >
                <FileCode
                  className={`w-4 h-4 shrink-0 ${
                    isActive ? 'text-indigo-400' : 'text-zinc-500 group-hover:text-zinc-300'
                  }`}
                />
                <div className="overflow-hidden">
                  <div className="text-xs font-mono font-bold truncate">{filename}</div>
                  <div className="text-[11px] text-zinc-500 truncate mt-0.5">{item.desc}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Column: Code Viewer */}
        <div className="lg:col-span-8 bg-zinc-950 border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col">
          <div className="bg-zinc-900/90 px-4 py-3 border-b border-zinc-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="font-mono text-xs text-zinc-200 font-bold">{activeFile}</span>
            </div>
            <span className="text-[11px] font-mono text-zinc-500 uppercase">{current.language}</span>
          </div>

          <pre className="p-5 font-mono text-xs text-zinc-300 leading-relaxed overflow-x-auto max-h-[500px] overflow-y-auto selection:bg-indigo-500/40">
            {current.content}
          </pre>
        </div>

      </div>
    </div>
  );
};
