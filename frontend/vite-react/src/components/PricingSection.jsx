import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Zap, Sparkles, Cpu, Crown, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const plans = [
  {
    name: 'Initiate Core',
    desc: 'Ideal for independent developers exploring spatial neural execution.',
    monthlyPrice: 49,
    annualPrice: 39,
    tag: 'STARTER MATRIX',
    popular: false,
    color: '#00E5FF',
    features: [
      '10 Million Neural Token Executions',
      'Up to 8 Autonomous Sub-Agents',
      'Community Quantum Relay Network',
      'Standard 24/7 Security Shield',
      'Spatial Dashboard Web Viewer',
    ],
  },
  {
    name: 'Cyber Core',
    desc: 'Engineered for high-growth tech startups and AI product teams.',
    monthlyPrice: 199,
    annualPrice: 159,
    tag: 'MOST POPULAR',
    popular: true,
    color: '#7B61FF',
    features: [
      'Unlimited Neural Token Executions',
      'Up to 128 Autonomous Sub-Agents',
      'Dedicated Zero-Latency Edge Grid',
      'Sub-Millisecond Quantum Engine (<0.2ms)',
      'Spatial Headset HUD Integration (Vision OS)',
      'Automated Predictive Threat Shielding',
      'Priority 24/7 Quantum Support Relay',
    ],
  },
  {
    name: 'Quantum Enterprise',
    desc: 'Full-scale custom quantum cluster for sovereign AI infrastructure.',
    monthlyPrice: 899,
    annualPrice: 719,
    tag: 'SOVEREIGN CLUSTER',
    popular: false,
    color: '#FF007F',
    features: [
      'Custom Dedicated Quantum Clusters',
      'Unlimited Sub-Agent Orchestration',
      'Isolated Air-Gapped Biometric Mesh',
      'Custom Model Weights & Neural Fine-Tuning',
      'Direct Fiber Relay & SLA Guarantee (99.999%)',
      'Dedicated Quantum Security Officer',
    ],
  },
];

export default function PricingSection() {
  const [annual, setAnnual] = useState(true);

  return (
    <section id="pricing" className="relative py-28 overflow-hidden">
      {/* Glow Backdrops */}
      <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] bg-[#00E5FF]/10 blur-[180px] pointer-events-none rounded-full" />
      <div className="absolute bottom-10 right-1/4 w-[600px] h-[600px] bg-[#7B61FF]/15 blur-[180px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0D1226]/80 border border-[#00E5FF]/30 backdrop-blur-md mb-4">
            <Zap className="w-4 h-4 text-[#00E5FF] animate-pulse" />
            <span className="text-xs font-mono font-bold tracking-widest text-[#00E5FF] uppercase">
              TRANSPARENT NEURAL TIERING
            </span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white font-heading tracking-tight leading-tight">
            SCALE YOUR <span className="gradient-text-cyan">NEURAL INTELLIGENCE</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300">
            Choose the neural tier optimized for your application throughput and compute requirements.
          </p>

          {/* Monthly / Annual Toggle Switch */}
          <div className="mt-8 inline-flex items-center gap-4 p-1.5 rounded-2xl glass-card border border-[#00E5FF]/30 backdrop-blur-xl">
            <button
              onClick={() => setAnnual(false)}
              className={`px-5 py-2 rounded-xl text-xs font-mono font-bold tracking-wider transition-all duration-300 ${
                !annual ? 'bg-[#00E5FF] text-black shadow-[0_0_15px_#00E5FF]' : 'text-slate-400 hover:text-white'
              }`}
            >
              MONTHLY BILLING
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`px-5 py-2 rounded-xl text-xs font-mono font-bold tracking-wider transition-all duration-300 flex items-center gap-2 ${
                annual ? 'bg-gradient-to-r from-[#00E5FF] to-[#7B61FF] text-white shadow-[0_0_20px_rgba(123,97,255,0.6)]' : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>ANNUAL BILLING</span>
              <span className="px-2 py-0.5 rounded-full bg-black/40 text-[10px] text-[#00E5FF] border border-[#00E5FF]/40">
                SAVE 20%
              </span>
            </button>
          </div>
        </div>

        {/* 3 Pricing Cards Grid */}
        <div className="grid lg:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, idx) => {
            const price = annual ? plan.annualPrice : plan.monthlyPrice;

            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className={`relative flex flex-col justify-between p-8 rounded-3xl transition-all duration-500 ${
                  plan.popular
                    ? 'glass-card-purple border-2 border-[#00E5FF] shadow-[0_0_50px_rgba(0,229,255,0.35)] lg:-translate-y-4 bg-[#0E1535]/90'
                    : 'glass-card border border-[#00E5FF]/20 hover:border-[#00E5FF]/50'
                }`}
              >
                {/* Popular Neon Ribbon */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-[#00E5FF] to-[#7B61FF] text-black font-mono text-[10px] font-extrabold uppercase tracking-widest shadow-[0_0_20px_#00E5FF] flex items-center gap-1.5">
                    <Crown className="w-3.5 h-3.5 fill-black" />
                    <span>RECOMMENDED CORE</span>
                  </div>
                )}

                <div>
                  {/* Top Name & Tag */}
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-bold text-white font-heading">
                      {plan.name}
                    </h3>
                    <span className="text-[10px] font-mono font-semibold tracking-wider px-2.5 py-1 rounded-full bg-[#050714] text-slate-300 border border-slate-800 uppercase">
                      {plan.tag}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 mb-6 min-h-[36px]">
                    {plan.desc}
                  </p>

                  {/* Price */}
                  <div className="flex items-baseline gap-2 mb-8 pb-6 border-b border-slate-800">
                    <span className="text-5xl font-extrabold font-heading text-white">
                      ${price}
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      / month per node
                    </span>
                  </div>

                  {/* Features List */}
                  <div className="space-y-4 mb-8">
                    <p className="text-xs font-mono text-slate-400 uppercase tracking-widest font-semibold">
                      INCLUDED NEURAL SERVICES:
                    </p>
                    {plan.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-3 text-xs text-slate-200">
                        <div
                          className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                          style={{ backgroundColor: `${plan.color}25` }}
                        >
                          <Check className="w-3 h-3" style={{ color: plan.color }} />
                        </div>
                        <span className="leading-snug">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA Button */}
                <Link
                  to="/register"
                  className={`w-full py-4 rounded-2xl font-mono font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-all duration-300 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-[#00E5FF] to-[#7B61FF] text-black hover:shadow-[0_0_35px_#00E5FF] hover:scale-[1.02]'
                      : 'bg-[#0D1226] text-white border border-[#00E5FF]/30 hover:border-[#00E5FF] hover:bg-[#00E5FF]/10'
                  }`}
                >
                  <span>INITIALIZE {plan.name.toUpperCase()}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
