import React from 'react';
import { UserCheck, Search, ShieldCheck, CheckCircle2 } from 'lucide-react';

const steps = [
  {
    step: '01',
    icon: UserCheck,
    title: 'Verify Campus Profile',
    desc: 'Sign up with your student email to unlock trusted peer-to-peer marketplace access.',
    color: '#2563EB',
  },
  {
    step: '02',
    icon: Search,
    title: 'Browse or Offer Services',
    desc: 'List your skills in coding, tutoring, design, or writing—or hire peers for small projects.',
    color: '#7C3AED',
  },
  {
    step: '03',
    icon: ShieldCheck,
    title: 'Deliver & Earn Safely',
    desc: 'Complete tasks with guaranteed payment releases, campus ratings, and portfolio building.',
    color: '#10B981',
  },
];

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20 bg-slate-100/80 border-y border-slate-200 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-200 uppercase tracking-wider">
            Simple 3-Step Process
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-3">
            How VIBA Campus Works
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            A safe, transparent marketplace engineered specifically for student success.
          </p>
        </div>

        {/* 3 Steps */}
        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-8 rounded-2xl bg-white border border-slate-200 shadow-sm relative overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center border"
                      style={{
                        backgroundColor: `${item.color}10`,
                        borderColor: `${item.color}30`,
                      }}
                    >
                      <Icon className="w-6 h-6" style={{ color: item.color }} />
                    </div>
                    <span className="font-mono font-extrabold text-2xl text-slate-300">
                      {item.step}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                </div>

                <div className="mt-6 flex items-center gap-1.5 text-xs text-blue-600 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-blue-600" />
                  <span>Campus Identity Protected</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
