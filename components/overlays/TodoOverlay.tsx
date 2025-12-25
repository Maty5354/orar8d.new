
import React, { useState, useEffect } from 'react';
import { Task, Folder, ToastNotification } from '../../types';
import { 
  X, Plus, Trash2, Calendar, CheckCircle, Circle, 
  Folder as FolderIcon, Inbox, GraduationCap, User, 
  Briefcase, Star, Heart, Zap, Coffee, Music, Image, 
  Settings, MoreVertical, Edit2, Layout, Home, Filter,
  Search, ArrowUpDown, SortAsc, ChevronDown, ChevronUp, Clock, GripVertical
} from 'lucide-react';
import TaskFormModal from './TaskFormModal';

interface TodoOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  playSound: (type: 'click' | 'switch' | 'success' | 'open' | 'close') => void;
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  folders: Folder[];
  setFolders: (folders: Folder[]) => void;
  addToast: (title: string, message: string, type: ToastNotification['type']) => void;
}

// Icon Mapping
const ICON_MAP: Record<string, any> = {
  Inbox, GraduationCap, User, Briefcase, Star, 
  Heart, Zap, Coffee, Music, Image, Home, Layout
};

const COLOR_PALETTE = [
  '#6196ff', '#f97316', '#10b981', '#ef4444', 
  '#8b5cf6', '#ec4899', '#eab308', '#64748b'
];

type SortOption = 'newest' | 'priority' | 'due' | 'alpha' | 'manual';

