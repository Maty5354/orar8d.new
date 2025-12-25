

import React, { useState, useEffect } from 'react';
import Timetable from './components/Timetable';
import SideMenu from './components/SideMenu';
import CustomizationOverlay from './components/overlays/CustomizationOverlay';
import TodoOverlay from './components/overlays/TodoOverlay';
import ManualsOverlay from './components/overlays/ManualsOverlay';
import ClockOverlay from './components/overlays/ClockOverlay';
import WeatherOverlay from './components/overlays/WeatherOverlay';
import InfoOverlay from './components/overlays/InfoOverlay';
import MobileNavbar from './components/MobileNavbar';
import TodayView from './components/TodayView';
import { THEMES, DEFAULT_THEME, DEFAULT_FOLDERS } from './constants';
import { useLocalStorage } from './hooks/useLocalStorage';
import { WeatherData, InteractionMode, UISettings, MobileSettings, AppSettings, FontSettings, Task, ToastNotification, Folder } from './types';
import { Menu, CheckCircle, AlertTriangle, Info as InfoIcon } from 'lucide-react';

function App() {
  // --- THEME & APPEARANCE ---
  const [themeName, setThemeName] = useLocalStorage<string>('themeName', DEFAULT_THEME.theme);
  const [accentColor, setAccentColor] = useLocalStorage<string>('accentColor', DEFAULT_THEME.accentColor);
  
  // --- SETTINGS GROUPS ---
  const [fontSettings, setFontSettings] = useLocalStorage<FontSettings>('fontSettings', {
    family: DEFAULT_THEME.font,
    weight: 'normal',
    lineHeight: 'normal',
    letterSpacing: 'normal'
  });

  const [uiSettings, setUiSettings] = useLocalStorage<UISettings>('uiSettings', {
    borderRadius: 'default',
    tableDensity: 'normal',
    fontScale: 'normal',
    showHeader: true,
    glassmorphism: true,
    cardElevation: 'low',
    activeIndicator: 'glow',
    markedIndicator: 'solid',
    texture: 'none'
  });

  const [mobileSettings, setMobileSettings] = useLocalStorage<MobileSettings>('mobileSettings', {
    shortcuts: { left: 'todo', right: 'weather' },
    navbarBlur: true,
    navStyle: 'classic',
    showLabels: true,
    haptics: true,
    safeArea: true,
    compactCards: false
  });

  const [appSettings, setAppSettings] = useLocalStorage<AppSettings>('appSettings', {
    timeFormat: '24h',
    showSeconds: false,
    animationSpeed: 'normal',
    showWeekends: false,
    dataSaver: false,
    soundEffects: false,
    devMode: false
  });
  
  // --- FEATURES ---
  const [interactionMode, setInteractionMode] = useLocalStorage<InteractionMode>('interactionMode', 'link');
  const [markedCells, setMarkedCells] = useLocalStorage<string[]>('markedCells', []);
  const [tasks, setTasks] = useLocalStorage<Task[]>('tasks', []);
  const [folders, setFolders] = useLocalStorage<Folder[]>('folders', DEFAULT_FOLDERS);

  const [activeOverlay, setActiveOverlay] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  
  // Mobile Navigation State
  const [mobileView, setMobileView] = useState<'today' | 'full'>('today');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // --- GLOBAL TOASTS & NOTIFICATIONS ---
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  const addToast = (title: string, message: string, type: ToastNotification['type'] = 'info') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  useEffect(() => {
    // Request permission on load if possible
    if ("Notification" in window && Notification.permission === 'default') {
       // Notification.requestPermission(); // Don't auto spam, let user enable in settings or on first task reminder
    }

    const checkReminders = setInterval(() => {
      const now = new Date();
      setTasks(prevTasks => {
        let hasChanges = false;
        const updatedTasks = prevTasks.map(task => {
          if (!task.completed && task.dueDate && !task.notified) {
            const due = new Date(task.dueDate);
            const diff = due.getTime() - now.getTime();
            const reminderTime = (task.reminderMinutesBefore || 15) * 60 * 1000;
            
            // If within reminder window (e.g., 15 mins before due) AND not overdue by more than an hour (to prevent old spam)
            if (task.reminderEnabled && diff > 0 && diff <= reminderTime) {
              
              if ("Notification" in window && Notification.permission === "granted") {
                try {
                  new Notification(`Task Due Soon: ${task.text}`, { 
                    body: `Due in ${Math.ceil(diff / 60000)} mins`, 
                    icon: "/favicon.ico", 
                    tag: task.id 
                  });
                } catch (e) { console.error("Notification failed", e); }
              }
              
              addToast('Reminder', `"${task.text}" is due soon!`, 'warning');
              playSoundEffect('mark'); 
              
              hasChanges = true;
              return { ...task, notified: true };
            }
          }
          return task;
        });
        return hasChanges ? updatedTasks : prevTasks;
      });
    }, 30000); // Check every 30s

    return () => clearInterval(checkReminders);
  }, []);

  // --- AUDIO ENGINE ---
  const playSoundEffect = (type: 'click' | 'mark' | 'open' | 'close' | 'success' | 'switch') => {
    if (!appSettings.soundEffects) return;
    
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    const now = ctx.currentTime;

    switch (type) {
      case 'click': // Sharp tick
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(1200, now + 0.05);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
        break;

      case 'switch': // Soft blip for tabs
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, now);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
        break;

      case 'open': // Woosh up
        osc.type = 'sine';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.exponentialRampToValueAtTime(600, now + 0.2);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
        break;

      case 'close': // Woosh down
        osc.type = 'sine';
        osc.frequency.setValueAtTime(500, now);
        osc.frequency.exponentialRampToValueAtTime(200, now + 0.15);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.linearRampToValueAtTime(0, now + 0.15);
        osc.start(now);
        osc.stop(now + 0.15);
        break;

      case 'success': // Happy ding
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(500, now);
        osc.frequency.setValueAtTime(800, now + 0.1);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.linearRampToValueAtTime(0.05, now + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
        osc.start(now);
        osc.stop(now + 0.4);
        break;

      case 'mark': // Simple toggle
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(400, now);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.1);
        break;
    }
  };

  const handleOpenOverlay = (id: string) => {
    playSoundEffect('open');
    setActiveOverlay(id);
  };

  const handleCloseOverlay = () => {
    playSoundEffect('close');
    setActiveOverlay(null);
  };

  // Helper for contrast
  const getContrastYIQ = (hexcolor: string) => {
    try {
      hexcolor = hexcolor.replace("#", "");
      var r = parseInt(hexcolor.substr(0, 2), 16);
      var g = parseInt(hexcolor.substr(2, 2), 16);
      var b = parseInt(hexcolor.substr(4, 2), 16);
      var yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
      return yiq >= 128 ? '#111827' : '#ffffff';
    } catch (e) {
      return '#ffffff';
    }
  }

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '255, 255, 255';
  }

  // --- EFFECT: Apply Global CSS Variables ---
  useEffect(() => {
    const root = document.documentElement;
    
    // 1. Theme Colors
    let activeThemeKey = themeName;
    if (themeName === 'auto') {
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      activeThemeKey = systemPrefersDark ? 'dark' : 'light';
    }
    const themeDef = THEMES[activeThemeKey as keyof typeof THEMES] || THEMES.light;
    const themeColors = themeDef.colors;
    
    root.style.setProperty('--bg-color', themeColors.bg);
    root.style.setProperty('--card-bg', themeColors.card);
    root.style.setProperty('--card-bg-rgb', hexToRgb(themeColors.card)); // RGB for opacity
    root.style.setProperty('--text-color', themeColors.text);
    root.style.setProperty('--border-color', themeColors.border);
    root.style.setProperty('--highlight-color', themeColors.highlight);
    root.style.setProperty('--accent-color', accentColor);
    root.style.setProperty('--accent-text-color', getContrastYIQ(accentColor));
    
    // 2. Font Settings
    const fontName = fontSettings.family.replace(/['"]/g, '').split(',')[0].trim();
    document.body.style.fontFamily = `"${fontName}", sans-serif`;

    const linkId = 'dynamic-google-font';
    let linkElement = document.getElementById(linkId) as HTMLLinkElement;
    if (!linkElement) {
      linkElement = document.createElement('link');
      linkElement.id = linkId;
      linkElement.rel = 'stylesheet';
      document.head.appendChild(linkElement);
    }
    if (fontName !== 'sans-serif' && fontName !== 'serif' && fontName !== 'monospace') {
      linkElement.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(/ /g, '+')}:wght@300;400;600;800&display=swap`;
    }
    
    const weightMap = { normal: '400', medium: '600', bold: '800' };
    root.style.setProperty('--font-weight-body', weightMap[fontSettings.weight]);
    
    const lsMap = { tighter: '-0.03em', normal: '0', wide: '0.05em' };
    root.style.setProperty('--letter-spacing', lsMap[fontSettings.letterSpacing]);

    const lhMap = { compact: '1.2', normal: '1.5', loose: '1.8' };
    root.style.setProperty('--line-height', lhMap[fontSettings.lineHeight]);

    let scale = '100%';
    if (uiSettings.fontScale === 'small') scale = '90%';
    if (uiSettings.fontScale === 'large') scale = '110%';
    root.style.fontSize = scale;

    // 3. UI Settings - Radius
    let radiusVal = '0.75rem';
    if (uiSettings.borderRadius === 'square') radiusVal = '0px';
    if (uiSettings.borderRadius === 'round') radiusVal = '1.75rem';
    root.style.setProperty('--radius', radiusVal);
    
    // Table Density
    let cellPadding = '1rem';
    if (uiSettings.tableDensity === 'compact') cellPadding = '0.5rem';
    if (uiSettings.tableDensity === 'spacious') cellPadding = '1.5rem';
    root.style.setProperty('--cell-padding', cellPadding);

    // Card Elevation
    const shadowMap = {
      flat: 'none',
      low: '0 1px 3px 0 rgb(0 0 0 / 0.1)',
      medium: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      high: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)'
    };
    root.style.setProperty('--card-shadow', shadowMap[uiSettings.cardElevation]);

    // Texture Overlay
    let textureUrl = 'none';
    let textureOpacity = '0';
    if (uiSettings.texture === 'noise') {
      textureUrl = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='1'/%3E%3C/svg%3E")`;
      textureOpacity = '0.15'; 
    } else if (uiSettings.texture === 'dots') {
      textureUrl = `url("data:image/svg+xml,%3Csvg width='12' height='12' viewBox='0 0 12 12' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%239C92AC' fill-opacity='0.4' fill-rule='evenodd'%3E%3Ccircle cx='2' cy='2' r='1'/%3E%3C/g%3E%3C/svg%3E")`;
      textureOpacity = '0.5';
    } else if (uiSettings.texture === 'grid') {
      textureUrl = `url("data:image/svg+xml,%3Csvg width='24' height='24' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cpath d='M0 24L24 0H12L0 12M24 24V12L12 24' stroke='%239C92AC' stroke-width='1' stroke-opacity='0.4'/%3E%3C/g%3E%3C/svg%3E")`;
      textureOpacity = '0.3';
    }
    root.style.setProperty('--texture-url', textureUrl);
    root.style.setProperty('--texture-opacity', textureOpacity);

    // Animation Speed
    const animMap = { instant: '0s', fast: '0.15s', normal: '0.3s', slow: '0.6s' };
    root.style.setProperty('--transition-speed', animMap[appSettings.animationSpeed]);

    // Favicon
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.beginPath();
      ctx.arc(16, 16, 16, 0, 2 * Math.PI);
      ctx.fillStyle = accentColor;
      ctx.fill();
      const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement || document.createElement('link');
      link.rel = 'icon';
      link.href = canvas.toDataURL();
      document.head.appendChild(link);
    }
  }, [themeName, accentColor, fontSettings, uiSettings, appSettings]);

  // Weather API
  useEffect(() => {
    if (appSettings.dataSaver) return; 

    const fetchWeather = async (lat: number, lng: number, locationName?: string) => {
      setWeatherLoading(true);
      try {
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,weather_code,relative_humidity_2m,apparent_temperature,wind_speed_10m&hourly=temperature_2m,weather_code&daily=sunrise,sunset&timezone=auto&forecast_days=2`
        );
        const data = await response.json();
        
        const getWmoDescription = (code: number) => {
           if(code < 3) return "Clear"; if(code < 50) return "Cloudy"; if(code < 80) return "Rain"; return "Storm";
        };
        const currentHourIndex = new Date().getHours();
        const hourlyData = data.hourly.time.slice(currentHourIndex, currentHourIndex + 24).map((time: string, index: number) => ({
          time: time,
          temp: data.hourly.temperature_2m[currentHourIndex + index],
          code: data.hourly.weather_code[currentHourIndex + index]
        }));
        setWeather({
          temp: Math.round(data.current.temperature_2m),
          weatherCode: data.current.weather_code,
          description: getWmoDescription(data.current.weather_code),
          location: locationName || "Local Weather",
          sunrise: data.daily.sunrise[0].split('T')[1],
          sunset: data.daily.sunset[0].split('T')[1],
          humidity: data.current.relative_humidity_2m,
          windSpeed: data.current.wind_speed_10m,
          feelsLike: data.current.apparent_temperature,
          hourly: hourlyData
        });
      } catch (error) {
        console.error("Weather fetch failed:", error);
      } finally {
        setWeatherLoading(false);
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeather(position.coords.latitude, position.coords.longitude, "Current Location");
        },
        () => {
          fetchWeather(44.4268, 26.1025, "Bucharest");
        }
      );
    } else {
       fetchWeather(44.4268, 26.1025, "Bucharest");
    }
  }, [appSettings.dataSaver]);

  // Timetable Ticks
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleMarkedCell = (id: string) => {
    playSoundEffect('mark');
    if (markedCells.includes(id)) {
      setMarkedCells(markedCells.filter(c => c !== id));
    } else {
      setMarkedCells([...markedCells, id]);
    }
    if (mobileSettings.haptics && navigator.vibrate) {
       navigator.vibrate(10);
    }
  };

  const handleShortcutTrigger = (id: string) => {
    handleOpenOverlay(id);
    if (mobileSettings.haptics && navigator.vibrate) navigator.vibrate(10);
  }

  // Dynamic Styles Injection
  const dynamicStyles = `
    /* Enforce Border Radius on generic elements */
    .rounded-xl, .rounded-2xl, .rounded-lg, .rounded-md, .rounded-sm, .rounded, input, .rounded-3xl { 
        border-radius: var(--radius) !important; 
    }
    
    td { padding: var(--cell-padding) !important; }
    
    body { 
        letter-spacing: var(--letter-spacing); 
        line-height: var(--line-height);
        font-weight: var(--font-weight-body);
    }

    /* Fixed texture z-index and pointer events */
    body::before {
      content: "";
      position: fixed;
      top: 0; left: 0; width: 100%; height: 100%;
      background-image: var(--texture-url);
      opacity: var(--texture-opacity);
      pointer-events: none;
      z-index: 10000;
      mix-blend-mode: overlay;
    }

    /* Properly use RGBA for glass effect to work on any theme color */
    .glass-effect {
      ${uiSettings.glassmorphism 
        ? 'backdrop-filter: blur(16px); background-color: rgba(var(--card-bg-rgb), 0.85);' 
        : 'background-color: var(--card-bg);'}
    }

    .shadow-sm, .shadow-md, .shadow-lg, .shadow-xl, .shadow-2xl {
       box-shadow: var(--card-shadow) !important;
    }

    * { transition-duration: var(--transition-speed) !important; }
    
    .mobile-nav-blur { 
       backdrop-filter: ${mobileSettings.navbarBlur ? 'blur(24px)' : 'none'} !important; 
       background-color: ${mobileSettings.navbarBlur ? 'rgba(var(--card-bg-rgb), 0.9)' : 'var(--card-bg)'} !important; 
    }
    
    ${mobileSettings.navStyle === 'floating' ? `
       .mobile-nav-container { 
         margin: 1rem; 
         border-radius: 9999px !important; 
         bottom: 1.5rem !important; 
         width: auto !important; 
         left: 1rem; right: 1rem;
         border: 1px solid var(--border-color);
         box-shadow: 0 10px 40px -10px rgba(0,0,0,0.3) !important;
         background-color: rgba(var(--card-bg-rgb), 0.85) !important;
         backdrop-filter: blur(20px) !important;
       }
       .mobile-nav-container .mobile-nav-blur { display: none; }
    ` : ''}

    ${mobileSettings.navStyle === 'minimal' ? `
       .mobile-nav-container { border-top: none !important; box-shadow: none !important; background: transparent !important; backdrop-filter: none !important; }
       .mobile-nav-container > div { background: var(--card-bg); border-radius: 2rem; padding: 0.5rem; border: 1px solid var(--border-color); box-shadow: var(--card-shadow); }
    ` : ''}
  `;

  return (
    <div className="min-h-screen w-full transition-colors duration-300 relative pb-24 sm:pb-0 selection:bg-[var(--accent-color)] selection:text-[var(--accent-text-color)]">
      <style>{dynamicStyles}</style>

      {/* Global Toasts */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 w-[90%] md:w-auto pointer-events-none">
          {toasts.map(toast => (
            <div key={toast.id} className="pointer-events-auto flex items-center gap-3 bg-[var(--card-bg)] border border-[var(--accent-color)] text-[var(--text-color)] px-4 py-3 rounded-xl shadow-lg animate-fade-in-down">
              {toast.type === 'success' && <CheckCircle size={18} className="text-green-500" />}
              {toast.type === 'warning' && <AlertTriangle size={18} className="text-orange-500" />}
              {toast.type === 'info' && <InfoIcon size={18} className="text-[var(--accent-color)]" />}
              <div>
                <div className="font-bold text-sm">{toast.title}</div>
                <div className="text-xs opacity-70">{toast.message}</div>
              </div>
            </div>
          ))}
      </div>

      {/* Desktop Menu Trigger */}
      <button 
        onClick={() => { playSoundEffect('open'); setIsMenuOpen(true); }}
        className="hidden sm:block fixed top-4 left-4 z-40 p-3 bg-[var(--card-bg)] rounded-xl shadow-lg border border-[var(--border-color)] text-[var(--accent-color)] transition-all hover:bg-[var(--highlight-color)]"
      >
        <Menu size={24} />
      </button>

      {/* Top Header */}
      {uiSettings.showHeader && (
        <div className="pt-8 pb-8 md:pb-12 px-4 flex justify-center">
          <div className="glass-effect border border-[var(--border-color)]/50 shadow-2xl rounded-full px-6 py-3 md:px-8 md:py-4 flex items-center gap-4 md:gap-6 animate-fade-in-down">
            <h1 className="text-2xl md:text-5xl font-extrabold text-[var(--accent-color)] tracking-tight">
              Orar 8D
            </h1>
            <div className="hidden md:block w-px h-12 bg-[var(--border-color)]"></div>
            <div className="text-sm md:text-2xl font-mono font-bold text-[var(--text-color)] tabular-nums">
              {currentTime.toLocaleTimeString([], {
                hour: '2-digit', 
                minute:'2-digit', 
                second: appSettings.showSeconds ? '2-digit' : undefined,
                hour12: appSettings.timeFormat === '12h'
              })}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className={`container mx-auto px-4 max-w-[1600px] ${!uiSettings.showHeader ? 'pt-8' : ''}`}>
        
        {/* Desktop View */}
        <div className="hidden sm:block">
          <Timetable 
            interactionMode={interactionMode}
            markedCells={markedCells}
            onToggleMark={toggleMarkedCell}
            uiSettings={uiSettings}
            appSettings={appSettings}
          />
        </div>

        {/* Mobile View */}
        <div className="sm:hidden">
          {mobileView === 'today' ? (
            <TodayView />
          ) : (
            <Timetable 
              interactionMode={interactionMode}
              markedCells={markedCells}
              onToggleMark={toggleMarkedCell}
              uiSettings={uiSettings}
              appSettings={appSettings}
            />
          )}
        </div>
      </div>

      {/* Mobile Navbar */}
      <div className="mobile-nav-container fixed bottom-0 left-0 w-full z-40 transition-all duration-300">
        <div className="mobile-nav-blur w-full h-full absolute inset-0 -z-10"></div>
        <MobileNavbar 
          currentView={mobileView}
          setView={(v) => { playSoundEffect('switch'); setMobileView(v); }}
          onOpenMenu={() => { playSoundEffect('open'); setIsMenuOpen(true); }}
          shortcutIds={mobileSettings.shortcuts}
          onTriggerShortcut={handleShortcutTrigger}
          mobileSettings={mobileSettings}
        />
      </div>

      {/* Side Menu */}
      <SideMenu 
        isOpen={isMenuOpen} 
        setIsOpen={(v) => { if(!v) playSoundEffect('close'); setIsMenuOpen(v); }} 
        onOpenOverlay={handleOpenOverlay} 
        weather={weather} 
        playSound={playSoundEffect}
      />

      {/* Overlays - Passing playSound to all */}
      <CustomizationOverlay 
        isOpen={activeOverlay === 'customization'} 
        onClose={handleCloseOverlay}
        currentTheme={themeName}
        setTheme={setThemeName}
        accentColor={accentColor}
        setAccentColor={setAccentColor}
        fontSettings={fontSettings}
        setFontSettings={setFontSettings}
        uiSettings={uiSettings}
        setUiSettings={setUiSettings}
        mobileSettings={mobileSettings}
        setMobileSettings={setMobileSettings}
        appSettings={appSettings}
        setAppSettings={setAppSettings}
        interactionMode={interactionMode}
        setInteractionMode={setInteractionMode}
        playSound={playSoundEffect}
      />
      
      <TodoOverlay 
        isOpen={activeOverlay === 'todo'} 
        onClose={handleCloseOverlay} 
        playSound={playSoundEffect}
        tasks={tasks}
        setTasks={setTasks}
        folders={folders}
        setFolders={setFolders}
        addToast={addToast}
      />
      <ManualsOverlay 
        isOpen={activeOverlay === 'manuals'} 
        onClose={handleCloseOverlay} 
        playSound={playSoundEffect}
      />
      <ClockOverlay 
        isOpen={activeOverlay === 'clock'} 
        onClose={handleCloseOverlay} 
        playSound={playSoundEffect}
      />
      <WeatherOverlay 
        isOpen={activeOverlay === 'weather'} 
        onClose={handleCloseOverlay} 
        weather={weather} 
        playSound={playSoundEffect}
      />
      <InfoOverlay 
        isOpen={activeOverlay === 'info'} 
        onClose={handleCloseOverlay} 
        playSound={playSoundEffect}
      />
    </div>
  );
}

export default App;
