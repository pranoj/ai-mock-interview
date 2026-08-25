"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

type Question = { question: string; type: string };

export default function InterviewSessionPage() {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [role, setRole] = useState("");
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answer, setAnswer] = useState("");
    const [feedback, setFeedback] = useState("");
    const [loading, setLoading] = useState(false);
    const [qaPairs, setQaPairs] = useState<any[]>([]);
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();

    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/login");
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        const stored = sessionStorage.getItem("currentInterview");
        if (!stored) {
            router.push("/interview/new");
            return;
        }
        const data = JSON.parse(stored);
        setQuestions(data.questions);
        setRole(data.role);
    }, [router]);

    if (authLoading || !user) {
        return null;
    }

    if (questions.length === 0) {
        return <p className="p-8">Loading questions...</p>;
    }

    const currentQuestion = questions[currentIndex];

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/generate-feedback", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    question: currentQuestion.question,
                    answer: answer,
                }),
            });
            const data = await res.json();
            if (data.error) {
                setFeedback(`Error: ${data.error} Please try submitting again.`);
            } else {
                setFeedback(data.feedback);
            }
        } catch {
            setFeedback("Something went wrong. Please try submitting again.");
        }
        setLoading(false);
    };

    const handleNext = () => {
        const updatedPairs = [
            ...qaPairs,
            {
                question: currentQuestion.question,
                type: currentQuestion.type,
                answer: answer,
                feedback: feedback,
            },
        ];
        setQaPairs(updatedPairs);

        if (currentIndex < questions.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setAnswer("");
            setFeedback("");
        } else {
            sessionStorage.setItem(
                "interviewResults",
                JSON.stringify({ role, qaPairs: updatedPairs })
            );
            router.push("/interview/summary");
        }
    };

    return (
        <div className="p-8 max-w-xl">
            <p className="text-sm text-gray-500 mb-2">
                Question {currentIndex + 1} of {questions.length} — {currentQuestion.type}
            </p>
            <h2 className="text-xl font-bold mb-4">{currentQuestion.question}</h2>

            <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="w-full border p-2 rounded h-32 mb-4"
                placeholder="Type your answer..."
            />

            <button
                onClick={handleSubmit}
                disabled={loading || !answer}
                className="bg-black text-white px-4 py-2 rounded disabled:opacity-50"
            >
                {loading ? "Getting feedback..." : "Submit Answer"}
            </button>

            {feedback && (
                <div className="mt-4 p-4 bg-gray-100 rounded">
                    <p className="font-medium">Feedback:</p>
                    <p>{feedback}</p>
                    <button
                        onClick={handleNext}
                        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
                    >
                        {currentIndex < questions.length - 1 ? "Next Question" : "Finish Interview"}
                    </button>
                </div>
            )}
        </div>
    );
}