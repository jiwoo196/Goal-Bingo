
import React, { useState } from 'react';
import { AppState, Goal } from '../types';
import { GoalModal } from './GoalModal';
import { RefreshCcw, Target as TargetIcon, TrendingUp } from 'lucide-react';

interface MainBingoBoardProps {
  state: AppState;
  onUpdateGoal: (goal: Goal) => void;
  onReset: () => void;
}

export const MainBingoBoard: React.FC<MainBingoBoardProps> = ({ state, onUpdateGoal, onReset }) => {
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  
  const completedCount = state.goals.filter(g => g.isCompleted).length;
  const progress = Math.round((completedCount / state.goals.length) * 100);

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-hidden animate-in slide-in-from-bottom duration-500">
      {/* Header */}
      <div className="bg-indigo-600 p-8 rounded-b-[3rem] shadow-xl text-white">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold tracking-tight">{state.userName}'s BINGO</h1>
          <div className="w-10 h-10 rounded-full bg-indigo-400/50 flex items-center justify-center">
            <span className="text-lg font-bold">{state.userName[0].toUpperCase()}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-6 mt-6">
          <div className="flex-1 bg-white/10 rounded-2xl p-4 backdrop-blur-md">
            <div className="flex items-center gap-2 mb-1 text-indigo-100 text-xs font-bold uppercase tracking-widest">
              <TrendingUp size={14} /> Progress
            </div>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-black">{progress}%</span>
              <div className="flex-1 h-2 bg-indigo-800/50 rounded-full mb-2 overflow-hidden">
                <div 
                  className="h-full bg-white transition-all duration-1000 ease-out" 
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
          
          <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-md">
            <div className="flex items-center gap-2 mb-1 text-indigo-100 text-xs font-bold uppercase tracking-widest">
              <TargetIcon size={14} /> Target
            </div>
            <span className="text-3xl font-black">{state.targetBingos}</span>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 p-6 flex items-center justify-center">
        <div 
          className="grid gap-4 w-full aspect-square"
          style={{ 
            gridTemplateColumns: `repeat(${state.gridSize}, minmax(0, 1fr))` 
          }}
        >
          {state.goals.map((goal) => (
            <button
              key={goal.id}
              onClick={() => setSelectedGoal(goal)}
              className={`relative flex flex-col items-center justify-center p-2 rounded-3xl text-center shadow-sm border transition-all duration-300 transform hover:scale-[1.02] active:scale-95 group overflow-hidden ${
                goal.isCompleted 
                ? 'bg-[#bbf7d0] border-[#86efac] text-emerald-900 shadow-emerald-100' 
                : 'bg-white border-slate-100 text-slate-700 hover:border-indigo-200 shadow-slate-100'
              }`}
            >
              <span className="text-xs md:text-sm font-bold line-clamp-2 leading-tight">
                {goal.title}
              </span>
              
              {goal.type === 'count' && !goal.isCompleted && (
                <div className="mt-1 px-2 py-0.5 bg-slate-100 rounded-full text-[10px] font-black text-slate-400">
                  {goal.currentCount}/{goal.targetCount}
                </div>
              )}

              {goal.type === 'habit' && !goal.isCompleted && (
                <div className="mt-1 px-2 py-0.5 bg-slate-100 rounded-full text-[10px] font-black text-slate-400">
                  {goal.habitDates.length} Days
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 pt-0 mt-auto">
        <button
          onClick={onReset}
          className="w-full py-4 border-2 border-slate-200 text-slate-500 rounded-[2rem] font-bold hover:bg-slate-100 hover:text-slate-700 hover:border-slate-300 transition-all flex items-center justify-center gap-2 group"
        >
          <RefreshCcw size={18} className="group-hover:rotate-180 transition-transform duration-500" />
          Reset Board
        </button>
      </div>

      {selectedGoal && (
        <GoalModal
          goal={selectedGoal}
          onClose={() => setSelectedGoal(null)}
          onUpdate={(updated) => {
            onUpdateGoal(updated);
            setSelectedGoal(updated);
          }}
        />
      )}
    </div>
  );
};
