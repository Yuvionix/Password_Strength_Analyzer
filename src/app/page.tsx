import { PasswordAnalyzer } from "@/components/password-analyzer";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Password Strength Analyzer</h1>
          <p className="text-slate-300">Check how secure your password really is</p>
        </div>
        <PasswordAnalyzer />
      </div>
    </main>
  );
}
