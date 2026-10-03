import { FlagDefinition, UserAttributes, ExposureEvent, BuildLogAnalysis } from '../types/flags';

/**
 * Fast deterministic hash string to a 0-1 float (GrowthBook uses MurmurHash3)
 */
export function hashToFloat(key: string, seed: string = ''): number {
  let hash = 0;
  const str = key + seed;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  const positive = Math.abs(hash);
  return (positive % 10000) / 10000;
}

export const INITIAL_USER_ATTRIBUTES: UserAttributes = {
  id: 'usr_7f82b4a1',
  anonymousId: 'anon_3c9d1e2f',
  country: 'US',
  device: 'desktop',
  tier: 'free',
  betaTester: false,
  loggedIn: true,
  browser: 'Chrome 128',
  appVersion: '2.4.0',
};

export const INITIAL_FLAGS: FlagDefinition[] = [
  {
    id: 'banner-top',
    name: 'Top Announcement Banner',
    description: 'Controls the display of the top announcement banner on the home page.',
    type: 'boolean',
    defaultValue: true,
    currentValue: true,
    isOverridden: false,
    origin: 'growthbook',
    rules: [
      {
        id: 'rule-top-banner-geo',
        condition: 'country === "US" or country === "GB"',
        attribute: 'country',
        operator: 'in',
        value: ['US', 'GB', 'CA'],
        servedValue: true,
        description: 'Target US, GB and CA visitors with special launch alert',
      },
    ],
  },
  {
    id: 'banner-bottom',
    name: 'Bottom Promotional Banner',
    description: 'Controls the visibility of the secondary promo banner above the footer.',
    type: 'boolean',
    defaultValue: false,
    currentValue: true,
    isOverridden: false,
    origin: 'growthbook',
    rules: [
      {
        id: 'rule-bottom-beta',
        condition: 'tier === "free"',
        attribute: 'tier',
        operator: 'equals',
        value: 'free',
        servedValue: true,
        description: 'Show upgrade banner only to free tier users',
      },
    ],
  },
  {
    id: 'checkout-button-color',
    name: 'Checkout Button Color & Copy Experiment',
    description: 'A/B/C/D experiment testing conversion impact of button color and call-to-action.',
    type: 'string',
    defaultValue: 'indigo',
    currentValue: 'indigo',
    isOverridden: false,
    origin: 'growthbook',
    variants: [
      { id: 'emerald', label: 'Emerald Green', value: 'emerald', weight: 0.25, color: '#10b981' },
      { id: 'indigo', label: 'Royal Indigo', value: 'indigo', weight: 0.25, color: '#6366f1' },
      { id: 'rose', label: 'Vibrant Rose', value: 'rose', weight: 0.25, color: '#f43f5e' },
      { id: 'amber', label: 'Sun Amber', value: 'amber', weight: 0.25, color: '#f59e0b' },
    ],
  },
  {
    id: 'discount-percentage',
    name: 'Flash Sale Discount Rate',
    description: 'Dynamic remote configuration for checkout coupon percentage.',
    type: 'number',
    defaultValue: 15,
    currentValue: 20,
    isOverridden: false,
    origin: 'growthbook',
    rules: [
      {
        id: 'rule-discount-beta',
        condition: 'betaTester === true',
        attribute: 'betaTester',
        operator: 'equals',
        value: true,
        servedValue: 30,
        description: 'Give 30% discount to Beta Program testers',
      },
    ],
  },
  {
    id: 'pro-analytics-feature',
    name: 'Advanced Telemetry Dashboard',
    description: 'Access control gate for high-tier telemetry and analytics widgets.',
    type: 'boolean',
    defaultValue: false,
    currentValue: false,
    isOverridden: false,
    origin: 'growthbook',
    rules: [
      {
        id: 'rule-pro-tier',
        condition: 'tier in ["pro", "enterprise"]',
        attribute: 'tier',
        operator: 'in',
        value: ['pro', 'enterprise'],
        servedValue: true,
        description: 'Unlock only for Pro and Enterprise subscribers',
      },
    ],
  },
  {
    id: 'ai-smart-recommendations',
    name: 'AI Smart Recommendations',
    description: 'Canary rollout of intelligent item recommendations.',
    type: 'boolean',
    defaultValue: false,
    currentValue: false,
    isOverridden: false,
    origin: 'growthbook',
    variants: [
      { id: 'control', label: 'Standard (Off)', value: false, weight: 0.7 },
      { id: 'treatment', label: 'AI Powered (On)', value: true, weight: 0.3 },
    ],
  },
];

