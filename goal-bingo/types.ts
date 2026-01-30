
export enum GoalType {
  GENERAL = 'GENERAL',
  COUNT = 'COUNT',
  HABIT = 'HABIT'
}

export interface HabitTracker {
  [key: string]: boolean; // date string "YYYY-MM-DD": completion
}

export interface Goal {
  id: string;
  title: string;
  type: GoalType;
  targetCount?: number;
  currentCount?: number;
  habitTracker?: HabitTracker;
  startDate: string;
  endDate: string;
  notes: string;
  isCompleted: boolean;
}

export type GridSize = 3 | 4;

export interface BingoBoard {
  userName: string;
  size: GridSize;
  targetBingos: number;
  goals: Goal[];
  completedLines: number;
}

export type AppStage = 'SETUP' | 'FILLING' | 'ACTIVE';
