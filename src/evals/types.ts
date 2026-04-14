/**
 * Shared types for the evaluation system
 */

import type { BillboardAnalysisToolResponse } from '../schemas/billboardAnalysis.js';

export interface TestCase {
  id: string;
  name: string;
  category: string;
  description: string;
  expected: {
    score_range: [number, number];
    arabic_detected: boolean;
    arabic_is_primary?: boolean;
    compliance_status: 'compliant' | 'partial' | 'critical_violation_no_arabic';
    critical_issues_keywords: string[];
    has_cta?: boolean;
  };
}

export interface Dataset {
  version: string;
  generated_at: string;
  description: string;
  test_cases: TestCase[];
}

export interface GradingCriterion {
  name: string;
  passed: boolean;
  score: number;
  max_score: number;
  reasoning: string;
}

export interface GradingResult {
  test_case_id: string;
  arabic_detection: GradingCriterion;
  score_accuracy: GradingCriterion;
  critical_issues_coverage: GradingCriterion;
  compliance_status: GradingCriterion;
  recommendation_quality: GradingCriterion;
  specificity: GradingCriterion;
  overall_grade: number;
  overall_pass: boolean;
}

export interface EvalResult {
  test_case: TestCase;
  response: BillboardAnalysisToolResponse | null;
  grading: GradingResult | null;
  error?: string;
  latency_ms: number;
}

export interface EvalSummary {
  total_tests: number;
  passed: number;
  failed: number;
  average_grade: number;
  criterion_averages: {
    arabic_detection: number;
    score_accuracy: number;
    critical_issues_coverage: number;
    compliance_status: number;
    recommendation_quality: number;
    specificity: number;
  };
  pass_rates: {
    arabic_detection: number;
    score_accuracy: number;
    critical_issues_coverage: number;
    compliance_status: number;
  };
}

export interface FullEvalResults {
  run_id: string;
  run_at: string;
  prompt_version: string;
  model: string;
  grading_model: string;
  summary: EvalSummary;
  results: EvalResult[];
}
