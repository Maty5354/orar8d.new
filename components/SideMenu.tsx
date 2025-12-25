import React, { useState, useEffect } from 'react';
import { Menu, ArrowLeft, Sliders, Cloud, Book, Clock, List, Info, ChevronDown, ExternalLink, BookOpen, AlertCircle } from 'lucide-react';
import { WeatherData } from '../types';
import { SCHEDULE_DATA, MANUALS } from '../constants';

interface SideMenuProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onOpenOverlay: (overlay: string) => void;
  weather: WeatherData | null;
  playSound: (type: 'click' | 'switch' | 'open' | 'close') => void;
}

interface RecManualState {
  subject: string;
  title?: string;
  image?: string;
  url?: string;
  label: string; 
}

const SideMenu: React.FC<SideMenuProps> = ({ isOpen, setIsOpen, onOpenOverlay, weather, playSound }) => {
  const [recManual, setRecManual] = useState<RecManualState | null>(null);
  const [statusMsg, setStatusMsg] = useState('Checking schedule...');

  // Recommended Manual Logic
  useEffect(() => {
    const checkManual = () => {
      const now = new Date();
      const day = now.getDay(); // 0=Sun, 6=Sat
      const hour = now.getHours();
      const min = now.getMinutes();

      if (day === 0 || day === 6) {
        setRecManual(null);
        setStatusMsg("Enjoy your weekend!");
        return;
      }

      const dayIndex = day - 1; 
      const isNext = min >= 50;
      const targetHour = isNext ? hour + 1 : hour;
      const row = SCHEDULE_DATA.find(r => parseInt(r.time) === targetHour);

      if (!row) {
        setRecManual(null);
        if (targetHour < 12) setStatusMsg("Good morning! Classes start at 12:00.");
        else if (targetHour > 19) setStatusMsg("Classes are over for today.");
        else setStatusMsg("No active class right now.");
        return;
      }

      const item = row.days[dayIndex];
      if (!item) {
        setRecManual(null);
        setStatusMsg("Free period.");
        return;
      }

      const manualDetails = MANUALS.find(m => m.url === item.manualUrl || m.title === item.subject);

      setRecManual({
        subject: item.subject,
        title: manualDetails?.title,
        image: manualDetails?.image,
        url: item.manualUrl,
        label: isNext ? "Up Next" : "Current Class"
      });
      setStatusMsg("");
    };

    checkManual();
    const interval = setInterval(checkManual, 60000); 
    return () => clearInterval(interval);
  }, []);

  const menuItems = [
    { id: 'customization', icon: Sliders, label: 'Customization' },
    { id: 'weather', icon: Cloud, label: 'Weather', subLabel: weather ? `${weather.temp}°C` : 'Loading...' },
    { id: 'manuals', icon: Book, label: 'All Textbooks' },
    { id: 'clock', icon: Clock, label: 'Clock' },
    { id: 'todo', icon: List, label: 'My Tasks' },
    { id: 'info', icon: Info, label: 'Info' },
  ];

  const handleItemClick = (id: string) => {
    playSound('switch');
    onOpenOverlay(id);
    setIsOpen(false);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Overlay Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm transition-opacity duration-300" 
          onClick={handleClose} 
        />
      )}

      <div 
        className={`fixed z-[51] bg-[var(--card-bg)] shadow-2xl transition-transform duration-300 ease-out flex flex-col
          sm:top-0 sm:left-0 sm:h-full sm:w-[320px] 
          ${isOpen ? 'sm:translate-x-0' : 'sm:-translate-x-full'}
          
          bottom-0 left-0 w-full h-[85vh] border-t border-[var(--border-color)]
          ${isOpen ? 'translate-y-0' : 'translate-y-full sm:translate-y-0'}
        `}
        // EXEMPTION: Inline styles to override global border-radius forced by App.tsx
        style={{ 
          borderTopRightRadius: window.innerWidth > 640 ? '1.5rem' : '0',
          borderBottomRightRadius: window.innerWidth > 640 ? '1.5rem' : '0',
          borderTopLeftRadius: window.innerWidth <= 640 ? '1.5rem' : '0',
          borderBottomLeftRadius: 0
        }}
      >
        <div className="sm:hidden flex justify-center pt-3 pb-1" onClick={handleClose}>
           <div className="w-12 h-1.5 bg-[var(--border-color)] rounded-full"></div>
        </div>

        <div className="p-6 sm:p-8 border-b border-[var(--border-color)] flex justify-between items-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--accent-color)]">Menu</h1>
          <button onClick={handleClose} className="hidden sm:block p-2 hover:bg-[var(--highlight-color)] rounded-full">
            <ArrowLeft size={24} />
          </button>
          <button onClick={handleClose} className="sm:hidden p-2 hover:bg-[var(--highlight-color)] rounded-full text-[var(--text-color)]">
             <ChevronDown size={24} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => handleItemClick(item.id)}
              className="w-full flex items-center gap-4 p-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-color)] hover:bg-[var(--highlight-color)] transition-all hover:scale-[1.02] active:scale-95 group"
            >
              <div className="p-2 rounded-lg bg-[var(--card-bg)] text-[var(--accent-color)] group-hover:text-[var(--text-color)] transition-colors">
                <item.icon size={24} />
              </div>
              <div className="flex flex-col items-start">
                <span className="font-semibold text-[var(--text-color)]">{item.label}</span>
                {item.subLabel && <span className="text-sm text-[var(--accent-color)] font-bold">{item.subLabel}</span>}
              </div>
            </button>
          ))}
        </div>

        <div className="p-4 border-t border-[var(--border-color)] bg-[var(--highlight-color)]/20 sm:mb-0 pb-8 sm:pb-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-[var(--accent-color)] uppercase tracking-wide flex items-center gap-2">
              <BookOpen size={16} /> Recommended
            </h3>
            {recManual && (
               <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--accent-color)] text-[var(--accent-text-color)] shadow-sm">
                 {recManual.label}
               </span>
            )}
          </div>
          
          <div className="bg-[var(--card-bg)] rounded-xl border border-[var(--border-color)] overflow-hidden shadow-sm hover:shadow-md transition-all group/card">
            {recManual ? (
              recManual.url ? (
                <div className="flex flex-row p-3 gap-3">
                  <div className="w-16 h-24 sm:w-20 sm:h-28 bg-gray-100 rounded-lg overflow-hidden shrink-0 border border-[var(--border-color)] relative">
                     {recManual.image ? (
                        <img src={recManual.image} alt={recManual.title} className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-500" />
                     ) : (
                        <div className="w-full h-full flex items-center justify-center bg-[var(--highlight-color)] text-[var(--accent-color)]">
                          <Book size={24} />
                        </div>
                     )}
                  </div>
                  <div className="flex flex-col justify-between flex-1 py-1">
                    <div>
                      <h4 className="font-bold text-[var(--text-color)] line-clamp-1 text-sm sm:text-base">{recManual.title || recManual.subject}</h4>
                      <p className="text-xs text-[var(--text-color)] opacity-60 line-clamp-2">{recManual.subject}</p>
                    </div>
                    <a 
                      href={recManual.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      onClick={() => playSound('click')}
                      className="mt-2 flex items-center justify-center gap-2 px-3 py-1.5 bg-[var(--accent-color)] text-[var(--accent-text-color)] text-xs font-bold rounded-lg hover:opacity-90 transition-opacity"
                    >
                      <ExternalLink size={14} /> Open
                    </a>
                  </div>
                </div>
              ) : (
                <div className="p-4 text-center flex flex-col items-center">
                   <div className="w-10 h-10 rounded-full bg-[var(--highlight-color)] flex items-center justify-center mb-2 text-[var(--text-color)]">
                     <AlertCircle size={20} />
                   </div>
                   <p className="font-bold text-[var(--text-color)] text-sm">{recManual.subject}</p>
                   <p className="text-[10px] text-[var(--text-color)] opacity-60 mt-1">No manuals available.</p>
                </div>
              )
            ) : (
              <div className="p-6 text-center opacity-60 flex flex-col items-center">
                <Clock size={24} className="mb-2 opacity-50" />
                <p className="text-xs sm:text-sm italic">{statusMsg}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SideMenu;