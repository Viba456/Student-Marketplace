import React from 'react';

export default function AmbientBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-slate-50">
      {/* Soft Blue Blob */}
      <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-blue-300/30 blur-[120px]" />
      {/* Soft Violet Blob */}
      <div className="absolute top-[30%] right-[-5%] w-[600px] h-[600px] rounded-full bg-violet-300/30 blur-[140px]" />
      {/* Soft Cyan Blob */}
      <div className="absolute bottom-[-10%] left-[20%] w-[550px] h-[550px] rounded-full bg-sky-300/25 blur-[130px]" />
    </div>
  );
}
