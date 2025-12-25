import React, { useState } from 'react';
import { MANUALS } from '../../constants';
import { X, Search, ExternalLink, BookOpen, Library } from 'lucide-react';

interface ManualsOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  playSound: (type: 'click') => void;
}

const ManualsOverlay: React.FC<ManualsOverlayProps> = ({ isOpen, onClose, playSound }) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const filteredManuals = MANUALS.filter(m => 
    m.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-0 md:p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-[var(--bg-color)] w-full h-full md:w-full md:max-w-6xl md:h-[90vh] rounded-none md:rounded-3xl shadow-2xl flex flex-col relative overflow-hidden border-none md:border border-[var(--border-color)]">
        
        <div className="p-6 bg-[var(--card-bg)] border-b border-[var(--border-color)] flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex w-full justify-between items-center md:w-auto">
            <h2 className="text-2xl font-bold text-[var(--accent-color)] flex items-center gap-2">
              <Library size={28} /> Textbooks
            </h2>
            <button onClick={onClose} className="md:hidden p-2 hover:bg-[var(--highlight-color)] rounded-full text-[var(--text-color)]">
              <X size={24} />
            </button>
          </div>
          
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-color)] opacity-50" size={20} />
            <input 
              type="text" 
              placeholder="Search textbook..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-[var(--highlight-color)] border border-[var(--border-color)] focus:border-[var(--accent-color)] outline-none transition-all"
            />
          </div>
          
          <button onClick={onClose} className="hidden md:block p-2 hover:bg-[var(--highlight-color)] rounded-full text-[var(--text-color)]">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 pb-24 md:pb-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredManuals.map((manual) => (
              <a 
                key={manual.title}
                href={manual.url}
                target="_blank"
                rel="noreferrer"
                onClick={() => playSound('click')}
                className="group flex flex-col bg-[var(--card-bg)] rounded-2xl p-4 border border-[var(--border-color)] hover:border-[var(--accent-color)] hover:shadow-xl transition-all hover:-translate-y-1"
              >
                <div className="aspect-[3/4] mb-4 overflow-hidden rounded-xl bg-gray-100 relative">
                  <img 
                    src={manual.image} 
                    alt={manual.title}
                    className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <ExternalLink className="text-white drop-shadow-md" size={32} />
                  </div>
                </div>
                <h3 className="text-center font-bold text-lg text-[var(--text-color)] group-hover:text-[var(--accent-color)] transition-colors">
                  {manual.title}
                </h3>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManualsOverlay;