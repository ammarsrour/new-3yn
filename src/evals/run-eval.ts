/**
 * Billboard Analysis Prompt Evaluation Orchestrator
 *
 * Orchestrates the full evaluation pipeline:
 * 1. Load dataset
 * 2. Run prompt for each test case
 * 3. Grade each response
 * 4. Aggregate results and generate report
 * 5. Identify best examples for few-shot learning
 *
 * Usage: npm run eval:run
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { runPrompt } from './run-prompt.js';
import { gradeResponse } from './grade-response.js';
import type {
  Dataset,
  TestCase,
  EvalResult,
  EvalSummary,
  FullEvalResults,
  GradingResult,
} from './types.js';
import type { BillboardAnalysisToolResponse } from '../schemas/billboardAnalysis.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ANSI colors for terminal output
const c = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
  dim: '\x1b[2m',
  bold: '\x1b[1m',
};

function log(msg: string) {
  console.log(msg);
}

function header(msg: string) {
  log(`\n${c.bold}${c.blue}${'═'.repeat(70)}${c.reset}`);
  log(`${c.bold}${c.blue}  ${msg}${c.reset}`);
  log(`${c.bold}${c.blue}${'═'.repeat(70)}${c.reset}\n`);
}

function subheader(msg: string) {
  log(`\n${c.cyan}─── ${msg} ${'─'.repeat(Math.max(0, 60 - msg.length))}${c.reset}`);
}

function pass(msg: string) {
  log(`  ${c.green}✓${c.reset} ${msg}`);
}

function fail(msg: string) {
  log(`  ${c.red}✗${c.reset} ${msg}`);
}

function warn(msg: string) {
  log(`  ${c.yellow}⚠${c.reset} ${msg}`);
}

function info(msg: string) {
  log(`  ${c.dim}${msg}${c.reset}`);
}

/**
 * Generate a unique run ID
 */
function generateRunId(): string {
  const now = new Date();
  const date = now.toISOString().split('T')[0].replace(/-/g, '');
  const time = now.toTimeString().split(' ')[0].replace(/:/g, '');
  return `eval_${date}_${time}`;
}

/**
 * Load the dataset
 */
function loadDataset(): Dataset {
  const datasetPath = path.join(__dirname, 'dataset.json');

  if (!fs.existsSync(datasetPath)) {
    throw new Error(`Dataset not found. Run 'npm run eval:generate' first.`);
  }

  return JSON.parse(fs.readFileSync(datasetPath, 'utf-8'));
}

/**
 * Run evaluation for a single test case
 */
async function evaluateTestCase(testCase: TestCase): Promise<EvalResult> {
  let response: BillboardAnalysisToolResponse | null = null;
  let grading: GradingResult | null = null;
  let error: string | undefined;
  let latency_ms = 0;

  try {
    // Run the prompt
    const promptResult = await runPrompt(testCase);
    response = promptResult.response;
    latency_ms = promptResult.latency_ms;

    // Grade the response
    grading = await gradeResponse(testCase, response);
  } catch (err) {
    error = err instanceof Error ? err.message : String(err);
  }

  return {
    test_case: testCase,
    response,
    grading,
    error,
    latency_ms,
  };
}

/**
 * Print detailed results for a single test case
 */
function printTestCaseResult(result: EvalResult) {
  const { test_case, response, grading, error, latency_ms } = result;

  const statusColor = error ? c.red : grading?.overall_pass ? c.green : c.yellow;
  const statusText = error ? 'ERROR' : grading?.overall_pass ? 'PASS' : 'FAIL';

  subheader(`${test_case.name} [${test_case.id}]`);
  log(`  ${statusColor}${c.bold}${statusText}${c.reset} | Grade: ${grading ? grading.overall_grade.toFixed(1) : 'N/A'}% | Latency: ${latency_ms}ms`);

  if (error) {
    fail(`Error: ${error}`);
    return;
  }

  if (!response || !grading) return;

  // Score summary
  log('');
  log(`  ${c.bold}Response Summary:${c.reset}`);
  info(`Score: ${response.assessment.overall_score}/10 (expected: ${test_case.expected.score_range[0]}-${test_case.expected.score_range[1]})`);
  info(`Arabic: ${response.arabic_analysis.arabic_detected} | Primary: ${response.arabic_analysis.arabic_is_primary} | Compliance: ${response.arabic_analysis.compliance_status}`);

  // Grading details
  log('');
  log(`  ${c.bold}Grading Criteria:${c.reset}`);

  const criteria = [
    grading.arabic_detection,
    grading.score_accuracy,
    grading.compliance_status,
    grading.critical_issues_coverage,
    grading.recommendation_quality,
    grading.specificity,
  ];

  for (const criterion of criteria) {
    const icon = criterion.passed ? `${c.green}✓` : `${c.red}✗`;
    const scoreStr = `${criterion.score.toFixed(1)}/${criterion.max_score}`;
    log(`  ${icon}${c.reset} ${criterion.name.padEnd(25)} ${scoreStr.padStart(6)}`);
    info(`    ${criterion.reasoning.substring(0, 80)}${criterion.reasoning.length > 80 ? '...' : ''}`);
  }

  // Critical issues (truncated)
  if (response.assessment.critical_issues.length > 0) {
    log('');
    log(`  ${c.bold}Critical Issues Found:${c.reset}`);
    for (const issue of response.assessment.critical_issues.slice(0, 2)) {
      info(`  • ${issue.substring(0, 90)}${issue.length > 90 ? '...' : ''}`);
    }
    if (response.assessment.critical_issues.length > 2) {
      info(`  ... and ${response.assessment.critical_issues.length - 2} more`);
    }
  }
}

