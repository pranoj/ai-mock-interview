"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function InterviewSummaryPage() {
    const [summary, setSummary] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();

    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/login");
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        const stored = sessionStorage.getItem("interviewResults");
        if (!stored) {
            router.push("/interview/new");
            return;
        }
        const { role, qaPairs } = JSON.parse(stored);

        const fetchSummary = async () => {
            try {
                const res = await fetch("/api/generate-summary", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ role, qaPairs }),
                });
                const data = await res.json();
                if (data.error) {
                    setError(data.error);
                } else {
                    setSummary(data.summary);
                }
            } catch {
                setError("Something went wrong generating your summary.");
            }
            setLoading(false);
        };

        fetchSummary();
    }, [router]);

    if (authLoading || !user) {
        return null;
    }

    if (loading) {
        return <p className="p-8">Generating your summary...</p>;
    }

    if (error) {
        return <p className="p-8 text-red-500">{error}</p>;
    }

    return (
        <div className="p-8 max-w-xl">
            <h1 className="text-2xl font-bold mb-4">Interview Summary</h1>
            <p className="text-4xl font-bold mb-6">{summary.score}/10</p>

            <div className="mb-4">
                <h2 className="font-semibold mb-1">Strengths</h2>
                <p>{summary.strengths}</p>
            </div>

            <div className="mb-6">
                <h2 className="font-semibold mb-1">Areas to Improve</h2>
                <p>{summary.weaknesses}</p>
            </div>

            <button
                onClick={() => router.push("/dashboard")}
                className="bg-black text-white px-4 py-2 rounded"
            >
                Back to Dashboard
            </button>
        </div>
    );
}