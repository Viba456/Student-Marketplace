import React from 'react';
import { Search, Sparkles, ShieldCheck, Star, Users, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function StudentHero({ searchQuery, setSearchQuery, selectedCategory, setSelectedCategory }) {
  const popularTags = [
    'Python Tutoring',
    'Figma UI Design',
    'Calculus Help',
    'Video Editing',
    'Essay Proofreading',
    'React Web Apps',
  ];

  return (
    <section className="relative pt-12 pb-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        
        {/* Campus Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-6">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>The Official Peer-to-Peer Campus Marketplace</span>
          <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
        </div>

        {/* Main Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight max-w-4xl mx-auto">
          Monetize Your Skills, <br />
          <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
            Hire Campus Talent
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
          Connect with verified students on campus for affordable tutoring, graphic design, coding help, editing, and creative services.
        </p>

        {/* Interactive Search Bar */}
        <div className="mt-8 max-w-2xl mx-auto">
          <div className="relative flex items-center">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search skills, tutors, or services (e.g. Python tutoring, Figma design...)"
              className="w-full pl-12 pr-32 py-4 rounded-2xl bg-white border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 shadow-md transition-all"
            />
            <button
              onClick={() => {
                const el = document.getElementById('marketplace');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="absolute right-2.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-white font-semibold text-xs shadow-md shadow-blue-500/20 hover:opacity-95 transition-all"
            >
              Explore Skills
            </button>
          </div>

          {/* Quick Filter Tags */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500">
            <span className="font-medium text-slate-700">Popular:</span>
            {popularTags.map((tag) => (
              <button
                key={tag}
                onClick={() => {
                  setSearchQuery(tag);
                  const el = document.getElementById('marketplace');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition-colors shadow-2xs"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Campus Stats Banner */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-8 border-t border-slate-200">
          <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <p className="text-2xl font-bold text-slate-900">1,250+</p>
            <p className="text-xs text-slate-500">Verified Campus Students</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <p className="text-2xl font-bold text-blue-600">4.9 / 5.0</p>
            <p className="text-xs text-slate-500">Average Service Rating</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <p className="text-2xl font-bold text-indigo-600">$15 / hr</p>
            <p className="text-xs text-slate-500">Affordable Student Rate</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <p className="text-2xl font-bold text-emerald-600">100%</p>
            <p className="text-xs text-slate-500">Campus Identity Verified</p>
          </div>
        </div>

      </div>
    </section>
  );
}
