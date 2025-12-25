import React, { useEffect, useState } from 'react';
import { SCHEDULE_DATA } from '../constants';
import { ScheduleItem, InteractionMode, UISettings, AppSettings } from '../types';
import { Check, X } from 'lucide-react';

interface TimetableProps {
  interactionMode: InteractionMode;
  markedCells: string[];
  onToggleMark: (id: string) => void;
  uiSettings: UISettings;
  appSettings: AppSettings;
}

const Timetable: React.FC<TimetableProps> = ({ interactionMode, markedCells, onToggleMark, uiSettings, appSettings }) => {
  const [currentDay, setCurrentDay] = useState(new Date().getDay()); // 0=Sun, 1=Mon...
  const [currentHour, setCurrentHour] = useState(new Date().getHours());

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentDay(now.getDay());
      setCurrentHour(now.getHours());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const handleCellClick = (item: ScheduleItem | null, id: string) => {
    if (!item && interactionMode !== 'mark') return; // Allow marking empty cells if needed, but usually we mark items

    if (interactionMode === 'mark') {
      onToggleMark(id);
    } else if (item) {
      // Default: Link mode
      if (item.manualUrl) {
        window.open(item.manualUrl, '_blank');
      }
    }
  };

  // Determine indicator style classes
  const getCellStyle = (isNow: boolean, isMarked: boolean) => {
     let baseClasses = 'p-4 text-center border-b border-[var(--border-color)] transition-all duration-200 cursor-pointer relative overflow-hidden';
     
     // Marked Logic
     if (isMarked) {
       switch (uiSettings.markedIndicator) {
         case 'solid':
           return `${baseClasses} !bg-[var(--accent-color)] !text-[var(--accent-text-color)]`;
         case 'check':
           return `${baseClasses} bg-[var(--highlight-color)]`;
         case 'strike':
           return `${baseClasses} opacity-50 line-through decoration-[var(--text-color)]`;
         case 'dim':
           return `${baseClasses} opacity-30 grayscale`;
         default:
           return `${baseClasses} !bg-[var(--accent-color)]`;
       }
     }

     // Active Logic (Only if not marked)
     if (isNow) {
        switch(uiSettings.activeIndicator) {
          case 'glow': 
            return `${baseClasses} bg-[var(--accent-color)]/10 text-[var(--accent-color)] font-bold shadow-[inset_0_0_15px_var(--accent-color)]/20`;
          case 'solid': 
            return `${baseClasses} bg-[var(--accent-color)] text-[var(--accent-text-color)] font-bold`;
          case 'bar': 
            return `${baseClasses} bg-[var(--highlight-color)] text-[var(--text-color)] font-bold`;
          case 'border': 
            return `${baseClasses} border-2 border-[var(--accent-color)] text-[var(--text-color)] font-bold`;
          default: 
            return `${baseClasses} bg-[var(--accent-color)]/10`;
        }
     }

     return baseClasses;
  };

  const dayHeaders = ['Luni', 'Marți', 'Miercuri', 'Joi', 'Vineri'];
  if (appSettings.showWeekends) {
     dayHeaders.push('Sâmbătă', 'Duminică');
  }

  return (
    <div className="w-full overflow-x-auto pb-4 px-2">
      <div className="min-w-[800px] bg-[var(--card-bg)] rounded-2xl shadow-[0_5px_15px_var(--shadow-color)] overflow-hidden border border-[var(--border-color)]">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="p-4 text-left w-24 border-b border-r border-[var(--border-color)] bg-[var(--highlight-color)]/30">
                 {appSettings.devMode && <span className="text-[10px] font-mono opacity-50">DEV</span>}
              </th>
              {dayHeaders.map((day, index) => (
                <th 
                  key={day} 
                  className={`p-4 text-center text-lg font-bold uppercase tracking-wider border-b border-[var(--border-color)] ${
                    currentDay === index + 1 ? 'text-[var(--accent-color)] bg-[var(--accent-color)]/5' : 'text-[var(--text-color)]'
                  }`}
                >
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SCHEDULE_DATA.map((row) => {
              const rowHour = parseInt(row.time.split(':')[0]);
              const isCurrentHour = currentHour === rowHour;
              
              return (
                <tr key={row.time} className="group hover:bg-[var(--highlight-color)]/10 transition-colors">
                  <td className={`p-4 text-center font-bold border-r border-b border-[var(--border-color)] ${isCurrentHour ? 'text-[var(--accent-color)] text-xl' : 'text-[var(--text-color)] opacity-70'}`}>
                    {row.time}
                  </td>
                  {dayHeaders.map((_, dayIndex) => {
                    // Check if day exists in data, otherwise null (for weekends or empty days)
                    const item = (dayIndex < row.days.length) ? row.days[dayIndex] : null; 
                    
                    const isToday = currentDay === dayIndex + 1;
                    const isNow = isToday && isCurrentHour;
                    const cellId = `${row.time}-${dayIndex}`;
                    const isMarked = markedCells.includes(cellId);

                    return (
                      <td 
                        key={dayIndex} 
                        onClick={() => handleCellClick(item, cellId)}
                        className={`${getCellStyle(isNow, isMarked)} hover:bg-[var(--highlight-color)] hover:scale-[1.02] hover:shadow-md`}
                      >
                        {/* Dev Info */}
                        {appSettings.devMode && <span className="absolute top-1 left-1 text-[8px] opacity-30 font-mono">{cellId}</span>}
                        
                        {/* Marked Icon Overlay */}
                        {isMarked && uiSettings.markedIndicator === 'check' && (
                          <div className="absolute top-1 right-1 text-[var(--accent-color)]">
                            <Check size={16} strokeWidth={3} />
                          </div>
                        )}

                        {item ? (
                          <div className="flex flex-row items-center justify-center gap-2 relative z-10">
                            <span className="text-xl md:text-2xl font-medium">{item.subject}</span>
                            <div className="flex items-center">
                              <span className="text-lg">{item.icon}</span>
                              {item.flag && (
                                <img 
                                  src={`https://flagcdn.com/24x18/${item.flag}.png`} 
                                  alt={item.flag} 
                                  className="h-4 ml-1 rounded-sm shadow-sm" 
                                />
                              )}
                            </div>
                          </div>
                        ) : (
                          <span className="opacity-10">-</span>
                        )}
                        
                        {/* Bar Indicator Logic */}
                        {isNow && !isMarked && uiSettings.activeIndicator === 'bar' && (
                           <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[var(--accent-color)]" />
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Timetable;