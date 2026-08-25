import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const { question, answer } = await req.json();

    const prompt = `You are an interview coach. A candidate was asked:
"${question}"

Their answer was:
"${answer}"

Give short, constructive feedback (2-3 sentences max). Be direct but encouraging.`;

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
    const feedback = data.candidates[0].content.parts[0].text;

    return NextResponse.json({ feedback });
}