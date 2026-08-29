import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Cpu, Shield, Zap, Eye, Lock, BarChart3, Radio, ChevronRight } from 'lucide-react';

const features = [
  {
    icon: Cpu,
    title: 'Quantum Neural Engine',
    desc: 'Autonomous multi-agent execution powered by next-gen sub-millisecond transformer nodes.',
    tag: 'CORE MATRIX',
    color: '#00E5FF',
    gradient: 'from-[#00E5FF]/20 to-transparent',
  },
  {
    icon: Shield,
    title: 'Autonomous Cyber Shield',
    desc: 'Zero-trust biometric quantum encryption defending workloads against synthetic threats.',
    tag: 'SECURE CORE',
    color: '#7B61FF',
    gradient: 'from-[#7B61FF]/20 to-transparent',
  },
  {
    icon: Zap,
    title: 'Zero-Latency Data Mesh',
    desc: 'Instant global state synchronization using spatial edge routing across 500+ cyber relays.',
    tag: 'ULTRA SPEED',
    color: '#00F0FF',
    gradient: 'from-[#00F0FF]/20 to-transparent',
  },
  {
    icon: Eye,
    title: 'Holo-Interface Matrix',
    desc: 'Immersive spatial 3D visualization dashboard engineered for spatial headsets and web HUDs.',
    tag: 'SPATIAL UI',
    color: '#FF007F',
    gradient: 'from-[#FF007F]/20 to-transparent',
  },
  {
    icon: Lock,
    title: 'Biometric Identity Core',
    desc: 'Decentralized cryptographic auth tokens backed by immutable neural hashes.',
    tag: 'AUTH MATRIX',
    color: '#00E5FF',
    gradient: 'from-[#00E5FF]/20 to-transparent',
  },
  {
    icon: BarChart3,
    title: 'Predictive AI Analytics',
    desc: 'Real-time telemetry forecasting system performance up to 72 hours into the future.',
    tag: 'FORECASTING',
    color: '#7B61FF',
    gradient: 'from-[#7B61FF]/20 to-transparent',
  },
];

export default function FeaturesSection() {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  return (
    <section id="features" className="relative py-28 overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-[#00E5FF]/10 blur-[160px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#7B61FF]/10 blur-[160px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0D1226]/80 border border-[#00E5FF]/30 backdrop-blur-md mb-4">
            <Radio className="w-4 h-4 text-[#00E5FF] animate-pulse" />
            <span className="text-xs font-mono font-bold tracking-widest text-[#00E5FF] uppercase">
              NEURAL CAPABILITIES
            </span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white font-heading tracking-tight leading-tight">
            ENGINEERED FOR THE <br />
            <span className="gradient-text-purple">QUANTUM AGE</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300">
            Discover the six foundational neural modules built into VIBA 2035 for enterprise-grade autonomous intelligence.
          </p>
        </div>

        {/* 6 Feature Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((item, idx) => {
            const Icon = item.icon;
            const isHovered = hoveredIdx === idx;

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                className="relative group glass-card p-8 rounded-3xl overflow-hidden cursor-pointer transform hover:-translate-y-2 transition-all duration-300"
              >
                {/* Glow Overlay on hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-b ${item.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
                />

                {/* Cyber Card Corner Accents */}
                <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-[#00E5FF]/20 group-hover:border-[#00E5FF] rounded-tr-3xl transition-colors duration-300" />
                <div className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 border-[#7B61FF]/20 group-hover:border-[#7B61FF] rounded-bl-3xl transition-colors duration-300" />

                {/* Top Badge */}
                <div className="flex items-center justify-between mb-6">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center border transition-all duration-300"
                    style={{
                      backgroundColor: `${item.color}15`,
                      borderColor: isHovered ? item.color : `${item.color}40`,
                      boxShadow: isHovered ? `0 0 25px ${item.color}50` : 'none',
                    }}
                  >
                    <Icon
                      className="w-7 h-7 transition-transform duration-300 group-hover:scale-110"
                      style={{ color: item.color }}
                    />
                  </div>
                  <span className="text-[10px] font-mono font-bold tracking-widest px-3 py-1 rounded-full bg-[#050714] text-slate-300 border border-slate-700 uppercase">
                    {item.tag}
                  </span>
                </div>

                {/* Title & Description */}
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#00E5FF] transition-colors duration-300">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed mb-6 font-normal">
                  {item.desc}
                </p>

                {/* Card Action Link */}
                <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#00E5FF] group-hover:translate-x-1 transition-transform duration-300">
                  <span>SYSTEM METRICS</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
