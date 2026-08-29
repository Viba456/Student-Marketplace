import React, { useState } from 'react';
import { X, Star, Clock, CheckCircle2, ShieldCheck, Video, Play } from 'lucide-react';
import api from '../api';

export default function BookServiceModal({ skill, onClose, onOpenMedia }) {
  const [booked, setBooked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!skill) return null;

  const handleBook = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const fd = new FormData(e.target);
    const notes = fd.get('notes') || '';

    try {
      await api.createRequest({
        listing_id: skill.id,
        notes: notes
      });
      setBooked(true);
      setTimeout(() => {
        setBooked(false);
        onClose();
      }, 2500);
    } catch (err) {
      setError(err.message || 'Failed to send request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-lg p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-2xl relative text-slate-900">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>

        {booked ? (
          <div className="py-8 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto animate-bounce" />
            <h4 className="text-xl font-bold text-slate-900">Service Request Sent!</h4>
            <p className="text-xs text-slate-600">
              We notified <span className="font-bold text-blue-600">{skill.seller_name || skill.seller}</span> on your campus. You can now access exclusive course media in your Requests dashboard!
            </p>
          </div>
        ) : (
          <div>
            {/* Seller Header */}
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-100">
              <img
                src={skill.seller_avatar || skill.avatar || 'https://via.placeholder.com/150'}
                alt={skill.seller_name || skill.seller}
                className="w-12 h-12 rounded-full object-cover border border-slate-200"
              />
              <div>
                <h4 className="text-base font-bold text-slate-900">{skill.seller_name || skill.seller}</h4>
                <p className="text-xs text-slate-500">{skill.seller_major || skill.major || 'Undecided'}</p>
                <div className="flex items-center gap-1 mt-0.5 text-xs text-amber-600 font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{skill.rating?.toFixed(1) || '0.0'}</span>
                  <span className="text-slate-400 font-normal">({skill.reviews || 0} reviews)</span>
                </div>
              </div>
            </div>

            <h3 className="text-lg font-bold text-slate-900 mb-2">{skill.title}</h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">{skill.desc || skill.description}</p>

            {/* Course Media Banner */}
            <div className="mb-4 p-3 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Video className="w-4 h-4 text-blue-600" />
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Course Media & Resources</span>
                  <span className="text-[10px] text-slate-500">Videos & images available for signed-up students</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onOpenMedia && onOpenMedia(skill)}
                className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1 shadow-xs shrink-0"
              >
                <Play className="w-3.5 h-3.5" /> View Media
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                <Clock className="w-4 h-4 text-blue-600" />
                <span>{skill.delivery_time || skill.delivery || 'N/A'}</span>
              </div>
              <div>
                <span className="text-xs text-slate-500 block">Total Rate</span>
                <span className="text-lg font-bold text-blue-600">{skill.price}</span>
              </div>
            </div>

            <form onSubmit={handleBook} className="space-y-4">
              {error && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs">
                  {error}
                </div>
              )}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  NOTES FOR THE SELLER (OPTIONAL)
                </label>
                <textarea
                  name="notes"
                  rows={2}
                  placeholder="Mention your assignment topics, preferred meet times, or project details..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white"
                />
              </div>

              <div className="flex items-center gap-2 text-[11px] text-slate-500">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Campus Escrow: Payment is released only after you approve the completed service.</span>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 hover:opacity-90 text-white font-semibold text-xs shadow-md shadow-blue-500/20 flex items-center gap-2 disabled:opacity-50"
                >
                  {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                  Send Request & Sign Up
                </button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}
