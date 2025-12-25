import React from 'react';
import { Calendar, Grid, Menu, LucideIcon, List, Cloud, Book, Clock, Settings, Info } from 'lucide-react';
import { ShortcutId, MobileSettings } from '../types';
import { SHORTCUT_OPTIONS } from '../constants';

interface MobileNavbarProps {
  currentView: 'today' | 'full';
  setView: (view: 'today' | 'full') => void;
  onOpenMenu: () => void;
  shortcutIds: { left: ShortcutId; right: ShortcutId };
  onTriggerShortcut: (id: ShortcutId) => void;
  mobileSettings: MobileSettings;
}

const MobileNavbar: React.FC<MobileNavbarProps> = ({ 
  currentView, 
  setView, 
  onOpenMenu, 
  shortcutIds,
  onTriggerShortcut,
  mobileSettings
}) => {
  
  const getIcon = (id: ShortcutId): LucideIcon => {
    const option = SHORTCUT_OPTIONS.find(o => o.id === id);
    if (option) {
       switch(id) {
         case 'todo': return List;
         case 'weather': return Cloud;
         case 'manuals': return Book;
         case 'clock': return Clock;
         default: return Settings;
       }
    }
    return Settings;
  };

  const LeftIcon = getIcon(shortcutIds.left);
  const RightIcon = getIcon(shortcutIds.right);

  // Helper to determine active state style
  const getActiveStyle = (isActive: boolean) => isActive ? 'text-[var(--accent-color)] fill-current' : 'text-[var(--text-color)]/60';
  const getButtonStyle = () => "p-2 transition-colors flex flex-col items-center gap-1 min-w-[64px]";

  return (
    <div className={`pb-safe px-4 z-40 sm:hidden transition-all duration-300 ${mobileSettings.navStyle === 'minimal' ? 'pt-0' : 'pt-2 shadow-[0_-5px_20px_rgba(0,0,0,0.1)]'}`}>
      <div className="flex items-center justify-between h-16 max-w-sm mx-auto">
        
        {/* Left Shortcut */}
        <button 
          onClick={() => onTriggerShortcut(shortcutIds.left)}
          className={`${getButtonStyle()} hover:text-[var(--accent-color)] ${getActiveStyle(false)}`}
        >
          <LeftIcon size={22} strokeWidth={2.5} />
          {mobileSettings.showLabels && <span className="text-[10px] font-bold opacity-70 capitalize">{shortcutIds.left}</span>}
        </button>

        {/* Today Tab */}
        <button 
          onClick={() => setView('today')}
          className={`${getButtonStyle()} ${currentView === 'today' ? 'text-[var(--accent-color)]' : 'text-[var(--text-color)]/60'}`}
        >
          <Calendar size={22} className={currentView === 'today' ? 'fill-current' : ''} strokeWidth={2.5} />
          {mobileSettings.showLabels && <span className="text-[10px] font-bold">Today</span>}
        </button>

        {/* Center Menu Button (Floating vs Normal) */}
        <div className="relative -top-6">
          <button 
            onClick={onOpenMenu}
            className={`w-14 h-14 bg-[var(--accent-color)] text-[var(--accent-text-color)] rounded-full flex items-center justify-center shadow-lg shadow-[var(--accent-color)]/40 active:scale-95 transition-transform ${mobileSettings.navStyle === 'minimal' ? 'ring-4 ring-[var(--bg-color)]' : ''}`}
          >
            <Menu size={26} strokeWidth={3} />
          </button>
        </div>

        {/* Full View Tab */}
        <button 
          onClick={() => setView('full')}
          className={`${getButtonStyle()} ${currentView === 'full' ? 'text-[var(--accent-color)]' : 'text-[var(--text-color)]/60'}`}
        >
          <Grid size={22} className={currentView === 'full' ? 'fill-current' : ''} strokeWidth={2.5} />
          {mobileSettings.showLabels && <span className="text-[10px] font-bold">Full</span>}
        </button>

        {/* Right Shortcut */}
        <button 
           onClick={() => onTriggerShortcut(shortcutIds.right)}
           className={`${getButtonStyle()} hover:text-[var(--accent-color)] ${getActiveStyle(false)}`}
        >
          <RightIcon size={22} strokeWidth={2.5} />
          {mobileSettings.showLabels && <span className="text-[10px] font-bold opacity-70 capitalize">{shortcutIds.right}</span>}
        </button>

      </div>
      {/* Safe Area spacer for iPhone home indicator */}
      {mobileSettings.safeArea && <div className="h-4 w-full"></div>}
    </div>
  );
};

export default MobileNavbar;