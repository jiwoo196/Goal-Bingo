
import React from 'react';
import { Goal } from '../types';
import { X, Calendar, ChevronRight, CheckCircle2 } from 'lucide-react';
import { HabitCalendar } from './HabitCalendar';

interface GoalModalProps {
  goal: Goal;
  onClose: () => void;
  onUpdate: (goal: Goal) => void;
}

export const GoalModal: React.FC<GoalModalProps> = ({ goal, onClose, onUpdate }) => {
  const handleToggleCompleted = () => {
    onUpdate({ ...goal, isCompleted: !goal.isCompleted });
  };

  const handleCountUpdate = (delta: number) => {
    const newCount = Math.max(0, (goal.currentCount || 0) + delta);
    const target = goal.targetCount || 1;
    const isCompleted = newCount >= target;
    onUpdate({ ...goal, currentCount: newCount, isCompleted });
  };

  const handleHabitToggle = (dateStr: string) => {
    const newDates = goal.habitDates.includes(dateStr)
      ? goal.habitDates.filter((d) => d !== dateStr)
      : [...goal.habitDates, dateStr];
    onUpdate({ ...goal, habitDates: newDates });
  };

  const handleDateChange = (field: 'startDate' | 'endDate', val: string) => {
    onUpdate({ ...goal, [field]: val });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="w-full max-w-xl bg-white rounded-t-[3rem] sm:rounded-[3rem] p-8 pb-10 shadow-2xl animate-in slide-in-from-bottom duration-500 flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-black text-slate-800">{goal.title}</h2>
          <button 
            onClick={onClose}
            className="p-3 bg-slate-50 rounded-2xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex flex-col gap-6 mb-8 overflow-y-auto custom-scrollbar flex-1 pr-2">
          {/* Goal Period */}
          <div className="bg-slate-50 p-6 rounded-3xl">
            <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
              <Calendar size={14} /> Goal Period
            </label>
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <input 
                  type="date" 
                  value={goal.startDate}
                  onChange={(e) => handleDateChange('startDate', e.target.value)}
                  className="w-full bg-white px-4 py-3 rounded-2xl border border-slate-200 text-sm font-semibold focus:outline-indigo-500"
                />
              </div>
              <ChevronRight className="text-slate-300" size={20} />
              <div className="flex-1">
                <input 
                  type="date" 
                  value={goal.endDate}
                  onChange={(e) => handleDateChange('endDate', e.target.value)}
                  className="w-full bg-white px-4 py-3 rounded-2xl border border-slate-200 text-sm font-semibold focus:outline-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Goal Type Specific Content */}
          <div className="flex-1">
            {goal.type === 'count' && (
              <div className="bg-indigo-50 p-8 rounded-[2.5rem] flex flex-col items-center">
                <label className="text-sm font-bold text-indigo-400 uppercase tracking-widest mb-4">Counter Progress</label>
                <div className="flex items-center gap-8">
                  <button 
                    onClick={() => handleCountUpdate(-1)}
                    className="w-14 h-14 bg-white rounded-2xl shadow-sm text-indigo-600 text-2xl font-bold flex items-center justify-center hover:bg-indigo-100 transition-all active:scale-90"
                  >
                    -
                  </button>
                  <div className="text-center">
                    <span className="text-6xl font-black text-slate-800 leading-none">
                      {goal.currentCount || 0}
                    </span>
                    <div className="text-indigo-400 font-bold mt-1">/ {goal.targetCount}</div>
                  </div>
                  <button 
                    onClick={() => handleCountUpdate(1)}
                    className="w-14 h-14 bg-white rounded-2xl shadow-sm text-indigo-600 text-2xl font-bold flex items-center justify-center hover:bg-indigo-100 transition-all active:scale-90"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {goal.type === 'habit' && (
              <div className="bg-indigo-50 p-6 rounded-[2.5rem]">
                <HabitCalendar 
                  completedDates={goal.habitDates} 
                  onToggle={handleHabitToggle} 
                />
              </div>
            )}

            {goal.type === 'regular' && (
              <div className="bg-emerald-50 p-8 rounded-[2.5rem] text-center">
                <CheckCircle2 className="mx-auto text-emerald-500 mb-4" size={48} />
                <p className="text-emerald-900/60 font-semibold italic">Standard objective: mark it successful when done!</p>
              </div>
            )}
          </div>

          {/* Notes Section */}
          <div className="space-y-3">
             <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Additional Notes</label>
             <textarea 
               value={goal.notes}
               onChange={(e) => onUpdate({...goal, notes: e.target.value})}
               placeholder="Write something specific here..."
               className="w-full p-6 bg-slate-50 border border-slate-200 rounded-3xl min-h-[120px] focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-slate-700 resize-none"
             />
          </div>
        </div>

        {/* Action Footer */}
        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 py-5 rounded-3xl font-black text-xl border-2 border-slate-100 text-slate-500 hover:bg-slate-50 transition-all active:scale-95 flex items-center justify-center"
          >
            BACK
          </button>
          <button
            onClick={handleToggleCompleted}
            className={`flex-[2] py-5 rounded-3xl font-black text-xl shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3 ${
              goal.isCompleted
              ? 'bg-[#bbf7d0] text-emerald-800'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}
          >
            {goal.isCompleted ? 'SUCCESSFUL' : 'MARK AS SUCCESS'}
          </button>
        </div>
      </div>
    </div>
  );
};
