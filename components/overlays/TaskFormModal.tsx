
import React, { useState, useEffect } from 'react';
import { Task, Folder, Subtask } from '../../types';
import { 
  X, Calendar, Bell, AlignLeft, Layers, Flag, 
  CheckCircle, Plus, Trash2, Clock 
} from 'lucide-react';

interface TaskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (task: Partial<Task>) => void;
  initialData?: Task | null;
  folders: Folder[];
  currentFolderId: string;
  playSound: (type: 'click' | 'switch' | 'success') => void;
}

const PRIORITIES = ['very-low', 'low', 'medium', 'high', 'very-high'] as const;
const DIFFICULTIES = ['very-easy', 'easy', 'medium', 'hard', 'very-hard'] as const;

const TaskFormModal: React.FC<TaskFormModalProps> = ({ 
  isOpen, onClose, onSubmit, initialData, folders, currentFolderId, playSound 
}) => {
  const [formData, setFormData] = useState<Partial<Task>>({
    text: '',
    description: '',
    folderId: currentFolderId === 'all' ? 'f_inbox' : currentFolderId,
    priority: 'medium',
    difficulty: 'medium',
    subtasks: [],
    reminderEnabled: false,
    reminderMinutesBefore: 15
  });

  const [newSubtask, setNewSubtask] = useState('');

  // Reset or Load Data
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({ ...initialData });
      } else {
        setFormData({
          text: '',
          description: '',
          folderId: currentFolderId === 'all' ? 'f_inbox' : currentFolderId,
          priority: 'medium',
          difficulty: 'medium',
          subtasks: [],
          reminderEnabled: false,
          reminderMinutesBefore: 15,
          dueDate: ''
        });
      }
    }
  }, [isOpen, initialData, currentFolderId]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.text?.trim()) return;
    onSubmit(formData);
    onClose();
  };

  const addSubtask = () => {
    if (!newSubtask.trim()) return;
    const sub: Subtask = {
      id: Date.now().toString(),
      text: newSubtask,
      completed: false
    };
    setFormData(prev => ({ ...prev, subtasks: [...(prev.subtasks || []), sub] }));
    setNewSubtask('');
    playSound('click');
  };

  const removeSubtask = (id: string) => {
    setFormData(prev => ({ ...prev, subtasks: prev.subtasks?.filter(s => s.id !== id) }));
    playSound('click');
  };

  const PriorityIcon = ({ level }: { level: string }) => {
    const colors: Record<string, string> = {
      'very-low': 'text-blue-400', 'low': 'text-green-500', 
      'medium': 'text-yellow-500', 'high': 'text-orange-500', 'very-high': 'text-red-500'
    };
    return <Flag size={16} className={colors[level]} fill="currentColor" fillOpacity={0.2} />;
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-0 md:p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-[var(--card-bg)] w-full h-full md:w-full md:max-w-2xl md:h-auto md:max-h-[90vh] rounded-none md:rounded-3xl shadow-2xl flex flex-col border-none md:border border-[var(--border-color)] animate-fade-in-up">
        
        {/* Header */}
        <div className="p-4 border-b border-[var(--border-color)] flex justify-between items-center bg-[var(--bg-color)]/50">
          <h2 className="text-xl font-bold text-[var(--text-color)] flex items-center gap-2">
            {initialData ? 'Edit Task' : 'New Task'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-[var(--highlight-color)] rounded-full text-[var(--text-color)]"><X size={20} /></button>
        </div>

        {/* Scrollable Form Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Title & Folder */}
          <div className="space-y-4">
             <input 
               type="text" 
               placeholder="What needs to be done?"
               value={formData.text}
               onChange={e => setFormData({...formData, text: e.target.value})}
               className="w-full text-2xl font-bold bg-transparent border-none outline-none placeholder:opacity-40"
               autoFocus
             />
             
             <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
               {folders.map(folder => (
                 <button
                   key={folder.id}
                   onClick={() => { setFormData({...formData, folderId: folder.id}); playSound('click'); }}
                   className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 border transition-all ${
                     formData.folderId === folder.id 
                       ? 'bg-[var(--accent-color)] text-[var(--accent-text-color)] border-transparent' 
                       : 'bg-[var(--highlight-color)] text-[var(--text-color)] border-transparent hover:border-[var(--accent-color)]'
                   }`}
                 >
                   {/* We assume FolderIcon handling or passed icons if needed, simple text for now or passed generic icon */}
                   {folder.name}
                 </button>
               ))}
             </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase opacity-60 flex items-center gap-2"><AlignLeft size={14} /> Description</label>
            <textarea 
              rows={3}
              placeholder="Add details, notes, or links..."
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              className="w-full p-4 rounded-xl bg-[var(--highlight-color)] border border-[var(--border-color)] outline-none focus:border-[var(--accent-color)] resize-none"
            />
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Priority */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase opacity-60 flex items-center gap-2"><Flag size={14} /> Priority</label>
              <div className="flex bg-[var(--highlight-color)] rounded-lg p-1">
                {PRIORITIES.map(p => (
                   <button
                     key={p}
                     onClick={() => { setFormData({...formData, priority: p}); playSound('click'); }}
                     className={`flex-1 h-8 rounded-md flex items-center justify-center transition-all ${formData.priority === p ? 'bg-[var(--card-bg)] shadow-sm' : 'opacity-40 hover:opacity-100'}`}
                     title={p}
                   >
                     <PriorityIcon level={p} />
                   </button>
                ))}
              </div>
            </div>

            {/* Difficulty */}
            <div className="space-y-2">
               <label className="text-xs font-bold uppercase opacity-60 flex items-center gap-2"><Layers size={14} /> Difficulty</label>
               <div className="flex bg-[var(--highlight-color)] rounded-lg p-1">
                {DIFFICULTIES.map(d => (
                   <button
                     key={d}
                     onClick={() => { setFormData({...formData, difficulty: d}); playSound('click'); }}
                     className={`flex-1 h-8 rounded-md text-[10px] font-bold uppercase transition-all ${formData.difficulty === d ? 'bg-[var(--card-bg)] text-[var(--accent-color)] shadow-sm' : 'opacity-40 hover:opacity-100'}`}
                   >
                     {d.split('-')[1] || d}
                   </button>
                ))}
              </div>
            </div>
          </div>

          {/* Scheduling */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase opacity-60 flex items-center gap-2"><Calendar size={14} /> Due Date & Reminders</label>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-[var(--highlight-color)] border border-[var(--border-color)]">
                <Calendar size={18} className="text-[var(--text-color)] opacity-50" />
                <input 
                  type="datetime-local" 
                  value={formData.dueDate || ''}
                  onChange={e => setFormData({...formData, dueDate: e.target.value})}
                  className="bg-transparent border-none outline-none flex-1 text-sm font-medium"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--highlight-color)] border border-[var(--border-color)]">
                <div className="flex items-center gap-3">
                   <Bell size={18} className={formData.reminderEnabled ? 'text-[var(--accent-color)]' : 'opacity-50'} />
                   <span className="text-sm font-medium">Remind me</span>
                </div>
                <div className="flex items-center gap-2">
                   {formData.reminderEnabled && (
                     <select 
                       value={formData.reminderMinutesBefore}
                       onChange={e => setFormData({...formData, reminderMinutesBefore: parseInt(e.target.value)})}
                       className="bg-[var(--card-bg)] text-xs p-1.5 rounded border border-[var(--border-color)] outline-none"
                     >
                       <option value={15}>15m before</option>
                       <option value={60}>1h before</option>
                       <option value={1440}>1d before</option>
                     </select>
                   )}
                   <button 
                     onClick={() => { setFormData({...formData, reminderEnabled: !formData.reminderEnabled}); playSound('switch'); }}
                     className={`w-10 h-6 rounded-full p-1 transition-colors ${formData.reminderEnabled ? 'bg-[var(--accent-color)]' : 'bg-gray-300 dark:bg-gray-600'}`}
                   >
                     <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${formData.reminderEnabled ? 'translate-x-4' : ''}`} />
                   </button>
                </div>
              </div>
            </div>
          </div>

          {/* Subtasks */}
          <div className="space-y-2">
             <label className="text-xs font-bold uppercase opacity-60 flex items-center gap-2"><CheckCircle size={14} /> Subtasks</label>
             <div className="space-y-2">
               {formData.subtasks?.map(sub => (
                 <div key={sub.id} className="flex items-center gap-3 p-2 bg-[var(--highlight-color)]/50 rounded-lg group">
                    <span className="w-2 h-2 rounded-full bg-[var(--accent-color)]" />
                    <span className="flex-1 text-sm">{sub.text}</span>
                    <button onClick={() => removeSubtask(sub.id)} className="opacity-0 group-hover:opacity-100 p-1 text-red-500"><Trash2 size={14} /></button>
                 </div>
               ))}
               <div className="flex gap-2">
                 <input 
                   type="text" 
                   value={newSubtask}
                   onChange={e => setNewSubtask(e.target.value)}
                   onKeyDown={e => e.key === 'Enter' && addSubtask()}
                   placeholder="Add a step..."
                   className="flex-1 p-2 bg-transparent border-b border-[var(--border-color)] outline-none text-sm focus:border-[var(--accent-color)] transition-colors"
                 />
                 <button onClick={addSubtask} className="p-2 text-[var(--accent-color)] hover:bg-[var(--highlight-color)] rounded-lg"><Plus size={18} /></button>
               </div>
             </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-[var(--border-color)] flex justify-end gap-3 bg-[var(--card-bg)] rounded-b-3xl">
           <button onClick={onClose} className="px-6 py-3 rounded-xl font-bold text-[var(--text-color)] hover:bg-[var(--highlight-color)] transition-colors">Cancel</button>
           <button 
             onClick={handleSubmit} 
             disabled={!formData.text?.trim()}
             className="px-8 py-3 rounded-xl font-bold bg-[var(--accent-color)] text-[var(--accent-text-color)] shadow-lg hover:shadow-[var(--accent-color)]/30 hover:-translate-y-1 active:translate-y-0 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
           >
             {initialData ? 'Save Changes' : 'Create Task'}
           </button>
        </div>

      </div>
    </div>
  );
};

export default TaskFormModal;
