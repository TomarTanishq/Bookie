'use client';
import { useState, useEffect } from 'react';
import { createSupabaseBrowser } from '../../lib/supabase-browser';
import ReactMarkdown from 'react-markdown';
import Link from 'next/link';

export default function DashboardPage() {
  const [bookmarks, setBookmarks] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', content: 'Hey! I can help you search or summarize your bookmarks. Ask me anything!' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatTyping, setIsChatTyping] = useState(false);
  const supabase = createSupabaseBrowser();

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        // Ensure profile exists
        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', user.id)
          .single();
        
        if (!profile) {
          await supabase.from('profiles').insert({ id: user.id });
        }

        const { data } = await supabase
          .from('bookmarks')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        setBookmarks(data || []);
        setFiltered(data || []);
      }
      setLoading(false);
    }
    load();
  }, []);

  useEffect(() => {
    let result = bookmarks;

    if (filter === 'pending') result = result.filter(b => !b.digest_sent);
    if (filter === 'sent') result = result.filter(b => b.digest_sent);

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(b =>
        b.title?.toLowerCase().includes(q) ||
        b.summary?.toLowerCase().includes(q) ||
        b.url?.toLowerCase().includes(q)
      );
    }

    setFiltered(result);
  }, [search, filter, bookmarks]);

  async function deleteBookmark(id) {
    await supabase.from('bookmarks').delete().eq('id', id);
    setBookmarks(prev => prev.filter(b => b.id !== id));
  }

  async function sendNow() {
    setSending(true);
    setMessage('');
    const res = await fetch('/api/digest', { method: 'POST' });
    const data = await res.json();
    if (data.ok) {
      setMessage('Digest sent to your Telegram!');
      const { data: fresh } = await supabase
        .from('bookmarks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      setBookmarks(fresh || []);
    } else {
      setMessage(data.error || 'Something went wrong.');
    }
    setSending(false);
  }

  async function sendChatMessage(e) {
    if (e) e.preventDefault();
    if (!chatInput.trim() || isChatTyping) return;

    const userMessage = { role: 'user', content: chatInput };
    setChatMessages(prev => [...prev, userMessage]);
    setChatInput('');
    setIsChatTyping(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...chatMessages, userMessage] })
      });
      const data = await res.json();
      if (data.content) {
        setChatMessages(prev => [...prev, { role: 'assistant', content: data.content }]);
      }
    } catch (err) {
      console.error('Chat error:', err);
    } finally {
      setIsChatTyping(false);
    }
  }

  const total = bookmarks.length;
  const sent = bookmarks.filter(b => b.digest_sent).length;
  const pending = bookmarks.filter(b => !b.digest_sent).length;

  if (loading) return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center text-neutral-500 font-sans">
      <div className="flex flex-col items-center gap-4">
        <div className="w-6 h-6 border-2 border-neutral-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm">Loading bookmarks...</p>
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
            <Link href="/settings" className="text-sm font-medium text-neutral-400 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-neutral-800">
              Settings
            </Link>
            <button
              onClick={() => supabase.auth.signOut().then(() => window.location.href = '/login')}
              className="text-sm font-medium text-neutral-400 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-neutral-800"
            >
              Sign out
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 mt-12">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-medium tracking-tight text-white mb-2">My Bookmarks</h1>
            <p className="text-neutral-400 text-sm">Manage your saved links and pending digests.</p>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            {message && (
              <span className={`text-sm font-medium ${message.includes('sent') ? 'text-emerald-400' : 'text-red-400'} animate-pulse`}>
                {message}
              </span>
            )}
            <button
              onClick={sendNow}
              disabled={sending}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-[#1a1a2e] hover:bg-[#252545] text-indigo-100 border border-indigo-500/20 px-5 py-2.5 rounded-xl text-sm font-medium transition-all active:scale-[0.98] disabled:opacity-50 shadow-lg shadow-indigo-500/5"
            >
              {sending ? (
                <div className="w-4 h-4 border-2 border-indigo-500/30 border-t-indigo-400 rounded-full animate-spin"></div>
              ) : (
                <svg width="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" /></svg>
              )}
              {sending ? 'Sending...' : 'Send digest'}
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {[
            {
              label: 'Total saved',
              value: total,
              icon: <svg width="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>,
              color: 'text-indigo-400',
              bg: 'bg-indigo-500/10',
              border: 'border-indigo-500/20'
            },
            {
              label: 'In next digest',
              value: pending,
              icon: <svg width="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>,
              color: 'text-amber-500/80',
              bg: 'bg-amber-500/10',
              border: 'border-amber-500/20'
            },
            {
              label: 'Already sent',
              value: sent,
              icon: <svg width="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>,
              color: 'text-emerald-500/80',
              bg: 'bg-emerald-500/10',
              border: 'border-emerald-500/20'
            },
          ].map(stat => (
            <div key={stat.label} className="bg-[#0f0f11] border border-neutral-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between hover:border-neutral-700 transition-colors">
              <div className={`w-8 h-8 rounded-lg ${stat.bg} ${stat.color} flex items-center justify-center mb-4`}>
                {stat.icon}
              </div>
              <div>
                <div className={`text-3xl font-medium ${stat.color} tracking-tight`}>{stat.value}</div>
                <div className="text-xs text-neutral-500 mt-1 font-medium">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Search + Filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500">
              <svg width="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </div>
            <input
              type="text"
              placeholder="Search by title, url, or summary..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-[#18181b] border border-neutral-800 text-neutral-100 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-700/50 transition-all placeholder:text-neutral-600 shadow-inner"
            />
          </div>
          <select
            value={filter}
            onChange={e => setFilter(e.target.value)}
            className="bg-[#18181b] border border-neutral-800 text-neutral-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-700/50 transition-all appearance-none outline-none shadow-inner md:w-48 cursor-pointer"
            style={{ backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%23a3a3a3\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1em' }}
          >
            <option value="all">All bookmarks</option>
            <option value="pending">In next digest</option>
            <option value="sent">Already sent</option>
          </select>
        </div>

        {/* Bookmark Cards */}
        {filtered.length === 0 ? (
          <div className="text-center py-24 border border-neutral-800 border-dashed rounded-2xl bg-[#0a0a0c]">
            <div className="w-12 h-12 bg-neutral-900 border border-neutral-800 rounded-xl flex items-center justify-center mx-auto mb-5 text-neutral-500 shadow-inner">
              <svg width="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
            </div>
            <p className="text-neutral-400 text-sm">
              {search ? 'No bookmarks match your search.' : 'No bookmarks yet. Send a URL to your Telegram bot to save one!'}
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filtered.map(b => {
              let hostname = b.url;
              try { hostname = new URL(b.url).hostname; } catch (e) { }

              return (
                <div key={b.id} className="group bg-[#0f0f11] border border-neutral-800 rounded-2xl p-6 shadow-xl hover:border-neutral-700 transition-colors flex flex-col items-start gap-4">

                  <div className="w-full">
                    <div className="flex items-center gap-3 mb-3">
                      <span className={`text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-md ${b.digest_sent
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-neutral-800 text-neutral-400 border border-neutral-700'
                        }`}>
                        {b.digest_sent ? 'Sent' : 'Pending'}
                      </span>
                      <p className="text-xs text-neutral-500 font-mono flex-1 truncate">{hostname}</p>
                    </div>

                    <h3 className="text-lg font-medium text-neutral-200 mb-2 leading-snug">
                      <a href={b.url} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">{b.title || b.url}</a>
                    </h3>

                    {b.summary && (
                      <p className="text-[13px] text-neutral-400 leading-relaxed font-light mb-4 line-clamp-3">
                        {b.summary}
                      </p>
                    )}

                    <div className="flex items-center justify-between w-full pt-1">
                      <div className="text-xs text-neutral-600">
                        {new Date(b.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>

                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <a
                          href={b.url}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center justify-center p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                          title="Open original"
                        >
                          <svg width="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                        </a>
                        <button
                          onClick={() => deleteBookmark(b.id)}
                          className="flex items-center justify-center p-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-red-400 hover:border-red-900 transition-colors"
                          title="Delete"
                        >
                          <svg width="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Floating AI Chat */}
      <div className="fixed bottom-6 right-6 z-[60] flex flex-col items-end gap-4">
        {isChatOpen && (
          <div className="w-[calc(100vw-3rem)] sm:w-96 h-[500px] bg-[#0f0f11] border border-neutral-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
            {/* Chat Header */}
            <div className="p-5 border-b border-neutral-800 flex items-center justify-between bg-[#0a0a0c]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-lg">
                  <svg width="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white leading-none">Bookie AI</h4>
                  <p className="text-[10px] text-indigo-500/70 mt-1 uppercase tracking-widest font-bold">Online</p>
                </div>
              </div>
              <button onClick={() => setIsChatOpen(false)} className="text-neutral-500 hover:text-white transition-colors">
                <svg width="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-[13px] leading-relaxed ${msg.role === 'user'
                    ? 'bg-neutral-800 text-white rounded-tr-sm'
                    : 'bg-[#18181b] border border-neutral-800 text-neutral-200 rounded-tl-sm shadow-inner'
                    }`}>
                    {msg.role === 'user' ? (
                      msg.content
                    ) : (
                      <ReactMarkdown
                        components={{
                          a: ({ node, ...props }) => <a {...props} target="_blank" rel="noopener noreferrer" className="text-neutral-100 hover:text-white underline underline-offset-4 decoration-white/20 transition-colors" />
                        }}
                      >
                        {msg.content}
                      </ReactMarkdown>
                    )}
                  </div>
                </div>
              ))}
              {isChatTyping && (
                <div className="flex justify-start">
                  <div className="bg-[#18181b] border border-neutral-800 px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-1.5 shadow-inner">
                    <div className="w-1.5 h-1.5 bg-neutral-500 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-neutral-500 rounded-full animate-bounce delay-75"></div>
                    <div className="w-1.5 h-1.5 bg-neutral-500 rounded-full animate-bounce delay-150"></div>
                  </div>
                </div>
              )}
            </div>

            {/* Chat Input */}
            <form onSubmit={sendChatMessage} className="p-4 bg-[#0a0a0c] border-t border-neutral-800">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Ask about your bookmarks..."
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  className="w-full bg-[#18181b] border border-neutral-800 text-white text-sm rounded-2xl pl-4 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-neutral-700/50 transition-all shadow-inner"
                />
                <button
                  type="submit"
                  disabled={!chatInput.trim() || isChatTyping}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center hover:bg-indigo-500/30 transition-colors disabled:opacity-50"
                >
                  <svg width="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"></path></svg>
                </button>
              </div>
            </form>
          </div>
        )}

        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className={`w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 transform active:scale-90 ${isChatOpen ? 'bg-neutral-800 text-white rotate-90' : 'bg-[#1a1a2e] border border-indigo-500/30 text-indigo-400 hover:bg-[#252545] hover:scale-105'}`}
        >
          {isChatOpen ? (
            <svg width="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          ) : (
            <svg width="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
          )}
        </button>
      </div>
    </div>
  );
}