
import React, { useState, useRef, useEffect } from 'react';
import { THEMES, SHORTCUT_OPTIONS, PREMADE_PRESETS } from '../../constants';
import { X, Moon, Droplet, Type, Bookmark, Plus, RefreshCw, Smartphone, Download, Upload, ChevronDown, Check, Wrench, MousePointer2, CheckSquare, Trash2, GalleryVerticalEnd, Save, Sliders, Type as TypeIcon, Sun, Layout, Tablet, Search, Bell } from 'lucide-react';
import { ShortcutId, InteractionMode, ThemePreset, ThemeDefinition, UISettings, MobileSettings, AppSettings, FontSettings } from '../../types';
import { useLocalStorage } from '../../hooks/useLocalStorage';

interface CustomizationOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: string;
  setTheme: (theme: string) => void;
  accentColor: string;
  setAccentColor: (color: string) => void;
  fontSettings: FontSettings;
  setFontSettings: (s: FontSettings) => void;
  uiSettings: UISettings;
  setUiSettings: (s: UISettings) => void;
  mobileSettings: MobileSettings;
  setMobileSettings: (s: MobileSettings) => void;
  appSettings: AppSettings;
  setAppSettings: (s: AppSettings) => void;
  interactionMode: InteractionMode;
  setInteractionMode: (mode: InteractionMode) => void;
  playSound: (type: 'click' | 'switch' | 'success') => void;
}

const GOOGLE_FONTS = [
  'Inter', 'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Poppins', 
  'Raleway', 'Ubuntu', 'Nunito', 'Quicksand', 'Outfit', 'DM Sans',
  'Space Grotesk', 'Merriweather', 'Playfair Display', 'JetBrains Mono', 'Fira Code'
];

const PREDEFINED_COLORS = [
  '#ef4444', '#f97316', '#f59e0b', '#84cc16', '#10b981',
  '#06b6d4', '#3b82f6', '#6366f1', '#8b5cf6', '#d946ef', '#f43f5e', '#78716c',
  // New presets
  '#2dd4bf', '#4f46e5', '#e11d48'
];

