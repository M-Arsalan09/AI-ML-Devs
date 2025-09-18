// api/search-developer.js (this runs on server in Vercel)
import { GoogleGenAI } from "@google/genai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { title, requirements, developers } = req.body;

  if (!title || !requirements || !developers) {
    return res.status(400).json({ error: "title, requirements, developers are required in body" });
  }

  // Get Gemini API key from env
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "Server mis-configured: missing API key" });
  }

  // init client
  const ai = new GoogleGenAI({ apiKey });  // prototype method; adjust for Vertex if using service account

  // Summarize devs for prompt
  const devSummaries = developers.map(dev => {
    const name = dev.Name || dev["Full Name"] || dev.name || "Unknown";
    const skills = (dev.details && dev.details.skills)
      ? dev.details.skills.map(s => {
          const skillName = s["Skill"] || s["skill"] || s["Technology"] || s["technology"] || "";
          const level = s["Experience level"] || s["Level"] || s["experience_level"] || "";
          return `${skillName}: ${level}`;
      }).join(", ")
      : "No skills listed";
    const experience = dev["Industry Experience"] || dev["Employment Duration"] || dev.Experience || "";
    return `Name: ${name}\nExperience: ${experience}\nSkills: ${skills}`;
  }).join("\n\n---\n\n");

  const prompt = `
Project Title: ${title}

Requirements:
${requirements}

Developer Profiles:
${devSummaries}

Task: Choose the most suitable developer. Return only JSON like:
{"bestDeveloper":"<developer name>","score":<0-100>,"reasoning":"<short explanation>"}
`;

  try {
    const resp = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: { responseMimeType: "application/json" }
    });

    const text = resp.text;
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return res.status(200).json({ error: "Model did not return JSON", raw: text });
    }

    let parsed;
    try {
      parsed = JSON.parse(jsonMatch[0]);
    } catch (e) {
      return res.status(200).json({ error: "Failed to parse JSON", raw: text, parseError: e.message });
    }

    return res.status(200).json({ result: parsed, raw: text });
  } catch (err) {
    console.error("Error calling Gemini API:", err);
    return res.status(500).json({ error: err.message });
  }
}
