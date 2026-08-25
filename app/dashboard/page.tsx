"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { signOut } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";

type Interview = {
    id: string;
    role: string;
    summary: { score: number };
    createdAt: any;
};

export default function DashboardPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [interviews, setInterviews] = useState<Interview[]>([]);
    const [loadingInterviews, setLoadingInterviews] = useState(true);

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login");
        }
    }, [user, loading, router]);

    useEffect(() => {
        const fetchInterviews = async () => {
            if (!user) return;
            const q = query(
                collection(db, "interviews"),
                where("userId", "==", user.uid),
                orderBy("createdAt", "desc")
            );
            const snapshot = await getDocs(q);
            const results = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            })) as Interview[];
            setInterviews(results);
            setLoadingInterviews(false);
        };

        if (user) {
            fetchInterviews();
        }
    }, [user]);

    const handleLogout = async () => {
        await signOut(auth);
        router.push("/login");
    };

    if (loading) {
        return <p className="p-8">Loading...</p>;
    }

    if (!user) {
        return null;
    }

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Dashboard</h1>
                    <p className="mt-1">Welcome, {user.email}</p>
                </div>
                <button
                    onClick={handleLogout}
                    className="bg-black text-white px-4 py-2 rounded"
                >
                    Log Out
                </button>
            </div>

            <button
                onClick={() => router.push("/interview/new")}
                className="bg-blue-600 text-white px-4 py-2 rounded mb-6"
            >
                Start New Interview
            </button>

            <h2 className="text-xl font-semibold mb-2">Past Interviews</h2>
            {loadingInterviews ? (
                <p>Loading interviews...</p>
            ) : interviews.length === 0 ? (
                <p className="text-gray-500">No interviews yet. Start one above!</p>
            ) : (
                <ul className="space-y-2">
                    {interviews.map((interview) => (
                        <li
                            key={interview.id}
                            onClick={() => router.push(`/interview/${interview.id}`)}
                            className="border p-3 rounded flex justify-between items-center cursor-pointer hover:bg-gray-50"
                        >
                            <span>{interview.role}</span>
                            <span className="font-semibold">{interview.summary.score}/10</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}