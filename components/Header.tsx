"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function Header() {
    const { user } = useAuth();

    return (
        <header className="px-8 py-4 border-b">
            <Link href={user ? "/dashboard" : "/"} className="text-lg font-bold">
                PrepPilot
            </Link>
        </header>
    );
}