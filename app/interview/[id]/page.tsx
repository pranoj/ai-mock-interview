"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export default function InterviewDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const { user, loading: authLoading } = useAuth();
    const [interview, setInterview] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/login");
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        const fetchInterview = async () => {
            const docRef = doc(db, "interviews", id as string);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setInterview(docSnap.data());
            }
            setLoading(false);
        };
        fetchInterview();
    }, [id]);

    if (authLoading || !user || loading) {
        return <p className="p-8">Loading...</p>;
    }

    if (!interview) {
        return <p className="p-8">Interview not found.</p>;
    }

    return (
        <div className="p-8 max-w-xl">
            <button
                onClick={() => router.push("/dashboard")}
                className="text-blue-600 mb-4"
            >
                ← Back to Dashboard
            </button>

            <h1 className="text-2xl font-bold mb-2">{interview.role}</h1>
            <p className="text-4xl font-bold mb-6">{interview.summary.score}/10</p>

            <div className="mb-6">
                <h2 className="font-semibold mb-1">Strengths</h2>
                <p>{interview.summary.strengths}</p>
            </div>

            <div className="mb-6">
                <h2 className="font-semibold mb-1">Areas to Improve</h2>
                <p>{interview.summary.weaknesses}</p>
            </div>

            <h2 className="text-xl font-semibold mb-2">Full Transcript</h2>
            {interview.qaPairs.map((qa: any, i: number) => (
                <div key={i} className="border p-3 rounded mb-3">
                    <p className="text-sm text-gray-500 mb-1">{qa.type}</p>
                    <p className="font-medium mb-2">{qa.question}</p>
                    <p className="mb-2"><strong>Your answer:</strong> {qa.answer}</p>
                    <p className="text-sm text-gray-600"><strong>Feedback:</strong> {qa.feedback}</p>
                </div>
            ))}
        </div>
    );
}