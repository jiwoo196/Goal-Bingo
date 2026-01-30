
import React, { useState, useEffect, useCallback } from 'react';
import { SetupStep } from './components/SetupStep';
import { FillingStep } from './components/FillingStep';
import { MainBingoBoard } from './components/MainBingoBoard';
import { AppState, Goal, GridSize } from './types';
import { CheckCircle2, RotateCcw, Play } from 'lucide-react';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    userName: '',
    gridSize: 3,
    targetBingos: 1,
    goals: [],
    step: 'setup',
  });

  const [showWinPopup, setShowWinPopup] = useState(false);
  const [hasAcknowledgedWin, setHasAcknowledgedWin] = useState(false);

  // 첫 화면(설정)으로 이동하는 함수
  const goToSetup = () => {
    setState({
      userName: '',
      gridSize: 3,
      targetBingos: 1,
      goals: [],
      step: 'setup',
    });
    setHasAcknowledgedWin(false);
    setShowWinPopup(false);
  };

  const handleStartSetup = (name: string, size: GridSize, target: number) => {
    setState({
      ...state,
      userName: name,
      gridSize: size,
      targetBingos: target,
      step: 'filling',
    });
    setHasAcknowledgedWin(false);
    setShowWinPopup(false);
  };

  const handleFinishFilling = (goals: Goal[]) => {
    setState({
      ...state,
      goals,
      step: 'main',
    });
  };

  const handleReset = () => {
    if (confirm("빙고판을 초기화하고 처음 설정 화면으로 돌아갈까요? 모든 진행 내용이 사라집니다.")) {
      goToSetup();
    }
  };

  const updateGoal = (updatedGoal: Goal) => {
    setState((prev) => ({
      ...prev,
      goals: prev.goals.map((g) => (g.id === updatedGoal.id ? updatedGoal : g)),
    }));
  };

  const checkBingoWins = useCallback(() => {
    const size = state.gridSize;
    if (state.goals.length === 0) return 0;
    
    const completedIndices = state.goals
      .map((g, idx) => (g.isCompleted ? idx : -1))
      .filter((idx) => idx !== -1);
    
    let winCount = 0;

    // 가로줄 체크
    for (let r = 0; r < size; r++) {
      let fullRow = true;
      for (let c = 0; c < size; c++) {
        if (!completedIndices.includes(r * size + c)) {
          fullRow = false;
          break;
        }
      }
      if (fullRow) winCount++;
    }

    // 세로줄 체크
    for (let c = 0; c < size; c++) {
      let fullCol = true;
      for (let r = 0; r < size; r++) {
        if (!completedIndices.includes(r * size + c)) {
          fullCol = false;
          break;
        }
      }
      if (fullCol) winCount++;
    }

    // 대각선 체크
    let diag1 = true;
    for (let i = 0; i < size; i++) {
      if (!completedIndices.includes(i * size + i)) {
        diag1 = false;
        break;
      }
    }
    if (diag1) winCount++;

    let diag2 = true;
    for (let i = 0; i < size; i++) {
      if (!completedIndices.includes(i * size + (size - 1 - i))) {
        diag2 = false;
        break;
      }
    }
    if (diag2) winCount++;

    return winCount;
  }, [state.goals, state.gridSize]);

  // 빙고 판정 로직
  useEffect(() => {
    if (state.step === 'main') {
      const wins = checkBingoWins();
      if (wins >= state.targetBingos) {
        // 목표 빙고 달성 시 팝업 노출 (이미 확인한 적이 없을 때만)
        if (!hasAcknowledgedWin && !showWinPopup) {
          setShowWinPopup(true);
        }
      } else {
        // 목표 빙고 아래로 떨어지면 (성공 취소 등) '확인 완료' 상태를 초기화
        // 이렇게 하면 다시 빙고를 완성했을 때 팝업이 다시 뜨게 됩니다.
        if (hasAcknowledgedWin) {
          setHasAcknowledgedWin(false);
        }
      }
    }
  }, [state.goals, state.step, state.targetBingos, checkBingoWins, showWinPopup, hasAcknowledgedWin]);

  const handleContinue = () => {
    setShowWinPopup(false);
    setHasAcknowledgedWin(true); // 현재 빙고 상태를 확인했음을 저장
  };

  const handleRestart = () => {
    goToSetup();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-50 relative overflow-x-hidden">
      <div className="w-full max-w-xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col h-[850px] border border-slate-100">
        {state.step === 'setup' && (
          <SetupStep onNext={handleStartSetup} />
        )}

        {state.step === 'filling' && (
          <FillingStep 
            gridSize={state.gridSize} 
            onFinish={handleFinishFilling} 
          />
        )}

        {state.step === 'main' && (
          <MainBingoBoard 
            state={state} 
            onUpdateGoal={updateGoal} 
            onReset={handleReset}
          />
        )}
      </div>

      {showWinPopup && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-6 animate-in fade-in zoom-in duration-300">
          <div className="bg-white rounded-[3rem] p-10 flex flex-col items-center text-center shadow-2xl max-w-sm w-full">
            <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mb-6 animate-bounce">
              <CheckCircle2 className="w-14 h-14 text-emerald-500" />
            </div>
            <h2 className="text-3xl font-black text-slate-800 mb-2 tracking-tight">빙고 달성!</h2>
            <p className="text-slate-500 mb-8 leading-relaxed">
              축하합니다, <strong>{state.userName}</strong>님!<br/>
              설정한 목표 빙고를 모두 이루셨어요. 계속 진행하시겠어요?
            </p>
            
            <div className="flex flex-col w-full gap-3">
              <button 
                onClick={handleContinue}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
              >
                <Play size={20} /> 네, 계속할래요
              </button>
              <button 
                onClick={handleRestart}
                className="w-full py-4 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-2xl transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <RotateCcw size={20} /> 아니오, 새로 만들래요
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
