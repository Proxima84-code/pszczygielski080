export type FlagType = 'boolean' | 'string' | 'number' | 'json';

export interface FlagDefinition {
  id: string;
  name: string;
  description: string;
  type: FlagType;
  defaultValue: any;
  currentValue: any;
  isOverridden: boolean;
  overrideValue?: any;
  rules?: FlagRule[];
  variants?: {
    id: string;
    label: string;
    value: any;
    weight?: number;
    color?: string;
  }[];
  origin: 'growthbook' | 'local-override' | 'default';
}

export interface FlagRule {
  id: string;
  condition: string;
  attribute: string;
  operator: 'equals' | 'in' | 'greaterThan' | 'lessThan' | 'contains';
  value: any;
  servedValue: any;
  description: string;
}

export interface UserAttributes {
  id: string;
  anonymousId: string;
  country: string;
  device: 'desktop' | 'mobile' | 'tablet';
  tier: 'free' | 'pro' | 'enterprise';
  betaTester: boolean;
  loggedIn: boolean;
  browser: string;
  appVersion: string;
}

export interface ExposureEvent {
  id: string;
  timestamp: string;
  flagId: string;
  experimentKey?: string;
  variantId?: string;
  value: any;
  userId: string;
  userAttributes: Partial<UserAttributes>;
  hashBucket?: number;
}

export interface BuildLogAnalysis {
  status: 'warning' | 'info' | 'error' | 'success';
  title: string;
  summary: string;
  details: string[];
  recommendation: string;
  commandSnippet?: string;
  fileSnippet?: {
    filename: string;
    code: string;
  };
}
