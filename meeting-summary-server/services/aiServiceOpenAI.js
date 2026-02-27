const OpenAI = require("openai");

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Build dynamic prompt based on requested section
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
        You are a highly accurate AI meeting summarizer.

        CRITICAL RULES:
        1. Extract ONLY information explicitly present in the transcript.
        2. DO NOT infer, assume, or hallucinate.
        3. If something is not mentioned, return null or empty array.
        4. Do not fabricate owners or due dates.
        5. Keep wording concise and factual.
        6. Output STRICT JSON only. No explanation text.

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

        If single section requested, return only that section in JSON.

        ${sectionInstruction}

        TRANSCRIPT:
        """
        ${transcript}
        """
    `;
}

/**
 * Safely parse AI JSON response
 */
function safeJsonParse(text) {
    try {
        return JSON.parse(text);
    } catch (error) {
        // Attempt minor cleanup if model wraps JSON in markdown
        const cleaned = text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

        try {
            return JSON.parse(cleaned);
        } catch (err) {
            throw new Error("Invalid JSON returned from AI");
        }
    }
}

/**
 * Basic validation to reduce hallucination risk
 * Ensures extracted content exists in transcript
 */
function validateAgainstTranscript(transcript, result) {
    const lowerTranscript = transcript.toLowerCase();

    function existsInTranscript(text) {
        if (!text) return true;
        return lowerTranscript.includes(text.toLowerCase());
    }

    // Validate topics
    if (result.main_topics) {
        result.main_topics = result.main_topics.filter(topic =>
            existsInTranscript(topic)
        );
    }

    // Validate decisions
    if (result.key_decisions) {
        result.key_decisions = result.key_decisions.filter(decision =>
            existsInTranscript(decision)
        );
    }

    // Validate action items
    if (result.action_items) {
        result.action_items = result.action_items.filter(item =>
            existsInTranscript(item.task)
        );
    }

    return result;
}

/**
 * Main summary generator function
 */
async function generateSummary(transcript, section = "all") {
    if (!transcript || transcript.trim() === "") {
        throw new Error("Transcript is empty");
    }

    const prompt = buildPrompt(transcript, section);

    try {
        const response = await openai.responses.create({
            model: "gpt-4.1-mini", // recommended latest stable small model
            temperature: 0.2,
            input: [
                {
                    role: "system",
                    content: "You are a precise enterprise meeting summarization engine.",
                },
                {
                    role: "user",
                    content: prompt,
                },
            ],
        });

        // ✅ NEW WAY to get text
        const rawOutput = response.output_text;
        console.log("Resposne ai service at 148",response)
        console.log("rawOutput ai service at 149",rawOutput)

        const parsed = safeJsonParse(rawOutput);

        console.log("parsed ai service at 152",parsed)

        const validated = validateAgainstTranscript(transcript, parsed);
        console.log("transcript ai service at 156",transcript)
        console.log("validated ai service at 157",validated)

        return validated;

    } catch (error) {
        console.error("OpenAI Error:", error);
        throw new Error("AI summarization failed");
    }
}

module.exports = { generateSummary };