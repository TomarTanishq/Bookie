'use client';
import { useState, useEffect } from 'react';
import { createSupabaseBrowser } from '../../lib/supabase-browser';
import Link from 'next/link';

export default function SettingsPage() {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [linkUrl, setLinkUrl] = useState('');
    const [message, setMessage] = useState('');
    const supabase = createSupabaseBrowser();

    useEffect(() => {
        async function load() {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);

            if (user) {
                // Fetch profile
                let { data: profileData } = await supabase
                    .from('profiles')
                    .select('telegram_chat_id, digest_day, digest_frequency')
                    .eq('id', user.id)
                    .single();

                // If profile is missing (e.g. after manual DB cleanup), create it
                if (!profileData) {
                    const { data: newProfile, error: upsertError } = await supabase
                        .from('profiles')
                        .insert({ id: user.id })
                        .select()
                        .single();
                    
                    if (!upsertError) {
                        profileData = newProfile;
                    }
                }

                setProfile(profileData);
            }
            setLoading(false);
        }
        load();
    }, []);

    async function connectTelegram() {
        const token = crypto.randomUUID();
        const expires_at = new Date(Date.now() + 15 * 60 * 1000).toISOString();

        await supabase.from('telegram_link_tokens').insert({
            token,
            user_id: user.id,
            expires_at
        });

        const botUsername = process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME || 'BookieDigestBot';
        setLinkUrl(`https://t.me/${botUsername}?start=${token}`);
    }

    async function disconnectTelegram() {
        await supabase
            .from('profiles')
            .update({ telegram_chat_id: null })
            .eq('id', user.id);
        setProfile({ ...profile, telegram_chat_id: null });
        setLinkUrl('');
    }

    if (loading) return (
        <div className="min-h-screen bg-[#09090b] flex items-center justify-center text-neutral-500 font-sans">
            <div className="flex flex-col items-center gap-4">
                <div className="w-6 h-6 border-2 border-neutral-400 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-sm">Loading settings...</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#09090b] text-neutral-50 font-sans pb-24 selection:bg-neutral-800">
            {/* Navbar */}
            <nav className="border-b border-neutral-900 bg-[#0a0a0c] sticky top-0 z-50">
                <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2.5 font-bold tracking-tight text-white hover:opacity-80 transition-opacity">
                    <div className="w-6 h-6 bg-white rounded-md flex items-center justify-center">
                    <svg width="12" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="3"><polyline points="20 12 20 22 12 17 4 22 4 2" /></svg>
                    </div>
                    Bookie.
                </Link>
                <div className="flex items-center gap-2 md:gap-4">
                    <Link href="/dashboard" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-neutral-800">
                      Dashboard
                    </Link>
                </div>
                </div>
            </nav>

            <main className="max-w-2xl mx-auto px-6 mt-16">
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/dashboard" className="w-8 h-8 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors">
                        <svg width="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                    </Link>
                    <h1 className="text-3xl font-medium tracking-tight text-white">Settings</h1>
                </div>

                <div className="space-y-6">
                    {/* Telegram Section */}
                    <div className="bg-[#0f0f11] border border-neutral-800 rounded-2xl p-6 shadow-xl">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-full bg-[#229ED9]/10 flex items-center justify-center text-[#229ED9]">
                                <svg width="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21.5 2L2 10.5L8.5 13.5M21.5 2L15 22L8.5 13.5M21.5 2L8.5 13.5L8.5 19L11.5 15.5"/></svg>
                            </div>
                            <div>
                                <h2 className="text-lg font-medium text-white">Telegram Connection</h2>
                                <p className="text-sm text-neutral-500">Required to receive Sunday digests.</p>
                            </div>
                        </div>

                        {profile?.telegram_chat_id ? (
                            <div className="flex items-center justify-between bg-[#18181b] border border-neutral-800 rounded-xl p-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                                    <span className="text-sm font-medium text-emerald-400">Connected & Active</span>
                                </div>
                                <button
                                    onClick={disconnectTelegram}
                                    className="text-xs font-medium text-neutral-400 hover:text-red-400 px-3 py-1.5 rounded-lg border border-neutral-800 hover:border-red-900 bg-neutral-900 transition-colors"
                                >
                                    Disconnect
                                </button>
                            </div>
                        ) : (
                            <div className="bg-[#18181b] border border-neutral-800 rounded-xl p-6 text-center shadow-inner">
                                <p className="text-neutral-400 text-sm mb-6">
                                    You haven't connected your Telegram yet. You won't receive any digests until you link your account using the bot.
                                </p>
                                {!linkUrl ? (
                                    <button
                                        onClick={connectTelegram}
                                        className="inline-flex items-center justify-center bg-[#1a1a2e] hover:bg-[#252545] text-indigo-100 border border-indigo-500/20 px-6 py-2.5 rounded-xl text-sm font-medium transition-transform active:scale-[0.98] shadow-lg shadow-indigo-500/5"
                                    >
                                        Connect Telegram
                                    </button>
                                ) : (
                                    <div className="animate-fade-in">
                                        <p className="text-sm text-neutral-300 mb-4 font-medium">
                                            Step 2: Click to open your Telegram app
                                        </p>
                                        <a
                                            href={linkUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex items-center gap-2 bg-[#229ED9] hover:bg-[#1fa1df] text-white px-6 py-3 rounded-xl text-sm font-medium transition-transform active:scale-[0.98] shadow-lg shadow-[#229ED9]/20"
                                        >
                                            <svg width="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21.5 2L2 10.5L8.5 13.5M21.5 2L15 22L8.5 13.5M21.5 2L8.5 13.5L8.5 19L11.5 15.5"/></svg>
                                            Open Bookie Bot
                                        </a>
                                        <p className="text-xs text-neutral-500 mt-4">
                                            This magic link securely ties your Telegram ID to this account. It expires in 15 minutes.
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Digest Preferences Section */}
                    <div className="bg-[#0f0f11] border border-neutral-800 rounded-2xl p-6 shadow-xl">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500/80">
                                <svg width="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                            </div>
                            <div>
                                <h2 className="text-lg font-medium text-white">Digest Preferences</h2>
                                <p className="text-sm text-neutral-500">Pick how and when you want your updates.</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-xs text-neutral-500 font-medium mb-2 block uppercase tracking-wider">Frequency</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {['daily', 'weekly'].map(freq => (
                                        <button
                                            key={freq}
                                            onClick={() => setProfile({ ...profile, digest_frequency: freq })}
                                            className={`py-2.5 rounded-xl text-sm font-medium border transition-all ${
                                                profile?.digest_frequency === freq 
                                                    ? 'bg-indigo-500/20 border-indigo-500/30 text-indigo-300' 
                                                    : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                                            }`}
                                        >
                                            {freq.charAt(0).toUpperCase() + freq.slice(1)}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {profile?.digest_frequency === 'weekly' && (
                                <div className="animate-fade-in">
                                    <label className="text-xs text-neutral-500 font-medium mb-2 block uppercase tracking-wider">Preferred Day</label>
                                    <div className="relative">
                                        <select
                                            value={profile?.digest_day ?? 0}
                                            onChange={(e) => setProfile({ ...profile, digest_day: parseInt(e.target.value) })}
                                            className="w-full bg-neutral-900 border border-neutral-800 text-neutral-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-700/50 transition-all appearance-none cursor-pointer"
                                            style={{ backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%23a3a3a3\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1em' }}
                                        >
                                            {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day, i) => (
                                                <option key={day} value={i}>{day}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            )}

                            <div className="flex items-center justify-between gap-4 mt-2">
                                {message && (
                                    <span className="text-xs font-medium text-emerald-400 animate-pulse">
                                        {message}
                                    </span>
                                )}
                                <button
                                    onClick={async () => {
                                        const { error } = await supabase.from('profiles').update({
                                            digest_frequency: profile.digest_frequency || 'weekly',
                                            digest_day: profile.digest_day ?? 0
                                        }).eq('id', user.id);
                                        
                                        if (error) {
                                            setMessage('Error saving preferences');
                                        } else {
                                            setMessage('Preferences saved! ✅');
                                            setTimeout(() => setMessage(''), 3000);
                                        }
                                    }}
                                    className="flex-1 bg-[#1a1a2e] hover:bg-[#252545] text-indigo-100 border border-indigo-500/20 py-2.5 rounded-xl text-sm font-medium transition-transform active:scale-[0.98] shadow-lg shadow-indigo-500/5"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Account Section */}
                    <div className="bg-[#0f0f11] border border-neutral-800 rounded-2xl p-6 shadow-xl">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400">
                                <svg width="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                            </div>
                            <div>
                                <h2 className="text-lg font-medium text-white">Account Details</h2>
                                <p className="text-sm text-neutral-500">Manage your Bookie identity.</p>
                            </div>
                        </div>

                        <div className="bg-[#18181b] border border-neutral-800 rounded-xl p-4 flex items-center justify-between shadow-inner">
                           <div>
                              <p className="text-xs text-neutral-500 font-medium mb-1">Email Address</p>
                              <p className="text-sm text-neutral-200">{user?.email}</p>
                           </div>
                           <button
                                onClick={() => supabase.auth.signOut().then(() => window.location.href = '/login')}
                                className="text-xs font-medium text-red-400 hover:text-white hover:bg-red-500 px-4 py-2 rounded-lg border border-red-900/50 hover:border-red-500 bg-red-500/10 transition-colors"
                            >
                                Sign out
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}