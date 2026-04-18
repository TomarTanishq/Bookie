'use client';
import { useState } from 'react';
import { createSupabaseBrowser } from '../../lib/supabase-browser';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const supabase = createSupabaseBrowser();

  async function handleSignup() {
    setLoading(true);
    setError('');
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      if (error.message.toLowerCase().includes('already registered')) {
        setError('Acccount already exists. Please sign in instead.');
      } else {
        setError(error.message);
      }
      setLoading(false);
    } else {
      router.push('/dashboard');
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[#09090b] text-neutral-50 font-sans flex flex-col justify-center items-center px-6 selection:bg-indigo-500/30">
        <div className="w-full max-w-[400px] text-center">
          <div className="w-16 h-16 bg-neutral-900 border border-neutral-800 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-400">
            <svg width="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
          </div>
          <h1 className="text-2xl font-medium tracking-tight text-white mb-3">Check your email</h1>
          <p className="text-neutral-400 text-sm leading-relaxed">
            We sent a confirmation link to <span className="text-white font-medium">{email}</span>. Click it to activate your account.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-neutral-50 font-sans flex flex-col justify-center items-center px-6 selection:bg-indigo-500/30">
      <div className="w-full max-w-[400px]">
        {/* Brand/Logo */}
        <div className="flex justify-center mb-8">
          <Link href="/" className="w-10 h-10 bg-white rounded-lg flex items-center justify-center hover:scale-105 transition-transform shadow-lg shadow-white/10">
            <svg width="18" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="3"><polyline points="20 12 20 22 12 17 4 22 4 2" /></svg>
          </Link>
        </div>

        <div className="bg-[#0f0f11] border border-neutral-800 rounded-2xl p-8 shadow-2xl">
          <h1 className="text-2xl font-medium tracking-tight text-white mb-2 text-center">Create account</h1>
          <p className="text-neutral-400 text-sm mb-8 text-center">Start digesting with Bookie</p>

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
                placeholder="min 6 characters"
                onKeyDown={e => e.key === 'Enter' && handleSignup()}
              />
            </div>

            <button
              onClick={handleSignup}
              disabled={loading}
              className="w-full bg-indigo-600 text-white font-medium py-3 rounded-xl text-sm hover:bg-indigo-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:active:scale-100 mt-2 shadow-lg shadow-indigo-600/20"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </div>
        </div>

        <p className="text-center mt-8 text-sm text-neutral-500">
          Already have an account? <Link href="/login" className="text-white hover:text-indigo-400 font-medium transition-colors">Sign in</Link>
        </p>
      </div>
    </div>
  );
}