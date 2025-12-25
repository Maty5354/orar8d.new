import React from 'react';
import { WeatherData } from '../../types';
import { X, Wind, Droplets, Thermometer, Sun, Moon, ArrowDown, ArrowUp, Menu } from 'lucide-react';

interface WeatherOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  weather: WeatherData | null;
  playSound: (type: 'click') => void;
}

const WeatherOverlay: React.FC<WeatherOverlayProps> = ({ isOpen, onClose, weather, playSound }) => {
  if (!isOpen || !weather) return null;

  const getWeatherIcon = (code: number) => {
    if (code <= 3) return '☀️';
    if (code <= 50) return '⛅';
    if (code >= 95) return '⚡';
    if (code >= 70) return '❄️';
    return '🌧️';
  };

  const getHourlyIcon = (code: number) => {
     if (code <= 1) return <Sun size={20} className="text-yellow-500" />;
     if (code <= 3) return <CloudIcon className="text-gray-400" />;
     if (code >= 95) return <CloudLightningIcon className="text-purple-500" />;
     if (code >= 70) return <SnowflakeIcon className="text-blue-300" />;
     return <CloudRainIcon className="text-blue-500" />;
  };

  const CloudIcon = ({className}: {className?: string}) => (
    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M17.5 19c0-1.7-1.3-3-3-3h-11a4 4 0 0 1-1.1-7.9 4 4 0 0 1 5-3.1 4 4 0 0 1 7.1 2.3 3 3 0 0 1 3 8.7z"></path></svg>
  );
  const CloudRainIcon = ({className}: {className?: string}) => (
    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M16 13v8"></path><path d="M8 13v8"></path><path d="M12 15v8"></path><path d="M20 16.58A5 5 0 0 0 18 7h-1.26A8 8 0 1 0 4 15.25"></path></svg>
  );
  const CloudLightningIcon = ({className}: {className?: string}) => (
    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M19 16.9A5 5 0 0 0 18 7h-1.26a8 8 0 1 0-11.62 9"></path><polyline points="13 11 9 17 15 17 11 23"></polyline></svg>
  );
  const SnowflakeIcon = ({className}: {className?: string}) => (
    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="2" y1="2" x2="22" y2="22"></line><line x1="12" y1="2" x2="12" y2="22"></line><line x1="2" y1="12" x2="22" y2="12"></line><line x1="2" y1="22" x2="22" y2="2"></line></svg>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-0 md:p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-[var(--card-bg)] w-full h-full md:w-full md:max-w-2xl md:h-auto md:min-h-[600px] rounded-none md:rounded-3xl shadow-2xl flex flex-col relative overflow-hidden border-none md:border border-[var(--border-color)]">
        
        <div className="p-6 flex justify-between items-start">
           <div>
             <h2 className="text-xl font-bold text-[var(--accent-color)] flex items-center gap-2">
               <MapPinIcon /> {weather.location}
             </h2>
             <p className="text-[var(--text-color)] opacity-60 text-sm">
               {new Date().toLocaleDateString(undefined, {weekday: 'long', day: 'numeric', month: 'long'})}
             </p>
           </div>
           <button 
             onClick={onClose} 
             className="p-2 rounded-full hover:bg-[var(--highlight-color)] text-[var(--text-color)]"
           >
             <X size={24} />
           </button>
        </div>

        <div className="flex flex-col items-center justify-center p-4">
           <div className="text-[8rem] md:text-[10rem] leading-none animate-bounce-slow" onClick={() => playSound('click')}>
             {getWeatherIcon(weather.weatherCode)}
           </div>
           <div className="text-[4rem] md:text-[5rem] font-bold text-[var(--text-color)] leading-none mt-2">
             {weather.temp}°
           </div>
           <div className="text-xl md:text-2xl text-[var(--accent-color)] font-medium mt-2 capitalize">
             {weather.description}
           </div>
           <div className="flex gap-4 mt-2 text-sm opacity-60">
             <span>H: {Math.round(weather.temp + 4)}°</span>
             <span>L: {Math.round(weather.temp - 4)}°</span>
           </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 mx-4 bg-[var(--highlight-color)]/30 rounded-2xl border border-[var(--border-color)]">
           <DetailItem icon={<Droplets size={20} className="text-blue-500"/>} label="Humidity" value={`${weather.humidity}%`} />
           <DetailItem icon={<Wind size={20} className="text-gray-500"/>} label="Wind" value={`${weather.windSpeed} km/h`} />
           <DetailItem icon={<Thermometer size={20} className="text-red-500"/>} label="Feels Like" value={`${weather.feelsLike}°`} />
           <DetailItem icon={<Sun size={20} className="text-orange-500"/>} label="Sunrise" value={weather.sunrise} />
        </div>

        <div className="p-6 flex-1 flex flex-col justify-end">
          <h3 className="text-sm font-bold text-[var(--text-color)] opacity-50 mb-4 uppercase tracking-wider">Hourly Forecast</h3>
          <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide">
            {weather.hourly.map((hour, index) => {
              const date = new Date(hour.time);
              const isNow = index === 0;
              return (
                <div key={index} className={`flex flex-col items-center min-w-[60px] p-3 rounded-xl border ${isNow ? 'bg-[var(--accent-color)] text-[var(--accent-text-color)] border-transparent' : 'bg-[var(--card-bg)] border-[var(--border-color)]'}`}>
                  <span className="text-xs font-bold mb-2">
                    {isNow ? 'Now' : date.getHours().toString().padStart(2, '0')}
                  </span>
                  <div className="mb-2">
                    {getHourlyIcon(hour.code)}
                  </div>
                  <span className="font-bold">{Math.round(hour.temp)}°</span>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};

const DetailItem = ({icon, label, value}: {icon: React.ReactNode, label: string, value: string}) => (
  <div className="flex flex-col items-center justify-center p-2">
    <div className="mb-1">{icon}</div>
    <div className="text-xs opacity-60 uppercase">{label}</div>
    <div className="font-bold">{value}</div>
  </div>
);

const MapPinIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
);

export default WeatherOverlay;