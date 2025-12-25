

export interface ThemeColors {
  bg: string;
  card: string;
  text: string;
  border: string;
  highlight: string;
}

export interface ThemeDefinition {
  name: string;
  emoji: string;
  description: string;
  type: 'light' | 'dark';
  recommendedAccents: string[]; // Array of 3 colors
  colors: ThemeColors;
}

export interface ThemePreset {
  id: string;
  name: string;
  theme: string;
  accentColor: string;
  font: string;
  emoji?: string;
}

export interface Folder {
  id: string;
  name: string;
  icon: string; // Lucide icon name key
  color: string;
  description?: string;
  isDefault?: boolean;
}

export interface Subtask {
  id: string;
  text: string;
  completed: boolean;
}

export interface Task {
  id: string;
  text: string;
  description?: string;
  completed: boolean;
  folderId: string; // Link to Folder
  
  priority: 'very-high' | 'high' | 'medium' | 'low' | 'very-low';
  difficulty: 'very-easy' | 'easy' | 'medium' | 'hard' | 'very-hard';
  
  dueDate?: string; // ISO Date String
  createdAt: string;
  
  // Reminders
  reminderEnabled?: boolean;
  reminderMinutesBefore?: number; // e.g., 15, 60, 1440 (1 day)
  notified?: boolean;
  
  subtasks?: Subtask[];
  
  // Sorting/Visuals
  order: number; 
  isExpanded?: boolean;
}

export interface Manual {
  title: string;
  image: string;
  url: string;
  subjectKeywords: string[];
}

export interface HourlyWeather {
  time: string;
  temp: number;
  code: number;
}

export interface WeatherData {
  temp: number;
  weatherCode: number;
  description: string;
  sunrise: string;
  sunset: string;
  location: string;
  humidity: number;
  windSpeed: number;
  feelsLike: number;
  hourly: HourlyWeather[];
}

export interface ScheduleItem {
  subject: string;
  icon: string; // Emoji
  flag?: string; // country code for flag-icons or null
  manualUrl?: string;
}

export type ScheduleRow = {
  time: string;
  days: (ScheduleItem | null)[];
};

export type ShortcutId = 'todo' | 'weather' | 'manuals' | 'clock' | 'customization' | 'info';

export type InteractionMode = 'link' | 'mark';

export interface ToastNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

// --- SETTINGS INTERFACES ---

export interface UISettings {
  borderRadius: 'square' | 'default' | 'round';
  tableDensity: 'compact' | 'normal' | 'spacious';
  fontScale: 'small' | 'normal' | 'large';
  showHeader: boolean; 
  glassmorphism: boolean;
  cardElevation: 'flat' | 'low' | 'medium' | 'high';
  activeIndicator: 'glow' | 'solid' | 'bar' | 'border';
  markedIndicator: 'solid' | 'check' | 'strike' | 'dim'; // New option for marked cells
  texture: 'none' | 'noise' | 'dots' | 'grid';
}

export interface MobileSettings {
  shortcuts: { left: ShortcutId; right: ShortcutId };
  navbarBlur: boolean;
  navStyle: 'classic' | 'floating' | 'minimal';
  showLabels: boolean;
  haptics: boolean;
  safeArea: boolean;
  compactCards: boolean;
}

export interface FontSettings {
  family: string;
  weight: 'normal' | 'medium' | 'bold';
  lineHeight: 'compact' | 'normal' | 'loose'; 
  letterSpacing: 'tighter' | 'normal' | 'wide'; // Moved here
}

export interface AppSettings {
  timeFormat: '12h' | '24h';
  showSeconds: boolean;
  animationSpeed: 'instant' | 'fast' | 'normal' | 'slow';
  showWeekends: boolean;
  dataSaver: boolean; 
  soundEffects: boolean;
  devMode: boolean; 
}