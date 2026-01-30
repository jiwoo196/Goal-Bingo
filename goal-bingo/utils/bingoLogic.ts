
import { Goal } from '../types';

export const checkBingos = (size: number, goals: Goal[]): number => {
  let bingoCount = 0;

  // Rows
  for (let r = 0; r < size; r++) {
    let rowComplete = true;
    for (let c = 0; c < size; c++) {
      if (!goals[r * size + c]?.isCompleted) {
        rowComplete = false;
        break;
      }
    }
    if (rowComplete) bingoCount++;
  }

  // Columns
  for (let c = 0; c < size; c++) {
    let colComplete = true;
    for (let r = 0; r < size; r++) {
      if (!goals[r * size + c]?.isCompleted) {
        colComplete = false;
        break;
      }
    }
    if (colComplete) bingoCount++;
  }

  // Diagonals
  let diag1Complete = true;
  for (let i = 0; i < size; i++) {
    if (!goals[i * size + i]?.isCompleted) {
      diag1Complete = false;
      break;
    }
  }
  if (diag1Complete) bingoCount++;

  let diag2Complete = true;
  for (let i = 0; i < size; i++) {
    if (!goals[i * size + (size - 1 - i)]?.isCompleted) {
      diag2Complete = false;
      break;
    }
  }
  if (diag2Complete) bingoCount++;

  return bingoCount;
};
