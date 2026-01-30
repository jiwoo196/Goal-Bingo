
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { GoalModal } from './components/GoalModal';
import { AppStage, BingoBoard, Goal, GoalType, GridSize } from './types';
import { checkBingos } from './utils/bingoLogic';
import { Trophy, Plus, ChevronRight, Grid3X3, AlertCircle, ArrowRight, Settings2, User } from 'lucide-react';

const App: React.FC = () => {
  const [stage, setStage] = useState<AppStage>('SETUP');
  const [gridSize, setGridSize] = useState<GridSize>(3);
  const [targetBingos, setTargetBingos] = useState<number>(1);
  const [userName, setUserName] = useState<string>('');
  const [board, setBoard] = useState<BingoBoard | null>(null);
  const [activeGoalIndex, setActiveGoalIndex] = useState<number | null>(null);
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [isCelebrationOpen, setIsCelebrationOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('goal_bingo_save');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setBoard(data.board);
        setStage(data.stage);
        if (data.board?.userName) setUserName(data.board.userName);
      } catch (e) {
        console.error("Failed to load saved state", e);
      }
    }
  }, []);

  useEffect(() => {
    if (board) {
      localStorage.setItem('goal_bingo_save', JSON.stringify({ board, stage }));
    }
  }, [board, stage]);

  const initializeBoard = () => {
    if (!userName.trim()) {
      alert("Please enter your name!");
      return;
    }
    const emptyGoals: Goal[] = Array.from({ length: gridSize * gridSize }, (_, i) => ({
      id: `goal-${i}`,
      title: '',
      type: GoalType.GENERAL,
      currentCount: 0,
      targetCount: 1,
      habitTracker: {},
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
      notes: '',
      isCompleted: false
    }));
    setBoard({
      userName: userName,
      size: gridSize,
      targetBingos,
      goals: emptyGoals,
      completedLines: 0
    });
    setStage('FILLING');
  };

  const handleCellClick = (index: number) => {
    setActiveGoalIndex(index);
    setShowGoalModal(true);
  };

  const handleGoalSave = (updatedGoal: Goal) => {
    if (!board) return;
    const newGoals = [...board.goals];
    newGoals[activeGoalIndex!] = updatedGoal;
    const newBingoCount = checkBingos(board.size, newGoals);
    setBoard({ ...board, goals: newGoals, completedLines: newBingoCount });
    setShowGoalModal(false);
    setActiveGoalIndex(null);
  };

  const startBingo = () => {
    if (!board) return;
    const allFilled = board.goals.every(g => g.title.trim() !== '');
    if (!allFilled) {
      alert("Please fill all cells before starting!");
      return;
    }
    setStage('ACTIVE');
  };

  const completeGoal = (updatedGoal?: Goal) => {
    if (!board || activeGoalIndex === null) return;
    const newGoals = [...board.goals];
    const goalToComplete = updatedGoal || newGoals[activeGoalIndex];
    goalToComplete.isCompleted = true;
    newGoals[activeGoalIndex] = goalToComplete;
    
    const newBingoCount = checkBingos(board.size, newGoals);
    
    if (newBingoCount > board.completedLines && newBingoCount >= board.targetBingos && !isCelebrationOpen) {
      setIsCelebrationOpen(true);
    }

    setBoard({ ...board, goals: newGoals, completedLines: newBingoCount });
    setShowGoalModal(false);
    setActiveGoalIndex(null);
  };

  const resetAll = () => {
    if (confirm("Reset everything? All progress will be lost and you will return to the setup screen.")) {
      localStorage.removeItem('goal_bingo_save');
      setStage('SETUP');
      setBoard(null);
      setTargetBingos(1);
      setGridSize(3);
      setUserName('');
    }
  };

  return (
    <Layout>
      <header className="mb-10">
        <p className="text-gray-500 font-medium mb-1 uppercase tracking-widest text-xs">Goal Bingo</p>
        <h1 className="text-4xl font-extrabold text-gray-800 tracking-tight">
          {stage === 'SETUP' && "Board Setup"}
          {stage === 'FILLING' && "Define Your Goals"}
          {stage === 'ACTIVE' && `${board?.userName || userName}'s BINGO`}
        </h1>
      </header>

      {stage === 'SETUP' && (
        <div className="max-w-2xl mx-auto bg-white p-10 rounded-[2.5rem] shadow-xl space-y-10 border border-white">
          <section>
            <h3 className="text-xl font-bold text-gray-700 mb-6 flex items-center">
              <User className="mr-2 text-[#38B2AC]" /> 1. Your Name
            </h3>
            <input 
              type="text"
              placeholder="Enter your name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full p-6 bg-gray-50 rounded-[2rem] border-2 border-gray-100 focus:border-[#38B2AC] outline-none text-xl font-bold transition-all"
            />
          </section>

          <section>
            <h3 className="text-xl font-bold text-gray-700 mb-6 flex items-center">
              <Grid3X3 className="mr-2 text-[#38B2AC]" /> 2. Select Grid Size
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {[3, 4].map(size => (
                <button 
                  key={size}
                  onClick={() => setGridSize(size as GridSize)}
                  className={`p-6 rounded-[2rem] border-2 transition-all flex flex-col items-center space-y-2 ${gridSize === size ? 'border-[#38B2AC] bg-teal-50 text-[#38B2AC]' : 'border-gray-100 bg-gray-50 text-gray-400 hover:bg-gray-100'}`}
                >
                  <span className="text-3xl font-black">{size} x {size}</span>
                  <span className="text-sm font-bold">{size * size} Goals</span>
                </button>
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-xl font-bold text-gray-700 mb-6 flex items-center">
              <Trophy className="mr-2 text-yellow-500" /> 3. Set Target Bingos
            </h3>
            <div className="flex items-center space-x-4">
              <input 
                type="number"
                min="1"
                max={gridSize * 2 + 2}
                value={targetBingos}
                onChange={(e) => setTargetBingos(parseInt(e.target.value) || 1)}
                className="flex-1 p-6 bg-gray-50 rounded-[2rem] border-2 border-gray-100 focus:border-[#38B2AC] outline-none text-2xl font-black text-center transition-all"
              />
            </div>
            <p className="mt-4 text-gray-400 text-sm text-center">How many lines do you want to complete to win?</p>
          </section>

          <button 
            onClick={initializeBoard}
            className="w-full bg-[#38B2AC] text-white py-6 rounded-3xl font-black text-xl hover:shadow-2xl hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center space-x-3 group"
          >
            <span>Proceed to Goal Setting</span>
            <ChevronRight className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      )}

      {(stage === 'FILLING' || stage === 'ACTIVE') && board && (
        <div className="flex flex-col space-y-10">
          <div className={`grid ${stage === 'ACTIVE' ? 'lg:grid-cols-3' : 'grid-cols-1 max-w-4xl mx-auto'} gap-10`}>
            {/* Main Board Grid */}
            <div className={stage === 'ACTIVE' ? 'lg:col-span-2' : ''}>
              <div 
                className="grid gap-4 bg-white/60 p-6 rounded-[3rem] shadow-inner border border-white/50"
                style={{ gridTemplateColumns: `repeat(${board.size}, 1fr)` }}
              >
                {board.goals.map((goal, idx) => (
                  <button
                    key={goal.id}
                    onClick={() => handleCellClick(idx)}
                    className={`aspect-square p-4 rounded-3xl flex flex-col items-center justify-center text-center transition-all group relative overflow-hidden
                      ${goal.isCompleted 
                        ? 'bg-[#38B2AC] text-white shadow-lg' 
                        : goal.title 
                          ? 'bg-white text-gray-700 shadow-sm border border-gray-100 hover:border-[#38B2AC]/40 hover:shadow-md' 
                          : 'bg-gray-100/50 text-gray-400 border border-dashed border-gray-300 hover:border-[#38B2AC]'
                      }`}
                  >
                    {goal.title ? (
                      <div className="flex flex-col items-center space-y-2">
                        <span className={`font-bold text-sm leading-tight transition-all ${goal.isCompleted ? 'scale-110' : ''}`}>
                          {goal.title}
                        </span>
                        {stage === 'ACTIVE' && !goal.isCompleted && goal.type === GoalType.COUNT && (
                          <div className="text-[10px] font-black bg-teal-50 text-teal-600 px-2 py-1 rounded-full border border-teal-100">
                             {goal.currentCount} / {goal.targetCount}
                          </div>
                        )}
                        {stage === 'ACTIVE' && !goal.isCompleted && goal.type === GoalType.HABIT && (
                           <div className="flex gap-0.5 mt-1">
                              {[...Array(5)].map((_, i) => (
                                <div key={i} className="w-1.5 h-1.5 rounded-full bg-indigo-200" />
                              ))}
                           </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center space-y-2 opacity-50 group-hover:opacity-100">
                        <Plus className="w-8 h-8" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Add Goal</span>
                      </div>
                    )}
                  </button>
                ))}
              </div>

              {stage === 'FILLING' && (
                <div className="mt-8 flex items-center justify-between bg-white/80 p-6 rounded-[2rem] border border-white shadow-sm">
                  <div className="flex items-center space-x-3">
                     <div className="bg-orange-100 text-orange-600 p-2 rounded-xl">
                        <ArrowRight className="w-5 h-5" />
                     </div>
                     <div>
                        <p className="font-bold text-gray-800">Fill all slots to start</p>
                        <p className="text-xs text-gray-500">Currently {board.goals.filter(g => g.title).length}/{board.size * board.size}</p>
                     </div>
                  </div>
                  <button 
                    onClick={startBingo}
                    className="bg-gray-800 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-black hover:scale-105 active:scale-95 transition-all"
                  >
                    Finish Setup
                  </button>
                </div>
              )}
            </div>

            {/* Side Info - ONLY ACTIVE STAGE */}
            {stage === 'ACTIVE' && (
              <div className="space-y-6">
                <div className="bg-white/90 p-8 rounded-[2.5rem] shadow-lg border border-white">
                  <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                    <Settings2 className="w-5 h-5 mr-2 text-[#38B2AC]" /> Progress
                  </h3>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 font-medium">Target Bingos</span>
                      <span className="text-2xl font-black text-[#38B2AC]">{board.targetBingos}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 font-medium">Completed Lines</span>
                      <span className="text-2xl font-black text-gray-800">{board.completedLines}</span>
                    </div>
                    <div className="h-4 w-full bg-gray-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-[#38B2AC] to-[#4FD1C5] transition-all duration-1000"
                        style={{ width: `${Math.min((board.completedLines / board.targetBingos) * 100, 100)}%` }}
                      />
                    </div>
                    {board.completedLines >= board.targetBingos && (
                      <div className="bg-teal-50 p-4 rounded-2xl border border-teal-100 flex items-center space-x-3 text-teal-700 animate-bounce">
                        <Trophy className="w-5 h-5" />
                        <span className="font-bold">Bingo Goal Reached!</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Reset Button - ONLY ACTIVE STAGE */}
          {stage === 'ACTIVE' && (
            <div className="flex justify-center pt-10 border-t border-gray-200/50">
              <button 
                onClick={resetAll}
                className="px-10 py-4 rounded-2xl bg-white text-red-500 font-bold border border-red-100 hover:bg-red-50 hover:shadow-lg transition-all flex items-center space-x-2"
              >
                <AlertCircle className="w-5 h-5" />
                <span>Reset Board</span>
              </button>
            </div>
          )}
        </div>
      )}

      {showGoalModal && (
        <GoalModal 
          goal={activeGoalIndex !== null ? board!.goals[activeGoalIndex] : {}} 
          onSave={handleGoalSave}
          onClose={() => setShowGoalModal(false)}
          isViewOnly={stage === 'ACTIVE'}
          onComplete={completeGoal}
        />
      )}

      {isCelebrationOpen && (
        <div className="fixed inset-0 z-[100] bg-[#4FD1C5]/20 backdrop-blur-md flex items-center justify-center p-4">
           <div className="bg-white rounded-[3rem] p-12 max-w-md w-full text-center shadow-2xl celebration-popup border-4 border-[#38B2AC]">
              <div className="w-24 h-24 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
                <Trophy className="w-12 h-12 text-[#38B2AC]" />
              </div>
              <h2 className="text-4xl font-black text-gray-800 mb-4">CONGRATS! ✨</h2>
              <p className="text-gray-500 mb-10 font-medium">You've successfully reached your target of <span className="text-[#38B2AC] font-black">{board?.targetBingos}</span> bingo lines!</p>
              <button 
                onClick={() => setIsCelebrationOpen(false)}
                className="w-full bg-[#38B2AC] text-white py-5 rounded-[2rem] font-bold text-lg hover:shadow-xl transition-all"
              >
                Keep Going
              </button>
           </div>
        </div>
      )}
    </Layout>
  );
};

export default App;
