/**
 * Prompt Runner for Billboard Analysis Evaluation
 *
 * Takes a test case description and runs the actual billboard analysis prompt
 * against OpenAI using the same configuration as production.
 *
 * Model: gpt-4o (same as production)
 */

import { getBillboardAnalyzerSystemPrompt } from '../prompts/billboardAnalyzer.js';
import { billboardAnalysisTool, BillboardAnalysisToolResponse } from '../schemas/billboardAnalysis.js';
import type { TestCase } from './types.js';

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const MODEL = 'gpt-4o';

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
 * Run the billboard analysis prompt for a given test case
 */
export async function runPrompt(testCase: TestCase): Promise<{
  response: BillboardAnalysisToolResponse;
  latency_ms: number;
}> {
  const apiKey = getApiKey();
  const systemPrompt = getBillboardAnalyzerSystemPrompt();

  const userMessage = `Analyze this billboard based on the following detailed description. Treat this description as if you were viewing the actual billboard image. Apply all scoring rules strictly, especially Arabic compliance requirements for Oman.

BILLBOARD DESCRIPTION:
${testCase.description}

Provide your complete analysis using the submit_billboard_analysis function. Be specific with measurements in inches, exact colors in hex codes, and reference the actual content described.`;

  const startTime = Date.now();

  const response = await fetch(OPENAI_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL,
      tools: [billboardAnalysisTool],
      tool_choice: { type: 'function', function: { name: 'submit_billboard_analysis' } },
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: userMessage,
        },
      ],
      max_tokens: 8000,
      temperature: 0.1, // Low temperature for consistency in evals
    }),
  });

  const latency_ms = Date.now() - startTime;

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(`OpenAI API error: ${response.status} - ${JSON.stringify(error)}`);
  }

  const data = await response.json();

  // Check for truncation via finish_reason
  const finishReason = data.choices?.[0]?.finish_reason;
  if (finishReason === 'length') {
    throw new Error('Response truncated due to max_tokens limit. Consider increasing max_tokens.');
  }

  const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];

  if (!toolCall?.function?.arguments) {
    throw new Error('No tool response from OpenAI');
  }

  if (toolCall.function.name !== 'submit_billboard_analysis') {
    throw new Error(`Unexpected tool: ${toolCall.function.name}`);
  }

  // Parse with error handling for truncated/malformed JSON
  let analysisResponse: BillboardAnalysisToolResponse;
  try {
    analysisResponse = JSON.parse(toolCall.function.arguments) as BillboardAnalysisToolResponse;
  } catch (parseError) {
    const preview = toolCall.function.arguments.substring(0, 200);
    throw new Error(`Failed to parse tool response (possibly truncated). Preview: ${preview}...`);
  }

  return {
    response: analysisResponse,
    latency_ms,
  };
}

/**
 * Standalone execution for testing a single case
 */
async function main() {
  const testDescription = process.argv[2];

  if (!testDescription) {
    console.log('Usage: npx tsx src/evals/run-prompt.ts "billboard description"');
    console.log('');
    console.log('Or import runPrompt() and use programmatically.');
    process.exit(1);
  }

  const testCase: TestCase = {
    id: 'cli_test',
    name: 'CLI Test',
    category: 'test',
    description: testDescription,
    expected: {
      score_range: [0, 10],
      arabic_detected: true,
      compliance_status: 'compliant',
      critical_issues_keywords: [],
    },
  };

  console.log('Running billboard analysis prompt...\n');

  try {
    const { response, latency_ms } = await runPrompt(testCase);

    console.log('Response received in', latency_ms, 'ms\n');
    console.log('Score:', response.assessment.overall_score);
    console.log('Arabic Detected:', response.arabic_analysis.arabic_detected);
    console.log('Compliance:', response.arabic_analysis.compliance_status);
    console.log('');
    console.log('Critical Issues:');
    for (const issue of response.assessment.critical_issues) {
      console.log('  -', issue.substring(0, 100) + (issue.length > 100 ? '...' : ''));
    }
    console.log('');
    console.log('Full response:');
    console.log(JSON.stringify(response, null, 2));
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

// Run if called directly
if (process.argv[1]?.endsWith('run-prompt.ts')) {
  main();
}
