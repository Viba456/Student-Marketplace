import React from 'react';
import { motion } from 'framer-motion';
import { Activity, ShieldCheck, Cpu, Globe, Server, Flame } from 'lucide-react';

const stats = [
  {
    icon: Activity,
    value: '99.999%',
    label: 'Uptime Reliability',
    sub: 'Quantum Node SLA',
    color: '#00E5FF',
  },
  {
    icon: Globe,
    value: '4.8M+',
    label: 'Active Cyber Nodes',
    sub: 'Global Relay Grid',
    color: '#7B61FF',
  },
  {
    icon: Cpu,
    value: '< 0.4ms',
    label: 'Execution Latency',
    sub: 'Sub-Millisecond Engine',
    color: '#00F0FF',
  },
  {
    icon: ShieldCheck,
    value: '$12.4B+',
    label: 'Secured Assets',
    sub: 'Zero-Trust Protocol',
    color: '#FF007F',
  },
];

export default function StatsSection() {
  return (
    <section className="relative py-20 overflow-hidden">
      {/* Glow Backdrop */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-6xl h-48 bg-gradient-to-r from-[#00E5FF]/10 via-[#7B61FF]/15 to-[#FF007F]/10 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main Stats Container with Gradient Border */}
        <div className="relative rounded-3xl p-[1px] bg-gradient-to-r from-[#00E5FF]/40 via-[#7B61FF]/40 to-[#FF007F]/40 shadow-[0_0_50px_rgba(0,229,255,0.15)]">
          <div className="bg-[#080B1E]/90 backdrop-blur-2xl rounded-[23px] p-8 sm:p-12">
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 divide-y sm:divide-y-0 sm:divide-x divide-slate-800">
              {stats.map((stat, idx) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className={`flex flex-col items-center text-center ${
                      idx > 0 ? 'pt-8 sm:pt-0 sm:pl-8' : ''
                    }`}
                  >
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 border shadow-lg"
                      style={{
                        backgroundColor: `${stat.color}15`,
                        borderColor: `${stat.color}40`,
                        boxShadow: `0 0 20px ${stat.color}30`,
                      }}
                    >
                      <Icon className="w-6 h-6" style={{ color: stat.color }} />
                    </div>

                    <h3
                      className="text-4xl sm:text-5xl font-extrabold font-heading tracking-tight mb-1"
                      style={{ color: stat.color }}
                    >
                      {stat.value}
                    </h3>
                    <p className="text-base font-bold text-white mb-0.5">
                      {stat.label}
                    </p>
                    <p className="text-xs font-mono text-slate-400">
                      {stat.sub}
                    </p>
                  </motion.div>
                );
              })}
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
