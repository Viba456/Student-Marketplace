import React, { useState, useEffect } from 'react';
import { RefreshCw, Clock, CheckCircle, XCircle, ArrowLeft, Star, Video } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api';
import ReviewModal from '../components/ReviewModal';
import ReportModal from '../components/ReportModal';
import MediaViewerModal from '../components/MediaViewerModal';

export default function Requests() {
  const [activeTab, setActiveTab] = useState('incoming'); // 'incoming' or 'outgoing'
  const [incoming, setIncoming] = useState([]);
  const [outgoing, setOutgoing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [reviewRequest, setReviewRequest] = useState(null);
  const [reportRequest, setReportRequest] = useState(null);
  const [mediaSkill, setMediaSkill] = useState(null);
  
  const navigate = useNavigate();

  const fetchRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      const [inc, out] = await Promise.all([
        api.getIncomingRequests(),
        api.getOutgoingRequests()
      ]);
      setIncoming(Array.isArray(inc) ? inc : []);
      setOutgoing(Array.isArray(out) ? out : []);
    } catch (err) {
      if (err.message.includes('401')) {
        navigate('/login');
      } else {
        setError(err.message || 'Failed to load requests');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      const updatedReq = await api.updateRequestStatus(id, status);
      if (activeTab === 'incoming') {
        setIncoming(prev => prev.map(r => r.id === id ? updatedReq : r));
      } else {
        setOutgoing(prev => prev.map(r => r.id === id ? updatedReq : r));
      }
    } catch (err) {
      alert("Failed to update status: " + err.message);
    }
  };

  const StatusBadge = ({ status }) => {
    switch (status) {
      case 'pending':
        return <span className="px-2 py-1 rounded text-xs font-bold bg-amber-500/20 text-amber-500 uppercase flex items-center gap-1"><Clock className="w-3 h-3" /> Pending</span>;
      case 'accepted':
        return <span className="px-2 py-1 rounded text-xs font-bold bg-blue-500/20 text-blue-400 uppercase">Accepted</span>;
      case 'completed':
        return <span className="px-2 py-1 rounded text-xs font-bold bg-emerald-500/20 text-emerald-400 uppercase flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Completed</span>;
      case 'declined':
        return <span className="px-2 py-1 rounded text-xs font-bold bg-rose-500/20 text-rose-400 uppercase flex items-center gap-1"><XCircle className="w-3 h-3" /> Declined</span>;
      case 'cancelled':
        return <span className="px-2 py-1 rounded text-xs font-bold bg-slate-500/20 text-slate-400 uppercase">Cancelled</span>;
      case 'disputed':
        return <span className="px-2 py-1 rounded text-xs font-bold bg-rose-500/20 text-rose-400 uppercase">Disputed</span>;
      default:
        return <span className="px-2 py-1 rounded text-xs font-bold bg-slate-500/20 text-slate-400 uppercase">{status}</span>;
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 flex justify-center px-4 bg-slate-50 text-slate-900">
      <div className="w-full max-w-4xl space-y-6">
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 mb-1">Service Requests</h1>
            <p className="text-sm text-slate-600">Manage your bookings and access signed-up skill media.</p>
          </div>
          <Link to="/" className="flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-sm">
            {error}
          </div>
        )}

        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xl">
          
          <div className="flex items-center border-b border-slate-200 bg-slate-50">
            <button
              onClick={() => setActiveTab('incoming')}
              className={`flex-1 py-4 text-sm font-bold border-b-2 transition-colors ${
                activeTab === 'incoming' ? 'border-blue-600 text-blue-600 bg-white' : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              Client Requests ({incoming.length})
            </button>
            <button
              onClick={() => setActiveTab('outgoing')}
              className={`flex-1 py-4 text-sm font-bold border-b-2 transition-colors ${
                activeTab === 'outgoing' ? 'border-blue-600 text-blue-600 bg-white' : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              My Bookings ({outgoing.length})
            </button>
            <button onClick={fetchRequests} className="p-4 text-slate-500 hover:text-slate-900 transition-colors">
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="py-12 text-center">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-sm text-slate-500 mt-4">Loading requests...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {(activeTab === 'incoming' ? incoming : outgoing).length === 0 ? (
                  <div className="text-center py-12 text-slate-500">
                    <p className="mb-2">No {activeTab} requests found.</p>
                  </div>
                ) : (
                  (activeTab === 'incoming' ? incoming : outgoing).map(req => (
                    <div key={req.id} className="p-5 rounded-xl border border-slate-200 bg-slate-50 flex flex-col md:flex-row gap-6 justify-between">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-base font-bold text-slate-900 leading-tight mb-1">{req.listing?.title}</h3>
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                              <span>{req.listing?.category}</span>
                              <span>•</span>
                              <span className="font-semibold text-blue-600">{req.listing?.price}</span>
                            </div>
                          </div>
                          <StatusBadge status={req.status} />
                        </div>
                        
                        {req.notes && (
                          <div className="p-3 rounded-lg bg-white border border-slate-200">
                            <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Notes from {activeTab === 'incoming' ? 'Client' : 'You'}</span>
                            <p className="text-xs text-slate-700">{req.notes}</p>
                          </div>
                        )}
                        
                        <div className="text-xs text-slate-500">
                          {activeTab === 'incoming' ? 'Client ID: ' : 'Seller: '} 
                          {activeTab === 'incoming' ? (
                            <span className="text-slate-800 font-medium">#{req.requester_id}</span>
                          ) : (
                            <span className="text-slate-800 font-medium">{req.listing?.seller_name || 'Student'}</span>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-row md:flex-col items-center justify-end gap-2 md:w-36 border-t md:border-t-0 md:border-l border-slate-200 pt-4 md:pt-0 md:pl-4">
                        {/* Course Media Button for active/signed-up requests */}
                        {req.listing && req.status !== 'cancelled' && req.status !== 'declined' && (
                          <button
                            onClick={() => setMediaSkill(req.listing)}
                            className="w-full px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold transition-colors flex items-center justify-center gap-1 border border-blue-200"
                          >
                            <Video className="w-3.5 h-3.5 text-blue-600" /> View Media
                          </button>
                        )}

                        {req.status === 'disputed' ? (
                          <div className="w-full text-center text-xs text-rose-600 font-bold py-2">
                            Under Review
                          </div>
                        ) : (
                          <>
                            {activeTab === 'incoming' && req.status === 'pending' && (
                              <>
                                <button onClick={() => handleUpdateStatus(req.id, 'accepted')} className="w-full px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors">
                                  Accept
                                </button>
                                <button onClick={() => handleUpdateStatus(req.id, 'declined')} className="w-full px-3 py-2 rounded-lg bg-slate-200 hover:bg-rose-100 text-slate-700 hover:text-rose-600 text-xs font-semibold transition-colors">
                                  Decline
                                </button>
                              </>
                            )}
                            
                            {activeTab === 'incoming' && req.status === 'accepted' && (
                              <button onClick={() => handleUpdateStatus(req.id, 'completed')} className="w-full px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors">
                                Mark Complete
                              </button>
                            )}

                            {activeTab === 'outgoing' && req.status === 'pending' && (
                              <button onClick={() => handleUpdateStatus(req.id, 'cancelled')} className="w-full px-3 py-2 rounded-lg bg-slate-200 hover:bg-rose-100 text-slate-700 hover:text-rose-600 text-xs font-semibold transition-colors">
                                Cancel Request
                              </button>
                            )}
                            
                            {activeTab === 'outgoing' && req.status === 'completed' && !req.has_review && (
                              <button onClick={() => setReviewRequest(req)} className="w-full px-3 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold transition-colors flex items-center justify-center gap-1">
                                <Star className="w-3.5 h-3.5 fill-white" /> Review
                              </button>
                            )}

                            {activeTab === 'outgoing' && req.status === 'completed' && req.has_review && (
                              <div className="w-full text-center text-xs text-amber-600 font-bold py-2 flex items-center justify-center gap-1">
                                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" /> Reviewed
                              </div>
                            )}
                            
                            {/* Dispute / Report Link for active requests */}
                            {req.status !== 'cancelled' && req.status !== 'declined' && !req.has_dispute && (
                               <button onClick={() => setReportRequest(req)} className="text-[10px] text-slate-400 hover:text-rose-600 mt-1 underline transition-colors">
                                  Report Issue
                               </button>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {reviewRequest && (
        <ReviewModal
          request={reviewRequest}
          onClose={() => setReviewRequest(null)}
          onSuccess={fetchRequests}
        />
      )}
      
      {reportRequest && (
        <ReportModal
          request={reportRequest}
          onClose={() => setReportRequest(null)}
          onSuccess={fetchRequests}
        />
      )}

      {mediaSkill && (
        <MediaViewerModal
          skill={mediaSkill}
          onClose={() => setMediaSkill(null)}
        />
      )}
    </div>
  );
}
