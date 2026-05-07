export type AuditStatus = 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED';

export interface WebVitals {
  lcp: number; // Largest Contentful Paint
  fcp: number; // First Contentful Paint
  cls: number; // Cumulative Layout Shift
  tti: number; // Time to Interactive
  inp: number; // Interaction to Next Paint
  tbt: number; // Total Blocking Time
}

export interface LighthouseScores {
  performance: number;
  accessibility: number;
  bestPractices: number;
  seo: number;
}

export interface AuditResult {
  id: string;
  projectId: string;
  status: AuditStatus;
  scores: LighthouseScores;
  webVitals: WebVitals;
  totalJsSize: number;
  totalRequests: number;
  timestamp: string;
  waterfallData?: any; // To be defined
}

export interface Project {
  id: string;
  name: string;
  url: string;
  environment: string;
  lastAudit?: AuditResult;
  createdAt: string;
}

export interface BundleAnalysis {
  totalSize: number;
  vendorSize: number;
  dependencies: {
    name: string;
    size: number;
    percentage: number;
  }[];
}
