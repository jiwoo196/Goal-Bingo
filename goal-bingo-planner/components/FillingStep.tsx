
import React, { useState } from 'react';
import { Goal, GoalType, GridSize, DEFAULT_GOAL_DURATION_DAYS } from '../types';
import { Check, ArrowRight, Settings2, Edit3 } from 'lucide-react';

interface FillingStepProps {
  gridSize: GridSize;
  onFinish: (goals: Goal[]) => void;
}

export const FillingStep: React.FC<FillingStepProps> = ({ gridSize, onFinish }) => {
  const cellCount = gridSize * gridSize;
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [goals, setGoals] = useState<Goal[]>(
    Array.from({ length: cellCount }, (_, i) => ({
      id: `goal-${i}`,
      title: '',
      type: 'regular',
      targetCount: 1,
      currentCount: 0,
      habitDates: [],
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(new Date().getTime() + DEFAULT_GOAL_DURATION_DAYS * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      notes: '',
      isCompleted: false,
    }))
  );

  const updateGoal = (index: number, updates: Partial<Goal>) => {
    const newGoals = [...goals];
    newGoals[index] = { ...newGoals[index], ...updates };
    setGoals(newGoals);
  };

  const allFilled = goals.every(g => g.title.trim() !== '');

  if (editingIndex !== null) {
    const currentGoal = goals[editingIndex];
    return (
      <div className="flex flex-col h-full p-6 animate-in zoom-in duration-300 bg-slate-50">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Configure Goal {editingIndex + 1}</h2>
          <p className="text-slate-500">Set the title and type for this bingo cell.</p>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto custom-scrollbar pr-1">
          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
             <label className="block text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Goal Title</label>
             <input
               type="text"
               value={currentGoal.title}
               onChange={(e) => updateGoal(editingIndex, { title: e.target.value })}
               placeholder="e.g. Morning Jog"
               className="w-full text-2xl font-bold text-slate-800 placeholder:text-slate-300 focus:outline-none"
               autoFocus
             />
          </div>

          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100">
            <label className="block text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Goal Type</label>
            <div className="grid grid-cols-1 gap-3">
              {(['regular', 'count', 'habit'] as GoalType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => updateGoal(editingIndex, { type })}
                  className={`px-5 py-4 rounded-2xl flex items-center justify-between border-2 transition-all ${
                    currentGoal.type === type
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                      : 'border-slate-50 bg-slate-50 text-slate-600 hover:border-slate-200'
                  }`}
                >
                  <span className="capitalize font-semibold text-lg">{type} Goal</span>
                  {currentGoal.type === type && <Check size={20} />}
                </button>
              ))}
            </div>
          </div>

          {currentGoal.type === 'count' && (
            <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 animate-in slide-in-from-top">
              <label className="block text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Target Count</label>
              <input
                type="number"
                min="1"
                value={currentGoal.targetCount}
                onChange={(e) => updateGoal(editingIndex, { targetCount: parseInt(e.target.value) || 1 })}
                className="w-full py-3 bg-slate-50 px-4 rounded-xl border border-slate-200 text-xl font-bold"
              />
            </div>
          )}
        </div>

        <button
          onClick={() => setEditingIndex(null)}
          className="mt-6 py-4 bg-indigo-600 text-white font-bold rounded-2xl shadow-lg hover:bg-indigo-700 transition-all active:scale-95"
        >
          Done Editing
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full p-6 animate-in slide-in-from-right duration-500 bg-slate-50">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Fill Your Board</h2>
        <p className="text-slate-500">Tap a cell to write your goal details.</p>
      </div>

      <div className="flex-1 flex items-center justify-center overflow-y-auto">
        <div 
          className="grid gap-3 w-full aspect-square max-w-[400px]"
          style={{ gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))` }}
        >
          {goals.map((goal, idx) => (
            <button
              key={goal.id}
              onClick={() => setEditingIndex(idx)}
              className={`relative flex flex-col items-center justify-center p-2 rounded-2xl text-center shadow-sm border transition-all transform hover:scale-[1.05] active:scale-95 overflow-hidden group ${
                goal.title 
                ? 'bg-white border-indigo-200 text-slate-700' 
                : 'bg-slate-100 border-dashed border-slate-300 text-slate-400'
              }`}
            >
              {goal.title ? (
                <>
                  <span className="text-[10px] md:text-xs font-bold line-clamp-2 leading-tight">
                    {goal.title}
                  </span>
                  <div className="mt-1 flex items-center gap-1">
                    <span className="text-[8px] uppercase font-black px-1.5 py-0.5 bg-indigo-50 text-indigo-500 rounded-md">{goal.type}</span>
                  </div>
                  <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Edit3 size={10} className="text-indigo-400" />
                  </div>
                </>
              ) : (
                <span className="text-[10px] md:text-xs font-medium">Empty</span>
              )}
            </button>
          ))}
        </div>
      </div>

      <button
        disabled={!allFilled}
        onClick={() => onFinish(goals)}
        className="mt-6 py-4 bg-indigo-600 text-white font-bold rounded-2xl shadow-lg hover:bg-indigo-700 disabled:bg-slate-300 transition-all flex items-center justify-center gap-2 active:scale-95"
      >
        Complete Setup <ArrowRight size={20} />
      </button>
    </div>
  );
};
