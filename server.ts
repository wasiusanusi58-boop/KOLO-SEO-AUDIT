import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API router
  app.post("/api/audit", async (req, res) => {
    try {
      const { url } = req.body;
      if (!url) {
        return res.status(400).json({ error: "URL is required" });
      }

      const prompt = `Analyze the website URL conceptually: ${url}. Provide a realistic, simulated comprehensive SEO audit. Include scores out of 100 and specific detailed insights. Return the output as JSON matching the schema precisely.

      Respond ONLY with valid JSON.
      JSON Schema:
      {
        "type": "object",
        "properties": {
          "overallScore": {"type": "number"},
          "performanceScore": {"type": "number"},
          "contentQualityScore": {"type": "number"},
          "mobileOptimizationScore": {"type": "number"},
          "userExperienceScore": {"type": "number"},
          "technicalSEOScore": {"type": "number"},
          "insights": {
            "type": "object",
            "properties": {
              "metaTitle": {"type": "string", "description": "Analysis of meta title"},
              "metaDescription": {"type": "string"},
              "headingStructure": {"type": "string"},
              "keywordOptimization": {"type": "string"},
              "internalLinking": {"type": "string"},
              "contentReadability": {"type": "string"},
              "callToAction": {"type": "string"},
              "mobileResponsiveness": {"type": "string"},
              "pageSpeed": {"type": "string"},
              "accessibility": {"type": "string"}
            },
            "required": ["metaTitle", "metaDescription", "headingStructure", "keywordOptimization", "internalLinking", "contentReadability", "callToAction", "mobileResponsiveness", "pageSpeed", "accessibility"]
          },
          "recommendations": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "priority": {"type": "string", "enum": ["critical", "important", "quick-win", "long-term"]},
                "title": {"type": "string"},
                "description": {"type": "string"}
              },
              "required": ["priority", "title", "description"]
            }
          }
        },
        "required": ["overallScore", "performanceScore", "contentQualityScore", "mobileOptimizationScore", "userExperienceScore", "technicalSEOScore", "insights", "recommendations"]
      }`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        }
      });

      const jsonStr = response.text || "{}";
      const data = JSON.parse(jsonStr);
      res.json(data);
    } catch (error) {
      console.error("Audit Generation Error:", error);
      res.status(500).json({ error: "Failed to generate audit" });
    }
  });

  app.post("/api/competitor", async (req, res) => {
    try {
      const { url, competitorUrl } = req.body;
      if (!url || !competitorUrl) {
        return res.status(400).json({ error: "Both URL and competitor URL are required" });
      }

      const prompt = `Perform a simulated high-level conceptual competitor analysis. Compare ${url} against ${competitorUrl}. Return valid JSON matching the schema precisely.

      JSON Schema:
      {
        "type": "object",
        "properties": {
          "strengths": {
            "type": "array",
            "items": {"type": "string"}
          },
          "weaknesses": {
            "type": "array",
            "items": {"type": "string"}
          },
          "contentGaps": {
            "type": "array",
            "items": {"type": "string"}
          },
          "keywordOpportunities": {
            "type": "array",
            "items": {"type": "string"}
          },
          "roadmap": {
            "type": "array",
            "items": {"type": "string"}
          }
        },
        "required": ["strengths", "weaknesses", "contentGaps", "keywordOpportunities", "roadmap"]
      }`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        }
      });

      const jsonStr = response.text || "{}";
      const data = JSON.parse(jsonStr);
      res.json(data);
    } catch (error) {
      console.error("Competitor Analysis Error:", error);
      res.status(500).json({ error: "Failed to generate analysis" });
    }
  });


  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
