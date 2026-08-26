import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
      <h1 className="text-5xl font-bold max-w-2xl mb-6">
        Practice interviews. Get real feedback. Land the job.
      </h1>
      <p className="text-lg text-gray-600 max-w-xl mb-8">
        PrepPilot generates role-specific interview questions, gives you
        instant AI feedback on every answer, and tracks your progress over
        time. Walk into your next interview ready.
      </p>
      <div className="flex gap-4">
        <Link
          href="/signup"
          className="bg-black text-white px-6 py-3 rounded text-lg font-medium"
        >
          Start Practicing (Free)
        </Link>
        <Link
          href="/login"
          className="border px-6 py-3 rounded text-lg font-medium"
        >
          Log In
        </Link>
      </div>
    </div>
  );
}