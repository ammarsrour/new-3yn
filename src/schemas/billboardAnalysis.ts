/**
 * OpenAI Function Calling Schema for Billboard Analysis
 *
 * This schema enforces structured output from the AI model,
 * eliminating the need for regex parsing and heuristic validation.
 */

export const billboardAnalysisTool = {
  type: "function" as const,
  function: {
    name: "submit_billboard_analysis",
    description: "Submit the complete billboard readability analysis with all required metrics, Arabic compliance assessment, and actionable recommendations for the Oman market",
    parameters: {
      type: "object",
      required: [
        "text_content",
        "visual_analysis",
        "arabic_analysis",
        "readability_metrics",
        "assessment",
        "recommendations",
        "detailed_visual_description"
      ],
      properties: {
        text_content: {
          type: "object",
          description: "All text content extracted from the billboard",
          required: ["headline", "all_text_elements"],
          properties: {
            headline: {
              type: "string",
              description: "EXACT headline text copied verbatim from billboard"
            },
            body: {
              type: "string",
              description: "EXACT body text copied verbatim"
            },
            cta: {
              type: "string",
              description: "EXACT call-to-action text (URL, phone, etc.)"
            },
            all_text_elements: {
              type: "array",
              items: { type: "string" },
              description: "Every individual word/phrase visible on the billboard"
            }
          }
        },
        visual_analysis: {
          type: "object",
          description: "Visual design analysis including typography and colors",
          required: ["headline_font_inches", "text_color", "background_color", "contrast_ratio", "clutter_score"],
          properties: {
            headline_font_inches: {
              type: "number",
              description: "Estimated headline height in inches based on billboard proportions"
            },
            body_font_inches: {
              type: "number",
              description: "Estimated body text height in inches"
            },
            font_style: {
              type: "string",
              description: "Description of fonts used (e.g., 'Bold sans-serif headline, Regular serif body')"
            },
            text_color: {
              type: "string",
              description: "Primary text color as hex code (e.g., #FFFFFF)"
            },
            background_color: {
              type: "string",
              description: "Background color as hex code (e.g., #000000)"
            },
            accent_colors: {
              type: "array",
              items: { type: "string" },
              description: "Additional accent colors as hex codes"
            },
            clutter_score: {
              type: "integer",
              minimum: 1,
              maximum: 10,
              description: "Visual clutter score 1-10 (10 = most cluttered)"
            },
            contrast_ratio: {
              type: "string",
              description: "Estimated contrast ratio as 'X:1' (e.g., '4.5:1')"
            },
            design_elements: {
              type: "array",
              items: { type: "string" },
              description: "List of visual elements present (logos, images, icons, etc.)"
            }
          }
        },
        arabic_analysis: {
          type: "object",
          description: "Arabic language compliance analysis per Oman Ordinance 25/93",
          required: ["arabic_detected", "arabic_is_primary", "ordinance_25_93_compliant", "compliance_status"],
          properties: {
            arabic_detected: {
              type: "boolean",
              description: "Whether any Arabic text is present on the billboard"
            },
            arabic_text_found: {
              type: "array",
              items: { type: "string" },
              description: "All Arabic text elements found"
            },
            english_text_found: {
              type: "array",
              items: { type: "string" },
              description: "All English text elements found"
            },
            other_language_found: {
              type: "array",
              items: { type: "string" },
              description: "Text in other languages"
            },
            arabic_is_primary: {
              type: "boolean",
              description: "Is Arabic text larger and more prominent than other languages?"
            },
            english_positioned_next_to_arabic: {
              type: "boolean",
              description: "Is English text positioned directly adjacent to Arabic?"
            },
            ordinance_25_93_compliant: {
              type: "boolean",
              description: "Does the billboard comply with Oman Ordinance 25/93 requiring Arabic as main language?"
            },
            compliance_status: {
              type: "string",
              enum: ["compliant", "partial", "critical_violation_no_arabic"],
              description: "Compliance status: compliant (Arabic primary), partial (Arabic present but not primary), critical_violation_no_arabic (no Arabic)"
            },
            legal_consequence: {
              type: "string",
              description: "Legal consequence if non-compliant (e.g., 'Municipality can remove billboard')"
            }
          }
        },
        readability_metrics: {
          type: "object",
          description: "Quantitative readability measurements",
          required: ["word_count", "viewing_time_seconds", "compliant"],
          properties: {
            word_count: {
              type: "integer",
              minimum: 0,
              description: "Total number of words on the billboard"
            },
            viewing_time_seconds: {
              type: "number",
              minimum: 0,
              description: "Estimated viewing time in seconds based on traffic speed"
            },
            max_recommended_words: {
              type: "integer",
              description: "Maximum recommended words for this viewing time"
            },
            compliant: {
              type: "boolean",
              description: "Does the billboard meet readability requirements?"
            },
            word_count_violation: {
              type: "boolean",
              description: "Does word count exceed maximum recommended?"
            },
            specific_measurements: {
              type: "object",
              description: "Specific size measurements",
              properties: {
                headline_height_inches: { type: "number" },
                body_text_height_inches: { type: "number" },
                total_text_elements: { type: "integer" }
              }
            }
          }
        },
        assessment: {
          type: "object",
          description: "Overall assessment with scores and issues",
          required: ["overall_score", "critical_issues", "scores_breakdown"],
          properties: {
            overall_score: {
              type: "number",
              minimum: 0,
              maximum: 10,
              description: "Overall score 0-10. MUST be ≤4.5 if no Arabic, ≤6.5 if Arabic not primary"
            },
            critical_issues: {
              type: "array",
              items: { type: "string" },
              description: "List of critical issues with specific measurements and values"
            },
            scores_breakdown: {
              type: "object",
              description: "Component scores breakdown",
              required: ["font_clarity", "color_contrast", "layout_simplicity", "cta_effectiveness", "arabic_compliance"],
              properties: {
                font_clarity: {
                  type: "integer",
                  minimum: 0,
                  maximum: 10,
                  description: "Font readability score 0-10"
                },
                color_contrast: {
                  type: "integer",
                  minimum: 0,
                  maximum: 10,
                  description: "Color contrast score 0-10"
                },
                layout_simplicity: {
                  type: "integer",
                  minimum: 0,
                  maximum: 10,
                  description: "Layout simplicity score 0-10"
                },
                cta_effectiveness: {
                  type: "integer",
                  minimum: 0,
                  maximum: 10,
                  description: "Call-to-action effectiveness 0-10"
                },
                arabic_compliance: {
                  type: "integer",
                  minimum: 0,
                  maximum: 10,
                  description: "Arabic compliance score 0-10 (0 if no Arabic)"
                }
              }
            }
          }
        },
        recommendations: {
          type: "array",
          description: "Prioritized recommendations for improvement",
          minItems: 1,
          maxItems: 5,
          items: {
            type: "object",
            required: ["priority", "issue", "action", "expected_impact"],
            properties: {
              priority: {
                type: "string",
                enum: ["CRITICAL", "HIGH", "MEDIUM", "LOW"],
                description: "Priority level"
              },
              issue: {
                type: "string",
                description: "Specific issue with measurements (e.g., 'Headline at 10 inches is too small for 100m viewing')"
              },
              action: {
                type: "string",
                description: "Actionable fix with specific values (e.g., 'Increase headline to 16 inches')"
              },
              expected_impact: {
                type: "string",
                description: "Quantified improvement (e.g., '+25% readability, +15 points to score')"
              }
            }
          }
        },
        detailed_visual_description: {
          type: "string",
          description: "Complete visual description of the billboard including all elements, colors, positioning, and layout"
        }
      }
    }
  }
};

