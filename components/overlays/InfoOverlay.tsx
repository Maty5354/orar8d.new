import React from 'react';
import { X, Github, Mail, Globe, Heart, Zap, Smartphone, Code, GraduationCap, Info } from 'lucide-react';

interface InfoOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  playSound: (type: 'click') => void;
}

const InfoOverlay: React.FC<InfoOverlayProps> = ({ isOpen, onClose, playSound }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-0 md:p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-[var(--card-bg)] w-full h-full md:w-full md:max-w-3xl md:h-auto md:max-h-[85vh] rounded-none md:rounded-3xl shadow-2xl flex flex-col overflow-hidden relative border-none md:border border-[var(--border-color)] animate-fade-in-up">
        
        <div className="bg-[var(--accent-color)] p-8 md:p-10 text-[var(--accent-text-color)] relative shrink-0">
           <button 
             onClick={onClose} 
             className="absolute top-6 right-6 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-colors backdrop-blur-sm"
           >
             <X size={24} className="text-current" />
           </button>
           
           <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mt-4">
             <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-inner border border-white/10 shrink-0">
                <GraduationCap size={40} className="text-current" />
             </div>
             <div>
               <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-2">Orar 8D</h1>
               <p className="opacity-90 text-lg font-medium">The ultimate schedule companion.</p>
             </div>
           </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 md:p-10 space-y-10">
           
           <section>
             <h3 className="text-sm font-bold text-[var(--accent-color)] uppercase tracking-wider mb-4 flex items-center gap-2">
               <Info size={16} /> About
             </h3>
             <p className="text-[var(--text-color)] opacity-80 text-lg leading-relaxed">
               Orar 8D is designed to streamline your school life. It combines a dynamic class timetable with integrated digital textbooks, a task manager, and live weather updates to ensure you're always prepared for the day ahead.
             </p>
           </section>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FeatureCard icon={<Zap />} title="Fast & Fluid" desc="Optimized for speed with smooth animations." />
              <FeatureCard icon={<Smartphone />} title="Responsive" desc="Looks great on mobile, tablet, and desktop." />
              <FeatureCard icon={<Code />} title="Modern Stack" desc="Built with React, Tailwind, and Lucide." />
           </div>

           <div className="bg-[var(--highlight-color)]/50 rounded-2xl p-6 border border-[var(--border-color)] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
             <div>
               <h3 className="font-bold text-[var(--text-color)] text-lg mb-1">Version 3.5</h3>
               <p className="text-sm opacity-60">Latest build includes new themes and timer features.</p>
             </div>
             <div className="flex gap-2">
                <span className="px-3 py-1 rounded-full bg-[var(--accent-color)]/10 text-[var(--accent-color)] text-xs font-bold border border-[var(--accent-color)]/20">
                  Stable
                </span>
                <span className="px-3 py-1 rounded-full bg-[var(--card-bg)] border border-[var(--border-color)] text-[var(--text-color)] text-xs font-bold opacity-60">
                  Build 2024.10
                </span>
             </div>
           </div>

           <div className="pt-6 border-t border-[var(--border-color)] flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex gap-3 w-full md:w-auto">
                <SocialButton onClick={() => playSound('click')} icon={<Github size={20}/>} label="GitHub" />
                <SocialButton onClick={() => playSound('click')} icon={<Mail size={20}/>} label="Contact" />
                <SocialButton onClick={() => playSound('click')} icon={<Globe size={20}/>} label="Website" />
              </div>
              <p className="text-sm opacity-50 flex items-center gap-1.5 font-medium whitespace-nowrap">
                Made with <Heart size={14} className="text-red-500 fill-current animate-pulse" /> for Class 8D
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({icon, title, desc}: {icon: React.ReactNode, title: string, desc: string}) => (
  <div className="p-5 rounded-xl bg-[var(--card-bg)] border border-[var(--border-color)] shadow-sm hover:shadow-md transition-shadow">
    <div className="text-[var(--accent-color)] mb-3">{icon}</div>
    <h4 className="font-bold text-[var(--text-color)] mb-1">{title}</h4>
    <p className="text-xs text-[var(--text-color)] opacity-60 leading-relaxed">{desc}</p>
  </div>
);

const SocialButton = ({icon, label, onClick}: {icon: React.ReactNode, label: string, onClick: () => void}) => (
  <button onClick={onClick} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--highlight-color)] hover:bg-[var(--accent-color)] hover:text-[var(--accent-text-color)] transition-all text-sm font-bold text-[var(--text-color)] group border border-[var(--border-color)] hover:border-[var(--accent-color)]">
    <span className="group-hover:scale-110 transition-transform">{icon}</span>
    <span>{label}</span>
  </button>
);

export default InfoOverlay;