import React from 'react';
import { motion } from 'framer-motion';
import { Play, Sparkles, ShieldCheck, Zap, Activity, Radio, Cpu, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HeroSection() {
  return (
    <section id="overview" className="relative min-h-screen pt-32 pb-20 flex items-center justify-center overflow-hidden">
      {/* Background glow spotlights */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-[#00E5FF]/20 via-[#7B61FF]/20 to-[#FF007F]/10 blur-[150px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Text Column */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7 space-y-8 text-center lg:text-left"
          >
            {/* Cyber Pill Tag */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0D1226]/80 border border-[#00E5FF]/30 backdrop-blur-md shadow-[0_0_20px_rgba(0,229,255,0.2)]">
              <Sparkles className="w-4 h-4 text-[#00E5FF] animate-pulse" />
              <span className="text-xs font-mono font-semibold tracking-wider text-[#00E5FF] uppercase">
                QUANTUM ENGINE 2035 // ONLINE
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#00E5FF] animate-ping" />
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.08] text-white font-heading">
              THE ARCHITECTURE OF <br />
              <span className="gradient-text-cyan drop-shadow-[0_0_35px_rgba(0,229,255,0.4)]">
                NEXT-GEN AI
              </span>{" "}
              INTELLIGENCE
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
              Orchestrate autonomous quantum neural agents with microsecond precision. Experience zero-latency data intelligence in a glassmorphism spatial matrix.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                to="/register"
                className="w-full sm:w-auto relative group overflow-hidden rounded-2xl p-0.5 font-mono font-bold text-sm tracking-wider uppercase shadow-[0_0_30px_rgba(0,229,255,0.4)] hover:shadow-[0_0_45px_rgba(0,229,255,0.8)] transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#00E5FF] via-[#7B61FF] to-[#FF007F] animate-gradient-x" />
                <div className="relative px-8 py-4 bg-[#050714] rounded-[14px] group-hover:bg-opacity-0 transition-all duration-300 flex items-center justify-center gap-3 text-white">
                  <Zap className="w-5 h-5 text-[#00E5FF] group-hover:text-white" />
                  <span>Deploy Neural Core</span>
                </div>
              </Link>

              <a
                href="#features"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl glass-card border border-[#00E5FF]/30 hover:border-[#00E5FF] text-white font-mono font-semibold text-sm tracking-wider uppercase flex items-center justify-center gap-3 transition-all duration-300 shadow-[0_0_15px_rgba(0,0,0,0.4)] hover:shadow-[0_0_25px_rgba(123,97,255,0.3)]"
              >
                <Play className="w-4 h-4 text-[#7B61FF] fill-[#7B61FF]" />
                <span>Explore Cyber Hub</span>
              </a>
            </div>

            {/* Metric Micro-stats */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-slate-800/80 max-w-lg mx-auto lg:mx-0">
              <div>
                <p className="text-2xl font-bold font-heading text-white">0.18 ms</p>
                <p className="text-xs font-mono text-slate-400">Quantum Latency</p>
              </div>
              <div>
                <p className="text-2xl font-bold font-heading text-white">100%</p>
                <p className="text-xs font-mono text-slate-400">Biometric Shield</p>
              </div>
              <div>
                <p className="text-2xl font-bold font-heading text-[#00E5FF]">1.24 Pflops</p>
                <p className="text-xs font-mono text-slate-400">Compute Mesh</p>
              </div>
            </div>

          </motion.div>

          {/* Right Hologram 3D Core Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="lg:col-span-5 relative flex items-center justify-center"
          >
            {/* Outer Hologram Orbit Rings */}
            <div className="relative w-[320px] h-[320px] sm:w-[420px] sm:h-[420px] flex items-center justify-center">
              
              {/* Outer Pulsing Glow Circle */}
              <div className="absolute inset-0 rounded-full border border-[#00E5FF]/30 animate-pulse-glow" />

              {/* Spinning Cyber HUD Outer Ring */}
              <div className="absolute inset-2 rounded-full border-2 border-dashed border-[#7B61FF]/40 animate-holo-spin" />

              {/* Inner Reverse Ring */}
              <div className="absolute inset-8 rounded-full border border-dotted border-[#00E5FF]/50 animate-holo-reverse" />

              {/* Central Glowing Core Sphere */}
              <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-full bg-gradient-to-br from-[#00E5FF] via-[#7B61FF] to-[#FF007F] p-1 shadow-[0_0_70px_rgba(0,229,255,0.6)] animate-float">
                <div className="w-full h-full bg-[#080B1E] rounded-full flex flex-col items-center justify-center p-6 text-center backdrop-blur-xl border border-[#00E5FF]/40 relative overflow-hidden">
                  <div className="absolute inset-0 scanline opacity-40 pointer-events-none" />
                  <Cpu className="w-12 h-12 text-[#00E5FF] animate-pulse mb-2" />
                  <span className="font-mono font-bold text-xs text-slate-200 tracking-widest uppercase">
                    VIBA CORE
                  </span>
                  <span className="text-[10px] font-mono text-[#00E5FF] mt-1">
                    NEURAL PROTOCOL 01
                  </span>
                </div>
              </div>

              {/* Floating HUD Cards */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -top-4 -left-4 sm:top-2 sm:-left-6 px-4 py-2.5 rounded-2xl glass-card backdrop-blur-xl border border-[#00E5FF]/40 shadow-[0_0_20px_rgba(0,229,255,0.3)] flex items-center gap-3 z-20"
              >
                <div className="w-8 h-8 rounded-xl bg-[#00E5FF]/20 flex items-center justify-center border border-[#00E5FF]/40">
                  <Activity className="w-4 h-4 text-[#00E5FF]" />
                </div>
                <div>
                  <p className="text-xs font-mono font-bold text-white">NEURAL SYNC</p>
                  <p className="text-[10px] font-mono text-[#00E5FF]">99.98% OPTIMAL</p>
                </div>
              </motion.div>

              <motion.div 
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                className="absolute -bottom-4 -right-4 sm:bottom-2 sm:-right-6 px-4 py-2.5 rounded-2xl glass-card backdrop-blur-xl border border-[#7B61FF]/40 shadow-[0_0_20px_rgba(123,97,255,0.3)] flex items-center gap-3 z-20"
              >
                <div className="w-8 h-8 rounded-xl bg-[#7B61FF]/20 flex items-center justify-center border border-[#7B61FF]/40">
                  <ShieldCheck className="w-4 h-4 text-[#7B61FF]" />
                </div>
                <div>
                  <p className="text-xs font-mono font-bold text-white">CYBER SHIELD</p>
                  <p className="text-[10px] font-mono text-[#7B61FF]">ACTIVE // SECURE</p>
                </div>
              </motion.div>

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