/**
 * Calculate summary statistics
 */
function calculateSummary(results: EvalResult[]): EvalSummary {
  const validResults = results.filter(r => r.grading !== null);
  const total = results.length;
  const passed = validResults.filter(r => r.grading!.overall_pass).length;
  const failed = total - passed;

  const grades = validResults.map(r => r.grading!.overall_grade);
  const average_grade = grades.length > 0 ? grades.reduce((a, b) => a + b, 0) / grades.length : 0;

  const criterion_averages = {
    arabic_detection: avg(validResults.map(r => r.grading!.arabic_detection.score)),
    score_accuracy: avg(validResults.map(r => r.grading!.score_accuracy.score)),
    critical_issues_coverage: avg(validResults.map(r => r.grading!.critical_issues_coverage.score)),
    compliance_status: avg(validResults.map(r => r.grading!.compliance_status.score)),
    recommendation_quality: avg(validResults.map(r => r.grading!.recommendation_quality.score)),
    specificity: avg(validResults.map(r => r.grading!.specificity.score)),
  };

  const pass_rates = {
    arabic_detection: pct(validResults.filter(r => r.grading!.arabic_detection.passed).length, validResults.length),
    score_accuracy: pct(validResults.filter(r => r.grading!.score_accuracy.passed).length, validResults.length),
    critical_issues_coverage: pct(validResults.filter(r => r.grading!.critical_issues_coverage.passed).length, validResults.length),
    compliance_status: pct(validResults.filter(r => r.grading!.compliance_status.passed).length, validResults.length),
  };

  return {
    total_tests: total,
    passed,
    failed,
    average_grade,
    criterion_averages,
    pass_rates,
  };
}

function avg(nums: number[]): number {
  return nums.length > 0 ? nums.reduce((a, b) => a + b, 0) / nums.length : 0;
}

function pct(part: number, whole: number): number {
  return whole > 0 ? (part / whole) * 100 : 0;
}

/**
 * Print the summary report
 */
function printSummary(summary: EvalSummary) {
  header('EVALUATION SUMMARY');

  log(`  Total Tests:    ${summary.total_tests}`);
  log(`  ${c.green}Passed:${c.reset}         ${summary.passed}`);
  log(`  ${c.red}Failed:${c.reset}         ${summary.failed}`);
  log(`  Average Grade:  ${summary.average_grade.toFixed(1)}%`);

  log('');
  log(`  ${c.bold}Criterion Averages (out of 10):${c.reset}`);
  log(`    Arabic Detection:    ${summary.criterion_averages.arabic_detection.toFixed(1)}`);
  log(`    Score Accuracy:      ${summary.criterion_averages.score_accuracy.toFixed(1)}`);
  log(`    Compliance Status:   ${summary.criterion_averages.compliance_status.toFixed(1)}`);
  log(`    Issues Coverage:     ${summary.criterion_averages.critical_issues_coverage.toFixed(1)}`);
  log(`    Recommendation:      ${summary.criterion_averages.recommendation_quality.toFixed(1)}`);
  log(`    Specificity:         ${summary.criterion_averages.specificity.toFixed(1)}`);

  log('');
  log(`  ${c.bold}Critical Check Pass Rates:${c.reset}`);
  log(`    Arabic Detection:    ${summary.pass_rates.arabic_detection.toFixed(0)}%`);
  log(`    Score Accuracy:      ${summary.pass_rates.score_accuracy.toFixed(0)}%`);
  log(`    Compliance Status:   ${summary.pass_rates.compliance_status.toFixed(0)}%`);
  log(`    Issues Coverage:     ${summary.pass_rates.critical_issues_coverage.toFixed(0)}%`);
}

/**
 * Find and save best examples for few-shot learning
 */
