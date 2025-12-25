import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, X, Flag, Clock, Timer, Watch } from 'lucide-react';
import { useLocalStorage } from '../../hooks/useLocalStorage';

interface ClockOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  playSound: (type: 'click' | 'switch') => void;
}

const ClockOverlay: React.FC<ClockOverlayProps> = ({ isOpen, onClose, playSound }) => {
  const [activeTab, setActiveTab] = useLocalStorage<'clock' | 'timer' | 'stopwatch'>('clock-active-tab', 'clock');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[var(--bg-color)] flex flex-col items-center justify-center animate-fade-in-up">
      <div className="absolute top-10 flex p-1 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-2xl shadow-lg">
        {[
          { id: 'clock', icon: Clock, label: 'Clock' },
          { id: 'timer', icon: Timer, label: 'Timer' },
          { id: 'stopwatch', icon: Watch, label: 'Stopwatch' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => { playSound('switch'); setActiveTab(tab.id as any); }}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all font-medium ${
              activeTab === tab.id
                ? 'bg-[var(--accent-color)] text-[var(--accent-text-color)] shadow-md'
                : 'text-[var(--text-color)] hover:bg-[var(--highlight-color)]'
            }`}
          >
            <tab.icon size={18} />
            <span className="hidden md:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      <button 
        onClick={onClose}
        className="absolute top-10 right-10 p-2 rounded-full bg-[var(--card-bg)] text-[var(--text-color)] hover:bg-[var(--highlight-color)] transition-all shadow-md"
      >
        <X size={24} />
      </button>

      <div className="w-full h-full flex items-center justify-center">
        {activeTab === 'clock' && <ClockView />}
        {activeTab === 'timer' && <TimerView playSound={playSound} />}
        {activeTab === 'stopwatch' && <StopwatchView playSound={playSound} />}
      </div>
    </div>
  );
};

/* --- Sub-Components --- */

const ClockView = () => {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="text-center flex flex-col items-center">
      <div className="text-[15vw] md:text-[12vw] font-bold text-[var(--accent-color)] tabular-nums leading-none tracking-tight">
        {time.toLocaleTimeString([], { hour12: false })}
      </div>
      <div className="text-[5vw] md:text-[3vw] text-[var(--text-color)] opacity-60 mt-4 font-medium">
        {time.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
      </div>
    </div>
  );
};

const TimerView = ({playSound}: {playSound: any}) => {
  const [timerState, setTimerState] = useLocalStorage('timer-data', {
    isRunning: false,
    targetTime: 0, 
    remaining: 0,  
    inputs: { h: 0, m: 5, s: 0 }
  });
  const [displayTime, setDisplayTime] = useState(0);

  useEffect(() => {
    const updateDisplay = () => {
      if (timerState.isRunning) {
        const now = Date.now();
        const left = Math.max(0, Math.ceil((timerState.targetTime - now) / 1000));
        setDisplayTime(left);
        if (left <= 0) {
          setTimerState(prev => ({ ...prev, isRunning: false, remaining: 0 }));
          // Add timer alarm sound here later
        }
      } else {
        setDisplayTime(timerState.remaining);
      }
    };
    updateDisplay();
    const interval = setInterval(updateDisplay, 100);
    return () => clearInterval(interval);
  }, [timerState.isRunning, timerState.targetTime, timerState.remaining]);

  const handleStart = () => {
    playSound('click');
    const { h, m, s } = timerState.inputs;
    let totalSeconds = timerState.remaining;
    if (totalSeconds === 0) totalSeconds = (h * 3600) + (m * 60) + s;

    if (totalSeconds > 0) {
      const target = Date.now() + (totalSeconds * 1000);
      setTimerState(prev => ({ ...prev, isRunning: true, targetTime: target, remaining: totalSeconds }));
    }
  };

  const handlePause = () => {
    playSound('click');
    const now = Date.now();
    const left = Math.max(0, Math.ceil((timerState.targetTime - now) / 1000));
    setTimerState(prev => ({ ...prev, isRunning: false, remaining: left }));
  };

  const handleReset = () => {
    playSound('click');
    setTimerState(prev => ({ ...prev, isRunning: false, remaining: 0, targetTime: 0 }));
  };

  const handleInputChange = (field: 'h'|'m'|'s', value: number) => {
    setTimerState(prev => ({ ...prev, inputs: { ...prev.inputs, [field]: value } }));
  };

  const formatTime = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center gap-8">
      {displayTime > 0 || timerState.isRunning ? (
        <div className="text-[15vw] md:text-[12vw] font-bold text-[var(--accent-color)] tabular-nums leading-none">
          {formatTime(displayTime)}
        </div>
      ) : (
        <div className="flex items-center gap-2 md:gap-4 text-4xl md:text-6xl font-bold text-[var(--text-color)]">
          <div className="flex flex-col items-center">
            <input type="number" min="0" max="99" value={timerState.inputs.h} onChange={(e) => handleInputChange('h', parseInt(e.target.value) || 0)} className="w-20 md:w-32 p-4 text-center bg-[var(--highlight-color)] rounded-2xl outline-none focus:ring-2 focus:ring-[var(--accent-color)]" />
            <span className="text-sm opacity-50 mt-2">hr</span>
          </div>
          <span className="mb-8">:</span>
          <div className="flex flex-col items-center">
            <input type="number" min="0" max="59" value={timerState.inputs.m} onChange={(e) => handleInputChange('m', parseInt(e.target.value) || 0)} className="w-20 md:w-32 p-4 text-center bg-[var(--highlight-color)] rounded-2xl outline-none focus:ring-2 focus:ring-[var(--accent-color)]" />
            <span className="text-sm opacity-50 mt-2">min</span>
          </div>
          <span className="mb-8">:</span>
          <div className="flex flex-col items-center">
            <input type="number" min="0" max="59" value={timerState.inputs.s} onChange={(e) => handleInputChange('s', parseInt(e.target.value) || 0)} className="w-20 md:w-32 p-4 text-center bg-[var(--highlight-color)] rounded-2xl outline-none focus:ring-2 focus:ring-[var(--accent-color)]" />
            <span className="text-sm opacity-50 mt-2">sec</span>
          </div>
        </div>
      )}
      <div className="flex gap-4">
        <button onClick={handleReset} className="p-6 rounded-full bg-[var(--highlight-color)] text-[var(--text-color)] hover:bg-[var(--border-color)] transition-colors"><RotateCcw size={32} /></button>
        <button onClick={() => timerState.isRunning ? handlePause() : handleStart()} className={`p-6 rounded-full transition-transform hover:scale-105 active:scale-95 shadow-xl ${timerState.isRunning ? 'bg-red-500 text-white' : 'bg-[var(--accent-color)] text-[var(--accent-text-color)]'}`}>
          {timerState.isRunning ? <Pause size={48} fill="currentColor" /> : <Play size={48} fill="currentColor" />}
        </button>
      </div>
    </div>
  );
};

const StopwatchView = ({playSound}: {playSound: any}) => {
  const [swState, setSwState] = useLocalStorage('stopwatch-data', { isRunning: false, startTime: 0, accumulated: 0, laps: [] as number[] });
  const [visualTime, setVisualTime] = useState(0);

  useEffect(() => {
    const updateVisuals = () => {
      if (swState.isRunning) setVisualTime(swState.accumulated + (Date.now() - swState.startTime));
      else setVisualTime(swState.accumulated);
    };
    updateVisuals();
    let interval: any;
    if (swState.isRunning) interval = setInterval(updateVisuals, 30);
    return () => clearInterval(interval);
  }, [swState]);

  const handleStart = () => { playSound('click'); setSwState(prev => ({ ...prev, isRunning: true, startTime: Date.now() })); };
  const handleStop = () => { playSound('click'); const now = Date.now(); setSwState(prev => ({ ...prev, isRunning: false, accumulated: prev.accumulated + (now - prev.startTime), startTime: 0 })); };
  const handleReset = () => { playSound('click'); setSwState(prev => ({ ...prev, isRunning: false, startTime: 0, accumulated: 0, laps: [] })); setVisualTime(0); };
  const handleLap = () => { playSound('click'); const currentTotal = swState.isRunning ? swState.accumulated + (Date.now() - swState.startTime) : swState.accumulated; setSwState(prev => ({ ...prev, laps: [currentTotal, ...prev.laps] })); };
  
  const formatTime = (ms: number) => {
    const m = Math.floor(ms / 60000);
    const s = Math.floor((ms % 60000) / 1000);
    const centi = Math.floor((ms % 1000) / 10);
    return <span className="tabular-nums">{m.toString().padStart(2, '0')}:{s.toString().padStart(2, '0')}.<span className="text-[0.6em] opacity-70">{centi.toString().padStart(2, '0')}</span></span>;
  };

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-md mx-auto">
      <div className="text-[12vw] md:text-[8vw] font-bold text-[var(--accent-color)] leading-none">{formatTime(visualTime)}</div>
      <div className="flex gap-6">
         <button onClick={handleReset} className="w-16 h-16 rounded-full bg-[var(--highlight-color)] text-[var(--text-color)] hover:bg-[var(--border-color)] flex items-center justify-center transition-colors"><RotateCcw size={24} /></button>
        <button onClick={() => swState.isRunning ? handleStop() : handleStart()} className={`w-24 h-24 rounded-full flex items-center justify-center transition-transform hover:scale-105 active:scale-95 shadow-xl ${swState.isRunning ? 'bg-red-500 text-white' : 'bg-[var(--accent-color)] text-[var(--accent-text-color)]'}`}>
          {swState.isRunning ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
        </button>
        <button onClick={handleLap} disabled={!swState.isRunning && visualTime === 0} className="w-16 h-16 rounded-full bg-[var(--highlight-color)] text-[var(--text-color)] hover:bg-[var(--border-color)] flex items-center justify-center transition-colors disabled:opacity-50"><Flag size={24} /></button>
      </div>
      {swState.laps.length > 0 && (
        <div className="w-full h-48 overflow-y-auto bg-[var(--card-bg)] rounded-2xl border border-[var(--border-color)] p-2 shadow-inner">
          <table className="w-full text-sm md:text-base">
            <tbody>
              {swState.laps.map((lapTime, index) => (
                <tr key={index} className="border-b border-[var(--border-color)] last:border-0">
                  <td className="p-3 text-[var(--text-color)] opacity-60">Lap {swState.laps.length - index}</td>
                  <td className="p-3 text-right font-mono font-bold">{formatTime(lapTime)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ClockOverlay;