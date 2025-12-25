
import { Manual, ScheduleRow, ThemeDefinition, ThemePreset, Folder } from './types';

export const DEFAULT_THEME = {
  theme: "dark",
  accentColor: "#6196ff",
  font: "Inter"
};

export const DEFAULT_FOLDERS: Folder[] = [
  { id: 'f_inbox', name: 'Inbox', icon: 'Inbox', color: '#6196ff', isDefault: true },
  { id: 'f_school', name: 'School', icon: 'GraduationCap', color: '#f97316' },
  { id: 'f_personal', name: 'Personal', icon: 'User', color: '#10b981' },
];

export const SHORTCUT_OPTIONS = [
  { id: 'todo', label: 'Tasks', icon: 'List' },
  { id: 'weather', label: 'Weather', icon: 'Cloud' },
  { id: 'manuals', label: 'Manuals', icon: 'Book' },
  { id: 'clock', label: 'Clock', icon: 'Clock' },
];

/* --- THEMES --- */
// 30 Themes with Emojis, Tinted Backgrounds, and 3 Accent Options

export const THEMES: Record<string, ThemeDefinition> = {
  // --- BASICS ---
  light: {
    name: "Light Mode",
    emoji: "☀️",
    description: "Classic bright white.",
    type: 'light',
    recommendedAccents: ["#3b82f6", "#ef4444", "#10b981"],
    colors: { bg: "#ffffff", card: "#f3f4f6", text: "#1a1a1a", border: "#e5e7eb", highlight: "#f0f0f0" }
  },
  dark: {
    name: "Dark Mode",
    emoji: "🌑",
    description: "Classic deep grey.",
    type: 'dark',
    recommendedAccents: ["#60a5fa", "#f87171", "#34d399"],
    colors: { bg: "#1a1a1a", card: "#2d2d2d", text: "#f0f0f0", border: "#3d3d3d", highlight: "#424242" }
  },
  oled: {
    name: "OLED Pitch",
    emoji: "🖤",
    description: "True black battery saver.",
    type: 'dark',
    recommendedAccents: ["#ffffff", "#38bdf8", "#4ade80"],
    colors: { bg: "#000000", card: "#121212", text: "#ffffff", border: "#333333", highlight: "#1a1a1a" }
  },
  
  // --- NATURE ---
  forest: {
    name: "Deep Forest",
    emoji: "🌲",
    description: "Dark mossy green tints.",
    type: 'dark',
    recommendedAccents: ["#4ade80", "#bef264", "#22c55e"],
    colors: { bg: "#051a0d", card: "#0f2e1b", text: "#e8f5e8", border: "#1a422a", highlight: "#143823" }
  },
  ocean: {
    name: "Ocean Depth",
    emoji: "🌊",
    description: "Deep underwater blue.",
    type: 'dark',
    recommendedAccents: ["#38bdf8", "#0ea5e9", "#7dd3fc"],
    colors: { bg: "#061221", card: "#0f2540", text: "#e0f2fe", border: "#1e3a5f", highlight: "#162e4d" }
  },
  sunset: {
    name: "Warm Sunset",
    emoji: "🌅",
    description: "Cozy orange glow.",
    type: 'light',
    recommendedAccents: ["#fb923c", "#f97316", "#c2410c"],
    colors: { bg: "#fff7ed", card: "#ffedd5", text: "#431407", border: "#fed7aa", highlight: "#fffaf0" }
  },
  lavender: {
    name: "Lavender Mist",
    emoji: "🪻",
    description: "Soft purple haze.",
    type: 'light',
    recommendedAccents: ["#a78bfa", "#8b5cf6", "#c4b5fd"],
    colors: { bg: "#f5f3ff", card: "#ede9fe", text: "#4c1d95", border: "#ddd6fe", highlight: "#fbfaff" }
  },
  rose: {
    name: "Dusty Rose",
    emoji: "🌹",
    description: "Elegant reddish dark.",
    type: 'dark',
    recommendedAccents: ["#fb7185", "#f43f5e", "#fda4af"],
    colors: { bg: "#1f080c", card: "#381017", text: "#ffe4e6", border: "#591c26", highlight: "#42121b" }
  },
  mint: {
    name: "Fresh Mint",
    emoji: "🌱",
    description: "Refreshing pale green.",
    type: 'light',
    recommendedAccents: ["#34d399", "#10b981", "#6ee7b7"],
    colors: { bg: "#ecfdf5", card: "#d1fae5", text: "#064e3b", border: "#a7f3d0", highlight: "#f0fdf4" }
  },
  sky: {
    name: "Clear Sky",
    emoji: "☁️",
    description: "Airy light blue.",
    type: 'light',
    recommendedAccents: ["#0ea5e9", "#0284c7", "#7dd3fc"],
    colors: { bg: "#f0f9ff", card: "#e0f2fe", text: "#0c4a6e", border: "#bae6fd", highlight: "#eef8ff" }
  },
  sand: {
    name: "Desert Sand",
    emoji: "🏜️",
    description: "Warm beige tones.",
    type: 'light',
    recommendedAccents: ["#d97706", "#b45309", "#f59e0b"],
    colors: { bg: "#fffbeb", card: "#fef3c7", text: "#78350f", border: "#fde68a", highlight: "#fffdf5" }
  },

  // --- TECH / MODERN ---
  midnight: {
    name: "Midnight Pro",
    emoji: "🌌",
    description: "Professional navy blue.",
    type: 'dark',
    recommendedAccents: ["#818cf8", "#6366f1", "#a5b4fc"],
    colors: { bg: "#0f172a", card: "#1e293b", text: "#f8fafc", border: "#334155", highlight: "#253248" }
  },
  cyberpunk: {
    name: "Neon City",
    emoji: "🌃",
    description: "High contrast dark grey.",
    type: 'dark',
    recommendedAccents: ["#f472b6", "#e879f9", "#22d3ee"],
    colors: { bg: "#050505", card: "#171717", text: "#e5e5e5", border: "#262626", highlight: "#262626" }
  },
  synthwave: {
    name: "Synthwave",
    emoji: "👾",
    description: "Retrowave purple dark.",
    type: 'dark',
    recommendedAccents: ["#d946ef", "#f0abfc", "#8b5cf6"],
    colors: { bg: "#180a29", card: "#2e104f", text: "#fae8ff", border: "#511f85", highlight: "#3d1466" }
  },
  terminal: {
    name: "Hacker",
    emoji: "📟",
    description: "Matrix green on black.",
    type: 'dark',
    recommendedAccents: ["#22c55e", "#4ade80", "#16a34a"],
    colors: { bg: "#020a02", card: "#0a1f0a", text: "#4ade80", border: "#14532d", highlight: "#0c290c" }
  },
  slate: {
    name: "Slate",
    emoji: "🏢",
    description: "Corporate cool grey.",
    type: 'light',
    recommendedAccents: ["#94a3b8", "#64748b", "#cbd5e1"],
    colors: { bg: "#f8fafc", card: "#e2e8f0", text: "#334155", border: "#cbd5e1", highlight: "#f1f5f9" }
  },
  nord: {
    name: "Nordic",
    emoji: "❄️",
    description: "Icy blue-grey dark.",
    type: 'dark',
    recommendedAccents: ["#88c0d0", "#81a1c1", "#5e81ac"],
    colors: { bg: "#242933", card: "#2e3440", text: "#eceff4", border: "#3b4252", highlight: "#353b49" }
  },
  dracula: {
    name: "Vampire",
    emoji: "🧛",
    description: "Purple tinted dark.",
    type: 'dark',
    recommendedAccents: ["#bd93f9", "#ff79c6", "#8be9fd"],
    colors: { bg: "#282a36", card: "#343746", text: "#f8f8f2", border: "#44475a", highlight: "#3e4153" }
  },
  monokai: {
    name: "Editor",
    emoji: "📝",
    description: "Warm dark code theme.",
    type: 'dark',
    recommendedAccents: ["#a6e22e", "#f92672", "#66d9ef"],
    colors: { bg: "#1e1f1c", card: "#272822", text: "#f8f8f2", border: "#3e3d32", highlight: "#33342d" }
  },

  // --- VIBRANT / FUN ---
  bubblegum: {
    name: "Bubblegum",
    emoji: "🍬",
    description: "Sweet pink tint.",
    type: 'light',
    recommendedAccents: ["#ec4899", "#db2777", "#f472b6"],
    colors: { bg: "#fff1f2", card: "#ffe4e6", text: "#be185d", border: "#fecdd3", highlight: "#fff5f7" }
  },
  lemonade: {
    name: "Lemon",
    emoji: "🍋",
    description: "Bright yellow tint.",
    type: 'light',
    recommendedAccents: ["#eab308", "#ca8a04", "#facc15"],
    colors: { bg: "#fefce8", card: "#fef9c3", text: "#854d0e", border: "#fde047", highlight: "#fffbea" }
  },
  grape: {
    name: "Grape",
    emoji: "🍇",
    description: "Rich purple dark.",
    type: 'dark',
    recommendedAccents: ["#c084fc", "#a855f7", "#d8b4fe"],
    colors: { bg: "#1e0b36", card: "#33135c", text: "#f3e8ff", border: "#572196", highlight: "#401873" }
  },
  peach: {
    name: "Peach",
    emoji: "🍑",
    description: "Soft orange pastel.",
    type: 'light',
    recommendedAccents: ["#f97316", "#fb923c", "#fdba74"],
    colors: { bg: "#fff7ed", card: "#ffedd5", text: "#9a3412", border: "#fed7aa", highlight: "#fffaf5" }
  },
  berry: {
    name: "Berry",
    emoji: "🍓",
    description: "Deep red dark.",
    type: 'dark',
    recommendedAccents: ["#f43f5e", "#fb7185", "#e11d48"],
    colors: { bg: "#260a0f", card: "#4c1219", text: "#ffe4e6", border: "#881337", highlight: "#5e161f" }
  },
  gold: {
    name: "Luxury",
    emoji: "👑",
    description: "Brownish gold dark.",
    type: 'dark',
    recommendedAccents: ["#fbbf24", "#f59e0b", "#d97706"],
    colors: { bg: "#1c1917", card: "#292524", text: "#fef3c7", border: "#451a03", highlight: "#38312d" }
  },

  // --- MINIMAL ---
  paper: {
    name: "Paper",
    emoji: "📜",
    description: "Warm reading tint.",
    type: 'light',
    recommendedAccents: ["#854d0e", "#a16207", "#ca8a04"],
    colors: { bg: "#f9f7f1", card: "#f0ebe0", text: "#433422", border: "#e6dec8", highlight: "#fbf9f5" }
  },
  arctic: {
    name: "Arctic",
    emoji: "🏔️",
    description: "Purest white.",
    type: 'light',
    recommendedAccents: ["#06b6d4", "#0ea5e9", "#22d3ee"],
    colors: { bg: "#ffffff", card: "#f8fafc", text: "#0f172a", border: "#e2e8f0", highlight: "#f1f5f9" }
  },
  coffee: {
    name: "Coffee",
    emoji: "☕",
    description: "Warm brown dark.",
    type: 'dark',
    recommendedAccents: ["#d6c0b6", "#a8a29e", "#e7e5e4"],
    colors: { bg: "#1a120e", card: "#2e201a", text: "#eaddd7", border: "#4a352c", highlight: "#3b2921" }
  },
  concrete: {
    name: "Concrete",
    emoji: "🏗️",
    description: "Industrial grey.",
    type: 'light',
    recommendedAccents: ["#737373", "#525252", "#404040"],
    colors: { bg: "#a3a3a3", card: "#b5b5b5", text: "#171717", border: "#737373", highlight: "#c4c4c4" }
  },
  nightfall: {
    name: "Nightfall",
    emoji: "🌃",
    description: "Muted blue black.",
    type: 'dark',
    recommendedAccents: ["#64748b", "#94a3b8", "#475569"],
    colors: { bg: "#020617", card: "#0f172a", text: "#94a3b8", border: "#1e293b", highlight: "#162036" }
  },
};

