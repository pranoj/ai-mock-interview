"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const ROLES = [
    "Frontend Engineer",
    "Backend Engineer",
    "Product Manager",
    "Data Analyst",
];

export default function NewInterviewPage() {
    const [role, setRole] = useState(ROLES[0]);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();

    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/login");
        }
    }, [user, authLoading, router]);

    if (authLoading || !user) {
        return null;
    }

    const handleStart = async () => {
        setLoading(true);
        const res = await fetch("/api/generate-questions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ role }),
        });
        const data = await res.json();

        sessionStorage.setItem(
            "currentInterview",
            JSON.stringify({ role, questions: data.questions, answers: [] })
        );

        router.push("/interview/session");
    };

    return (
        <div className="p-8 max-w-md">
            <h1 className="text-2xl font-bold mb-4">Start a Mock Interview</h1>
            <label className="block mb-2 font-medium">Choose a role:</label>
            <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full border p-2 rounded mb-4"
            >
                {ROLES.map((r) => (
                    <option key={r} value={r}>
                        {r}
                    </option>
                ))}
            </select>
            <button
                onClick={handleStart}
                disabled={loading}
                className="bg-black text-white px-4 py-2 rounded disabled:opacity-50"
            >
                {loading ? "Generating questions..." : "Start Interview"}
            </button>
        </div>
    );
}