'use client';
import { useState, useEffect } from 'react';
import { createSupabaseBrowser } from '../../lib/supabase-browser';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ResetPasswordPage() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const router = useRouter();
    const supabase = createSupabaseBrowser();

    async function handleReset(e) {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);
        setError('');

        const { error } = await supabase.auth.updateUser({ password });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            setSuccess(true);
            setTimeout(() => {
                router.push('/login');
            }, 3000);
        }
    }

    return (
        <div className="min-h-screen bg-[#09090b] text-neutral-50 font-sans flex flex-col justify-center items-center px-6 selection:bg-indigo-500/30">
            <div className="w-full max-w-[400px]">
                {/* Brand/Logo */}
                <div className="flex justify-center mb-8">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-lg shadow-white/10">
                        <svg width="18" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="3"><polyline points="20 12 20 22 12 17 4 22 4 2" /></svg>
                    </div>
                </div>

                <div className="bg-[#0f0f11] border border-neutral-800 rounded-2xl p-8 shadow-2xl">
                    <h1 className="text-2xl font-medium tracking-tight text-white mb-2 text-center">New Password</h1>
                    <p className="text-neutral-400 text-sm mb-8 text-center">Secure your account with a new password</p>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-xl text-sm mb-6 flex items-start gap-2 animate-shake">
                            <svg width="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mt-0.5 flex-shrink-0"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                            <span>{error}</span>
                        </div>
                    )}

                    {success ? (
                        <div className="text-center py-6 animate-fade-in">
                            <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/50 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg width="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                            </div>
                            <p className="text-white font-medium mb-2">Password Updated!</p>
                            <p className="text-neutral-400 text-sm">Redirecting to login...</p>
                        </div>
                    ) : (
                        <form onSubmit={handleReset} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-neutral-300 mb-2">New Password</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    className="w-full bg-[#18181b] border border-neutral-800 text-neutral-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-neutral-600 shadow-inner"
                                    placeholder="at least 6 characters"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-300 mb-2">Confirm New Password</label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={e => setConfirmPassword(e.target.value)}
                                    className="w-full bg-[#18181b] border border-neutral-800 text-neutral-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-neutral-600 shadow-inner"
                                    placeholder="repeat new password"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-white text-black font-medium py-3 rounded-xl text-sm hover:bg-neutral-200 active:scale-[0.98] transition-all disabled:opacity-50 disabled:active:scale-100 mt-2 shadow-lg"
                            >
                                {loading ? 'Updating...' : 'Update Password'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
