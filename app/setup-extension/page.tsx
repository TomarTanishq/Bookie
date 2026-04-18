'use client';
import { useState, useEffect } from 'react';
import { createSupabaseBrowser } from '../../lib/supabase-browser';
import Link from 'next/link';

export default function ExtensionSetup() {
    const [user, setUser] = useState<any>(null);
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [hasExtension, setHasExtension] = useState(false);
    const [status, setStatus] = useState('');
    const [isSynced, setIsSynced] = useState(false);
    const supabase = createSupabaseBrowser();

    useEffect(() => {
        async function load() {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);

            if (user) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('telegram_chat_id')
                    .eq('id', user.id)
                    .single();
                setProfile(profile);
            }
            setLoading(false);

            // Handshake logic
            const checkExt = () => {
                if (document.documentElement.getAttribute('data-bookie-ext') === 'true') {
                    setHasExtension(true);
                }
            };

            const handleSuccess = () => {
                setIsSynced(true);
                setStatus('✅ Connection synchronized successfully!');
            };
            
            checkExt();
            document.addEventListener('BOOKIE_EXT_SETUP_SUCCESS', handleSuccess);

            const observer = new MutationObserver(checkExt);
            observer.observe(document.documentElement, { attributes: true });
            
            return () => {
                observer.disconnect();
                document.removeEventListener('BOOKIE_EXT_SETUP_SUCCESS', handleSuccess);
            };
        }
        load();
    }, []);

    const handleSync = () => {
        if (!profile?.telegram_chat_id) {
            setStatus('❌ No Telegram connected. Please go to Settings first.');
            return;
        }

        const setupEvent = new CustomEvent('BOOKIE_EXT_SETUP', {
            detail: {
                apiUrl: window.location.origin,
                chatId: profile.telegram_chat_id
            }
        });
        document.dispatchEvent(setupEvent);
        setStatus('Beaming settings to extension...');
    };

    if (loading) return (
        <div className="min-h-screen bg-[#09090b] flex items-center justify-center text-neutral-500">
            <div className="w-6 h-6 border-2 border-neutral-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    if (!user) {
        return (
            <div className="min-h-screen bg-[#09090b] flex items-center justify-center p-6 text-center">
                <div className="max-w-sm">
                    <h1 className="text-2xl font-bold text-white mb-4">Login Required</h1>
                    <p className="text-neutral-400 mb-8 text-sm">You need to be logged in to sync your extension.</p>
                    <Link href="/login" className="bg-white text-black px-8 py-3 rounded-full font-medium inline-block hover:bg-neutral-200 transition-colors shadow-lg">Login to Bookie</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#09090b] text-neutral-50 font-sans selection:bg-neutral-800">
            <nav className="border-b border-neutral-900 bg-[#0a0a0c] h-16 flex items-center px-6">
                <Link href="/dashboard" className="flex items-center gap-2.5 font-bold tracking-tight text-white hover:opacity-80 transition-opacity">
                    <div className="w-6 h-6 bg-white rounded-md flex items-center justify-center">
                        <svg width="12" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="3"><polyline points="20 12 20 22 12 17 4 22 4 2" /></svg>
                    </div>
                    Bookie.
                </Link>
            </nav>

            <main className="max-w-lg mx-auto px-6 pt-24 text-center">
                <div className="w-20 h-20 bg-neutral-900 border border-neutral-800 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl">
                    <svg width="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v8m0 0l-3-3m3 3l3-3M5 12h14a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2z" /></svg>
                </div>

                <h1 className="text-3xl font-medium tracking-tight text-white mb-4">Extension Sync</h1>
                <p className="text-neutral-400 text-sm leading-relaxed mb-12">
                    This page will securely pass your configuration to the Bookmark Digest extension. No manual typing required.
                </p>

                {!hasExtension ? (
                    <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6 mb-8 animate-fade-in shadow-inner">
                        <p className="text-sm text-neutral-300 font-medium mb-2">Extension Not Detected</p>
                        <p className="text-xs text-neutral-500 font-light">
                            Please make sure the Bookmark Digest extension is installed and enabled in your browser.
                        </p>
                    </div>
                ) : isSynced ? (
                    <div className="space-y-6 animate-fade-in">
                        <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-2xl p-6 mb-4">
                            <p className="text-sm font-medium text-emerald-500/80 mb-1">Success!</p>
                            <p className="text-xs text-emerald-500/40 font-light">Your extension is now linked and ready to sync bookmarks.</p>
                        </div>
                        <Link
                            href="/dashboard"
                            className="w-full bg-[#1a1a2e] hover:bg-[#252545] text-indigo-100 border border-indigo-500/20 py-4 rounded-2xl font-semibold transition-all active:scale-[0.98] shadow-xl shadow-indigo-500/5 block"
                        >
                            Go to Dashboard
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        <button
                            onClick={handleSync}
                            className="w-full bg-[#1a1a2e] hover:bg-[#252545] text-indigo-100 border border-indigo-500/20 py-4 rounded-2xl font-semibold transition-all active:scale-[0.98] shadow-xl shadow-indigo-500/5"
                        >
                            Connect Extension Now
                        </button>
                        {status && (
                            <p className={`text-sm font-medium animate-pulse ${status.includes('❌') ? 'text-red-400' : 'text-neutral-500'}`}>
                                {status}
                            </p>
                        )}
                    </div>
                )}

                <Link href="/dashboard" className="text-xs text-neutral-600 hover:text-neutral-400 transition-colors mt-12 block">
                    Return to Dashboard
                </Link>
            </main>
        </div>
    );
}
