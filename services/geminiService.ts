import { GoogleGenAI, Type } from "@google/genai";
import type { AnalysisResult } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    winner: { type: Type.STRING, enum: ['version1', 'version2', 'tie'], description: "The winning version for SEO." },
    summary: { type: Type.STRING, description: "A concise summary explaining why the winner was chosen." },
    detailedAnalysis: {
      type: Type.OBJECT,
      properties: {
        keywordStrategy: {
          type: Type.OBJECT,
          properties: {
            qualitativePoints: {
                type: Type.ARRAY,
                description: "A side-by-side comparison of qualitative points about the keyword strategy.",
                items: {
                    type: Type.OBJECT,
                    properties: {
                        point: { type: Type.STRING, description: "The aspect being compared (e.g., 'Primary Keyword Usage')." },
                        version1: { type: Type.STRING, description: "Analysis for Version 1 on this point." },
                        version2: { type: Type.STRING, description: "Analysis for Version 2 on this point." }
                    },
                    required: ['point', 'version1', 'version2']
                }
            },
            version1Keywords: {
              type: Type.ARRAY,
              description: "Top 5 keywords and their density for Version 1.",
              items: {
                type: Type.OBJECT,
                properties: {
                  keyword: { type: Type.STRING },
                  density: { type: Type.STRING, description: "Density of the keyword (e.g., '1.5%' or '5 times')." }
                },
                required: ['keyword', 'density']
              }
            },
            version2Keywords: {
              type: Type.ARRAY,
              description: "Top 5 keywords and their density for Version 2.",
              items: {
                type: Type.OBJECT,
                properties: {
                  keyword: { type: Type.STRING },
                  density: { type: Type.STRING, description: "Density of the keyword (e.g., '1.5%' or '5 times')." }
                },
                required: ['keyword', 'density']
              }
            }
          },
          required: ['qualitativePoints', 'version1Keywords', 'version2Keywords'],
        },
        readabilityAndEngagement: {
          type: Type.OBJECT,
          properties: {
            version1: { type: Type.STRING, description: "Analysis of Version 1's readability." },
            version2: { type: Type.STRING, description: "Analysis of Version 2's readability." },
          },
          required: ['version1', 'version2'],
        },
        metaContent: {
          type: Type.OBJECT,
          properties: {
            version1: { type: Type.STRING, description: "Analysis of Version 1's meta title, description, and tags." },
            version2: { type: Type.STRING, description: "Analysis of Version 2's meta title, description, and tags." },
            scoreVersion1: { type: Type.NUMBER, description: "SEO score out of 100 for Version 1's meta content."},
            scoreVersion2: { type: Type.NUMBER, description: "SEO score out of 100 for Version 2's meta content."},
          },
          required: ['version1', 'version2', 'scoreVersion1', 'scoreVersion2'],
        },
        structureAndFlow: {
          type: Type.OBJECT,
          properties: {
            version1: { type: Type.STRING, description: "Analysis of Version 1's structure and flow." },
            version2: { type: Type.STRING, description: "Analysis of Version 2's structure and flow." },
          },
          required: ['version1', 'version2'],
        },
        callToAction: {
          type: Type.OBJECT,
          properties: {
            version1: { type: Type.STRING, description: "Analysis of Version 1's call to action." },
            version2: { type: Type.STRING, description: "Analysis of Version 2's call to action." },
          },
          required: ['version1', 'version2'],
        },
      },
      required: ['keywordStrategy', 'readabilityAndEngagement', 'metaContent', 'structureAndFlow', 'callToAction'],
    },
    recommendations: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Actionable recommendations to improve the winning content."
    },
    suggestedKeywords: {
        type: Type.ARRAY,
        items: { type: Type.STRING },
        description: "An array of 5-10 additional high-intent keywords."
    },
    competitorAnalysis: {
        type: Type.STRING,
        description: "A brief analysis of how the content compares to top-ranking competitors."
    },
    rankingPrediction: {
        type: Type.STRING,
        description: "A qualitative prediction of the winning version's ranking potential."
    },
  },
  required: ['winner', 'summary', 'detailedAnalysis', 'recommendations', 'suggestedKeywords', 'competitorAnalysis', 'rankingPrediction']
};

export const analyzeSeoContent = async (version1: string, version2: string): Promise<AnalysisResult> => {
  const prompt = `
    You are a world-class SEO expert and copywriter specializing in e-commerce product descriptions and blog content for the South Asian market, particularly Bangladesh.
    Your task is to analyze and compare two versions of a product description for the 'Oraimo Watch 5 Lite'. Determine which version is superior for ranking high on Google in Bangladesh.

    Evaluate based on the following criteria:
    1.  **Keyword Strategy:**
        - First, identify the top 5 most important keywords for each version and calculate their density (as a percentage or count).
        - Second, provide a qualitative comparison of the keyword strategies. Structure this as a list of comparison points (e.g., 'Primary Keyword Usage', 'Long-tail Keyword Variety', 'Semantic Relevance'). For each point, provide a brief analysis for both Version 1 and Version 2.
    2.  **Readability & User Engagement:** Assess clarity, scannability (use of headings, lists, tables), and persuasive language.
    3.  **Meta Content:** Evaluate the effectiveness of the provided Meta Title, Meta Description, and Meta Tags for click-through rate (CTR) and keyword targeting. Provide a numerical SEO score out of 100 for each version's meta content.
    4.  **Structure & Flow:** Compare the logical flow, use of headings, FAQs, and overall structure of the content.
    5.  **Call to Action (CTA):** Evaluate the strength, clarity, and placement of the calls to action.

    In addition to the comparison, provide the following:
    - **Suggested Keywords:** Suggest 5-10 additional high-intent keywords relevant to the product in the Bangladeshi market.
    - **Competitor Analysis:** Provide a brief analysis of how this content might stack up against top-ranking competitors for 'Oraimo Watch 5 Lite price in Bangladesh'. Mention potential strengths and weaknesses against them.
    - **Ranking Prediction:** Give a qualitative prediction of the winning version's ranking potential (e.g., 'High potential to rank on the first page', 'Good potential but needs improvement').

    Here are the two versions:

    --- VERSION 1 ---
    ${version1}
    --- END OF VERSION 1 ---

    --- VERSION 2 ---
    ${version2}
    --- END OF VERSION 2 ---

    Provide your analysis in a structured JSON format according to the provided schema. Identify a clear winner ('version1' or 'version2'). If they are equally good, you can choose 'tie'.
    Provide a detailed breakdown for each criterion and offer actionable recommendations to make the winning version even better.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
      },
    });

    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText);
    return result as AnalysisResult;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to get analysis from Gemini. Please check the console for more details.");
  }
};