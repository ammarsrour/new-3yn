/**
 * Response Grader for Billboard Analysis Evaluation
 *
 * Makes a SEPARATE grading API call to evaluate the quality of
 * billboard analysis responses against expected criteria.
 *
 * Model: gpt-4o-mini (cheaper, for cost efficiency)
 */

import type { BillboardAnalysisToolResponse } from '../schemas/billboardAnalysis.js';
import type { TestCase, GradingResult, GradingCriterion } from './types.js';

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const GRADING_MODEL = 'gpt-4o-mini';

/**
 * Get the OpenAI API key from environment
 */
function getApiKey(): string {
  const key = process.env.VITE_OPENAI_API_KEY || process.env.OPENAI_API_KEY;
  if (!key) {
    throw new Error('OpenAI API key not found. Set VITE_OPENAI_API_KEY or OPENAI_API_KEY.');
  }
  return key;
}

/**
 * Grading tool schema for structured output
 */
const gradingTool = {
  type: 'function' as const,
  function: {
    name: 'submit_grading',
    description: 'Submit the grading evaluation for a billboard analysis response',
    parameters: {
      type: 'object',
      required: [
        'arabic_detection',
        'score_accuracy',
        'critical_issues_coverage',
        'compliance_status',
        'recommendation_quality',
        'specificity',
      ],
      properties: {
        arabic_detection: {
          type: 'object',
          required: ['correct', 'reasoning'],
          properties: {
            correct: { type: 'boolean', description: 'Did the AI correctly detect Arabic presence?' },
            reasoning: { type: 'string', description: 'Explanation of the evaluation' },
          },
        },
        score_accuracy: {
          type: 'object',
          required: ['in_range', 'actual_score', 'expected_min', 'expected_max', 'deviation', 'reasoning'],
          properties: {
            in_range: { type: 'boolean', description: 'Is the score within expected range?' },
            actual_score: { type: 'number', description: 'The actual score given' },
            expected_min: { type: 'number', description: 'Expected minimum score' },
            expected_max: { type: 'number', description: 'Expected maximum score' },
            deviation: { type: 'number', description: 'How far off from nearest bound if out of range' },
            reasoning: { type: 'string', description: 'Explanation of the score evaluation' },
          },
        },
        critical_issues_coverage: {
          type: 'object',
          required: ['keywords_found', 'keywords_expected', 'percentage', 'reasoning'],
          properties: {
            keywords_found: { type: 'array', items: { type: 'string' }, description: 'Which expected keywords were found' },
            keywords_expected: { type: 'array', items: { type: 'string' }, description: 'Keywords that were expected' },
            percentage: { type: 'number', description: 'Percentage of expected keywords found (0-100)' },
            reasoning: { type: 'string', description: 'Explanation of issue coverage' },
          },
        },
        compliance_status: {
          type: 'object',
          required: ['correct', 'expected', 'actual', 'reasoning'],
          properties: {
            correct: { type: 'boolean', description: 'Is compliance status correct?' },
            expected: { type: 'string', description: 'Expected compliance status' },
            actual: { type: 'string', description: 'Actual compliance status given' },
            reasoning: { type: 'string', description: 'Explanation of compliance evaluation' },
          },
        },
        recommendation_quality: {
          type: 'object',
          required: ['score', 'reasoning'],
          properties: {
            score: {
              type: 'integer',
              minimum: 1,
              maximum: 10,
              description: 'Quality score 1-10: Are recommendations specific, actionable, with measurements?',
            },
            reasoning: { type: 'string', description: 'Explanation of recommendation quality' },
          },
        },
        specificity: {
          type: 'object',
          required: ['score', 'reasoning'],
          properties: {
            score: {
              type: 'integer',
              minimum: 1,
              maximum: 10,
              description: 'Specificity score 1-10: Does analysis reference actual billboard elements with exact values?',
            },
            reasoning: { type: 'string', description: 'Explanation of specificity evaluation' },
          },
        },
      },
    },
  },
};

interface GradingToolResponse {
  arabic_detection: {
    correct: boolean;
    reasoning: string;
  };
  score_accuracy: {
    in_range: boolean;
    actual_score: number;
    expected_min: number;
    expected_max: number;
    deviation: number;
    reasoning: string;
  };
  critical_issues_coverage: {
    keywords_found: string[];
    keywords_expected: string[];
    percentage: number;
    reasoning: string;
  };
  compliance_status: {
    correct: boolean;
    expected: string;
    actual: string;
    reasoning: string;
  };
  recommendation_quality: {
    score: number;
    reasoning: string;
  };
  specificity: {
    score: number;
    reasoning: string;
  };
}

/**
 * Grade a billboard analysis response
 */
