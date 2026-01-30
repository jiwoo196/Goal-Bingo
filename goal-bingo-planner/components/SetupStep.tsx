
import React, { useState } from 'react';
import { GridSize } from '../types';
import { User, LayoutGrid, Target, ArrowRight } from 'lucide-react';

interface SetupStepProps {
  onNext: (name: string, size: GridSize, target: number) => void;
}

export const SetupStep: React.FC<SetupStepProps> = ({ onNext }) => {
  const [name, setName] = useState('');
  const [gridSize, setGridSize] = useState<GridSize>(3);
  const [target, setTarget] = useState(1);

  const isValid = name.trim() !== '' && target > 0;

  return (
    <div className="flex flex-col h-full p-8 animate-in slide-in-from-right duration-500">
      <div className="mt-12 mb-10">
        <h1 className="text-4xl font-extrabold text-slate-800 leading-tight">
          Welcome to <span className="text-indigo-600">Goal Bingo</span>
        </h1>
        <p className="text-slate-500 mt-2 text-lg">Set your targets and start your journey.</p>
      </div>

      <div className="space-y-8 flex-1">
        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 uppercase tracking-wider">
            <User size={16} /> User Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="What's your name?"
            className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-lg"
          />
        </div>

        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 uppercase tracking-wider">
            <LayoutGrid size={16} /> Grid Size
          </label>
          <div className="grid grid-cols-2 gap-4">
            {[3, 4].map((size) => (
              <button
                key={size}
                onClick={() => setGridSize(size as GridSize)}
                className={`py-4 rounded-2xl border-2 transition-all font-bold text-lg ${
                  gridSize === size
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                    : 'border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-300'
                }`}
              >
                {size} x {size}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 uppercase tracking-wider">
            <Target size={16} /> Target Bingos
          </label>
          <input
            type="number"
            min="1"
            max={gridSize * 2 + 2}
            value={target}
            onChange={(e) => setTarget(parseInt(e.target.value) || 1)}
            className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-lg"
          />
        </div>
      </div>

      <button
        disabled={!isValid}
        onClick={() => onNext(name, gridSize, target)}
        className="mt-auto py-5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold rounded-2xl transition-all shadow-xl flex items-center justify-center gap-2 text-xl active:scale-95"
      >
        Get Started <ArrowRight size={24} />
      </button>
    </div>
  );
};
