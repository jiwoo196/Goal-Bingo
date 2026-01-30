
import React, { useState, useMemo, useEffect } from 'react';
import { X, Plus, Minus, Calendar as CalendarIcon, StickyNote, ChevronLeft, ChevronRight } from 'lucide-react';
import { Goal, GoalType } from '../types';

interface GoalModalProps {
  goal: Partial<Goal>;
  onSave: (goal: Goal) => void;
  onClose: () => void;
  isViewOnly?: boolean;
  onComplete?: (updatedGoal?: Goal) => void;
}

export const GoalModal: React.FC<GoalModalProps> = ({ goal, onSave, onClose, isViewOnly, onComplete }) => {
  const [formData, setFormData] = useState<Partial<Goal>>({
    title: '',
    type: GoalType.GENERAL,
    targetCount: 1,
    currentCount: 0,
    habitTracker: {},
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
    notes: '',
    isCompleted: false,
    ...goal
  });

  // Calendar State for Habit Tracker
  const [currentDate, setCurrentDate] = useState(new Date());

  const handleSave = () => {
    if (!formData.title) return;
    onSave(formData as Goal);
  };

  const incrementCount = () => {
    const nextCount = (formData.currentCount || 0) + 1;
    const target = formData.targetCount || 1;
    const isNowCompleted = nextCount >= target;
    
    const updated = { 
      ...formData, 
      currentCount: nextCount, 
      isCompleted: isNowCompleted || formData.isCompleted 
    };
    
    setFormData(updated);
    
    // Auto-complete if target reached and not already completed
    if (isNowCompleted && !formData.isCompleted && isViewOnly) {
      setTimeout(() => {
        onComplete?.(updated as Goal);
      }, 500);
    }
  };

  const decrementCount = () => {
    const nextCount = Math.max(0, (formData.currentCount || 0) - 1);
    setFormData({ ...formData, currentCount: nextCount });
  };

  // Monthly Calendar Generation
  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      days.push(date.toISOString().split('T')[0]);
    }
    return days;
  }, [currentDate]);

  const toggleHabitDay = (dateStr: string) => {
    const newTracker = { ...(formData.habitTracker || {}) };
    newTracker[dateStr] = !newTracker[dateStr];
    
    const currentMonthDays = calendarDays.filter(d => d !== null) as string[];
    const allChecked = currentMonthDays.length > 0 && currentMonthDays.every(d => !!newTracker[d]);
    
    setFormData({ ...formData, habitTracker: newTracker });

    if (allChecked) {
      setTimeout(() => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
      }, 300);
    }
  };

  const monthYearStr = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const isReadyToComplete = () => {
    if (formData.type === GoalType.COUNT) {
      return (formData.currentCount || 0) >= (formData.targetCount || 1);
    }
    return true;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-[2rem] w-full max-w-lg shadow-2xl overflow-hidden celebration-popup">
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800">{isViewOnly ? 'Goal Details' : 'Setup Goal'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto no-scrollbar">
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-400 mb-2 uppercase tracking-widest">Title</label>
            <input 
              type="text" 
              readOnly={isViewOnly}
              className={`w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-[#38B2AC] outline-none text-xl font-bold transition-all shadow-sm ${isViewOnly ? 'cursor-default bg-white border border-gray-100' : ''}`}
              placeholder="What's your goal?"
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div className={`bg-gray-50 p-4 rounded-2xl border border-gray-100 ${isViewOnly ? 'bg-white' : ''}`}>
              <label className="flex items-center text-[10px] font-bold text-gray-400 mb-1 uppercase"><CalendarIcon className="w-3 h-3 mr-1" /> Start Date</label>
              <input 
                type="date" 
                readOnly={isViewOnly}
                className="bg-transparent border-none text-sm font-bold w-full outline-none" 
                value={formData.startDate} 
                onChange={e => setFormData({...formData, startDate: e.target.value})} 
              />
            </div>
            <div className={`bg-gray-50 p-4 rounded-2xl border border-gray-100 ${isViewOnly ? 'bg-white' : ''}`}>
              <label className="flex items-center text-[10px] font-bold text-gray-400 mb-1 uppercase"><CalendarIcon className="w-3 h-3 mr-1" /> End Date</label>
              <input 
                type="date" 
                readOnly={isViewOnly}
                className="bg-transparent border-none text-sm font-bold w-full outline-none" 
                value={formData.endDate} 
                onChange={e => setFormData({...formData, endDate: e.target.value})} 
              />
            </div>
          </div>

          {/* Goal Type & Trackers */}
          <div className="space-y-6">
            {!isViewOnly && (
              <div>
                <label className="block text-sm font-semibold text-gray-400 mb-2 uppercase tracking-widest">Goal Type</label>
                <div className="grid grid-cols-3 gap-3">
                  {[GoalType.GENERAL, GoalType.COUNT, GoalType.HABIT].map(type => (
                    <button
                      key={type}
                      onClick={() => setFormData({...formData, type})}
                      className={`p-3 rounded-xl text-xs font-black transition-all ${formData.type === type ? 'bg-[#38B2AC] text-white shadow-lg' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {formData.type === GoalType.COUNT && (
              <div className="space-y-4">
                {!isViewOnly && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-400 mb-2 uppercase tracking-widest">Target Count</label>
                    <input 
                      type="number" 
                      className="w-full p-4 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-[#38B2AC] outline-none text-xl font-black"
                      value={formData.targetCount}
                      onChange={e => setFormData({...formData, targetCount: parseInt(e.target.value) || 1})}
                    />
                  </div>
                )}
                {isViewOnly && (
                  <div className="bg-teal-50 p-6 rounded-3xl border border-teal-100 flex items-center justify-between shadow-sm">
                    <button onClick={decrementCount} className="p-3 bg-white rounded-2xl shadow-sm text-teal-600 active:scale-90 border border-teal-100"><Minus /></button>
                    <div className="text-center">
                      <p className="text-3xl font-black text-gray-800">{formData.currentCount} <span className="text-gray-400 text-lg">/ {formData.targetCount}</span></p>
                    </div>
                    <button onClick={incrementCount} className="p-3 bg-[#38B2AC] rounded-2xl shadow-lg text-white active:scale-90"><Plus /></button>
                  </div>
                )}
              </div>
            )}

            {formData.type === GoalType.HABIT && isViewOnly && (
              <div className="bg-indigo-50 p-6 rounded-3xl border border-indigo-100 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))} className="p-2 hover:bg-white rounded-full transition-colors"><ChevronLeft className="w-4 h-4 text-indigo-400" /></button>
                  <p className="text-sm font-black text-indigo-700 uppercase tracking-widest">{monthYearStr}</p>
                  <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))} className="p-2 hover:bg-white rounded-full transition-colors"><ChevronRight className="w-4 h-4 text-indigo-400" /></button>
                </div>
                
                <div className="grid grid-cols-7 gap-1">
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
                    <div key={day} className="text-[10px] font-black text-indigo-300 text-center pb-2">{day}</div>
                  ))}
                  {calendarDays.map((dateStr, idx) => (
                    <div key={idx} className="aspect-square flex items-center justify-center p-0.5">
                      {dateStr ? (
                        <button 
                          onClick={() => toggleHabitDay(dateStr)}
                          className={`w-full h-full rounded-xl text-[10px] font-bold flex items-center justify-center transition-all ${formData.habitTracker?.[dateStr] ? 'bg-indigo-500 text-white shadow-md' : 'bg-white text-indigo-200 border border-indigo-50 hover:bg-indigo-100/30'}`}
                        >
                          {new Date(dateStr).getDate()}
                        </button>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {isViewOnly && (
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <label className="flex items-center text-[10px] font-bold text-gray-400 mb-1 uppercase"><StickyNote className="w-3 h-3 mr-1" /> Notes</label>
                <textarea 
                  className="bg-transparent border-none text-sm w-full outline-none h-20 resize-none font-medium" 
                  value={formData.notes} 
                  onChange={e => setFormData({...formData, notes: e.target.value})} 
                  placeholder="Additional thoughts..."
                />
              </div>
            )}
          </div>
        </div>

        <div className="p-6 bg-gray-50/50 flex flex-col space-y-3 border-t border-gray-100">
          <div className="flex space-x-3">
            {isViewOnly ? (
               <button 
                  onClick={handleSave} 
                  className="flex-1 bg-white text-[#38B2AC] border border-[#38B2AC] py-4 rounded-2xl font-bold text-lg hover:bg-teal-50 transition-all shadow-sm"
                >
                  Save Progress
                </button>
            ) : (
                <button 
                  onClick={handleSave} 
                  className="flex-1 bg-[#38B2AC] text-white py-4 rounded-2xl font-bold text-lg hover:shadow-lg transition-all"
                >
                  Save Goal
                </button>
            )}
            
            {isViewOnly && !formData.isCompleted && (
              <button 
                onClick={() => {
                  const updated = { ...formData, isCompleted: true } as Goal;
                  setFormData(updated);
                  onComplete?.(updated);
                }}
                disabled={!isReadyToComplete()}
                className={`flex-1 ${isReadyToComplete() ? 'bg-[#38B2AC] text-white hover:shadow-lg' : 'bg-gray-200 text-gray-400 cursor-not-allowed'} py-4 rounded-2xl font-bold text-lg transition-all`}
              >
                Success
              </button>
            )}
          </div>
          {formData.isCompleted && isViewOnly && (
            <div className="w-full bg-teal-100 text-teal-700 py-4 rounded-2xl font-bold text-lg text-center border-2 border-teal-200">
              Success
            </div>
          )}
          <button 
            onClick={onClose} 
            className="w-full py-3 rounded-2xl font-bold text-gray-400 hover:text-gray-600 transition-all text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
