import React, { useState } from 'react';
import AmbientBackground from '../components/AmbientBackground';
import Navbar from '../components/Navbar';
import StudentHero from '../components/StudentHero';
import SkillMarketplaceGrid from '../components/SkillMarketplaceGrid';
import HowItWorksSection from '../components/HowItWorksSection';
import StudentReviewsSection from '../components/StudentReviewsSection';
import FooterSection from '../components/FooterSection';
import PostSkillModal from '../components/PostSkillModal';
import BookServiceModal from '../components/BookServiceModal';
import MediaViewerModal from '../components/MediaViewerModal';

export default function HomeLanding() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Skills');
  const [postModalOpen, setPostModalOpen] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [mediaSkill, setMediaSkill] = useState(null);

  return (
    <div className="relative min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-600 selection:text-white">
      {/* Ambient Backdrop */}
      <AmbientBackground />

      {/* Navbar */}
      <Navbar onOpenPostModal={() => setPostModalOpen(true)} />

      {/* Hero Header */}
      <StudentHero
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      {/* Skill Marketplace Cards Grid */}
      <SkillMarketplaceGrid
        searchQuery={searchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        onSelectSkill={(skill) => setSelectedSkill(skill)}
        onOpenMedia={(skill) => setMediaSkill(skill)}
      />

      {/* How It Works */}
      <HowItWorksSection />

      {/* Campus Reviews */}
      <StudentReviewsSection />

      {/* Footer */}
      <FooterSection />

      {/* Modals */}
      <PostSkillModal
        isOpen={postModalOpen}
        onClose={() => setPostModalOpen(false)}
      />

      <BookServiceModal
        skill={selectedSkill}
        onClose={() => setSelectedSkill(null)}
        onOpenMedia={(skill) => setMediaSkill(skill)}
      />

      {mediaSkill && (
        <MediaViewerModal
          skill={mediaSkill}
          onClose={() => setMediaSkill(null)}
          onBookRequest={(skill) => setSelectedSkill(skill)}
        />
      )}
    </div>
  );
}