export async function gradeResponse(
  testCase: TestCase,
  response: BillboardAnalysisToolResponse
): Promise<GradingResult> {
  const apiKey = getApiKey();

  const gradingPrompt = `You are an expert evaluator for billboard analysis AI systems. Your task is to grade the quality of an AI's billboard analysis response.

## TEST CASE
Name: ${testCase.name}
Category: ${testCase.category}

### Billboard Description (what the AI was shown):
${testCase.description}

### Expected Values:
- Arabic Text Present: ${testCase.expected.arabic_detected}
- Arabic Is Primary: ${testCase.expected.arabic_is_primary ?? 'N/A'}
- Compliance Status: ${testCase.expected.compliance_status}
- Expected Score Range: ${testCase.expected.score_range[0]} to ${testCase.expected.score_range[1]}
- Critical Issues Should Mention: ${testCase.expected.critical_issues_keywords.length > 0 ? testCase.expected.critical_issues_keywords.join(', ') : 'None required'}
- Has CTA: ${testCase.expected.has_cta ?? 'N/A'}

## AI'S RESPONSE
${JSON.stringify(response, null, 2)}

## GRADING INSTRUCTIONS

Evaluate the AI's response on these criteria:

1. **Arabic Detection** (Pass/Fail): Did the AI correctly identify whether Arabic text was present?

2. **Score Accuracy** (Pass/Fail): Is the overall_score within the expected range? If not, how far off?

3. **Critical Issues Coverage** (Percentage): If keywords were expected in critical_issues, what percentage were mentioned? Search the critical_issues array and recommendations for the expected keywords.

4. **Compliance Status** (Pass/Fail): Did the AI assign the correct compliance_status?

5. **Recommendation Quality** (1-10): Are the recommendations:
   - Specific (with exact measurements like "increase to 16 inches")?
   - Actionable (clear next steps)?
   - Not generic (avoid vague advice like "improve contrast")?
   Score 1-3 for generic, 4-6 for somewhat specific, 7-10 for highly specific with numbers.

6. **Specificity** (1-10): Does the detailed analysis:
   - Reference actual billboard elements from the description?
   - Include exact hex colors, inch measurements, contrast ratios?
   - Avoid generic observations?
   Score 1-3 for generic, 4-6 for somewhat specific, 7-10 for highly specific.

Provide your grading using the submit_grading function.`;

  const gradeResponse = await fetch(OPENAI_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: GRADING_MODEL,
      tools: [gradingTool],
      tool_choice: { type: 'function', function: { name: 'submit_grading' } },
      messages: [
        {
          role: 'user',
          content: gradingPrompt,
        },
      ],
      max_tokens: 1500,
      temperature: 0.1,
    }),
  });

  if (!gradeResponse.ok) {
    const error = await gradeResponse.json().catch(() => ({}));
    throw new Error(`Grading API error: ${gradeResponse.status} - ${JSON.stringify(error)}`);
  }

  const data = await gradeResponse.json();
  const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];

  if (!toolCall?.function?.arguments) {
    throw new Error('No grading response from OpenAI');
  }

  const grading = JSON.parse(toolCall.function.arguments) as GradingToolResponse;

  // Convert to GradingResult format
  return convertToGradingResult(testCase.id, grading, testCase);
}

/**
 * Convert raw grading response to structured GradingResult
 */
function convertToGradingResult(
  testCaseId: string,
  grading: GradingToolResponse,
  testCase: TestCase
): GradingResult {
  const arabicDetection: GradingCriterion = {
    name: 'Arabic Detection',
    passed: grading.arabic_detection.correct,
    score: grading.arabic_detection.correct ? 10 : 0,
    max_score: 10,
    reasoning: grading.arabic_detection.reasoning,
  };

  const scoreAccuracy: GradingCriterion = {
    name: 'Score Accuracy',
    passed: grading.score_accuracy.in_range,
    score: grading.score_accuracy.in_range ? 10 : Math.max(0, 10 - grading.score_accuracy.deviation * 2),
    max_score: 10,
    reasoning: grading.score_accuracy.reasoning,
  };

  const criticalIssuesCoverage: GradingCriterion = {
    name: 'Critical Issues Coverage',
    passed: grading.critical_issues_coverage.percentage >= 75,
    score: grading.critical_issues_coverage.percentage / 10,
    max_score: 10,
    reasoning: grading.critical_issues_coverage.reasoning,
  };

  const complianceStatus: GradingCriterion = {
    name: 'Compliance Status',
    passed: grading.compliance_status.correct,
    score: grading.compliance_status.correct ? 10 : 0,
    max_score: 10,
    reasoning: grading.compliance_status.reasoning,
  };

  const recommendationQuality: GradingCriterion = {
    name: 'Recommendation Quality',
    passed: grading.recommendation_quality.score >= 7,
    score: grading.recommendation_quality.score,
    max_score: 10,
    reasoning: grading.recommendation_quality.reasoning,
  };

  const specificity: GradingCriterion = {
    name: 'Specificity',
    passed: grading.specificity.score >= 7,
    score: grading.specificity.score,
    max_score: 10,
    reasoning: grading.specificity.reasoning,
  };

  // Calculate overall grade (weighted average)
  const weights = {
    arabic: 20,
    score: 20,
    issues: 15,
    compliance: 20,
    recommendations: 15,
    specificity: 10,
  };

  const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);

  const overall_grade =
    ((arabicDetection.score / arabicDetection.max_score) * weights.arabic +
      (scoreAccuracy.score / scoreAccuracy.max_score) * weights.score +
      (criticalIssuesCoverage.score / criticalIssuesCoverage.max_score) * weights.issues +
      (complianceStatus.score / complianceStatus.max_score) * weights.compliance +
      (recommendationQuality.score / recommendationQuality.max_score) * weights.recommendations +
      (specificity.score / specificity.max_score) * weights.specificity) /
    totalWeight *
    100;

  // Overall pass requires all critical checks to pass
  const overall_pass =
    arabicDetection.passed && scoreAccuracy.passed && complianceStatus.passed;

  return {
    test_case_id: testCaseId,
    arabic_detection: arabicDetection,
    score_accuracy: scoreAccuracy,
    critical_issues_coverage: criticalIssuesCoverage,
    compliance_status: complianceStatus,
    recommendation_quality: recommendationQuality,
    specificity: specificity,
    overall_grade,
    overall_pass,
  };
}

/**
 * Standalone execution for testing
 */
async function main() {
  console.log('Grade Response module loaded.');
  console.log('Import gradeResponse() and use programmatically.');
}

if (process.argv[1]?.endsWith('grade-response.ts')) {
  main();
}
