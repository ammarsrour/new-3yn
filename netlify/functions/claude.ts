import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";

const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";

// For development: http://localhost:5173
// For production: Set ALLOWED_ORIGIN env var in Netlify to your domain
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || "http://localhost:5173";

interface ClaudeRequest {
  action: "analyze" | "validate";
  model?: string;
  system?: string;
  messages: Array<{ role: string; content: any }>;
  max_tokens?: number;
  temperature?: number;
  tools?: any[];
  tool_choice?: any;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  // Handle CORS preflight
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: "",
    };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    console.error("ANTHROPIC_API_KEY not configured in environment");
    return {
      statusCode: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Anthropic API key not configured on server" }),
    };
  }

  try {
    const requestBody: ClaudeRequest = JSON.parse(event.body || "{}");
    const { action, model, system, messages, max_tokens, temperature, tools, tool_choice } = requestBody;

    if (!messages || !Array.isArray(messages)) {
      return {
        statusCode: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Missing or invalid messages array" }),
      };
    }

    // Set defaults based on action
    const isValidate = action === "validate";
    const defaultModel = isValidate ? "claude-haiku-4-5-20251001" : "claude-haiku-4-5-20251001";
    const defaultMaxTokens = isValidate ? 150 : 4096;
    const defaultTemperature = isValidate ? 0.1 : 0.3;

    // Build Anthropic request body
    const anthropicRequestBody: any = {
      model: model || defaultModel,
      max_tokens: max_tokens || defaultMaxTokens,
      temperature: temperature ?? defaultTemperature,
      messages,
    };

    // Add system prompt as top-level string (not in messages)
    if (system) {
      anthropicRequestBody.system = system;
    }

    // Add tools if provided (pass through as-is, client handles schema transformation)
    if (tools && Array.isArray(tools) && tools.length > 0) {
      anthropicRequestBody.tools = tools;
      if (tool_choice) {
        anthropicRequestBody.tool_choice = tool_choice;
      }
    }

    const response = await fetch(ANTHROPIC_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify(anthropicRequestBody),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Anthropic API error:", response.status, data);
      return {
        statusCode: response.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        body: JSON.stringify({
          error: "Analysis service error",
          details: "Please try again later",
        }),
      };
    }

    return {
      statusCode: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error("Function error:", error);
    return {
      statusCode: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      body: JSON.stringify({
        error: "Internal server error",
        details: "Please try again later",
      }),
    };
  }
};

export { handler };
