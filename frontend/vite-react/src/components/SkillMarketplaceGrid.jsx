import React, { useState, useEffect } from 'react';
import { Star, Clock, Video, Lock } from 'lucide-react';
import api from '../api';

const categories = [
  'All Skills',
  'Tutoring & Academics',
  'Coding & Web Dev',
  'Graphic & UI Design',
  'Video & Audio',
  'Writing & Proofreading',
];

export default function SkillMarketplaceGrid({ searchQuery, selectedCategory, setSelectedCategory, onSelectSkill, onOpenMedia }) {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchListings() {
      try {
        const res = await api.getListings();
        setListings(Array.isArray(res) ? res : []);
      } catch (err) {
        console.error("Failed to load listings", err);
      } finally {
        setLoading(false);
      }
    }
    fetchListings();
  }, []);

  const filteredListings = listings.filter((item) => {
    const matchesCategory =
      selectedCategory === 'All Skills' || item.category === selectedCategory;
    const matchesQuery =
      item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.seller_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  return (
    <section id="marketplace" className="py-16 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Explore Campus Student Listings
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Connect directly with student peers to hire services, learn skills, and access course media.
            </p>
          </div>

          <div className="text-xs text-slate-600 font-medium bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs">
            Showing <span className="text-blue-600 font-bold">{filteredListings.length}</span> active student services
          </div>
        </div>

        {/* Category Pills Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                  : 'bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-900 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Listings Grid */}
        {loading ? (
          <div className="text-center py-16">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-sm text-slate-500 mt-4">Loading listings...</p>
          </div>
        ) : filteredListings.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 shadow-xs">
            <p className="text-base font-semibold text-slate-800">No skill listings found matching your search.</p>
            <p className="text-xs text-slate-500 mt-1">Try searching for "tutoring", "design", or "editing".</p>
            <button
              onClick={() => setSelectedCategory('All Skills')}
              className="mt-4 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((item) => (
              <div
                key={item.id}
                className="student-card p-6 flex flex-col justify-between group cursor-pointer relative"
                onClick={() => onSelectSkill(item)}
              >
                <div>
                  {/* Seller Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.seller_avatar || 'https://via.placeholder.com/150'}
                        alt={item.seller_name || 'Student'}
                        className="w-10 h-10 rounded-full object-cover border border-slate-200"
                      />
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {item.seller_name || 'Student'}
                        </h4>
                        <p className="text-[11px] text-slate-500 font-medium">{item.seller_major || 'Undecided'}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 text-xs font-bold text-amber-600">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{item.rating?.toFixed(1) || '0.0'}</span>
                      <span className="text-[10px] text-slate-400 font-normal">({item.reviews || 0})</span>
                    </div>
                  </div>

                  {/* Title & Desc */}
                  <h3 className="text-base font-bold text-slate-900 leading-snug mb-1 group-hover:text-blue-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-2 mb-3 leading-relaxed font-normal">
                    {item.description}
                  </p>

                  {/* Media Badge */}
                  <div className="mb-3 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onOpenMedia) onOpenMedia(item);
                      }}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-lg border border-blue-200/60 transition-colors"
                    >
                      <Video className="w-3 h-3 text-blue-600" />
                      <span>Course Media Attached</span>
                      <Lock className="w-2.5 h-2.5 text-amber-600 ml-0.5" />
                    </button>
                  </div>
                </div>

                {/* Card Footer Info */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                    <Clock className="w-3.5 h-3.5 text-blue-600" />
                    <span>{item.delivery_time || 'N/A'}</span>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-slate-400 font-normal block">Starting at</span>
                    <span className="text-base font-bold text-blue-600">{item.price}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
