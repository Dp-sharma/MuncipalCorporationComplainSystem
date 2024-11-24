import { NextResponse } from "next/server";

// Domain-specific AI model mapping
const monster_ai_model_name = {
  "Google-Gemma": "google/gemma-2-9b-it",
  "Mistral": "mistralai/Mistral-7B-Instruct-v0.2",
  "Microsoft-Phi": "microsoft/Phi-3-mini-4k-instruct",
  "Meta-Llama": "meta-llama/Meta-Llama-3.1-8B-Instruct",
};

// Environment variable for API key
const MONSTER_API_KEY = process.env.MONSTER_API_KEY; // Ensure this is set in your .env file
const MONSTER_API_URL = "https://llm.monsterapi.ai/v1/chat/completions";

// POST handler for the API route
export async function POST(req) {
  try {
    // Parse request body
    const body = await req.json();
    const { prompt, llm_name } = body;

    // Validate inputs
    if (!prompt || !llm_name) {
      return NextResponse.json(
        { error: "Missing required parameters: prompt or llm_name." },
        { status: 400 }
      );
    }

    const model_name = monster_ai_model_name[llm_name];
    if (!model_name) {
      return NextResponse.json(
        { error: "Invalid model name provided." },
        { status: 400 }
      );
    }

    // Domain-specific context for Smart City Complaints
    const messages = [
      {
        role: "system",
        content:
          "You are a Smart City Complaints Assistant. Your role is to help users report issues like potholes, waste collection, and broken streetlights, and provide updates on reported problems. Respond concisely and professionally.",
      },
      { role: "user", content: prompt }, // User's input
    ];

    // Send request to Monster API
    const response = await fetch(MONSTER_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${MONSTER_API_KEY}`,
      },
      body: JSON.stringify({
        model: model_name,
        messages: messages,
        temperature: 0.7, // Adjusted for balanced creativity
        top_p: 0.85,
        max_tokens: 1500, // Reduced for concise responses
        stream: false,
      }),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch response from Monster API." },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Extract response from Monster API
    const ai_response = data.choices?.[0]?.message?.content ?? "No response received.";
    return NextResponse.json({ response: ai_response });
  } catch (error) {
    console.error("Error in API route:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while processing your request." },
      { status: 500 }
    );
  }
}