const TodoOverlay: React.FC<TodoOverlayProps> = ({ 
  isOpen, onClose, playSound, tasks, setTasks, folders, setFolders, addToast 
}) => {
  // State
  const [selectedFolderId, setSelectedFolderId] = useState<string>('all');
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [showSearch, setShowSearch] = useState(false);
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set());
  
  // Drag State
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);
  
  // Task Form State
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Folder Management State
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null);
  const [folderForm, setFolderForm] = useState({ name: '', icon: 'Folder', color: '#6196ff' });

  // Reset selected folder if it gets deleted
  useEffect(() => {
    if (selectedFolderId !== 'all' && !folders.find(f => f.id === selectedFolderId)) {
      setSelectedFolderId('all');
    }
  }, [folders, selectedFolderId]);

  if (!isOpen) return null;

  // --- CRUD OPERATIONS ---

  const handleSaveTask = (taskData: Partial<Task>) => {
    if (editingTask) {
      // Edit Mode
      setTasks(tasks.map(t => t.id === editingTask.id ? { ...t, ...taskData } as Task : t));
      addToast('Task Updated', 'Changes saved successfully', 'success');
    } else {
      // Create Mode
      const newTask: Task = {
        id: Date.now().toString(),
        text: taskData.text || 'Untitled',
        description: taskData.description,
        completed: false,
        priority: taskData.priority || 'medium',
        difficulty: taskData.difficulty || 'medium',
        createdAt: new Date().toISOString(),
        folderId: taskData.folderId || 'f_inbox',
        order: tasks.length,
        subtasks: taskData.subtasks || [],
        dueDate: taskData.dueDate,
        reminderEnabled: taskData.reminderEnabled,
        reminderMinutesBefore: taskData.reminderMinutesBefore
      };
      setTasks([...tasks, newTask]);
      addToast('Task Created', 'New task added to list', 'success');
    }
    playSound('success');
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    playSound('switch');
  };

  const toggleSubtask = (taskId: string, subtaskId: string) => {
    setTasks(tasks.map(t => {
      if (t.id === taskId && t.subtasks) {
        return {
          ...t,
          subtasks: t.subtasks.map(s => s.id === subtaskId ? { ...s, completed: !s.completed } : s)
        };
      }
      return t;
    }));
    playSound('switch');
  };

  const toggleExpand = (taskId: string) => {
    const newSet = new Set(expandedTasks);
    if (newSet.has(taskId)) {
      newSet.delete(taskId);
    } else {
      newSet.add(taskId);
    }
    setExpandedTasks(newSet);
    playSound('click');
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
    playSound('click');
  };

  const openTaskModal = (task?: Task) => {
    if (task) {
      setEditingTask(task);
    } else {
      setEditingTask(null);
    }
    setIsTaskModalOpen(true);
    playSound('open');
  };

  // --- DRAG AND DROP ---
  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    setDraggedTaskId(taskId);
    e.dataTransfer.effectAllowed = 'move';
    // Transparent drag image or default
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetTaskId: string) => {
    e.preventDefault();
    if (!draggedTaskId || draggedTaskId === targetTaskId) return;

    // Reorder Global Tasks List
    const sourceIndex = tasks.findIndex(t => t.id === draggedTaskId);
    const targetIndex = tasks.findIndex(t => t.id === targetTaskId);

    if (sourceIndex === -1 || targetIndex === -1) return;

    const newTasks = [...tasks];
    const [movedTask] = newTasks.splice(sourceIndex, 1);
    newTasks.splice(targetIndex, 0, movedTask);

    // Update orders
    const updatedTasks = newTasks.map((t, index) => ({ ...t, order: index }));
    setTasks(updatedTasks);
    setDraggedTaskId(null);
    playSound('click');
  };


  const saveFolder = () => {
    if (!folderForm.name.trim()) return;

    if (editingFolderId) {
      // Edit
      setFolders(folders.map(f => f.id === editingFolderId ? { ...f, ...folderForm } : f));
      addToast('Folder Updated', `Updated "${folderForm.name}"`, 'success');
    } else {
      // Create
      const newFolder: Folder = {
        id: `f_${Date.now()}`,
        name: folderForm.name,
        icon: folderForm.icon,
        color: folderForm.color,
        isDefault: false
      };
      setFolders([...folders, newFolder]);
      addToast('Folder Created', `Created "${folderForm.name}"`, 'success');
    }
    closeFolderModal();
    playSound('success');
  };

  const deleteFolder = (id: string) => {
    if (confirm('Are you sure? Tasks in this folder will be moved to Inbox.')) {
      setFolders(folders.filter(f => f.id !== id));
      // Move tasks to Inbox
      setTasks(tasks.map(t => t.folderId === id ? { ...t, folderId: 'f_inbox' } : t));
      addToast('Folder Deleted', 'Tasks moved to Inbox', 'info');
      playSound('click');
    }
  };

  const openFolderModal = (folder?: Folder) => {
    if (folder) {
      setEditingFolderId(folder.id);
      setFolderForm({ name: folder.name, icon: folder.icon, color: folder.color });
    } else {
      setEditingFolderId(null);
      setFolderForm({ name: '', icon: 'Briefcase', color: '#6196ff' });
    }
    setIsFolderModalOpen(true);
    playSound('switch');
  };

  const closeFolderModal = () => {
    setIsFolderModalOpen(false);
    setEditingFolderId(null);
  };

  // --- FILTERING & SORTING ---

  const getTaskGroup = (task: Task) => {
    if (task.completed) return 'Completed';
    if (!task.dueDate) return 'No Date';
    
    const date = new Date(task.dueDate);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const taskDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    if (taskDate < today) return 'Overdue';
    if (taskDate.getTime() === today.getTime()) return 'Today';
    if (taskDate.getTime() === tomorrow.getTime()) return 'Tomorrow';
    return 'Upcoming';
  };

  const filteredTasks = tasks
    .filter(t => {
      // 1. Folder Filter
      if (selectedFolderId !== 'all' && t.folderId !== selectedFolderId) return false;
      // 2. Status Filter
      if (filter === 'pending' && t.completed) return false;
      if (filter === 'completed' && !t.completed) return false;
      // 3. Search Filter
      if (searchQuery && !t.text.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      // Always put completed tasks at bottom if mixed
      if (filter === 'all' && a.completed !== b.completed) return a.completed ? 1 : -1;

      if (sortBy === 'priority') {
        const pMap = { 'very-high': 5, 'high': 4, 'medium': 3, 'low': 2, 'very-low': 1 };
        return pMap[b.priority] - pMap[a.priority];
      }
      if (sortBy === 'due') {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      if (sortBy === 'alpha') {
        return a.text.localeCompare(b.text);
      }
      if (sortBy === 'manual') {
        return (a.order || 0) - (b.order || 0);
      }
      // newest (default)
      return parseInt(b.id) - parseInt(a.id);
    });

  // Grouping Logic for "Due Date" sort
  const groupedTasks: Record<string, Task[]> = {};
  if (sortBy === 'due') {
    filteredTasks.forEach(task => {
      const group = getTaskGroup(task);
      if (!groupedTasks[group]) groupedTasks[group] = [];
      groupedTasks[group].push(task);
    });
  }

  const groupOrder = ['Overdue', 'Today', 'Tomorrow', 'Upcoming', 'No Date', 'Completed'];

  const priorityColors = {
    'very-high': 'text-red-600 bg-red-100',
    'high': 'text-orange-600 bg-orange-100',
    'medium': 'text-yellow-600 bg-yellow-100',
    'low': 'text-green-600 bg-green-100',
    'very-low': 'text-blue-600 bg-blue-100'
  };

  const SelectedIcon = ICON_MAP[folderForm.icon] || FolderIcon;

  // Helper to render a task item
  const renderTaskItem = (task: Task) => {
    const folder = folders.find(f => f.id === task.folderId);
    const FIcon = folder ? (ICON_MAP[folder.icon] || FolderIcon) : FolderIcon;
    const isExpanded = expandedTasks.has(task.id);
    const hasSubtasks = task.subtasks && task.subtasks.length > 0;
    const isDraggable = sortBy === 'manual';
    
    return (
      <div 
        key={task.id} 
        draggable={isDraggable}
        onDragStart={(e) => handleDragStart(e, task.id)}
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, task.id)}
        onClick={() => openTaskModal(task)}
        className={`group flex flex-col gap-2 p-4 rounded-xl border bg-[var(--card-bg)] hover:shadow-md transition-all cursor-pointer ${
          task.completed ? 'opacity-60 bg-[var(--highlight-color)]/20 border-[var(--border-color)]' : 'border-[var(--border-color)] hover:border-[var(--accent-color)]/50'
        } ${draggedTaskId === task.id ? 'opacity-50 ring-2 ring-[var(--accent-color)]' : ''}`}
      >
        <div className="flex items-start gap-4">
          
          {isDraggable && (
             <div className="text-[var(--text-color)] opacity-30 cursor-grab hover:opacity-100 flex items-center pt-1" onClick={(e) => e.stopPropagation()}>
               <GripVertical size={20} />
             </div>
          )}

          <button 
            onClick={(e) => { e.stopPropagation(); toggleTask(task.id); }} 
            className="text-[var(--accent-color)] flex-shrink-0 mt-1 hover:scale-110 transition-transform"
          >
            {task.completed ? <CheckCircle size={22} /> : <Circle size={22} />}
          </button>
          
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start">
               <p className={`text-base md:text-lg font-medium truncate ${task.completed ? 'line-through decoration-2 decoration-[var(--text-color)]/30' : ''}`}>
                {task.text}
              </p>
              {hasSubtasks && (
                <div className="flex items-center gap-2">
                  <span className="text-[10px] bg-[var(--highlight-color)] px-1.5 py-0.5 rounded text-[var(--text-color)]/60 font-bold ml-2">
                    {task.subtasks!.filter(s => s.completed).length}/{task.subtasks!.length}
                  </span>
                  <button 
                     onClick={(e) => { e.stopPropagation(); toggleExpand(task.id); }}
                     className="p-1 hover:bg-[var(--highlight-color)] rounded text-[var(--text-color)]/60"
                  >
                     {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                </div>
              )}
            </div>
            
            {task.description && (
               <p className="text-sm opacity-60 truncate mt-0.5">{task.description}</p>
            )}
            
            <div className="flex flex-wrap gap-2 mt-2 items-center">
              {/* Priority Badge */}
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide ${priorityColors[task.priority]}`}>
                {task.priority}
              </span>
              
              {/* Folder Badge (Only if in All view) */}
              {selectedFolderId === 'all' && folder && (
                <span className="text-[10px] flex items-center gap-1 px-2 py-0.5 rounded-full border border-[var(--border-color)] text-[var(--text-color)] opacity-70">
                   <FIcon size={10} color={folder.color} /> {folder.name}
                </span>
              )}

              {/* Date */}
              {task.dueDate && (
                <span className={`text-[10px] flex items-center gap-1 font-bold ${new Date(task.dueDate) < new Date() && !task.completed ? 'text-red-500' : 'text-[var(--text-color)] opacity-50'}`}>
                  <Calendar size={10} /> {new Date(task.dueDate).toLocaleDateString()}
                  {task.dueDate.includes('T') && <span>{new Date(task.dueDate).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>}
                </span>
              )}
            </div>
          </div>
          
          <div className="flex flex-col gap-1">
            <button 
              onClick={(e) => { e.stopPropagation(); deleteTask(task.id); }} 
              className="p-2 text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 size={18} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); openTaskModal(task); }}
              className="p-2 text-[var(--text-color)] hover:bg-[var(--highlight-color)] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Edit2 size={18} />
            </button>
          </div>
        </div>

        {/* Inline Subtasks */}
        {hasSubtasks && isExpanded && (
           <div className="ml-10 mt-2 pl-4 border-l-2 border-[var(--border-color)] space-y-2 animate-fade-in-down">
             {task.subtasks!.map(sub => (
               <div 
                 key={sub.id} 
                 onClick={(e) => { e.stopPropagation(); toggleSubtask(task.id, sub.id); }}
                 className="flex items-center gap-3 py-1 cursor-pointer hover:opacity-80"
               >
                 <div className={`w-4 h-4 rounded-full border border-[var(--text-color)]/30 flex items-center justify-center transition-colors ${sub.completed ? 'bg-[var(--accent-color)] border-[var(--accent-color)]' : ''}`}>
                    {sub.completed && <CheckCircle size={10} className="text-white" />}
                 </div>
                 <span className={`text-sm ${sub.completed ? 'line-through opacity-50' : ''}`}>{sub.text}</span>
               </div>
             ))}
           </div>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-0 md:p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-[var(--card-bg)] w-full h-full md:w-full md:max-w-5xl md:h-[90vh] rounded-none md:rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden relative border-none md:border border-[var(--border-color)]">
        
        {/* --- SIDEBAR (FOLDERS) --- */}
        <div className="w-full md:w-64 bg-[var(--highlight-color)]/30 border-b md:border-b-0 md:border-r border-[var(--border-color)] flex flex-col">
          
          {/* Sidebar Header */}
          <div className="p-4 flex items-center justify-between">
            <h3 className="font-bold text-[var(--text-color)] opacity-70 uppercase text-xs tracking-wider">Collections</h3>
            <button onClick={() => openFolderModal()} className="p-1.5 hover:bg-[var(--highlight-color)] rounded-lg text-[var(--accent-color)] transition-colors">
              <Plus size={18} />
            </button>
          </div>

          {/* Folder List (Horizontal scroll on mobile, Vertical on desktop) */}
          <div className="flex-1 overflow-x-auto md:overflow-y-auto flex md:flex-col gap-2 p-2 scrollbar-hide">
            
            {/* "All Tasks" Button */}
            <button
              onClick={() => { setSelectedFolderId('all'); playSound('switch'); }}
              className={`flex-shrink-0 flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium ${
                selectedFolderId === 'all' 
                  ? 'bg-[var(--card-bg)] shadow-sm text-[var(--accent-color)] ring-1 ring-[var(--border-color)]' 
                  : 'text-[var(--text-color)] hover:bg-[var(--highlight-color)]'
              }`}
            >
              <Layout size={18} />
              <span className="flex-1 text-left">All Tasks</span>
              <span className="text-xs opacity-50 bg-[var(--highlight-color)] px-2 py-0.5 rounded-full">{tasks.filter(t => !t.completed).length}</span>
            </button>

            {/* Folder Items */}
            {folders.map(folder => {
              const FolderIconComp = ICON_MAP[folder.icon] || FolderIcon;
              const isActive = selectedFolderId === folder.id;
              const count = tasks.filter(t => t.folderId === folder.id && !t.completed).length;

              return (
                <div 
                  key={folder.id}
                  className={`group relative flex-shrink-0 flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium cursor-pointer ${
                    isActive 
                      ? 'bg-[var(--card-bg)] shadow-sm ring-1 ring-[var(--border-color)]' 
                      : 'hover:bg-[var(--highlight-color)]'
                  }`}
                  onClick={() => { setSelectedFolderId(folder.id); playSound('switch'); }}
                >
                  <FolderIconComp size={18} style={{ color: folder.color }} />
                  <span className={`flex-1 text-left ${isActive ? 'text-[var(--text-color)]' : 'text-[var(--text-color)]/80'}`}>{folder.name}</span>
                  
                  {/* Actions (Only show for non-default or if active) */}
                  <div className="flex items-center gap-1">
                     {count > 0 && <span className="text-xs opacity-50 bg-[var(--highlight-color)] px-2 py-0.5 rounded-full">{count}</span>}
                     {!folder.isDefault && (
                       <button 
                         onClick={(e) => { e.stopPropagation(); openFolderModal(folder); }}
                         className={`p-1 rounded hover:bg-[var(--highlight-color)] text-[var(--text-color)] opacity-0 group-hover:opacity-100 transition-opacity ${isActive ? 'opacity-100' : ''}`}
                       >
                         <MoreVertical size={14} />
                       </button>
                     )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* --- MAIN CONTENT (TASKS) --- */}
        <div className="flex-1 flex flex-col min-w-0 bg-[var(--card-bg)] relative">
          
          {/* Header */}
          <div className="p-4 md:p-6 border-b border-[var(--border-color)] flex flex-col gap-4 bg-[var(--bg-color)]/50 backdrop-blur-sm z-10">
            <div className="flex justify-between items-center">
               <div className="min-w-0">
                 <h2 className="text-xl md:text-2xl font-bold text-[var(--text-color)] flex items-center gap-2 truncate">
                   {selectedFolderId === 'all' ? 'All Tasks' : folders.find(f => f.id === selectedFolderId)?.name}
                 </h2>
                 <p className="text-xs opacity-50 font-medium">
                   {filteredTasks.length} {filteredTasks.length === 1 ? 'Task' : 'Tasks'} • {new Date().toLocaleDateString()}
                 </p>
               </div>
               
               <div className="flex items-center gap-2">
                 {/* Desktop Filters */}
                 <div className="hidden md:flex bg-[var(--highlight-color)] p-1 rounded-lg">
                  {['all', 'pending', 'completed'].map((f) => (
                    <button
                      key={f}
                      onClick={() => { setFilter(f as any); playSound('click'); }}
                      className={`px-3 py-1.5 rounded-md text-xs font-bold capitalize transition-all ${
                        filter === f 
                        ? 'bg-[var(--card-bg)] text-[var(--accent-color)] shadow-sm' 
                        : 'text-[var(--text-color)] opacity-60 hover:opacity-100'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
                
                {/* Search Toggle */}
                <button onClick={() => { setShowSearch(!showSearch); playSound('click'); }} className={`p-2 rounded-full transition-colors ${showSearch ? 'bg-[var(--accent-color)] text-[var(--accent-text-color)]' : 'hover:bg-[var(--highlight-color)] text-[var(--text-color)]'}`}>
                   <Search size={20} />
                </button>
                
                {/* Sort Toggle */}
                <div className="relative group">
                   <button className="p-2 hover:bg-[var(--highlight-color)] rounded-full text-[var(--text-color)]">
                     <ArrowUpDown size={20} />
                   </button>
                   {/* Dropdown */}
                   <div className="absolute right-0 top-full mt-2 w-40 bg-[var(--card-bg)] border border-[var(--border-color)] rounded-xl shadow-xl p-1 hidden group-hover:block z-50">
                     {[
                       { id: 'newest', label: 'Newest First' },
                       { id: 'due', label: 'Due Date' },
                       { id: 'priority', label: 'Priority' },
                       { id: 'alpha', label: 'A-Z' },
                       { id: 'manual', label: 'Manual Sort' },
                     ].map((opt) => (
                       <button
                         key={opt.id}
                         onClick={() => { setSortBy(opt.id as any); playSound('click'); }}
                         className={`w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-[var(--highlight-color)] ${sortBy === opt.id ? 'text-[var(--accent-color)] font-bold' : ''}`}
                       >
                         {opt.label}
                       </button>
                     ))}
                   </div>
                </div>

                <button onClick={onClose} className="p-2 hover:bg-[var(--highlight-color)] rounded-full text-[var(--text-color)] transition-colors">
                  <X size={24} />
                </button>
               </div>
            </div>

            {/* Expandable Search Bar */}
            {showSearch && (
               <div className="animate-fade-in-down">
                 <div className="relative">
                   <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-color)] opacity-50" />
                   <input 
                     type="text" 
                     autoFocus
                     placeholder="Search tasks..." 
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                     className="w-full pl-10 pr-4 py-2.5 bg-[var(--highlight-color)] border border-[var(--border-color)] rounded-xl text-sm outline-none focus:border-[var(--accent-color)]"
                   />
                 </div>
               </div>
            )}
            
            {/* Mobile Filter Tabs */}
            <div className="md:hidden flex bg-[var(--highlight-color)] p-1 rounded-lg">
                {['all', 'pending', 'completed'].map((f) => (
                  <button
                    key={f}
                    onClick={() => { setFilter(f as any); playSound('click'); }}
                    className={`flex-1 py-1.5 rounded-md text-xs font-bold capitalize transition-all ${
                      filter === f 
                      ? 'bg-[var(--card-bg)] text-[var(--accent-color)] shadow-sm' 
                      : 'text-[var(--text-color)] opacity-60 hover:opacity-100'
                    }`}
                  >
                    {f}
                  </button>
                ))}
            </div>
          </div>

          {/* Task List */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-3 pb-24 md:pb-6 relative">
            {filteredTasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full opacity-40 text-center p-8">
                <div className="w-20 h-20 bg-[var(--highlight-color)] rounded-full flex items-center justify-center mb-4">
                   <Inbox size={40} />
                </div>
                <h3 className="text-xl font-bold">No tasks found</h3>
                <p>Adjust your filters or add a new task.</p>
              </div>
            ) : sortBy === 'due' ? (
              // Grouped Render for Date Sorting
              groupOrder.map(groupKey => {
                const groupTasks = groupedTasks[groupKey];
                if (!groupTasks || groupTasks.length === 0) return null;
                
                return (
                  <div key={groupKey} className="space-y-3 mb-6">
                    <h4 className={`text-xs font-bold uppercase tracking-wider pl-1 mb-2 ${
                      groupKey === 'Overdue' ? 'text-red-500' :
                      groupKey === 'Today' ? 'text-[var(--accent-color)]' :
                      'text-[var(--text-color)] opacity-50'
                    }`}>
                      {groupKey}
                    </h4>
                    {groupTasks.map(renderTaskItem)}
                  </div>
                );
              })
            ) : (
              // Standard Flat List
              filteredTasks.map(renderTaskItem)
            )}
          </div>

          {/* New Task FAB / Button */}
          <div className="absolute bottom-6 right-6 z-20">
             <button
               onClick={() => openTaskModal()}
               className="flex items-center gap-2 bg-[var(--accent-color)] text-[var(--accent-text-color)] pl-4 pr-6 py-4 rounded-full shadow-xl hover:scale-105 active:scale-95 transition-all font-bold"
             >
               <Plus size={24} />
               <span>New Task</span>
             </button>
          </div>

        </div>
      </div>

      {/* --- TASK FORM MODAL --- */}
      <TaskFormModal 
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSubmit={handleSaveTask}
        initialData={editingTask}
        folders={folders}
        currentFolderId={selectedFolderId}
        playSound={playSound}
      />

      {/* --- FOLDER MODAL --- */}
      {isFolderModalOpen && (
        <div className="absolute inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-[var(--card-bg)] w-full max-w-sm rounded-2xl shadow-2xl border border-[var(--border-color)] overflow-hidden animate-fade-in-up">
            <div className="p-4 border-b border-[var(--border-color)] flex justify-between items-center">
              <h3 className="font-bold text-[var(--text-color)]">{editingFolderId ? 'Edit Folder' : 'New Folder'}</h3>
              <button onClick={closeFolderModal} className="p-1 rounded-full hover:bg-[var(--highlight-color)]"><X size={20} /></button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Name Input */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase opacity-60">Folder Name</label>
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-[var(--highlight-color)] text-[var(--accent-color)]">
                    <SelectedIcon size={24} style={{ color: folderForm.color }} />
                  </div>
                  <input 
                    type="text" 
                    value={folderForm.name}
                    onChange={e => setFolderForm({...folderForm, name: e.target.value})}
                    placeholder="e.g. Work, Hobbies..."
                    className="flex-1 p-3 rounded-xl bg-[var(--highlight-color)] border border-[var(--border-color)] outline-none focus:border-[var(--accent-color)]"
                    autoFocus
                  />
                </div>
              </div>

              {/* Color Picker */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase opacity-60">Color Code</label>
                <div className="flex flex-wrap gap-3">
                  {COLOR_PALETTE.map(c => (
                    <button
                      key={c}
                      onClick={() => { setFolderForm({...folderForm, color: c}); playSound('click'); }}
                      className={`w-8 h-8 rounded-full transition-transform hover:scale-110 ${folderForm.color === c ? 'ring-2 ring-[var(--text-color)] scale-110' : ''}`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              {/* Icon Picker */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase opacity-60">Icon</label>
                <div className="grid grid-cols-6 gap-2">
                  {Object.keys(ICON_MAP).map(iconKey => {
                    const IComp = ICON_MAP[iconKey];
                    return (
                      <button
                        key={iconKey}
                        onClick={() => { setFolderForm({...folderForm, icon: iconKey}); playSound('click'); }}
                        className={`aspect-square flex items-center justify-center rounded-lg hover:bg-[var(--highlight-color)] transition-colors ${folderForm.icon === iconKey ? 'bg-[var(--highlight-color)] text-[var(--accent-color)]' : 'text-[var(--text-color)]/60'}`}
                      >
                        <IComp size={20} />
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-[var(--border-color)] bg-[var(--highlight-color)]/20 flex gap-3">
              {editingFolderId && !folders.find(f => f.id === editingFolderId)?.isDefault && (
                <button 
                  onClick={() => { closeFolderModal(); deleteFolder(editingFolderId); }}
                  className="p-3 text-red-500 hover:bg-red-100 rounded-xl transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              )}
              <button 
                onClick={saveFolder}
                disabled={!folderForm.name.trim()}
                className="flex-1 py-3 bg-[var(--accent-color)] text-[var(--accent-text-color)] font-bold rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {editingFolderId ? 'Save Changes' : 'Create Folder'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default TodoOverlay;
