
export type GoalType = 'regular' | 'count' | 'habit';

export interface Goal {
  id: string;
  title: string;
  type: GoalType;
  targetCount?: number;
  currentCount?: number;
  habitDates: string[]; // ISO date strings
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  notes: string;
  isCompleted: boolean;
}

export type GridSize = 3 | 4;

export interface AppState {
  userName: string;
  gridSize: GridSize;
  targetBingos: number;
  goals: Goal[];
  step: 'setup' | 'filling' | 'main';
}

export const DEFAULT_GOAL_DURATION_DAYS = 365;