/**
 * Evaluate a single flag given attributes and overrides
 */
export function evaluateFlag(
  flag: FlagDefinition,
  attributes: UserAttributes,
  overrides: Record<string, any>
): { value: any; reason: string; variantId?: string; bucketScore?: number } {
  // 1. Check local / Vercel toolbar override
  if (overrides[flag.id] !== undefined) {
    return {
      value: overrides[flag.id],
      reason: 'Vercel Toolbar / Local Override',
    };
  }

  // 2. Check multivariate A/B experiment
  if (flag.variants && flag.variants.length > 0) {
    const bucket = hashToFloat(attributes.id || attributes.anonymousId, flag.id);
    let cumulative = 0;
    for (const variant of flag.variants) {
      cumulative += variant.weight || 1 / flag.variants.length;
      if (bucket <= cumulative) {
        return {
          value: variant.value,
          variantId: variant.id,
          reason: `Experiment assignment (Bucket: ${(bucket * 100).toFixed(1)}%)`,
          bucketScore: Math.round(bucket * 100),
        };
      }
    }
    const last = flag.variants[flag.variants.length - 1];
    return {
      value: last.value,
      variantId: last.id,
      reason: 'Experiment fallback variant',
      bucketScore: Math.round(bucket * 100),
    };
  }

  // 3. Check targeting rules
  if (flag.rules && flag.rules.length > 0) {
    for (const rule of flag.rules) {
      const userVal = (attributes as any)[rule.attribute];
      let matches = false;

      if (rule.operator === 'equals') {
        matches = userVal === rule.value;
      } else if (rule.operator === 'in') {
        matches = Array.isArray(rule.value) && rule.value.includes(userVal);
      } else if (rule.operator === 'contains') {
        matches = String(userVal).includes(String(rule.value));
      }

      if (matches) {
        return {
          value: rule.servedValue,
          reason: `Rule matched: ${rule.description}`,
        };
      }
    }
  }

  // 4. Default fallback
  return {
    value: flag.defaultValue,
    reason: 'Default fallback value',
  };
}

export const ORIGINAL_VERCEL_BUILD_LOG = `00:27:42.187 
Running build in Washington, D.C., USA (East) – iad1
00:27:42.188 
Build machine configuration: 4 cores, 8 GB
00:27:42.299 
Cloning github.com/Proxima84-code/growthbook-flags-sdk-example (Branch: main, Commit: 4a6af4b)
00:27:42.301 
Previous build caches not available.
00:27:42.875 
Cloning completed: 575.000ms
00:27:43.204 
Running "vercel build"
00:27:43.223 
Vercel CLI 54.12.2
00:27:43.511 
Detected \`pnpm-lock.yaml\` 9 which may be generated by pnpm@9.x or pnpm@10.x
00:27:43.511 
Using pnpm@10.x based on project creation date
00:27:43.511 
To use pnpm@9.x, manually opt in using corepack (https://vercel.com/docs/deployments/configure-a-build#corepack)
00:27:43.537 
Installing dependencies...
00:27:43.968 
Lockfile is up to date, resolution step is skipped
00:27:44.013 
Progress: resolved 1, reused 0, downloaded 0, added 0
00:27:44.079 
Packages: +432
00:27:44.079 
++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
00:27:45.016 
Progress: resolved 432, reused 0, downloaded 88, added 49
00:27:46.017 
Progress: resolved 432, reused 0, downloaded 231, added 125
00:27:47.017 
Progress: resolved 432, reused 0, downloaded 306, added 156
00:27:48.017 
Progress: resolved 432, reused 0, downloaded 414, added 184
00:27:49.018 
Progress: resolved 432, reused 0, downloaded 432, added 430
00:27:49.657 
Progress: resolved 432, reused 0, downloaded 432, added 432, done
00:27:49.903 
00:27:49.903 
dependencies:`;

