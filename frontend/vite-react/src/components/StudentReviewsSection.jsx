import React from 'react';
import { Star, Quote, CheckCircle } from 'lucide-react';

const reviews = [
  {
    name: 'Emily Watson',
    major: 'Computer Science Senior',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    comment: 'I earned over $800 tutoring Python and Data Structures on VIBA last semester while managing my own classes. It fits right into my schedule!',
    rating: 5,
    tag: 'Verified Student Tutor',
  },
  {
    name: 'Brandon Cole',
    major: 'Business Administration Major',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    comment: 'Hired a graphic design major on campus to design our club logo and pitch deck. The work was incredible and delivered in less than 48 hours.',
    rating: 5,
    tag: 'Verified Student Client',
  },
  {
    name: 'Sophia Martinez',
    major: 'Digital Media Junior',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80',
    comment: 'VIBA helped me build my portfolio with real client projects before graduating. Now I have verified reviews to show future employers!',
    rating: 5,
    tag: 'Verified Student Creator',
  },
];

export default function StudentReviewsSection() {
  return (
    <section id="testimonials" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-violet-50 text-violet-700 border border-violet-200 uppercase tracking-wider">
            Campus Success Stories
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-3">
            What Students Say About VIBA
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Real feedback from students earning income and finding affordable help on campus.
          </p>
        </div>

        {/* 3 Review Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {reviews.map((rev, idx) => (
            <div
              key={idx}
              className="p-8 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                    {rev.tag}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed italic mb-6">
                  "{rev.comment}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <img
                  src={rev.avatar}
                  alt={rev.name}
                  className="w-10 h-10 rounded-full object-cover border border-slate-200"
                />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{rev.name}</h4>
                  <p className="text-[11px] text-slate-500 font-medium">{rev.major}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
