import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const { role, qaPairs } = await req.json();

    const transcript = qaPairs
        .map((qa: any, i: number) => `Q${i + 1} (${qa.type}): ${qa.question}\nAnswer: ${qa.answer}`)
        .join("\n\n");

    const prompt = `You are an interview coach reviewing a full mock interview for a ${role} role.

Here is the full transcript:
${transcript}

Give an overall summary in this exact JSON format, no other text:
{
  "strengths": "2-3 sentences on what they did well",
  "weaknesses": "2-3 sentences on what to improve",
  "score": <a number from 1 to 10>
}`;

    const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
            }),
        }
    );

    const data = await response.json();
    const text = data.candidates[0].content.parts[0].text;
    const cleaned = text.replace(/```json|```/g, "").trim();
    const summary = JSON.parse(cleaned);

    return NextResponse.json({ summary });
}