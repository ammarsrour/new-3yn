import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";

const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

interface OpenAIRequest {
  action: "analyze" | "validate";
  model?: string;
  messages: any[];
  max_tokens?: number;
  temperature?: number;
  response_format?: { type: string };
}

const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  // Handle CORS preflight
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
      },
      body: "",
    };
  }

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  const apiKey = process.env.VITE_OPENAI_API_KEY;

  if (!apiKey) {
    console.error("VITE_OPENAI_API_KEY not configured in environment");
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ error: "OpenAI API key not configured on server" }),
    };
  }

  try {
    const requestBody: OpenAIRequest = JSON.parse(event.body || "{}");
    const { action, model, messages, max_tokens, temperature, response_format } = requestBody;

    if (!messages || !Array.isArray(messages)) {
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ error: "Missing or invalid messages array" }),
      };
    }

    // Build OpenAI request
    const openaiRequestBody: any = {
      model: model || (action === "validate" ? "gpt-4o-mini" : "gpt-4o"),
      messages,
      max_tokens: max_tokens || (action === "validate" ? 150 : 1500),
      temperature: temperature ?? (action === "validate" ? 0.1 : 0.3),
    };

    if (response_format) {
      openaiRequestBody.response_format = response_format;
    }

    console.log(`Processing ${action} request with model ${openaiRequestBody.model}`);

    const response = await fetch(OPENAI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(openaiRequestBody),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("OpenAI API error:", response.status, data);
      return {
        statusCode: response.status,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          error: `OpenAI API error: ${response.status}`,
          details: data.error?.message || "Unknown error",
        }),
      };
    }

    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error("Function error:", error);
    return {
      statusCode: 500,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
    };
  }
};

export { handler };
