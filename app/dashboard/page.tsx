"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function DashboardPage() {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login");
        }
    }, [user, loading, router]);

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
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="mt-2">Welcome, {user.email}</p>
            <button
                onClick={handleLogout}
                className="mt-4 bg-black text-white px-4 py-2 rounded"
            >
                Log Out
            </button>
        </div>
    );
}