// Helper: Custom Dropdown
const CustomSelect = ({ value, onChange, options, playSound }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) setIsOpen(false);
    };
    if (isOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => { playSound('click'); setIsOpen(!isOpen); }}
        className={`w-full p-3 rounded-xl bg-[var(--highlight-color)] border transition-all flex items-center justify-between text-left group ${isOpen ? 'border-[var(--accent-color)] ring-2 ring-[var(--accent-color)]/20' : 'border-[var(--border-color)] hover:border-[var(--accent-color)]/50'}`}
      >
        <span className="font-medium text-[var(--text-color)] text-sm">{options.find((o:any) => o.value === value)?.label || value}</span>
        <ChevronDown size={16} className={`text-[var(--text-color)] opacity-50 transition-transform duration-300 ${isOpen ? 'rotate-180 text-[var(--accent-color)] opacity-100' : 'group-hover:opacity-80'}`} />
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 w-full mt-2 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl shadow-xl z-50 max-h-60 overflow-y-auto p-1 animate-fade-in-up">
          {options.map((opt:any) => (
            <button
              key={opt.value}
              onClick={() => { playSound('click'); onChange(opt.value); setIsOpen(false); }}
              className={`w-full p-2.5 rounded-lg text-left flex items-center justify-between transition-colors text-sm ${opt.value === value ? 'bg-[var(--accent-color)] text-[var(--accent-text-color)] font-bold' : 'text-[var(--text-color)] hover:bg-[var(--highlight-color)]'}`}
            >
              <span>{opt.label}</span>
              {opt.value === value && <Check size={14} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Helper: Toggle
const Toggle = ({ checked, onChange, label, description, playSound }: any) => (
  <button 
    onClick={() => { playSound('switch'); onChange(!checked); }}
    className="flex items-center justify-between w-full p-3 rounded-xl bg-[var(--highlight-color)] border border-[var(--border-color)] group hover:bg-[var(--card-bg)] transition-colors"
  >
    <div className="flex flex-col items-start text-left">
      <span className="font-medium text-sm">{label}</span>
      {description && <span className="text-[10px] opacity-60">{description}</span>}
    </div>
    <div className={`w-10 h-5 rounded-full p-0.5 transition-colors relative flex-shrink-0 ${checked ? 'bg-[var(--accent-color)]' : 'bg-gray-300 dark:bg-gray-600'}`}>
      <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
    </div>
  </button>
);

// Helper: Segmented Control
const SegmentedControl = ({ options, value, onChange, playSound }: any) => (
  <div className="flex bg-[var(--highlight-color)] p-1 rounded-xl w-full">
    {options.map((opt:any) => (
      <button
        key={opt.value}
        onClick={() => { playSound('click'); onChange(opt.value); }}
        className={`flex-1 flex items-center justify-center gap-2 py-1.5 px-2 rounded-lg text-xs md:text-sm font-bold transition-all ${value === opt.value ? 'bg-[var(--card-bg)] text-[var(--accent-color)] shadow-sm' : 'text-[var(--text-color)] opacity-60 hover:opacity-100'}`}
      >
        {opt.icon}
        {opt.label}
      </button>
    ))}
  </div>
);

const CustomizationOverlay: React.FC<CustomizationOverlayProps> = ({
  isOpen, onClose, currentTheme, setTheme, accentColor, setAccentColor, 
  fontSettings, setFontSettings, uiSettings, setUiSettings, mobileSettings, setMobileSettings, 
  appSettings, setAppSettings, interactionMode, setInteractionMode, playSound
}) => {
  const [activeTab, setActiveTab] = useState<'theme' | 'color' | 'font' | 'ui' | 'mobile' | 'advanced' | 'presets'>('theme');
  const [hexInput, setHexInput] = useState(accentColor);
  const [customFontInput, setCustomFontInput] = useState('');
  
  const [customColors, setCustomColors] = useLocalStorage<string[]>('custom-accent-colors', []);
  const [savedPresets, setSavedPresets] = useLocalStorage<ThemePreset[]>('saved-presets', []);
  const [presetNameInput, setPresetNameInput] = useState('');
  const [presetTab, setPresetTab] = useState<'my' | 'gallery'>('my');
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 768);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setHexInput(accentColor); }, [accentColor]);
  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth > 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!isOpen) return null;

  const handleTabChange = (tab: any) => {
    playSound('switch');
    setActiveTab(tab);
  };

  const handleThemeChange = (key: string) => {
    playSound('click');
    setTheme(key);
    const themeDef = THEMES[key];
    if (themeDef?.recommendedAccents?.length) setAccentColor(themeDef.recommendedAccents[0]);
  };

  const handleSavePreset = () => {
    if (!presetNameInput.trim()) return;
    playSound('success');
    const savedThemeName = currentTheme === 'auto' ? 'light' : currentTheme;
    const themeDef = THEMES[savedThemeName];
    const newPreset: ThemePreset = {
      id: Date.now().toString(),
      name: presetNameInput,
      theme: savedThemeName,
      accentColor: accentColor,
      font: fontSettings.family,
      emoji: themeDef ? themeDef.emoji : '🎨'
    };
    setSavedPresets([...savedPresets, newPreset]);
    setPresetNameInput('');
  };

  const handleApplyPreset = (preset: ThemePreset) => {
    playSound('click');
    setTheme(preset.theme);
    setAccentColor(preset.accentColor);
    setHexInput(preset.accentColor);
    setFontSettings({...fontSettings, family: preset.font});
  };

  const handleDeletePreset = (id: string) => {
    playSound('click');
    setSavedPresets(savedPresets.filter(p => p.id !== id));
  };
  
  const handleCustomFontChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCustomFontInput(val);
    if(val.length > 2) {
       setFontSettings({...fontSettings, family: `'${val}', sans-serif`});
    }
  };

  const handleRequestNotifications = () => {
     if ("Notification" in window) {
       Notification.requestPermission().then(permission => {
         if (permission === 'granted') {
           playSound('success');
           // Could add a toast here via app, but tricky to pass down
           alert("Notifications enabled!");
         } else {
           alert("Notifications denied or blocked.");
         }
       });
     }
  };

  const fontOptions = GOOGLE_FONTS.map(f => ({ value: f, label: f }));
  const shortcutOptions = SHORTCUT_OPTIONS.map(opt => ({ value: opt.id, label: opt.label }));

  const renderThemeCard = (themeKey: string, def: ThemeDefinition) => (
    <button
      key={themeKey}
      onClick={() => handleThemeChange(themeKey)}
      className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 text-center h-full relative overflow-hidden group ${
        currentTheme === themeKey 
          ? 'border-[var(--accent-color)] bg-[var(--highlight-color)] shadow-lg scale-105' 
          : 'border-[var(--border-color)] bg-[var(--highlight-color)] hover:-translate-y-1'
      }`}
    >
      <div className="text-5xl mb-3 z-10 group-hover:scale-110 transition-transform">{def.emoji}</div>
      <span className="capitalize font-bold text-sm z-10 relative">{def.name}</span>
      <span className="text-[10px] opacity-60 leading-tight z-10 relative">{def.description}</span>
      <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity" style={{ background: def.recommendedAccents?.[0] || def.colors.highlight }}></div>
    </button>
  );

  const lightThemes = Object.entries(THEMES).filter(([_, def]) => def.type === 'light');
  const darkThemes = Object.entries(THEMES).filter(([_, def]) => def.type === 'dark');

  // Collect all unique theme accents for the presets list
  const themeAccents = Array.from(new Set(
    Object.values(THEMES).flatMap(t => t.recommendedAccents)
  ));
  const allPresets = Array.from(new Set([...PREDEFINED_COLORS, ...themeAccents]));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-0 md:p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
      {/* Main Container - Ensuring it has glass effect logic if enabled */}
      <div className="glass-effect w-full h-full md:w-[90%] md:max-w-4xl md:h-[85vh] rounded-none md:rounded-[var(--radius)] shadow-2xl flex flex-col md:flex-row overflow-hidden relative border-none md:border border-[var(--border-color)] animate-fade-in-up">
        
        {/* Standardized Close Button */}
        <button onClick={onClose} className="absolute top-4 right-4 z-50 p-2 rounded-full hover:bg-[var(--highlight-color)] text-[var(--text-color)] transition-all">
          <X size={24} />
        </button>

        {/* Sidebar */}
        <div className="w-full md:w-64 bg-[var(--highlight-color)]/50 backdrop-blur-xl border-b md:border-b-0 md:border-r border-[var(--border-color)] flex flex-col flex-shrink-0">
          <div className="p-6 border-b border-[var(--border-color)]">
            <h2 className="text-xl font-bold text-[var(--accent-color)] flex items-center gap-2">
              <Sliders size={24} /> Customize
            </h2>
          </div>
          <nav className="flex-1 overflow-x-auto md:overflow-y-auto flex md:flex-col scrollbar-hide">
            {[
              { id: 'theme', icon: Moon, label: 'Theme' },
              { id: 'color', icon: Droplet, label: 'Color' },
              { id: 'ui', icon: Layout, label: 'UI' },
              { id: 'font', icon: Type, label: 'Font' },
              { id: 'mobile', icon: Smartphone, label: 'Mobile' },
              { id: 'advanced', icon: Wrench, label: 'Advanced' },
              { id: 'presets', icon: Bookmark, label: 'Presets' }
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => handleTabChange(item.id as any)}
                style={{ borderRadius: 0 }} // Force square corners
                className={`!rounded-none flex-shrink-0 md:w-full flex items-center gap-3 px-6 py-4 text-left transition-all whitespace-nowrap border-b-4 md:border-b-0 md:border-l-4 ${activeTab === item.id ? 'bg-[var(--card-bg)] border-[var(--accent-color)] font-semibold text-[var(--text-color)]' : 'text-[var(--text-color)]/70 hover:bg-[var(--card-bg)] hover:border-[var(--accent-color)]/50 border-transparent'}`}
              >
                <item.icon size={20} className="text-[var(--accent-color)]" />
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex-1 p-8 overflow-y-auto text-[var(--text-color)] pb-24 md:pb-8 bg-[var(--card-bg)]/50">
          {activeTab === 'theme' && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-[var(--accent-color)]">Theme Settings</h3>

              </div>
              <div className="space-y-4">
                 <h4 className="text-sm font-bold uppercase tracking-wider opacity-60 flex items-center gap-2"><Sun size={14}/> Light Modes</h4>
                 <div className="grid grid-cols-2 md:grid-cols-3 gap-4">{lightThemes.map(([key, def]) => renderThemeCard(key, def))}</div>
              </div>
              <div className="space-y-4">
                 <h4 className="text-sm font-bold uppercase tracking-wider opacity-60 flex items-center gap-2"><Moon size={14}/> Dark Modes</h4>
                 <div className="grid grid-cols-2 md:grid-cols-3 gap-4">{darkThemes.map(([key, def]) => renderThemeCard(key, def))}</div>
              </div>
            </div>
          )}

          {activeTab === 'color' && (
            <div className="space-y-8">
              <h3 className="text-2xl font-bold text-[var(--accent-color)]">Accent Color</h3>
              
              <div className="space-y-4">
                <label className="block text-sm font-semibold opacity-70">Custom Color</label>
                <div className="flex items-center gap-4">
                   {/* Color Preview & Picker */}
                   <div className="relative w-16 h-16 rounded-xl overflow-hidden border-2 border-[var(--border-color)] cursor-pointer hover:border-[var(--accent-color)] transition-all shadow-inner shrink-0">
                      <div className="absolute inset-0" style={{ backgroundColor: accentColor }}></div>
                      <input type="color" value={accentColor} onChange={(e) => { setAccentColor(e.target.value); setHexInput(e.target.value); }} className="absolute inset-[-50%] w-[200%] h-[200%] opacity-0 cursor-pointer" />
                   </div>
                   {/* Hex Input */}
                   <div className="flex-1 bg-[var(--highlight-color)] rounded-xl border border-[var(--border-color)] px-4 py-3 font-mono text-center tracking-wider text-lg uppercase flex items-center justify-center">
                     {accentColor}
                   </div>
                   {/* Random Button */}
                   <button onClick={() => { playSound('click'); setAccentColor('#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0')); }} className="p-4 rounded-xl bg-[var(--highlight-color)] border border-[var(--border-color)] hover:bg-[var(--accent-color)] hover:text-[var(--accent-text-color)] transition-all">
                      <RefreshCw size={24} />
                   </button>
                </div>

                <div className="flex items-center justify-between mt-4">
                   <button onClick={() => { playSound('click'); if(!customColors.includes(accentColor)) setCustomColors([...customColors, accentColor]); }} className="w-full py-3 rounded-xl border border-dashed border-[var(--text-color)]/30 hover:border-[var(--accent-color)] hover:text-[var(--accent-color)] hover:bg-[var(--accent-color)]/5 transition-all text-sm font-bold flex items-center justify-center gap-2">
                     <Plus size={16} /> Add current color as preset
                   </button>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-[var(--border-color)]">
                 <label className="block text-sm font-semibold opacity-70">Presets</label>
                 <div className="grid grid-cols-5 md:grid-cols-6 gap-3">
                   {[...allPresets, ...customColors].map((color, idx) => (
                     <button key={`${color}-${idx}`} onClick={() => { playSound('click'); setAccentColor(color); }} className="aspect-square rounded-full border-2 hover:scale-110 transition-transform shadow-sm flex items-center justify-center relative overflow-hidden group" style={{ background: color, borderColor: accentColor === color ? 'var(--text-color)' : 'transparent' }}>
                       {accentColor === color && <Check className="mix-blend-difference text-white" size={20} />}
                       <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                     </button>
                   ))}
                 </div>
              </div>
            </div>
          )}

          {activeTab === 'ui' && (
            <div className="space-y-8">
               <h3 className="text-2xl font-bold text-[var(--accent-color)]">Interface Design</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {/* Moved Typography Controls to UI */}
                 <div className="space-y-2">
                    <label className="block text-xs font-bold opacity-60 uppercase">Size Scaling</label>
                    <SegmentedControl playSound={playSound} value={uiSettings.fontScale} onChange={(val:any) => setUiSettings({...uiSettings, fontScale: val})} options={[{ value: 'small', label: 'Small' }, { value: 'normal', label: 'Normal' }, { value: 'large', label: 'Large' }]} />
                  </div>
                  {/* Removed Letter Spacing from here */}

                 <div className="space-y-2">
                   <label className="block text-xs font-bold opacity-60 uppercase">Border Radius</label>
                   <SegmentedControl playSound={playSound} value={uiSettings.borderRadius} onChange={(val:any) => setUiSettings({...uiSettings, borderRadius: val})} options={[{ value: 'square', label: 'Square' }, { value: 'default', label: 'Default' }, { value: 'round', label: 'Round' }]} />
                 </div>
                 <div className="space-y-2">
                   <label className="block text-xs font-bold opacity-60 uppercase">Table Density</label>
                   <SegmentedControl playSound={playSound} value={uiSettings.tableDensity} onChange={(val:any) => setUiSettings({...uiSettings, tableDensity: val})} options={[{ value: 'compact', label: 'Compact' }, { value: 'normal', label: 'Normal' }, { value: 'spacious', label: 'Spacious' }]} />
                 </div>
                 <div className="space-y-2">
                   <label className="block text-xs font-bold opacity-60 uppercase">Card Elevation</label>
                   <SegmentedControl playSound={playSound} value={uiSettings.cardElevation} onChange={(val:any) => setUiSettings({...uiSettings, cardElevation: val})} options={[{ value: 'flat', label: 'Flat' }, { value: 'low', label: 'Low' }, { value: 'high', label: 'High' }]} />
                 </div>
                 <div className="space-y-2">
                   <label className="block text-xs font-bold opacity-60 uppercase">Texture Overlay</label>
                   <SegmentedControl playSound={playSound} value={uiSettings.texture} onChange={(val:any) => setUiSettings({...uiSettings, texture: val})} options={[{ value: 'none', label: 'None' }, { value: 'noise', label: 'Noise' }, { value: 'dots', label: 'Dots' }, { value: 'grid', label: 'Grid' }]} />
                 </div>
                 <div className="space-y-2 col-span-1 md:col-span-2">
                   <label className="block text-xs font-bold opacity-60 uppercase">Active Class Indicator</label>
                   <SegmentedControl playSound={playSound} value={uiSettings.activeIndicator} onChange={(val:any) => setUiSettings({...uiSettings, activeIndicator: val})} options={[{ value: 'glow', label: 'Glow' }, { value: 'solid', label: 'Solid' }, { value: 'bar', label: 'Bar' }, { value: 'border', label: 'Border' }]} />
                 </div>
                 <div className="space-y-2 col-span-1 md:col-span-2">
                   <label className="block text-xs font-bold opacity-60 uppercase">Marked Cell Style</label>
                   <SegmentedControl playSound={playSound} value={uiSettings.markedIndicator} onChange={(val:any) => setUiSettings({...uiSettings, markedIndicator: val})} options={[{ value: 'solid', label: 'Solid Color' }, { value: 'check', label: 'Checkmark' }, { value: 'strike', label: 'Strikethrough' }, { value: 'dim', label: 'Dimmed' }]} />
                 </div>
               </div>
               <div className="space-y-4 pt-4 border-t border-[var(--border-color)]">
                  <Toggle playSound={playSound} label="Show Top Header" description="Display the large title and clock" checked={uiSettings.showHeader} onChange={(val:any) => setUiSettings({...uiSettings, showHeader: val})} />
                  <Toggle playSound={playSound} label="Glassmorphism Effects" description="Enable blur effects" checked={uiSettings.glassmorphism} onChange={(val:any) => setUiSettings({...uiSettings, glassmorphism: val})} />
               </div>
            </div>
          )}

          {activeTab === 'font' && (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-[var(--accent-color)]">Typography</h3>
              <div className="space-y-5">
                <div className="space-y-2">
                  <label className="block text-xs font-bold opacity-60 uppercase">Font Family</label>
                  <CustomSelect playSound={playSound} value={fontSettings.family.replace(/['"]/g, '').split(',')[0]} onChange={(val:any) => setFontSettings({...fontSettings, family: `'${val}', sans-serif`})} options={fontOptions} />
                </div>
                
                {/* New Custom Font Input */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold opacity-60 uppercase">Custom Google Font</label>
                  <div className="relative">
                    <TypeIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-color)] opacity-50" size={16} />
                    <input 
                      type="text" 
                      placeholder="e.g. Pacifico" 
                      value={customFontInput}
                      onChange={handleCustomFontChange}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-[var(--highlight-color)] border border-[var(--border-color)] focus:border-[var(--accent-color)] outline-none transition-all"
                    />
                  </div>
                  <p className="text-[10px] opacity-60">Type a name from Google Fonts to preview it instantly.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Weight */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold opacity-60 uppercase">Weight</label>
                    <SegmentedControl playSound={playSound} value={fontSettings.weight} onChange={(val:any) => setFontSettings({...fontSettings, weight: val})} options={[{ value: 'normal', label: 'Regular' }, { value: 'medium', label: 'Medium' }, { value: 'bold', label: 'Bold' }]} />
                  </div>
                  
                  {/* New Line Height */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold opacity-60 uppercase">Line Height</label>
                    <SegmentedControl playSound={playSound} value={fontSettings.lineHeight} onChange={(val:any) => setFontSettings({...fontSettings, lineHeight: val})} options={[{ value: 'compact', label: 'Compact' }, { value: 'normal', label: 'Normal' }, { value: 'loose', label: 'Loose' }]} />
                  </div>
                  
                  {/* Moved Letter Spacing to Font Tab */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold opacity-60 uppercase">Letter Spacing</label>
                    <SegmentedControl playSound={playSound} value={fontSettings.letterSpacing} onChange={(val:any) => setFontSettings({...fontSettings, letterSpacing: val})} options={[{ value: 'tighter', label: 'Tight' }, { value: 'normal', label: 'Normal' }, { value: 'wide', label: 'Wide' }]} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'mobile' && (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-[var(--accent-color)]">Mobile Experience</h3>
              {isDesktop ? (
                <div className="flex flex-col items-center justify-center p-8 bg-[var(--highlight-color)]/50 rounded-xl border border-[var(--border-color)] text-center animate-fade-in-up">
                   <div className="w-16 h-16 bg-[var(--card-bg)] rounded-full flex items-center justify-center mb-4 shadow-sm text-[var(--accent-color)]"><Tablet size={32} /></div>
                   <h4 className="text-lg font-bold mb-2">Desktop Detected</h4>
                   <p className="opacity-70 max-w-sm">Mobile settings are best viewed on a smaller screen.</p>
                </div>
              ) : (
                <div className="space-y-6">
                   <div className="space-y-4 pt-4 border-t border-[var(--border-color)]">
                     <div className="space-y-2">
                       <label className="block text-xs font-bold opacity-60 uppercase">Navigation Style</label>
                       <SegmentedControl playSound={playSound} value={mobileSettings.navStyle} onChange={(val:any) => setMobileSettings({...mobileSettings, navStyle: val})} options={[{ value: 'classic', label: 'Classic' }, { value: 'floating', label: 'Floating' }, { value: 'minimal', label: 'Minimal' }]} />
                     </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Toggle playSound={playSound} label="Glass Blur" description="Blur behind navbar" checked={mobileSettings.navbarBlur} onChange={(val:any) => setMobileSettings({...mobileSettings, navbarBlur: val})} />
                    <Toggle playSound={playSound} label="Show Labels" description="Text under icons" checked={mobileSettings.showLabels} onChange={(val:any) => setMobileSettings({...mobileSettings, showLabels: val})} />
                    <Toggle playSound={playSound} label="Haptic Feedback" description="Vibrate on interact" checked={mobileSettings.haptics} onChange={(val:any) => setMobileSettings({...mobileSettings, haptics: val})} />
                    <Toggle playSound={playSound} label="Safe Area Padding" description="Extra bottom space" checked={mobileSettings.safeArea} onChange={(val:any) => setMobileSettings({...mobileSettings, safeArea: val})} />
                    <Toggle playSound={playSound} label="Compact Cards" description="Reduced padding" checked={mobileSettings.compactCards} onChange={(val:any) => setMobileSettings({...mobileSettings, compactCards: val})} />
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'advanced' && (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-[var(--accent-color)]">Advanced Settings</h3>
              <div className="space-y-6">
                
                <div className="p-4 rounded-xl border border-[var(--accent-color)] bg-[var(--accent-color)]/10 flex items-center justify-between">
                   <div className="flex flex-col">
                     <span className="font-bold flex items-center gap-2"><Bell size={16} /> Notifications</span>
                     <span className="text-xs opacity-60">Allow system alerts for task reminders.</span>
                   </div>
                   <button onClick={handleRequestNotifications} className="px-4 py-2 bg-[var(--accent-color)] text-[var(--accent-text-color)] rounded-lg text-xs font-bold">Request</button>
                </div>

                <div className="space-y-4">
                  <label className="block text-sm font-semibold opacity-70">Timetable Interaction</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button onClick={() => { playSound('click'); setInteractionMode('link'); }} className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${interactionMode === 'link' ? 'border-[var(--accent-color)] bg-[var(--accent-color)]/5' : 'border-[var(--border-color)] hover:bg-[var(--highlight-color)]'}`}>
                      <MousePointer2 size={24} className={interactionMode === 'link' ? 'text-[var(--accent-color)]' : 'text-[var(--text-color)] opacity-50'} />
                      <div className="text-center font-bold text-sm">Open Link</div>
                    </button>
                    <button onClick={() => { playSound('click'); setInteractionMode('mark'); }} className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${interactionMode === 'mark' ? 'border-[var(--accent-color)] bg-[var(--accent-color)]/5' : 'border-[var(--border-color)] hover:bg-[var(--highlight-color)]'}`}>
                      <CheckSquare size={24} className={interactionMode === 'mark' ? 'text-[var(--accent-color)]' : 'text-[var(--text-color)] opacity-50'} />
                      <div className="text-center font-bold text-sm">Mark as Done</div>
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-[var(--border-color)]">
                  <Toggle playSound={playSound} label="Time Format" description={appSettings.timeFormat} checked={appSettings.timeFormat === '24h'} onChange={() => setAppSettings({...appSettings, timeFormat: appSettings.timeFormat === '12h' ? '24h' : '12h'})} />
                  <Toggle playSound={playSound} label="Show Seconds" description="In main clock" checked={appSettings.showSeconds} onChange={(val:any) => setAppSettings({...appSettings, showSeconds: val})} />
                  <Toggle playSound={playSound} label="Show Weekends" description="Include Sat/Sun" checked={appSettings.showWeekends} onChange={(val:any) => setAppSettings({...appSettings, showWeekends: val})} />
                  <Toggle playSound={playSound} label="Sound Effects" description="UI sounds" checked={appSettings.soundEffects} onChange={(val:any) => setAppSettings({...appSettings, soundEffects: val})} />
                  <Toggle playSound={playSound} label="Data Saver" description="Reduce API calls" checked={appSettings.dataSaver} onChange={(val:any) => setAppSettings({...appSettings, dataSaver: val})} />
                  <Toggle playSound={playSound} label="Developer Mode" description="Show technical IDs" checked={appSettings.devMode} onChange={(val:any) => setAppSettings({...appSettings, devMode: val})} />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'presets' && (
             <div className="space-y-6">
               <div className="flex gap-4 border-b border-[var(--border-color)] pb-4">
                 <button onClick={() => { playSound('switch'); setPresetTab('my'); }} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-colors ${presetTab === 'my' ? 'bg-[var(--accent-color)] text-[var(--accent-text-color)]' : 'text-[var(--text-color)] hover:bg-[var(--highlight-color)]'}`}><Save size={18} /> My Presets</button>
                 <button onClick={() => { playSound('switch'); setPresetTab('gallery'); }} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition-colors ${presetTab === 'gallery' ? 'bg-[var(--accent-color)] text-[var(--accent-text-color)]' : 'text-[var(--text-color)] hover:bg-[var(--highlight-color)]'}`}><GalleryVerticalEnd size={18} /> Gallery</button>
               </div>
               
               {presetTab === 'my' && (
                 <>
                  <div className="p-4 bg-[var(--highlight-color)]/50 rounded-xl border border-[var(--border-color)]">
                    <h4 className="font-bold mb-2">Save Current Configuration</h4>
                    <div className="flex gap-2">
                      <input type="text" placeholder="Preset Name" value={presetNameInput} onChange={(e) => setPresetNameInput(e.target.value)} className="flex-1 p-3 rounded-xl bg-[var(--card-bg)] border border-[var(--border-color)] outline-none" />
                      <button onClick={handleSavePreset} className="bg-[var(--accent-color)] text-[var(--accent-text-color)] p-3 rounded-xl font-bold">Save</button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {savedPresets.length === 0 ? <div className="col-span-2 text-center py-8 opacity-50">No saved presets yet.</div> : savedPresets.map(preset => (
                        <div key={preset.id} className="p-4 rounded-xl border border-[var(--border-color)] flex justify-between items-center hover:bg-[var(--highlight-color)] transition-colors">
                          <div className="flex items-center gap-3">
                             <div className="w-10 h-10 rounded-full bg-[var(--card-bg)] flex items-center justify-center text-xl border border-[var(--border-color)]">{preset.emoji || '🎨'}</div>
                             <div><div className="font-bold">{preset.name}</div><div className="text-xs opacity-60 capitalize">{preset.theme}</div></div>
                          </div>
                          <div className="flex gap-2">
                            <button onClick={() => handleApplyPreset(preset)} className="p-2 bg-[var(--accent-color)] text-[var(--accent-text-color)] rounded-lg"><Check size={16} /></button>
                            <button onClick={() => handleDeletePreset(preset.id)} className="p-2 text-red-500 hover:bg-red-100 rounded-lg"><Trash2 size={16} /></button>
                          </div>
                        </div>
                      ))}
                  </div>
                 </>
               )}

               {presetTab === 'gallery' && (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {PREMADE_PRESETS.map(preset => (
                        <div key={preset.id} className="p-4 rounded-xl border border-[var(--border-color)] flex justify-between items-center hover:bg-[var(--highlight-color)] transition-colors">
                          <div className="flex items-center gap-3">
                             <div className="w-10 h-10 rounded-full bg-[var(--card-bg)] flex items-center justify-center text-xl border border-[var(--border-color)]">{preset.emoji}</div>
                             <div><div className="font-bold">{preset.name}</div><div className="text-xs opacity-60 capitalize">{preset.theme}</div></div>
                          </div>
                          <button onClick={() => handleApplyPreset(preset)} className="px-4 py-2 bg-[var(--card-bg)] border border-[var(--border-color)] hover:bg-[var(--accent-color)] hover:text-[var(--accent-text-color)] rounded-lg font-bold text-sm transition-colors">Apply</button>
                        </div>
                    ))}
                 </div>
               )}
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomizationOverlay;
