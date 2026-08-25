import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <nav className="flex justify-between items-center px-8 py-6">
        <span className="text-xl font-bold">PrepPilot</span>
        <div className="space-x-4">
          <Link href="/login" className="text-sm font-medium">
            Log In
          </Link>
          <Link
            href="/signup"
            className="text-sm font-medium bg-black text-white px-4 py-2 rounded"
          >
            Sign Up
          </Link>
        </div>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-5xl font-bold max-w-2xl mb-6">
          Practice interviews. Get real feedback. Land the job.
        </h1>
        <p className="text-lg text-gray-600 max-w-xl mb-8">
          PrepPilot generates role-specific interview questions, gives you
          instant AI feedback on every answer, and tracks your progress over
          time — so you walk into the real interview ready.
        </p>
        <Link
          href="/signup"
          className="bg-black text-white px-6 py-3 rounded text-lg font-medium"
        >
          Start Practicing — Free
        </Link>
      </main>

      <footer className="text-center text-sm text-gray-400 py-6">
        PrepPilot — built with Next.js, Firebase & Gemini
      </footer>
    </div>
  );
}