export function analyzeBuildLog(log: string): BuildLogAnalysis[] {
  const issues: BuildLogAnalysis[] = [];

  // Check 1: pnpm version mismatch (pnpm 10 vs pnpm 9)
  if (log.includes('Detected `pnpm-lock.yaml` 9') && log.includes('Using pnpm@10.x')) {
    issues.push({
      status: 'warning',
      title: 'pnpm Major Version Mismatch (pnpm 10 vs Lockfile 9)',
      summary: 'Vercel automatically selected pnpm@10.x because the project is newer, but your lockfile was generated with pnpm@9.x.',
      details: [
        'pnpm 10 introduced strict dependency hoisting and removed automatic fallback for peer dependency resolutions.',
        'With Next.js and @flags-sdk/growthbook, strict hoisting without public-hoist-pattern can cause "Cannot find module" or build stalls during Next.js page bundling.',
        'Vercel explicitly noted: "To use pnpm@9.x, manually opt in using corepack".',
      ],
      recommendation: 'Add `"packageManager": "pnpm@9.15.4"` into your `package.json` or configure `.npmrc`.',
      commandSnippet: 'corepack enable && corepack use pnpm@9.15.4',
      fileSnippet: {
        filename: 'package.json',
        code: `{\n  "name": "growthbook-flags-sdk-example",\n  "packageManager": "pnpm@9.15.4"\n}`,
      },
    });
  }

  // Check 2: Truncation after dependencies
  if (log.trim().endsWith('dependencies:') || log.includes('Progress: resolved 432, reused 0, downloaded 432, added 432, done')) {
    issues.push({
      status: 'error',
      title: 'Build Interrupted or Stalled at Dependency Stage',
      summary: 'The build log ended right after downloading 432 packages. Next.js build step ("next build") did not commence or log stream timed out.',
      details: [
        'Vercel CLI completed package download (432 packages in 6.7 seconds).',
        'Common culprit in GrowthBook Flags SDK templates: `flags.ts` pre-evaluates or attempts network requests to `https://cdn.growthbook.io` during Next.js static page generation without an API key or timeout.',
        'If `GROWTHBOOK_CLIENT_KEY` is not defined in Vercel Environment Variables, the adapter may hang or throw an unhandled rejection.',
      ],
      recommendation: 'Ensure `GROWTHBOOK_CLIENT_KEY` is set in Vercel project environment settings, and add an offline fallback payload in `flags.ts`.',
      fileSnippet: {
        filename: '.env.local',
        code: `GROWTHBOOK_CLIENT_KEY="sdk-xxxxxxxxxxxx"\nGROWTHBOOK_API_HOST="https://cdn.growthbook.io"\nFLAGS_SECRET="your-vercel-flags-secret-for-toolbar"`,
      },
    });
  }

  // Check 3: Missing flags protocol endpoint
  issues.push({
    status: 'info',
    title: 'Vercel Flags Explorer Discovery Endpoint Required',
    summary: 'To enable the interactive Vercel Toolbar Flags tab on Vercel preview deployments, you must expose the discovery endpoint.',
    details: [
      'The Flags SDK uses `app/api/flags/route.ts` or `pages/api/flags.ts` matching the Vercel Flags specification.',
      'The response must authenticate requests using the `FLAGS_SECRET` verification helper.',
    ],
    recommendation: 'Verify that `app/api/flags/route.ts` is implemented using `createFlagsDiscoveryEndpoint`.',
    fileSnippet: {
      filename: 'app/api/flags/route.ts',
      code: `import { getFlags } from '@/flags';\nimport { createFlagsDiscoveryEndpoint } from '@flags-sdk/growthbook';\n\nexport const GET = createFlagsDiscoveryEndpoint(getFlags);`,
    },
  });

  return issues;
}
