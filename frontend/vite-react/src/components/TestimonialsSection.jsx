import React from 'react';
import { Star, ShieldCheck, MessageSquareCode } from 'lucide-react';

const testimonials = [
  {
    name: 'Dr. Evelyn Vance',
    role: 'Chief AI Architect @ CyberDyne',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    content: 'VIBA 2035 reduced our multi-agent model latency from 45ms to under 0.2ms. The glassmorphism HUD telemetries are completely mind-blowing.',
    hash: '0x8F...A12B',
    rating: 5,
  },
  {
    name: 'Kaelen Thorne',
    role: 'VP of Spatial Systems @ Vercel AI',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    content: 'Operating our global quantum relay nodes on VIBA has given us 100% uptime with zero biometric breaches over the past two years.',
    hash: '0x3C...99DF',
    rating: 5,
  },
  {
    name: 'Aria Sterling',
    role: 'Head of Robotics @ Neuralink Labs',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    content: 'The autonomous protocol matrix is seamless. Our spatial vision headsets synched instantly with VIBA’s zero-trust biometric identity layer.',
    hash: '0x71...440C',
    rating: 5,
  },
  {
    name: 'Marcus Chen',
    role: 'Director of Security @ Apex Cyber',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    content: 'The predictive AI analytics detected an edge breach 48 hours before it materialized. This platform feels like technology straight from 2035.',
    hash: '0x9E...66FB',
    rating: 5,
  },
];

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="relative py-28 overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-r from-[#00E5FF]/10 via-[#7B61FF]/15 to-[#FF007F]/10 blur-[160px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mb-16 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0D1226]/80 border border-[#00E5FF]/30 backdrop-blur-md mb-4">
          <MessageSquareCode className="w-4 h-4 text-[#00E5FF] animate-pulse" />
          <span className="text-xs font-mono font-bold tracking-widest text-[#00E5FF] uppercase">
            NEURAL TELEMETRIES & REVIEWS
          </span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-white font-heading tracking-tight leading-tight">
          TRUSTED BY <span className="gradient-text-purple">NEURAL PIONEERS</span>
        </h2>
        <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto">
          See what leading architects, roboticists, and spatial engineers are building with VIBA.
        </p>
      </div>

      {/* Auto-Scroll Marquee */}
      <div className="relative w-full overflow-hidden py-4">
        {/* Gradient Fades on edges */}
        <div className="absolute top-0 bottom-0 left-0 w-24 bg-gradient-to-r from-[#050714] to-transparent z-20 pointer-events-none" />
        <div className="absolute top-0 bottom-0 right-0 w-24 bg-gradient-to-l from-[#050714] to-transparent z-20 pointer-events-none" />

        <div className="animate-marquee flex gap-8">
          {[...testimonials, ...testimonials].map((item, idx) => (
            <div
              key={idx}
              className="w-[380px] sm:w-[420px] glass-card p-8 rounded-3xl shrink-0 flex flex-col justify-between hover:border-[#00E5FF] transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
            >
              <div>
                {/* Rating & Verified Hash */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-1">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-[#00E5FF] fill-[#00E5FF]" />
                    ))}
                  </div>
                  <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#050714] border border-[#00E5FF]/20 text-[10px] font-mono text-[#00E5FF]">
                    <ShieldCheck className="w-3 h-3 text-[#00E5FF]" />
                    <span>{item.hash}</span>
                  </div>
                </div>

                <p className="text-sm text-slate-200 leading-relaxed font-normal italic mb-6">
                  "{item.content}"
                </p>
              </div>

              {/* User Profile */}
              <div className="flex items-center gap-4 pt-4 border-t border-slate-800/80">
                <img
                  src={item.avatar}
                  alt={item.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-[#00E5FF]/40 shadow-[0_0_15px_rgba(0,229,255,0.4)]"
                />
                <div>
                  <h4 className="text-sm font-bold text-white">{item.name}</h4>
                  <p className="text-xs font-mono text-slate-400">{item.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
