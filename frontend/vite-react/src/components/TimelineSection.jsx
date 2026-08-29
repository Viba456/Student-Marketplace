import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Cpu, Network, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

const steps = [
  {
    number: '01',
    title: 'Core Initialization & Neural Sync',
    tag: 'STAGE 1 // INITIALIZE',
    desc: 'Connect your data streams to VIBA 2035 using automated zero-latency quantum WebSockets.',
    details: [
      'Automatic Neural Protocol Discovery',
      'Quantum SSL Handshake & Token Issue',
      'Instant In-Memory Edge Caching',
    ],
    code: 'sys.init_neural_core(mesh_id="VIBA_2035", latency_target=0.18);',
  },
  {
    number: '02',
    title: 'Autonomous Protocol Matrix Setup',
    tag: 'STAGE 2 // ORCHESTRATE',
    desc: 'Deploy custom neural agents across decentralized sub-networks with built-in biometric failover.',
    details: [
      'Multi-Agent Load Balancing',
      'Autonomous Threat Detection & Sandbox Isolation',
      'Real-Time Telemetry Event Streaming',
    ],
    code: 'mesh.deploy_subagents(count=1024, mode="AUTONOMOUS_ENFORCED");',
  },
  {
    number: '03',
    title: 'Real-Time Quantum Execution',
    tag: 'STAGE 3 // EXECUTE',
    desc: 'Execute sub-millisecond AI inference and spatial computations across global relay nodes.',
    details: [
      'Sub-millisecond Tensor Pipeline',
      'Distributed State Machine Synchronization',
      'Self-Healing Node Rebalancing',
    ],
    code: 'pipeline.execute_task(task_hash="0x9F4A...", priority="HIGH");',
  },
  {
    number: '04',
    title: 'Continuous Holo Dashboard Telemetry',
    tag: 'STAGE 4 // MONITOR',
    desc: 'Monitor health metrics, security shields, and neural activity in real-time spatial HUD visuals.',
    details: [
      '3D Holographic Telemetry Graphs',
      'Predictive Anomaly Warning Alerts',
      'Automated Immutable Audit Logging',
    ],
    code: 'telemetry.stream_hud(mode="3D_SPATIAL_MATRIX", fps=60);',
  },
];

export default function TimelineSection() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section id="timeline" className="relative py-28 overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-[#7B61FF]/10 blur-[150px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#00E5FF]/10 blur-[150px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0D1226]/80 border border-[#7B61FF]/30 backdrop-blur-md mb-4">
            <Sparkles className="w-4 h-4 text-[#7B61FF] animate-pulse" />
            <span className="text-xs font-mono font-bold tracking-widest text-[#7B61FF] uppercase">
              AUTONOMOUS WORKFLOW
            </span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white font-heading tracking-tight leading-tight">
            HOW THE <span className="gradient-text-cyan">QUANTUM MATRIX</span> OPERATES
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300">
            Four seamless phases powering the next generation of spatial neural computing.
          </p>
        </div>

        {/* Interactive Timeline Container */}
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          
          {/* Step Selector Column */}
          <div className="lg:col-span-6 space-y-4">
            {steps.map((step, idx) => {
              const isActive = activeStep === idx;
              return (
                <motion.div
                  key={idx}
                  onClick={() => setActiveStep(idx)}
                  whileHover={{ scale: 1.01 }}
                  className={`relative p-6 rounded-2xl cursor-pointer transition-all duration-300 border ${
                    isActive
                      ? 'glass-card border-[#00E5FF] shadow-[0_0_30px_rgba(0,229,255,0.25)] bg-[#0A1029]/80'
                      : 'bg-[#080B1E]/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {/* Glowing vertical connector line */}
                  {idx < steps.length - 1 && (
                    <div className="absolute left-[31px] top-[70px] w-0.5 h-6 bg-gradient-to-b from-[#00E5FF] to-[#7B61FF] opacity-40" />
                  )}

                  <div className="flex items-start gap-4">
                    {/* Step Number Circle */}
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-mono font-bold text-sm border transition-all duration-300 shrink-0 ${
                        isActive
                          ? 'bg-[#00E5FF] text-black border-[#00E5FF] shadow-[0_0_15px_#00E5FF]'
                          : 'bg-[#0D1226] text-slate-400 border-slate-700'
                      }`}
                    >
                      {step.number}
                    </div>

                    <div className="space-y-1">
                      <span className="text-[10px] font-mono tracking-widest text-[#00E5FF] uppercase font-semibold">
                        {step.tag}
                      </span>
                      <h3 className="text-lg font-bold text-white">
                        {step.title}
                      </h3>
                      <p className="text-xs text-slate-300 line-clamp-2">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Step Detail Active HUD Card */}
          <div className="lg:col-span-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="glass-card-purple p-8 sm:p-10 rounded-3xl relative overflow-hidden border border-[#7B61FF]/40 shadow-[0_0_40px_rgba(123,97,255,0.2)]"
              >
                {/* HUD Top Bar */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-5 h-5 text-[#00E5FF]" />
                    <span className="text-xs font-mono font-bold text-slate-200 uppercase tracking-widest">
                      NEURAL PROTOCOL CONSOLE
                    </span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-mono bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/30">
                    STEP {steps[activeStep].number} / 04
                  </span>
                </div>

                {/* Title & Desc */}
                <h4 className="text-2xl font-bold text-white mb-3">
                  {steps[activeStep].title}
                </h4>
                <p className="text-sm text-slate-300 leading-relaxed mb-6">
                  {steps[activeStep].desc}
                </p>

                {/* Bullet Points */}
                <div className="space-y-3 mb-8">
                  {steps[activeStep].details.map((detail, dIdx) => (
                    <div key={dIdx} className="flex items-center gap-3 text-xs text-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-[#00E5FF] shrink-0" />
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>

                {/* Code Terminal Display */}
                <div className="p-4 rounded-xl bg-[#050714] border border-[#00E5FF]/20 font-mono text-xs text-[#00E5FF] flex items-center justify-between shadow-inner">
                  <div className="truncate">
                    <span className="text-slate-400 mr-2">&gt;</span>
                    {steps[activeStep].code}
                  </div>
                  <span className="w-2 h-4 bg-[#00E5FF] animate-pulse shrink-0 ml-2" />
                </div>

              </motion.div>
            </AnimatePresence>
          </div>

        </div>

      </div>
    </section>
  );
}
