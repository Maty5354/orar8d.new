import React, { useEffect, useState } from 'react';
import { SCHEDULE_DATA } from '../constants';
import { ScheduleItem } from '../types';
import { Calendar, Clock, BookOpen } from 'lucide-react';

const TodayView: React.FC = () => {
  const [currentDay, setCurrentDay] = useState(new Date().getDay());
  const [currentHour, setCurrentHour] = useState(new Date().getHours());

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentDay(now.getDay());
      setCurrentHour(now.getHours());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Adjust currentDay to 0-indexed for array access (Monday is index 0 in days array)
  // getDay() returns 0 for Sunday, 1 for Monday.
  // Our data: index 0 = Monday.
  const dayIndex = currentDay - 1;
  const isWeekend = dayIndex < 0 || dayIndex > 4;

  const todayClasses = SCHEDULE_DATA.map(row => ({
    time: row.time,
    item: row.days[dayIndex]
  })).filter(slot => slot.item !== null);

  const handleCardClick = (item: ScheduleItem) => {
    if (item.manualUrl) {
      window.open(item.manualUrl, '_blank');
    }
  };

  if (isWeekend) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center p-6 animate-fade-in-up">
        <div className="bg-[var(--highlight-color)] p-8 rounded-full mb-6">
          <Calendar size={64} className="text-[var(--accent-color)]" />
        </div>
        <h2 className="text-2xl font-bold text-[var(--text-color)] mb-2">It's the Weekend!</h2>
        <p className="text-[var(--text-color)] opacity-60">No classes today. Relax and recharge.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-24 animate-fade-in-up">
      <div className="flex items-center gap-2 mb-6 px-2">
         <div className="w-1 h-8 bg-[var(--accent-color)] rounded-full"></div>
         <h2 className="text-2xl font-bold text-[var(--text-color)]">Today's Schedule</h2>
      </div>

      {todayClasses.length === 0 ? (
         <div className="p-8 text-center border border-[var(--border-color)] rounded-2xl bg-[var(--card-bg)]">
            <p className="opacity-60">No classes scheduled for today.</p>
         </div>
      ) : (
        todayClasses.map((slot, index) => {
          if (!slot.item) return null;
          
          const rowHour = parseInt(slot.time.split(':')[0]);
          const isCurrent = currentHour === rowHour;
          const isPast = currentHour > rowHour;

          return (
            <div 
              key={index}
              onClick={() => slot.item && handleCardClick(slot.item)}
              className={`relative flex items-center gap-4 p-5 rounded-2xl border transition-all duration-300 ${
                isCurrent 
                  ? 'bg-[var(--card-bg)] border-[var(--accent-color)] shadow-[0_0_20px_var(--accent-color)]/20 scale-[1.02] z-10' 
                  : 'bg-[var(--card-bg)] border-[var(--border-color)] hover:border-[var(--accent-color)]/50'
              } ${isPast ? 'opacity-60 grayscale-[0.5]' : ''}`}
            >
              {/* Time Column */}
              <div className="flex flex-col items-center min-w-[60px] border-r border-[var(--border-color)] pr-4">
                <span className={`text-lg font-bold ${isCurrent ? 'text-[var(--accent-color)]' : 'text-[var(--text-color)]'}`}>
                  {slot.time}
                </span>
                <Clock size={14} className="opacity-40 mt-1" />
              </div>

              {/* Content */}
              <div className="flex-1 pl-2">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-xl font-bold text-[var(--text-color)]">{slot.item.subject}</h3>
                  <span className="text-2xl">{slot.item.icon}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  {slot.item.flag && (
                     <img src={`https://flagcdn.com/24x18/${slot.item.flag}.png`} alt="flag" className="h-3 rounded-sm opacity-80" />
                  )}
                  {slot.item.manualUrl && (
                    <div className="flex items-center gap-1 text-xs text-[var(--accent-color)] font-medium bg-[var(--highlight-color)] px-2 py-1 rounded-full">
                      <BookOpen size={10} />
                      <span>Textbook</span>
                    </div>
                  )}
                </div>
              </div>

              {isCurrent && (
                <div className="absolute -right-1 -top-1 w-3 h-3 bg-[var(--accent-color)] rounded-full animate-ping" />
              )}
            </div>
          );
        })
      )}
    </div>
  );
};

export default TodayView;