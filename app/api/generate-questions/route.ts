import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const { role } = await req.json();

    const prompt = `Generate 5 mock interview questions for a ${role} role.
Mix technical and behavioral questions (aim for 3 technical, 2 behavioral).
Return ONLY a JSON array, no other text, in this exact format:
[
  { "question": "...", "type": "technical" },
  { "question": "...", "type": "behavioral" }
]`;

    const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-lite-latest:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
            }),
        }
    );

    const data = await response.json();

    if (!data.candidates) {
        return NextResponse.json(
            { error: "Gemini is temporarily unavailable. Please try again." },
            { status: 503 }
        );
    }

    const text = data.candidates[0].content.parts[0].text;
    const cleaned = text.replace(/```json|```/g, "").trim();
    const questions = JSON.parse(cleaned);

    return NextResponse.json({ questions });
}