/**
 * TypeScript type derived from the schema for type safety
 */
export interface BillboardAnalysisToolResponse {
  text_content: {
    headline: string;
    body?: string;
    cta?: string;
    all_text_elements: string[];
  };
  visual_analysis: {
    headline_font_inches: number;
    body_font_inches?: number;
    font_style?: string;
    text_color: string;
    background_color: string;
    accent_colors?: string[];
    clutter_score: number;
    contrast_ratio: string;
    design_elements?: string[];
  };
  arabic_analysis: {
    arabic_detected: boolean;
    arabic_text_found?: string[];
    english_text_found?: string[];
    other_language_found?: string[];
    arabic_is_primary: boolean;
    english_positioned_next_to_arabic?: boolean;
    ordinance_25_93_compliant: boolean;
    compliance_status: 'compliant' | 'partial' | 'critical_violation_no_arabic';
    legal_consequence?: string;
  };
  readability_metrics: {
    word_count: number;
    viewing_time_seconds: number;
    max_recommended_words?: number;
    compliant: boolean;
    word_count_violation?: boolean;
    specific_measurements?: {
      headline_height_inches?: number;
      body_text_height_inches?: number;
      total_text_elements?: number;
    };
  };
  assessment: {
    overall_score: number;
    critical_issues: string[];
    scores_breakdown: {
      font_clarity: number;
      color_contrast: number;
      layout_simplicity: number;
      cta_effectiveness: number;
      arabic_compliance: number;
    };
  };
  recommendations: Array<{
    priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
    issue: string;
    action: string;
    expected_impact: string;
  }>;
  detailed_visual_description: string;
}
