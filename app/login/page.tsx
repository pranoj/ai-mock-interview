"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        try {
            await signInWithEmailAndPassword(auth, email, password);
            router.push("/dashboard");
        } catch (err: any) {
            if (err.code === "auth/invalid-credential" || err.code === "auth/wrong-password") {
                setError("Incorrect email or password. Please try again.");
            } else if (err.code === "auth/user-not-found") {
                setError("No account found with this email. Try signing up instead.");
            } else {
                setError("Something went wrong. Please try again.");
            }
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center">
            <form onSubmit={handleLogin} className="w-80 space-y-4">
                <h1 className="text-2xl font-bold">Log In</h1>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border p-2 rounded"
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border p-2 rounded"
                    required
                />
                <button type="submit" className="w-full bg-black text-white p-2 rounded">
                    Log In
                </button>
                <p className="text-sm text-center text-gray-600">
                    Don&apos;t have an account?{" "}
                    <Link href="/signup" className="text-blue-600 font-medium">
                        Sign Up
                    </Link>
                </p>
            </form>
        </div>
    );
}