function saveBestExamples(results: EvalResult[], outputPath: string) {
  const validResults = results.filter(r => r.grading && r.response);

  // Sort by overall grade descending
  const sorted = validResults.sort((a, b) => b.grading!.overall_grade - a.grading!.overall_grade);

  // Take top 3
  const top3 = sorted.slice(0, 3);

  const bestExamples = top3.map(r => ({
    test_case_id: r.test_case.id,
    test_case_name: r.test_case.name,
    grade: r.grading!.overall_grade,
    input_description: r.test_case.description,
    output: r.response,
  }));

  fs.writeFileSync(outputPath, JSON.stringify(bestExamples, null, 2));

  subheader('Top 3 Best Examples (saved for few-shot)');
  for (const ex of bestExamples) {
    log(`  ${c.green}★${c.reset} ${ex.test_case_name} - Grade: ${ex.grade.toFixed(1)}%`);
  }

  log('');
  info(`Saved to: ${outputPath}`);
}

/**
 * Main entry point
 */
async function main() {
  const runId = generateRunId();

  header(`Billboard Analysis Prompt Evaluation`);
  log(`  Run ID: ${runId}`);
  log(`  Time: ${new Date().toISOString()}`);

  // Check API key
  const apiKey = process.env.VITE_OPENAI_API_KEY || process.env.OPENAI_API_KEY;
  if (!apiKey) {
    fail('OpenAI API key not found. Set VITE_OPENAI_API_KEY or OPENAI_API_KEY.');
    process.exit(1);
  }
  pass('OpenAI API key found');

  // Load dataset
  let dataset: Dataset;
  try {
    dataset = loadDataset();
    pass(`Dataset loaded: ${dataset.test_cases.length} test cases`);
  } catch (err) {
    fail(`Failed to load dataset: ${err}`);
    process.exit(1);
  }

  // Run evaluations
  header('Running Evaluations');

  const results: EvalResult[] = [];
  let completed = 0;

  for (const testCase of dataset.test_cases) {
    log(`\n${c.dim}[${completed + 1}/${dataset.test_cases.length}] Running: ${testCase.id}...${c.reset}`);

    const result = await evaluateTestCase(testCase);
    results.push(result);
    completed++;

    // Brief status
    if (result.error) {
      fail(`Error: ${result.error.substring(0, 50)}`);
    } else if (result.grading) {
      const icon = result.grading.overall_pass ? `${c.green}✓` : `${c.yellow}⚠`;
      log(`  ${icon}${c.reset} Grade: ${result.grading.overall_grade.toFixed(1)}% | Score: ${result.response?.assessment.overall_score}/10`);
    }

    // Delay between API calls to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  // Print detailed results
  header('Detailed Results');
  for (const result of results) {
    printTestCaseResult(result);
  }

  // Calculate and print summary
  const summary = calculateSummary(results);
  printSummary(summary);

  // Save results
  const resultsPath = path.join(__dirname, 'results.json');
  const fullResults: FullEvalResults = {
    run_id: runId,
    run_at: new Date().toISOString(),
    prompt_version: '1.0.0',
    model: 'gpt-4o',
    grading_model: 'gpt-4o-mini',
    summary,
    results: results.map(r => ({
      ...r,
      // Don't include full response in JSON for readability
      response: r.response
        ? {
            ...r.response,
            detailed_visual_description: r.response.detailed_visual_description.substring(0, 200) + '...',
          }
        : null,
    })),
  };

  fs.writeFileSync(resultsPath, JSON.stringify(fullResults, null, 2));
  log('');
  info(`Full results saved to: ${resultsPath}`);

  // Save best examples
  const bestExamplesPath = path.join(__dirname, 'best-examples.json');
  saveBestExamples(results, bestExamplesPath);

  // Final verdict
  log('');
  const passRate = summary.passed / summary.total_tests;
  if (passRate >= 0.8) {
    log(`${c.green}${c.bold}EVALUATION PASSED${c.reset} - ${summary.passed}/${summary.total_tests} tests passed (${(passRate * 100).toFixed(0)}%)`);
    process.exit(0);
  } else if (passRate >= 0.5) {
    log(`${c.yellow}${c.bold}EVALUATION NEEDS IMPROVEMENT${c.reset} - ${summary.passed}/${summary.total_tests} tests passed (${(passRate * 100).toFixed(0)}%)`);
    process.exit(1);
  } else {
    log(`${c.red}${c.bold}EVALUATION FAILED${c.reset} - ${summary.passed}/${summary.total_tests} tests passed (${(passRate * 100).toFixed(0)}%)`);
    process.exit(1);
  }
}

// Run
main().catch(error => {
  console.error(`${c.red}Fatal error:${c.reset}`, error);
  process.exit(1);
});
