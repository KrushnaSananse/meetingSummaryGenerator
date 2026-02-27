const axios = require("axios");

/**
 * Build structured prompt
 */
function buildPrompt(transcript, section) {
  let sectionInstruction = "";

  if (section && section !== "all") {
    sectionInstruction = `
      Generate ONLY the "${section}" section.
      Do NOT generate other sections.
      Return strictly valid JSON.
    `;
  } else {
    sectionInstruction = `
      Generate all sections: main_topics, key_decisions, action_items.
      Return strictly valid JSON.
    `;
  }

  return `
    You are a highly accurate meeting summarizer.

    CRITICAL RULES:
    1. Extract ONLY information explicitly present in transcript.
    2. Do NOT hallucinate.
    3. If missing, return null or empty array.
    4. Output STRICT JSON only.

    JSON FORMAT:

    If ALL sections:
    {
      "main_topics": ["string"],
      "key_decisions": ["string"],
      "action_items": [
        {
          "task": "string",
          "owner": "string or null",
          "due_date": "string or null"
        }
      ]
    }

    If single section requested, return only that section.

    ${sectionInstruction}

    TRANSCRIPT:
    """
    ${transcript}
    """
  `;
} 

/**
 * Safe JSON parsing
 */
function safeJsonParse(text) {
  try {
    return JSON.parse(text);
  } catch (err) {
    // Extract JSON object from text
    const jsonMatch = text.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      throw new Error("No valid JSON found in model response");
    }

    return JSON.parse(jsonMatch[0]);
  }
}
/**
 * Generate summary using Ollama local model
 */
async function generateSummary(transcript, section = "all") {
    
  if (!transcript || transcript.trim() === "") {
    throw new Error("Transcript is empty");
  }

  console.log("Transcript : ",transcript);
  console.log("Section : ",section);
  const prompt = buildPrompt(transcript, section);
  console.log("Prompt : ",prompt);
  const response = await axios.post(
    "http://localhost:11434/api/generate",
    {
      model: "llama3",
      prompt: prompt,
      stream: false
    }
  );

  console.log("Response : ",response);
  const rawOutput = response.data.response;
  console.log("rawOutput : ",rawOutput);

  const parsed = safeJsonParse(rawOutput);

  return parsed;
}

module.exports = { generateSummary };