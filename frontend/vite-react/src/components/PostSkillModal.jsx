import React, { useState } from 'react';
import { X, PlusCircle, CheckCircle, Upload, Lock } from 'lucide-react';
import api from '../api';

export default function PostSkillModal({ isOpen, onClose }) {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const fd = new FormData(e.target);
    const payload = {
      title: fd.get('title'),
      category: fd.get('category'),
      price: fd.get('price'),
      description: fd.get('description'),
      delivery_time: fd.get('delivery_time') || null,
      sample_work_url: fd.get('sample_work_url') || null,
    };

    try {
      const createdListing = await api.createListing(payload);
      
      // Check for multiple media file upload
      const filesInput = e.target.querySelector('input[name="media_files"]');
      if (filesInput && filesInput.files && filesInput.files.length > 0 && createdListing && createdListing.id) {
        const mediaFd = new FormData();
        for (let i = 0; i < filesInput.files.length; i++) {
          mediaFd.append('files', filesInput.files[i]);
        }
        await api.uploadListingMedia(createdListing.id, mediaFd);
      }

      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        onClose();
        window.location.reload();
      }, 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in overflow-y-auto">
      <div className="w-full max-w-lg p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-2xl relative my-8 text-slate-900">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-200 flex items-center justify-center mb-3">
            <PlusCircle className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Offer Your Skill on Campus</h3>
          <p className="text-xs text-slate-500 mt-1">
            Create a listing to offer tutoring, design, coding, or writing services to peers.
          </p>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-3">
            <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto animate-bounce" />
            <h4 className="text-lg font-bold text-slate-900">Skill Listing Published!</h4>
            <p className="text-xs text-slate-600">Your listing and course media items are now active on VIBA.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs">
                {error}
              </div>
            )}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">SERVICE TITLE</label>
              <input name="title" type="text" required placeholder="e.g. Python Tutoring & Code Walkthrough" className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">CATEGORY</label>
                <select name="category" className="w-full px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white">
                  <option value="Tutoring & Academics">Tutoring & Academics</option>
                  <option value="Coding & Web Dev">Coding & Web Dev</option>
                  <option value="Graphic & UI Design">Graphic & UI Design</option>
                  <option value="Video & Audio">Video & Audio</option>
                  <option value="Writing & Proofreading">Writing & Proofreading</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">PRICE</label>
                <input name="price" type="text" required placeholder="$15 / hr" className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">DELIVERY TIME (Optional)</label>
                <input name="delivery_time" type="text" placeholder="e.g. 2 Days, 1-on-1 Zoom" className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">SAMPLE WORK URL (Optional)</label>
                <input name="sample_work_url" type="url" placeholder="https://..." className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">SERVICE DESCRIPTION</label>
              <textarea name="description" rows={3} required placeholder="Describe what you offer..." className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white" />
            </div>

            {/* Multiple Media Upload Option */}
            <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100 space-y-2">
              <label className="block text-xs font-bold text-slate-800 flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-blue-700">
                  <Upload className="w-4 h-4" /> ATTACH COURSE MEDIA (MULTIPLE VIDEOS / IMAGES)
                </span>
                <span className="text-[10px] text-amber-700 bg-amber-100 px-2 py-0.5 rounded flex items-center gap-1 font-semibold">
                  <Lock className="w-3 h-3" /> Signed-Up Only
                </span>
              </label>
              <input
                name="media_files"
                type="file"
                multiple
                accept="video/*,image/*"
                className="w-full text-xs text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer"
              />
              <p className="text-[11px] text-slate-500">
                You can select multiple files at once! Upload video lessons (.mp4, .webm) or diagram images (.png, .jpg) for your students.
              </p>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button type="button" onClick={onClose} disabled={loading} className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100">
                Cancel
              </button>
              <button type="submit" disabled={loading} className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md shadow-blue-500/20 disabled:opacity-50 flex items-center gap-2">
                {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : null}
                Publish Skill Listing
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