export const PREMADE_PRESETS: ThemePreset[] = [
  // --- Original 6 ---
  { id: 'p1', name: "Developer Mode", theme: "monokai", accentColor: "#a6e22e", font: "Fira Code", emoji: "👨‍💻" },
  { id: 'p2', name: "Barbie World", theme: "bubblegum", accentColor: "#ec4899", font: "Quicksand", emoji: "💅" },
  { id: 'p3', name: "Matrix", theme: "terminal", accentColor: "#22c55e", font: "JetBrains Mono", emoji: "😎" },
  { id: 'p4', name: "Reading Nook", theme: "paper", accentColor: "#854d0e", font: "Merriweather", emoji: "📖" },
  { id: 'p5', name: "Deep Sea", theme: "ocean", accentColor: "#38bdf8", font: "Montserrat", emoji: "🐡" },
  { id: 'p6', name: "Royal Court", theme: "grape", accentColor: "#c084fc", font: "Playfair Display", emoji: "👑" },
  
  // --- New 24 Items ---
  { id: 'p7', name: "Solar Flare", theme: "sunset", accentColor: "#f97316", font: "Ubuntu", emoji: "☀️" },
  { id: 'p8', name: "Night Owl", theme: "midnight", accentColor: "#818cf8", font: "Inter", emoji: "🦉" },
  { id: 'p9', name: "Cherry Blossom", theme: "light", accentColor: "#f472b6", font: "Nunito", emoji: "🌸" },
  { id: 'p10', name: "Stealth", theme: "oled", accentColor: "#404040", font: "Roboto", emoji: "🥷" },
  { id: 'p11', name: "Minty Fresh", theme: "mint", accentColor: "#10b981", font: "Poppins", emoji: "🌿" },
  { id: 'p12', name: "Cyber Samurai", theme: "cyberpunk", accentColor: "#22d3ee", font: "Orbitron", emoji: "🦾" },
  { id: 'p13', name: "Golden Hour", theme: "gold", accentColor: "#f59e0b", font: "Lato", emoji: "🌅" },
  { id: 'p14', name: "Vampire Slayer", theme: "dracula", accentColor: "#ff5555", font: "Rubik", emoji: "🗡️" },
  { id: 'p15', name: "Nordic Winter", theme: "nord", accentColor: "#88c0d0", font: "Open Sans", emoji: "🏔️" },
  { id: 'p16', name: "Lavender Haze", theme: "lavender", accentColor: "#8b5cf6", font: "Raleway", emoji: "🌫️" },
  { id: 'p17', name: "Forest Ranger", theme: "forest", accentColor: "#22c55e", font: "Roboto Mono", emoji: "🏕️" },
  { id: 'p18', name: "Espresso Shot", theme: "coffee", accentColor: "#a8a29e", font: "Merriweather", emoji: "☕" },
  { id: 'p19', name: "Clear Blue", theme: "sky", accentColor: "#0284c7", font: "Inter", emoji: "💎" },
  { id: 'p20', name: "Love Letter", theme: "rose", accentColor: "#fb7185", font: "Playfair Display", emoji: "💌" },
  { id: 'p21', name: "Concrete Jungle", theme: "concrete", accentColor: "#262626", font: "Oswald", emoji: "🏙️" },
  { id: 'p22', name: "Retro Wave", theme: "synthwave", accentColor: "#e879f9", font: "Press Start 2P", emoji: "📼" },
  { id: 'p23', name: "Sandstorm", theme: "sand", accentColor: "#d97706", font: "Work Sans", emoji: "🐪" },
  { id: 'p24', name: "Fruit Punch", theme: "berry", accentColor: "#fbbf24", font: "Fredoka", emoji: "🥊" },
  { id: 'p25', name: "Lemon Drop", theme: "lemonade", accentColor: "#eab308", font: "Dosis", emoji: "🍬" },
  { id: 'p26', name: "Corporate Memphis", theme: "slate", accentColor: "#3b82f6", font: "Inter", emoji: "🟦" },
  { id: 'p27', name: "Clean Code", theme: "dark", accentColor: "#60a5fa", font: "Fira Code", emoji: "💻" },
  { id: 'p28', name: "Soft Peach", theme: "peach", accentColor: "#f97316", font: "Lora", emoji: "🍑" },
  { id: 'p29', name: "Arctic Fox", theme: "arctic", accentColor: "#0ea5e9", font: "Nunito Sans", emoji: "🦊" },
  { id: 'p30', name: "Void", theme: "nightfall", accentColor: "#475569", font: "Space Grotesk", emoji: "⚫" }
];

