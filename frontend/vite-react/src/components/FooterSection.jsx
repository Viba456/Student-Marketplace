import React from 'react';
import { GraduationCap, ShieldCheck, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function FooterSection() {
  return (
    <footer className="bg-white border-t border-slate-200 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid md:grid-cols-12 gap-8 pb-12 border-b border-slate-200">
          
          {/* Brand */}
          <div className="md:col-span-5 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-violet-600 flex items-center justify-center text-white">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="font-bold text-xl text-slate-900">
                VIBA <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-200 font-semibold">Campus</span>
              </span>
            </Link>
            <p className="text-xs text-slate-600 max-w-sm leading-relaxed">
              The trusted peer-to-peer student marketplace. Earn money by offering your skills and find affordable campus talent for tutoring, design, coding, and writing.
            </p>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-4 grid grid-cols-2 gap-4 text-xs">
            <div>
              <h4 className="font-bold text-slate-900 uppercase tracking-wider mb-3">MARKETPLACE</h4>
              <ul className="space-y-2 text-slate-600">
                <li><a href="#marketplace" className="hover:text-blue-600 transition-colors">Browse Skills</a></li>
                <li><a href="#categories" className="hover:text-blue-600 transition-colors">Skill Categories</a></li>
                <li><a href="#how-it-works" className="hover:text-blue-600 transition-colors">How It Works</a></li>
                <li><a href="#testimonials" className="hover:text-blue-600 transition-colors">Student Reviews</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 uppercase tracking-wider mb-3">CAMPUS ACCOUNT</h4>
              <ul className="space-y-2 text-slate-600">
                <li><Link to="/login" className="hover:text-blue-600 transition-colors">Student Sign In</Link></li>
                <li><Link to="/register" className="hover:text-blue-600 transition-colors">Join Marketplace</Link></li>
                <li><Link to="/profile" className="hover:text-blue-600 transition-colors">Student Dashboard</Link></li>
                <li><Link to="/verify" className="hover:text-blue-600 transition-colors">Verify Email</Link></li>
              </ul>
            </div>
          </div>

          {/* Trust Banner */}
          <div className="md:col-span-3 space-y-3 p-4 rounded-xl bg-slate-50 border border-slate-200 shadow-2xs">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-700">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Campus Identity Verified</span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              All students are verified with official university email domains to ensure a trusted campus environment.
            </p>
          </div>

        </div>

        {/* Bottom */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 VIBA Student Skill Marketplace. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Built with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
            <span>for student success on campus.</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
