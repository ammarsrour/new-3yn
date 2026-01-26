// test-billboard-analyzer.ts
import { OpenAI } from "openai";

const client = new OpenAI({npx tsx test-billboard.ts
  apiKey: "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" // Make sure you have this set
});

async function testBillboardAnalyzer() {
  console.log("🚀 Testing Billboard Readability Analyzer...\n");

  const systemPrompt = `You are an expert billboard readability analyst specializing in outdoor advertising effectiveness for highway viewing conditions.

TASK: Analyze the uploaded billboard image and provide a comprehensive readability assessment.

EXTRACT:
1. Text Content: Headline, body copy, call-to-action, any additional text
2. Visual Properties: Font sizes (in inches), font style, colors (hex codes)
3. Layout Analysis: Text positioning, visual clutter score (1-10), text-to-image ratio
4. Readability Metrics: Word count, contrast ratio, reading time, legibility issues

CALCULATE (based on provided context or defaults):
- Viewing time available: (distance × 2) / (speed / 3.6) seconds
- Maximum recommended words: viewing_time × 2.5 words
- Minimum font size for highway: 12 inches for headline at 80+ km/h

ASSESS:
- Is word count within limits?
- Is font size adequate for viewing speed?
- Is contrast ratio sufficient (minimum 4.5:1)?
- Are there competing visual elements?

PROVIDE:
1. Overall readability score (0-10)
2. Top 3 critical issues
3. 3-5 specific, actionable recommendations with expected impact

OUTPUT FORMAT - Return valid JSON with this exact structure:
{
  "text_content": {
    "headline": "string",
    "body": "string",
    "cta": "string"
  },
  "visual_analysis": {
    "headline_font_inches": number,
    "body_font_inches": number,
    "font_style": "string",
    "text_color": "#hex",
    "background_color": "#hex",
    "clutter_score": number,
    "contrast_ratio": "number:1"
  },
  "readability_metrics": {
    "word_count": number,
    "viewing_time_seconds": number,
    "max_recommended_words": number,
    "compliant": boolean
  },
  "assessment": {
    "overall_score": number,
    "critical_issues": ["string", "string", "string"]
  },
  "recommendations": [
    {
      "priority": "HIGH|MEDIUM|LOW",
      "issue": "string",
      "action": "string",
      "expected_impact": "string"
    }
  ]
}

Be precise, specific, and actionable. Focus on what drivers can actually comprehend at highway speeds.`;

  const userPrompt = `Please analyze this billboard for highway readability.

Billboard description:
- Headline: "ANNUAL SOCCER TOURNAMENT" (large white text, bold sans-serif)
- Body: "23 MAY 2024 | 8 PM LIVE" (medium white text)
- CTA: "WWW.REALLYGREATSITE.COM" (smaller white text at bottom)
- Background: Black
- Visual elements: Two team logos with "VS" between them, flame graphics around logos, large soccer player illustration on right side (orange/yellow uniform)
- Accent colors: Orange (#FF6B4A)

Viewing context:
- Speed limit: 80 km/h
- Viewing distance: 50 meters
- Location: Highway billboard

Provide a comprehensive readability analysis following your expert framework. Return your analysis as valid JSON.`;

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: userPrompt,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
      max_tokens: 2048,
    });

    const analysis = response.choices[0].message.content;
    
    console.log("✅ Analysis Complete!\n");
    console.log("📊 Raw Response:");
    console.log("=".repeat(80));
    console.log(analysis);
    console.log("=".repeat(80));
    
    // Parse and display nicely
    const parsed = JSON.parse(analysis || "{}");
    
    console.log("\n📈 Key Metrics:");
    console.log(`   Overall Score: ${parsed.assessment?.overall_score}/10`);
    console.log(`   Word Count: ${parsed.readability_metrics?.word_count}`);
    console.log(`   Viewing Time: ${parsed.readability_metrics?.viewing_time_seconds}s`);
    console.log(`   Compliant: ${parsed.readability_metrics?.compliant ? "✅ Yes" : "❌ No"}`);
    
    console.log("\n🚨 Critical Issues:");
    parsed.assessment?.critical_issues?.forEach((issue: string, idx: number) => {
      console.log(`   ${idx + 1}. ${issue}`);
    });
    
    console.log("\n💡 Top Recommendations:");
    parsed.recommendations?.slice(0, 3).forEach((rec: any, idx: number) => {
      console.log(`   ${idx + 1}. [${rec.priority}] ${rec.issue}`);
      console.log(`      → ${rec.action}`);
      console.log(`      💰 Impact: ${rec.expected_impact}\n`);
    });

    console.log("\n✨ Test completed successfully!");
    
  } catch (error) {
    console.error("❌ Error testing billboard analyzer:", error);
    throw error;
  }
}

// Run the test
testBillboardAnalyzer()
  .then(() => {
    console.log("\n🎉 Done!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n💥 Test failed:", error);
    process.exit(1);
  });