export const MANUALS: Manual[] = [
  {
    title: "Arte Plastice",
    image: "https://www.manuale.edu.ro/assets/img/manuale/A1899.png",
    url: "https://manuale.edu.ro/manuale/Clasa%20a%20VIII-a/Educatie%20plastica/Uy5DLiBMaXRlcmEgRWR1/",
    subjectKeywords: ["arte", "plastice", "desen"]
  },
  {
    title: "Biologie",
    image: "https://www.manuale.edu.ro/assets/img/manuale/A1857.png",
    url: "https://manuale.edu.ro/manuale/Clasa%20a%20VIII-a/Biologie/Q29yaW50IExvZ2lzdGlj/",
    subjectKeywords: ["biologie", "bio"]
  },
  {
    title: "Chimie",
    image: "https://www.manuale.edu.ro/assets/img/manuale/A1877.png",
    url: "https://manuale.edu.ro/manuale/Clasa%20a%20VIII-a/Chimie/QXJ0IEtsZXR0IFMuUi5M/#book/0-help",
    subjectKeywords: ["chimie"]
  },
  {
    title: "Civică",
    image: "https://www.manuale.edu.ro/assets/img/manuale/A1902.png",
    url: "https://manuale.edu.ro/manuale/Clasa%20a%20VIII-a/Educatie%20sociala/Q0QgUHJlc3MgUy5SLkwu/book.html?book#0",
    subjectKeywords: ["civică", "educație socială", "civica"]
  },
  {
    title: "Engleză",
    image: "https://www.manuale.edu.ro/assets/img/manuale/A1942.png",
    url: "https://manuale.edu.ro/manuale/Clasa%20a%20VIII-a/Limba%20moderna%201-limba%20engleza/QXJ0IEtsZXR0IFMuUi5M/#book/0-help",
    subjectKeywords: ["engleză", "engleza"]
  },
  {
    title: "Franceză",
    image: "https://www.manuale.edu.ro/assets/img/manuale/A1958.png",
    url: "https://manuale.edu.ro/manuale/Clasa%20a%20VIII-a/Limba%20moderna%202%20franceza/Uy5DLiBCb29rbGV0IFMu/",
    subjectKeywords: ["franceză", "franceza"]
  },
  {
    title: "Fizică",
    image: "https://www.manuale.edu.ro/assets/img/manuale/A1915.png",
    url: "https://manuale.edu.ro/manuale/Clasa%20a%20VIII-a/Fizica/QXJ0IEtsZXR0IFMuUi5M/",
    subjectKeywords: ["fizică", "fizica"]
  },
  {
    title: "Geografie",
    image: "https://www.manuale.edu.ro/assets/img/manuale/A1920.png",
    url: "https://manuale.edu.ro/manuale/Clasa%20a%20VIII-a/Geografie/QXJ0IEtsZXR0IFMuUi5M/#book/0-help",
    subjectKeywords: ["geografie"]
  },
  {
    title: "Informatică",
    image: "https://www.manuale.edu.ro/assets/img/manuale/A1969.png",
    url: "https://manuale.edu.ro/manuale/Clasa%20a%20VIII-a/Informatica%20si%20TIC/Uy5DLiBMaXRlcmEgRWR1/",
    subjectKeywords: ["informatică", "tic", "info"]
  },
  {
    title: "Istorie",
    image: "https://www.manuale.edu.ro/assets/img/manuale/A1940.png",
    url: "https://manuale.edu.ro/manuale/Clasa%20a%20VIII-a/Istorie/QWthZGVtb3MgQXJ0IFMu/interior.html",
    subjectKeywords: ["istorie"]
  },
  {
    title: "Mate",
    image: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fplay-lh.googleusercontent.com%2FB_xhOxjZahDaNvf7NYDBa8uCj1bmmUpQAdsxeG8_n7HErkfqHnFQS3HCZWLua6tj7w&f=1&nofb=1&ipt=e0719d2a65e76c03a8158e5fbf69d6f994c312763d96851f8383d094269c73dc",
    url: "https://app.asq.ro/",
    subjectKeywords: ["mate", "matematică", "matematica", "opț mate"]
  },
  {
    title: "Muzică",
    image: "https://www.manuale.edu.ro/assets/img/manuale/A1893.png",
    url: "https://manuale.edu.ro/manuale/Clasa%20a%20VIII-a/Educatie%20muzicala/QXJ0IEtsZXR0IFMuUi5M/",
    subjectKeywords: ["muzică", "muzica"]
  },
  {
    title: "Română",
    image: "https://www.manuale.edu.ro/assets/img/manuale/A1948.png",
    url: "https://manuale.edu.ro/manuale/Clasa%20a%20VIII-a/Limba%20si%20literatura%20romana/QXJ0IEtsZXR0IFMuUi5M/A1948.pdf",
    subjectKeywords: ["română", "romana"]
  },
  {
    title: "Tehnologică",
    image: "https://www.manuale.edu.ro/assets/img/manuale/A1911.png",
    url: "https://manuale.edu.ro/manuale/Clasa%20a%20VIII-a/Educatie%20tehnologica%20si%20aplicatii%20practice/Q0QgUHJlc3MgUy5SLkwu/book.html?book#0",
    subjectKeywords: ["tehnologică", "tehnologica"]
  }
];

