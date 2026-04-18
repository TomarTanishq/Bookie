'use client';
import { useState } from 'react';
import { createSupabaseBrowser } from '../../lib/supabase-browser';
import Link from 'next/link';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const supabase = createSupabaseBrowser();

    async function handleResetRequest(e) {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setError('');

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`,
        });

        if (error) {
            setError(error.message);
        } else {
            setMessage('Check your email for the reset link!');
        }
        setLoading(false);
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
                    <h1 className="text-2xl font-medium tracking-tight text-white mb-2 text-center">Reset Password</h1>
                    <p className="text-neutral-400 text-sm mb-8 text-center">We'll send a magic link to your inbox</p>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl text-sm mb-6 flex items-start gap-2">
                            <svg width="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mt-0.5 flex-shrink-0"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                            <span>{error}</span>
                        </div>
                    )}

                    {message && (
                        <div className="bg-emerald-500/10 border border-emerald-500/50 text-emerald-400 px-4 py-3 rounded-xl text-sm mb-6 flex items-start gap-2 animate-fade-in">
                            <svg width="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mt-0.5 flex-shrink-0"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                            <span>{message}</span>
                        </div>
                    )}

                    <form onSubmit={handleResetRequest} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-neutral-300 mb-2">Email address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className="w-full bg-[#18181b] border border-neutral-800 text-neutral-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-neutral-600 shadow-inner"
                                placeholder="you@example.com"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading || message}
                            className="w-full bg-white text-black font-medium py-3 rounded-xl text-sm hover:bg-neutral-200 active:scale-[0.98] transition-all disabled:opacity-50 disabled:active:scale-100 mt-2 shadow-lg"
                        >
                            {loading ? 'Sending link...' : message ? 'Email Sent' : 'Send Reset Link'}
                        </button>
                    </form>
                </div>

                <p className="text-center mt-8 text-sm text-neutral-500">
                    Remember your password? <Link href="/login" className="text-white hover:text-indigo-400 font-medium transition-colors">Sign in</Link>
                </p>
            </div>
        </div>
    );
}
