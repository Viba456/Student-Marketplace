import React, { useState, useEffect } from 'react';
import { X, Lock, Play, Image as ImageIcon, Video, CheckCircle, AlertTriangle } from 'lucide-react';
import api from '../api';

const getMediaUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
    return url;
  }
  return url.startsWith('/') ? url : '/' + url;
};

export default function MediaViewerModal({ skill, onClose, onBookRequest }) {
  const [loading, setLoading] = useState(true);
  const [mediaData, setMediaData] = useState(null);
  const [error, setError] = useState(null);
  const [activeMedia, setActiveMedia] = useState(null);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    if (!skill) return;
    async function fetchMedia() {
      setLoading(true);
      setError(null);
      setImgError(false);
      try {
        const res = await api.getListingMedia(skill.id);
        setMediaData(res);
        if (res.access_granted && res.media && res.media.length > 0) {
          setActiveMedia(res.media[0]);
        }
      } catch (err) {
        setError(err.message || "Failed to load media");
      } finally {
        setLoading(false);
      }
    }
    fetchMedia();
  }, [skill]);

  if (!skill) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-3xl p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 shadow-2xl relative text-slate-900 overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
          <div>
            <span className="text-[10px] font-bold text-blue-600 tracking-wider uppercase px-2 py-0.5 rounded bg-blue-50 border border-blue-100">
              {skill.category || 'Course / Skill Media'}
            </span>
            <h3 className="text-xl font-bold text-slate-900 mt-1">{skill.title}</h3>
            <p className="text-xs text-slate-500">Offered by {skill.seller_name || skill.seller || 'Student'}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        {loading ? (
          <div className="py-20 text-center space-y-3">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-sm text-slate-500">Checking course access & loading media...</p>
          </div>
        ) : error ? (
          <div className="py-12 text-center text-rose-600 bg-rose-50 rounded-xl p-4 border border-rose-200">
            <p className="text-sm font-semibold">{error}</p>
          </div>
        ) : mediaData && !mediaData.access_granted ? (
          /* LOCKED STATE */
          <div className="py-10 px-6 text-center space-y-5 bg-gradient-to-b from-slate-50 to-blue-50/30 rounded-2xl border border-slate-200">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 text-amber-600 border border-amber-200 flex items-center justify-center mx-auto shadow-sm">
              <Lock className="w-8 h-8 animate-pulse" />
            </div>
            
            <div className="max-w-md mx-auto space-y-2">
              <h4 className="text-xl font-extrabold text-slate-900">
                Course Media & Resources Locked
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                This skill listing contains exclusive video lessons and image materials. 
                <span className="font-semibold text-slate-800"> Media access is strictly reserved for students who sign up or book this skill.</span>
              </p>
            </div>

            {mediaData.media_count > 0 && (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-100/80 border border-amber-200 text-amber-800 text-xs font-semibold">
                <Video className="w-3.5 h-3.5" />
                <span>{mediaData.media_count} Exclusive File{mediaData.media_count > 1 ? 's' : ''} Attached</span>
              </div>
            )}

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={onClose}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100"
              >
                Close Preview
              </button>
              <button
                onClick={() => {
                  onClose();
                  if (onBookRequest) onBookRequest(skill);
                }}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 text-white font-bold text-xs shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                Sign Up / Request Skill to Unlock
              </button>
            </div>
          </div>
        ) : (
          /* UNLOCKED STATE */
          <div className="flex-1 flex flex-col md:flex-row gap-6 overflow-hidden">
            {/* Main Player / Viewer */}
            <div className="flex-1 flex flex-col justify-between bg-slate-950 rounded-xl overflow-hidden relative min-h-[280px]">
              <div className="flex-1 flex items-center justify-center p-4">
                {activeMedia ? (
                  activeMedia.file_type === 'video' ? (
                    <video
                      key={activeMedia.file_url}
                      src={getMediaUrl(activeMedia.file_url)}
                      controls
                      autoPlay
                      className="w-full h-full max-h-[380px] object-contain rounded-lg"
                    />
                  ) : imgError ? (
                    <div className="text-center p-6 text-rose-400 space-y-2">
                      <AlertTriangle className="w-8 h-8 mx-auto" />
                      <p className="text-xs font-semibold">Failed to display media file</p>
                      <a
                        href={getMediaUrl(activeMedia.file_url)}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] underline text-blue-400"
                      >
                        Open directly in new tab
                      </a>
                    </div>
                  ) : (
                    <img
                      key={activeMedia.file_url}
                      src={getMediaUrl(activeMedia.file_url)}
                      alt={activeMedia.title}
                      onError={() => setImgError(true)}
                      className="max-h-[360px] max-w-full object-contain rounded-lg shadow-md"
                    />
                  )
                ) : (
                  <div className="text-center p-8 text-slate-400 text-xs">
                    No media uploaded yet for this skill listing.
                  </div>
                )}
              </div>

              {activeMedia && (
                <div className="p-3 bg-slate-900 border-t border-slate-800 text-white flex items-center justify-between text-xs">
                  <span className="font-semibold truncate">{activeMedia.title}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono uppercase">
                    {activeMedia.file_type}
                  </span>
                </div>
              )}
            </div>

            {/* Media Playlist / Sidebar */}
            <div className="w-full md:w-64 flex flex-col bg-slate-50 rounded-xl border border-slate-200 p-3 overflow-y-auto max-h-[360px]">
              <div className="flex items-center justify-between mb-3 px-1 border-b border-slate-200 pb-2">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Course Content ({mediaData?.media?.length || 0})
                </span>
                <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Unlocked
                </span>
              </div>

              {mediaData?.media?.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-6">No media uploaded yet.</p>
              ) : (
                <div className="space-y-2">
                  {mediaData?.media?.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => {
                        setActiveMedia(m);
                        setImgError(false);
                      }}
                      className={`w-full text-left p-2.5 rounded-lg border text-xs flex items-center gap-3 transition-all ${
                        activeMedia?.id === m.id
                          ? 'bg-blue-600 text-white border-blue-600 shadow-sm font-semibold'
                          : 'bg-white text-slate-700 hover:bg-slate-100 border-slate-200'
                      }`}
                    >
                      <div className={`p-1.5 rounded-md ${activeMedia?.id === m.id ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
                        {m.file_type === 'video' ? <Video className="w-3.5 h-3.5" /> : <ImageIcon className="w-3.5 h-3.5" />}
                      </div>
                      <div className="truncate flex-1">
                        <p className="truncate text-xs">{m.title || m.filename}</p>
                        <span className={`text-[10px] capitalize ${activeMedia?.id === m.id ? 'text-blue-100' : 'text-slate-400'}`}>
                          {m.file_type}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