export const SCHEDULE_DATA: ScheduleRow[] = [
  {
    time: "12:00",
    days: [
      { subject: "Fizică", icon: "💡", manualUrl: MANUALS.find(m => m.title === "Fizică")?.url },
      { subject: "Fizică", icon: "💡", manualUrl: MANUALS.find(m => m.title === "Fizică")?.url },
      { subject: "Mate", icon: "📏", manualUrl: MANUALS.find(m => m.title === "Mate")?.url },
      null,
      null
    ]
  },
  {
    time: "13:00",
    days: [
      { subject: "Istorie", icon: "📜", manualUrl: MANUALS.find(m => m.title === "Istorie")?.url },
      { subject: "Franceză", icon: "", flag: "fr", manualUrl: MANUALS.find(m => m.title === "Franceză")?.url },
      { subject: "Chimie", icon: "🧪", manualUrl: MANUALS.find(m => m.title === "Chimie")?.url },
      { subject: "Geografie", icon: "🌍", manualUrl: MANUALS.find(m => m.title === "Geografie")?.url },
      { subject: "Geografie", icon: "🌍", manualUrl: MANUALS.find(m => m.title === "Geografie")?.url }
    ]
  },
  {
    time: "14:00",
    days: [
      { subject: "Biologie", icon: "🧬", manualUrl: MANUALS.find(m => m.title === "Biologie")?.url },
      { subject: "Mate", icon: "📏", manualUrl: MANUALS.find(m => m.title === "Mate")?.url },
      { subject: "Franceză", icon: "", flag: "fr", manualUrl: MANUALS.find(m => m.title === "Franceză")?.url },
      { subject: "Muzică", icon: "🎵", manualUrl: MANUALS.find(m => m.title === "Muzică")?.url },
      { subject: "Arte", icon: "🎨", manualUrl: MANUALS.find(m => m.title === "Arte Plastice")?.url }
    ]
  },
  {
    time: "15:00",
    days: [
      { subject: "Mate", icon: "📏", manualUrl: MANUALS.find(m => m.title === "Mate")?.url },
      { subject: "Română", icon: "", flag: "ro", manualUrl: MANUALS.find(m => m.title === "Română")?.url },
      { subject: "Opț Mate", icon: "📐", manualUrl: MANUALS.find(m => m.title === "Mate")?.url },
      { subject: "Engleză", icon: "", flag: "gb", manualUrl: MANUALS.find(m => m.title === "Engleză")?.url },
      { subject: "Mate", icon: "📏", manualUrl: MANUALS.find(m => m.title === "Mate")?.url }
    ]
  },
  {
    time: "16:00",
    days: [
      { subject: "Sport", icon: "⚽" },
      { subject: "Informatică", icon: "💻", manualUrl: MANUALS.find(m => m.title === "Informatică")?.url },
      { subject: "Română", icon: "", flag: "ro", manualUrl: MANUALS.find(m => m.title === "Română")?.url },
      { subject: "Religie", icon: "☦️" },
      { subject: "Engleză", icon: "", flag: "gb", manualUrl: MANUALS.find(m => m.title === "Engleză")?.url }
    ]
  },
  {
    time: "17:00",
    days: [
      { subject: "Tehnologică", icon: "🛠️", manualUrl: MANUALS.find(m => m.title === "Tehnologică")?.url },
      { subject: "Sport", icon: "⚽" },
      { subject: "Istorie", icon: "📜", manualUrl: MANUALS.find(m => m.title === "Istorie")?.url },
      { subject: "Chimie", icon: "🧪", manualUrl: MANUALS.find(m => m.title === "Chimie")?.url },
      { subject: "Română", icon: "", flag: "ro", manualUrl: MANUALS.find(m => m.title === "Română")?.url }
    ]
  },
  {
    time: "18:00",
    days: [
      { subject: "Română", icon: "", flag: "ro", manualUrl: MANUALS.find(m => m.title === "Română")?.url },
      null,
      null,
      { subject: "Civică", icon: "🏛️", manualUrl: MANUALS.find(m => m.title === "Civică")?.url },
      { subject: "Dirigenție", icon: "📰" }
    ]
  }
];