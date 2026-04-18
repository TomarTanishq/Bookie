'use client';
import { useState } from 'react';
import { createSupabaseBrowser } from '../../lib/supabase-browser';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createSupabaseBrowser();

  async function handleLogin() {
    setLoading(true);
    setError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push('/dashboard');
    }
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-neutral-50 font-sans flex flex-col justify-center items-center px-6 selection:bg-indigo-500/30">
      <div className="w-full max-w-[400px]">
        {/* Brand/Logo */}
        <div className="flex justify-center mb-8">
          <Link href="/" className="w-10 h-10 bg-white rounded-lg flex items-center justify-center hover:scale-105 transition-transform">
            <svg width="18" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="3"><polyline points="20 12 20 22 12 17 4 22 4 2" /></svg>
          </Link>
        </div>

        <div className="bg-[#0f0f11] border border-neutral-800 rounded-2xl p-8 shadow-2xl">
          <h1 className="text-2xl font-medium tracking-tight text-white mb-2 text-center">Welcome back</h1>
          <p className="text-neutral-400 text-sm mb-8 text-center">Sign in to your Bookie account</p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl text-sm mb-6 flex items-start gap-2">
              <svg width="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mt-0.5 flex-shrink-0"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">Email address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-[#18181b] border border-neutral-800 text-neutral-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-neutral-600"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-[#18181b] border border-neutral-800 text-neutral-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-neutral-600"
                placeholder="••••••••"
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
              />
            </div>

            <div className="flex justify-end">
              <Link href="/forgot-password" size="sm" className="text-xs text-neutral-500 hover:text-white transition-colors">
                Forgot password?
              </Link>
            </div>

            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-white text-black font-medium py-3 rounded-xl text-sm hover:bg-neutral-200 active:scale-[0.98] transition-all disabled:opacity-50 disabled:active:scale-100 mt-2 shadow-lg"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </div>

        <p className="text-center mt-8 text-sm text-neutral-500">
          Don't have an account? <Link href="/signup" className="text-white hover:text-indigo-400 font-medium transition-colors">Sign up</Link>
        </p>
      </div>
    </div>
  );
}