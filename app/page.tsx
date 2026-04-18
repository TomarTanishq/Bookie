'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [demoTab, setDemoTab] = useState('extension');
  const [animStep, setAnimStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimStep((prev) => (prev + 1) % 4);
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#09090b] text-neutral-50 selection:bg-indigo-500/20 font-sans pb-12 overflow-x-hidden">
      {/* Floating Nav */}
      <div className="fixed top-4 md:top-6 left-0 right-0 z-50 flex justify-center px-6 pointer-events-none transition-transform">
        <nav
          className={`bg-neutral-950/70 backdrop-blur-lg border border-neutral-800 rounded-full flex items-center justify-between pointer-events-auto transform transition-all duration-500 ease-[0.16,1,0.3,1] ${scrolled
            ? 'w-full max-w-[340px] px-2 py-2 shadow-2xl shadow-neutral-900/10'
            : 'w-full max-w-4xl px-3 py-3 md:py-4 shadow-xl'
            }`}
        >
          {/* Brand */}
          <div className="flex items-center font-bold tracking-tight text-white pl-2 md:pl-3">
            <div className={`bg-white rounded-md flex items-center justify-center transition-all duration-500 ${scrolled ? 'w-6 h-6 mr-0' : 'w-7 h-7 mr-3'}`}>
              <svg width={scrolled ? "12" : "14"} viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="3"><polyline points="20 12 20 22 12 17 4 22 4 2" /></svg>
            </div>
            <span className={`transition-all duration-500 block ${scrolled ? 'max-w-0 opacity-0 overflow-hidden' : 'max-w-[100px] opacity-100 text-[15px]'}`}>Bookie.</span>
          </div>

          {/* Middle Links */}
          <div className={`hidden md:flex items-center transition-all duration-500 ease-[0.16,1,0.3,1] ${scrolled ? 'max-w-0 opacity-0 overflow-hidden gap-0' : 'max-w-[500px] opacity-100 gap-8'}`}>
            <a href="#demo" className="text-[13px] font-medium text-neutral-400 hover:text-white transition-colors whitespace-nowrap">Demo</a>
            <a href="#how-it-works" className="text-[13px] font-medium text-neutral-400 hover:text-white transition-colors whitespace-nowrap">Features</a>
            <a href="#philosophy" className="text-[13px] font-medium text-neutral-400 hover:text-white transition-colors whitespace-nowrap">Philosophy</a>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <Link href="/login" className={`text-[13px] text-neutral-300 font-medium hover:text-white transition-colors rounded-full hover:bg-neutral-800/80 ${scrolled ? 'px-3 py-1.5' : 'px-4 py-2'}`}>Login</Link>
            <Link href="/signup" className={`text-[13px] bg-white text-black rounded-full font-medium hover:bg-neutral-200 transition-transform active:scale-95 shadow-sm ${scrolled ? 'px-4 py-1.5' : 'px-5 py-2'}`}>Sign up</Link>
          </div>
        </nav>
      </div>

      {/* Hero */}
      <main className="max-w-6xl mx-auto px-6 pt-48 pb-24 flex flex-col md:flex-row items-end justify-between border-b border-neutral-900 border-dashed">
        <div className="max-w-3xl w-full">
          <h1 className="text-6xl sm:text-7xl md:text-[8rem] font-medium tracking-tighter leading-[0.85] text-neutral-50">
            We read <br />
            <span className="text-neutral-700">bookmarks</span> <br />
            <span className="text-neutral-700">for you.</span>
          </h1>
        </div>

        <div className="max-w-[280px] w-full text-left mt-16 md:mt-0 md:pb-6">
          <div className="w-2 h-2 bg-emerald-500/80 rounded-full animate-pulse mb-6 shadow-[0_0_15px_rgba(16,185,129,0.5)]"></div>
          <p className="text-neutral-400 leading-relaxed text-sm mb-10 font-light">
            Bookie strictly forces you to consume what you save. Add our browser extension and wake up Sunday morning to a radically compressed Telegram digest.
          </p>
          <div className="flex flex-col gap-3">
            <Link href="/signup" className="flex items-center justify-center bg-[#1a1a2e] hover:bg-[#252545] text-indigo-100 border border-indigo-500/20 px-6 py-3.5 rounded-lg text-sm font-medium transition-all active:scale-[0.98] shadow-lg shadow-indigo-500/5">
              Connect Telegram
            </Link>
          </div>
        </div>
      </main>

      {/* Interactive Demo Section */}
      <section id="demo" className="max-w-4xl mx-auto px-6 mt-20 mb-10 relative z-10">

        {/* Toggle UI */}
        <div className="flex justify-center mb-8">
          <div className="bg-[#18181b] border border-neutral-800 p-1 rounded-full flex gap-1 shadow-2xl">
            <button
              onClick={() => setDemoTab('extension')}
              className={`px-5 py-2.5 rounded-full text-[13px] font-medium transition-all ${demoTab === 'extension' ? 'bg-[#27272a] text-white shadow-md' : 'text-neutral-400 hover:text-neutral-200'}`}
            >
              Desktop Extension
            </button>
            <button
              onClick={() => setDemoTab('telegram')}
              className={`px-5 py-2.5 rounded-full text-[13px] font-medium transition-all ${demoTab === 'telegram' ? 'bg-[#27272a] text-white shadow-md' : 'text-neutral-400 hover:text-neutral-200'}`}
            >
              Mobile Bot
            </button>
          </div>
        </div>

        {/* Mockup Frame */}
        <div className="w-full h-[400px] sm:h-[450px] bg-[#0c0c0e] border border-neutral-800 rounded-3xl shadow-[0_0_80px_-15px_rgba(0,0,0,0.5)] overflow-hidden relative group">

          {/* Top Window Bar */}
          <div className="h-12 bg-[#121214] border-b border-neutral-800 flex items-center px-4 gap-2 relative">
            <div className="flex gap-1.5 opacity-50 w-16">
              <div className="w-3 h-3 rounded-full bg-neutral-600"></div>
              <div className="w-3 h-3 rounded-full bg-neutral-600"></div>
              <div className="w-3 h-3 rounded-full bg-neutral-600"></div>
            </div>
            <div className="flex-1 flex justify-center">
              <div className="w-64 h-7 bg-[#18181b] rounded-md border border-neutral-800 flex items-center relative shadow-inner transition-colors">
                <span className="flex-1 text-center text-[10px] text-neutral-500 font-mono pr-3">{demoTab === 'extension' ? 'news.ycombinator.com' : 't.me/bookiebot'}</span>
                {demoTab === 'extension' && (
                  <div className={`absolute right-2.5 transition-all duration-200 flex items-center justify-center ${animStep === 2 ? 'scale-75 text-neutral-200' : animStep === 3 ? 'text-white' : 'text-neutral-500'}`}>
                    <svg width="12" viewBox="0 0 24 24" fill={animStep >= 2 ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
                  </div>
                )}
              </div>
            </div>
            <div className={`flex gap-3 items-center w-16 justify-end transition-opacity ${demoTab === 'extension' ? 'opacity-100' : 'opacity-0'}`}>
              <div className="w-4 h-4 rounded-full bg-neutral-800"></div>
              <div className="w-4 h-4 rounded-full bg-neutral-800"></div>
            </div>
          </div>

          {/* Tab Content Canvas */}
          <div className="relative w-full h-[calc(100%-3rem)] flex items-center justify-center">

            {/* Extension Vector Demo */}
            <div className={`absolute inset-0 transition-all duration-700 ease-[0.16,1,0.3,1] flex flex-col items-center justify-center ${demoTab === 'extension' ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto' : 'opacity-0 translate-y-8 scale-95 pointer-events-none'}`}>
              <div className="relative">
                {/* Abstract Article Background */}
                <div className="w-[300px] h-[300px] border border-neutral-800 bg-[#0f0f11] rounded-xl p-8 opacity-40 blur-[1px]">
                  <div className="w-24 h-6 bg-neutral-800 mb-6 rounded-md"></div>
                  <div className="w-full h-3 bg-neutral-800 mb-3 rounded-md"></div>
                  <div className="w-4/5 h-3 bg-neutral-800 mb-3 rounded-md"></div>
                  <div className="w-5/6 h-3 bg-neutral-800 mb-3 rounded-md"></div>
                  <div className="w-1/2 h-3 bg-neutral-800 mb-10 rounded-md"></div>

                  <div className="w-full h-3 bg-neutral-800 mb-3 rounded-md"></div>
                  <div className="w-5/6 h-3 bg-neutral-800 rounded-md"></div>
                </div>

                {/* Popover Ext */}
                <div className={`absolute top-[-44px] right-[10px] w-64 bg-[#18181b] border border-neutral-700 shadow-2xl rounded-xl p-5 z-10 transition-all duration-500 ease-out before:absolute before:border-[8px] before:border-transparent before:border-b-neutral-700 before:-top-[16px] before:right-[20px] ${animStep === 3 ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto' : 'opacity-0 -translate-y-4 scale-95 pointer-events-none'}`}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-7 h-7 bg-white rounded flex items-center justify-center shrink-0">
                      <span className="text-black font-extrabold text-[10px] tracking-tighter">B.</span>
                    </div>
                    <div>
                      <h4 className="text-white text-xs font-medium leading-tight">Bookie Grab</h4>
                      <p className="text-neutral-400 text-[10px] text-emerald-400 mt-0.5">DOM Connected</p>
                    </div>
                  </div>
                  <h5 className="text-white text-[11px] font-medium mb-1 truncate leading-relaxed">Ask HN: Best stack for 2026?</h5>
                  <p className="text-neutral-500 text-[9.5px] mb-4 truncate font-mono bg-neutral-900 px-2 py-1 rounded inline-block">news.ycombinator.com</p>
                  <div className="w-full bg-[#1a1a2e] text-indigo-100 border border-indigo-500/20 text-[11px] font-medium py-2 rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/5">
                    <svg width="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
                    Saved to Telegram
                  </div>
                </div>

                {/* Mock Cursor */}
                <div className="absolute top-0 right-0 z-20 transition-all duration-700 pointer-events-none" style={{
                  transform:
                    animStep === 1 ? 'translate(-20px, -55px)' :
                      animStep === 2 ? 'translate(-20px, -55px)' :
                        animStep === 3 ? 'translate(-20px, -55px)' :
                          'translate(30px, 80px)',
                  transitionTimingFunction: animStep === 1 ? 'cubic-bezier(0.16, 1, 0.3, 1)' : 'linear'
                }}>
                  <svg viewBox="0 0 24 24" fill="white" stroke="black" strokeWidth="2" strokeLinejoin="round" width="22" height="22" className={`transition-transform duration-200 ${animStep === 2 ? 'scale-75' : 'scale-100'} origin-[3px_3px]`}>
                    <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z" />
                  </svg>
                </div>
              </div>
              <p className="mt-8 text-neutral-400 text-[13px] font-medium">Bypasses JS blockers by parsing the raw DOM locally.</p>
            </div>

            {/* Telegram Mobile Demo */}
            <div className={`absolute inset-0 transition-all duration-700 ease-[0.16,1,0.3,1] flex flex-col items-center justify-center ${demoTab === 'telegram' ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto' : 'opacity-0 translate-y-8 scale-95 pointer-events-none'}`}>
              <div className="relative">
                {/* Phone Bezel */}
                <div className="w-[240px] h-[340px] border-[6px] border-neutral-900 bg-black rounded-[2rem] p-3 shadow-2xl relative overflow-hidden pointer-events-none">
                  {/* Dynamic Notch */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-4 bg-neutral-900 rounded-b-xl z-20"></div>

                  <div className="mt-4 flex items-center gap-3 border-b border-neutral-900 pb-2 mb-3 px-1">
                    <div className="w-7 h-7 rounded-full bg-neutral-800 flex items-center justify-center text-[10px] text-white font-bold tracking-tight">B.</div>
                    <div>
                      <div className="text-neutral-200 text-xs font-medium">Bookie Bot</div>
                      <div className="text-emerald-500/80 text-[9px]">online</div>
                    </div>
                  </div>

                  <div className="space-y-4 px-1 mt-6">
                    {/* Old Message */}
                    <div className="flex justify-start opacity-20 transition-opacity">
                      <div className="bg-[#18181b] border border-neutral-800 text-neutral-300 text-[9px] px-2 py-1 rounded-xl rounded-tl-sm w-fit">
                        Digest delivered for Mar 24.
                      </div>
                    </div>

                    {/* Step 1: User Sends Link */}
                    <div className={`flex justify-end transition-all duration-500 ${animStep >= 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                      <div className="bg-[#2b5278] text-white text-[10px] px-3 py-2 rounded-2xl rounded-tr-sm font-mono break-all max-w-[85%] shadow-lg">
                        https://twitter.com/nextjs/status/123
                      </div>
                    </div>

                    {/* Step 2 & 3: Bot Responds */}
                    <div className={`flex justify-start transition-all duration-500 delay-300 ${animStep >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                      <div className={`text-neutral-300 text-[10px] px-3 py-2 rounded-2xl rounded-tl-sm w-fit transition-colors duration-300 ${animStep === 3 ? 'bg-emerald-600/20 border border-emerald-500/50' : 'bg-[#18181b] border border-neutral-800'}`}>
                        {animStep === 2 ? (
                          <div className="flex items-center gap-1.5">
                            <div className="w-1 h-1 bg-neutral-400 rounded-full animate-bounce"></div>
                            <div className="w-1 h-1 bg-neutral-400 rounded-full animate-bounce delay-75"></div>
                            <div className="w-1 h-1 bg-neutral-400 rounded-full animate-bounce delay-150"></div>
                            <span className="text-[9px] ml-1">Saving...</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5">
                            <svg width="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-emerald-500"><polyline points="20 6 9 17 4 12"></polyline></svg>
                            <span>Saved to digest ✅</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="absolute bottom-2 left-2 right-2 h-8 bg-[#18181b] rounded-full flex items-center px-3">
                    <span className="text-neutral-500 text-[9px]">Message...</span>
                    <div className="ml-auto w-4 h-4 rounded-full bg-[#1a1a2e] border border-indigo-500/30 flex items-center justify-center">
                      <svg width="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="text-indigo-300"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"></path></svg>
                    </div>
                  </div>
                </div>
              </div>
              <p className="mt-8 text-neutral-400 text-[13px] font-medium">Forward literally anything from the iOS/Android share sheet.</p>
            </div>

          </div>
        </div>
      </section>

      {/* Mock UI Elements - Bento Box Grid */}
      <section className="max-w-6xl mx-auto px-6 mt-32">
        <div id="how-it-works" className="grid md:grid-cols-2 gap-6 items-stretch text-left">

          {/* Telegram Digest Mockup - Top Banner */}
          <div className="rounded-[24px] bg-[#0f0f11] border border-neutral-800 shadow-2xl flex flex-col md:flex-row gap-8 lg:gap-16 items-center p-8 md:p-12 md:col-span-2 overflow-hidden group hover:border-neutral-700 transition-colors">
            <div className="flex-1 w-full order-2 md:order-1">
              <div className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold mb-6">Sunday Delivery</div>
              <h3 className="text-3xl font-medium tracking-tighter text-white mb-4">Read without thinking.</h3>
              <p className="text-neutral-400 text-sm leading-relaxed max-w-sm">
                Every Sunday at 9:00 AM, Bookie compiles your links, compresses thousands of words of noise into vital signal using a 120B parameter LLM, and drops a single beautiful message straight into your Telegram app.
              </p>
            </div>

            <div className="flex-1 w-full space-y-4 order-1 md:order-2">
              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex-shrink-0 flex items-center justify-center overflow-hidden shadow-lg">
                  <svg width="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-indigo-400"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                </div>
                <div className="bg-neutral-800/60 p-5 rounded-2xl rounded-tl-[4px] border border-neutral-700 w-full backdrop-blur-sm shadow-xl group-hover:scale-[1.02] transition-transform">
                  <div className="text-xs text-neutral-400 font-medium mb-4 flex justify-between">
                    <span>Bookie Bot</span>
                    <span className="text-neutral-600">Sun 9:00 AM</span>
                  </div>
                  <div className="text-[13px] leading-relaxed text-neutral-300 space-y-5">
                    <p className="border-l-[3px] border-indigo-500/30 pl-4 py-0.5">
                      <span className="text-indigo-400 font-medium block mb-1">React 19 Release Notes:</span>
                      The core team finalized the new compiler. You no longer need to write useMemo or useCallback hooks manually.
                    </p>
                    <p className="border-l-[3px] border-indigo-500/30 pl-4 py-0.5">
                      <span className="text-indigo-400 font-medium block mb-1">Why I left Big Tech:</span>
                      An engineer got bored of tracking unread bookmarks. He decided to build a browser extension instead.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Extension Mockup - Bottom Left */}
          <div className="rounded-[24px] bg-[#0f0f11] border border-neutral-800 shadow-2xl flex flex-col justify-between p-8 md:p-10 min-h-[420px] overflow-hidden group hover:border-neutral-700 transition-colors">
            <div>
              <div className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold mb-6">Browser Extension</div>
              <h3 className="text-2xl font-medium tracking-tighter text-white mb-3">Save with zero friction.</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">
                Install the extension and click the icon to save. Bypasses JS blockers and reads raw DOM text natively.
              </p>
            </div>

            <div className="mt-10 w-full relative group-hover:-translate-y-2 transition-transform">
              <div className="max-w-sm mx-auto">
                <div className="w-full h-10 bg-[#18181b] rounded-md border border-neutral-800 flex items-center px-4 gap-3 text-neutral-400 text-sm font-mono mb-4 shadow-inner">
                  <svg width="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /></svg>
                  github.com/react/core
                </div>
                <div className="w-full bg-[#1a1a2e] text-indigo-100 border border-indigo-500/20 rounded-md py-3.5 text-sm font-medium text-center shadow-lg shadow-indigo-500/10">
                  Save Bookmark to Bookie
                </div>
              </div>
            </div>
          </div>

          {/* Telegram Ingestion Mockup - Bottom Right */}
          <div className="rounded-[24px] bg-[#0f0f11] border border-neutral-800 shadow-2xl flex flex-col justify-between p-8 md:p-10 min-h-[420px] overflow-hidden group hover:border-neutral-700 transition-colors">
            <div>
              <div className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold mb-6">Forward to Bot</div>
              <h3 className="text-2xl font-medium tracking-tighter text-white mb-3">Share from Mobile.</h3>
              <p className="text-neutral-400 text-sm leading-relaxed">
                Reading on your phone during a commute? Just forward any link to your private Bookie Telegram Bot and it's instantly securely synced.
              </p>
            </div>

            <div className="mt-10 w-full group-hover:-translate-y-2 transition-transform">
              <div className="max-w-sm mx-auto">
                <div className="flex gap-3 justify-end">
                  <div className="bg-neutral-800 text-white px-3 py-2.5 rounded-2xl rounded-tr-[4px] text-sm shadow-md max-w-[85%] truncate font-mono border border-neutral-700">
                    https://ycombinator.com
                  </div>
                </div>
                <div className="flex gap-3 mt-3">
                  <div className="w-7 h-7 rounded-full bg-neutral-800 flex-shrink-0 flex items-center justify-center mt-0.5 shadow-inner">
                    <span className="text-[10px] text-neutral-500 font-bold">B.</span>
                  </div>
                  <div className="bg-[#18181b] border border-neutral-800 text-neutral-300 px-4 py-2.5 rounded-2xl rounded-tl-[4px] text-sm shadow-sm inline-block">
                    Saved ✅
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Redesigned FAQ / Why Bookie Section */}
      <section id="philosophy" className="max-w-6xl mx-auto px-6 mt-48 mb-32 grid md:grid-cols-12 gap-16 lg:gap-24">

        {/* Sticky Left Column */}
        <div className="md:col-span-5 md:sticky top-32 self-start">
          <h2 className="text-5xl md:text-6xl font-medium tracking-tighter text-neutral-50 mb-6 leading-[1.1]">
            Read-it-later <br /> is dead.
          </h2>
          <p className="text-neutral-400 text-lg leading-relaxed mb-8 font-light">
            Traditional bookmark apps are just link graveyards where your best intentions go to die. We built Bookie to completely flip this broken model upside down.
          </p>
          <div className="w-full h-[1px] bg-neutral-900 mt-8 mb-8 hidden md:block"></div>
          <div className="hidden md:flex gap-4 items-center opacity-80">
            <div className="w-10 h-10 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center">
              <svg width="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 20V10M18 20V4M6 20v-4" /></svg>
            </div>
            <span className="text-sm font-medium text-neutral-400">100% Signal, 0% Noise</span>
          </div>
        </div>

        {/* Right Column - The Points */}
        <div className="md:col-span-7 space-y-16">
          <div className="relative pl-8 md:pl-16">
            <div className="absolute left-0 top-0 text-3xl font-medium tracking-tighter text-neutral-800">01</div>
            <h3 className="text-2xl font-medium text-neutral-100 mb-4 tracking-tight">Active Push vs Passive Pull</h3>
            <p className="text-neutral-400 leading-relaxed font-light text-[15px]">
              In Pocket or Raindrop, you save an article and realistically never open the app again. Bookie actively pushes knowledge back to you using a platform you already check every single day (Telegram). It forces consumption.
            </p>
          </div>

          <div className="relative pl-8 md:pl-16 border-t border-neutral-900 pt-16">
            <div className="absolute left-0 top-16 text-3xl font-medium tracking-tighter text-neutral-800">02</div>
            <h3 className="text-2xl font-medium text-neutral-100 mb-4 tracking-tight">Constraints Breed Consumption</h3>
            <p className="text-neutral-400 leading-relaxed font-light text-[15px]">
              Why exactly two sentences? Because if we sent you 5 paragraphs per bookmark, you'd swipe the notification away. 2 sentences is the maximum psychological threshold of completely frictionless reading. We ruthlessly compress the noise.
            </p>
          </div>

          <div className="relative pl-8 md:pl-16 border-t border-neutral-900 pt-16">
            <div className="absolute left-0 top-16 text-3xl font-medium tracking-tighter text-neutral-800">03</div>
            <h3 className="text-2xl font-medium text-neutral-100 mb-4 tracking-tight">Zero Dead Ends</h3>
            <p className="text-neutral-400 leading-relaxed font-light text-[15px]">
              Most backend scrapers fail entirely on modern dynamic sites. Bookie's browser extension reads the raw DOM natively from your active tab before sending it to the cloud. If you can see it on your screen, Bookie can summarize it.
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="mt-40 border-t border-neutral-900 bg-[#0f0f11] py-32 px-6 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-indigo-500/5 blur-[120px] rounded-full"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="w-16 h-16 bg-[#1a1a2e] rounded-2xl border border-indigo-500/20 flex items-center justify-center mx-auto mb-10 shadow-2xl">
            <svg width="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-indigo-300" strokeWidth="2.5"><polyline points="20 12 20 22 12 17 4 22 4 2" /></svg>
          </div>
          <h2 className="text-5xl md:text-[5.5rem] font-medium tracking-tighter text-neutral-50 mb-8 leading-[0.9]">
            Stop hoarding.<br />Start digesting.
          </h2>
          <Link href="/signup" className="inline-flex items-center gap-3 px-8 py-4 bg-[#1a1a2e] text-indigo-100 border border-indigo-500/20 rounded-full font-medium hover:bg-[#252545] transition-all active:scale-[0.98] shadow-[0_0_40px_-15px_rgba(99,102,241,0.2)] mt-8">
            Connect your Telegram
            <svg width="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </Link>
        </div>
      </section>

    </div>
  );
}
