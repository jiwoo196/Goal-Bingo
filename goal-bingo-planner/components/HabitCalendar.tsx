
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface HabitCalendarProps {
  completedDates: string[];
  onToggle: (date: string) => void;
}

export const HabitCalendar: React.FC<HabitCalendarProps> = ({ completedDates, onToggle }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const monthName = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(currentDate);

  const days = [];
  // Padding for start of month
  for (let i = 0; i < firstDay; i++) {
    days.push(<div key={`pad-${i}`} className="h-10" />);
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = new Date(year, month, d).toISOString().split('T')[0];
    const isCompleted = completedDates.includes(dateStr);
    const isToday = new Date().toISOString().split('T')[0] === dateStr;

    days.push(
      <button
        key={d}
        onClick={() => onToggle(dateStr)}
        className={`h-10 w-10 rounded-xl text-xs font-bold transition-all flex items-center justify-center ${
          isCompleted 
          ? 'bg-indigo-600 text-white shadow-md' 
          : isToday 
            ? 'bg-indigo-100 text-indigo-600 border border-indigo-200' 
            : 'bg-white text-slate-500 hover:bg-indigo-50'
        }`}
      >
        {d}
      </button>
    );
  }

  return (
    <div className="flex flex-col select-none">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-black text-slate-800">{monthName} {year}</h3>
        <div className="flex gap-2">
          <button onClick={prevMonth} className="p-2 hover:bg-white rounded-lg transition-all text-slate-400"><ChevronLeft size={16} /></button>
          <button onClick={nextMonth} className="p-2 hover:bg-white rounded-lg transition-all text-slate-400"><ChevronRight size={16} /></button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-2 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
        <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
      </div>
      <div className="grid grid-cols-7 gap-2">
        {days}
      </div>
      <div className="mt-4 flex items-center justify-between text-[11px] font-bold text-indigo-400 uppercase tracking-tighter">
        <span>{completedDates.filter(d => d.startsWith(`${year}-${(month + 1).toString().padStart(2, '0')}`)).length} COMPLETED THIS MONTH</span>
        <div className="flex gap-2">
           <div className="flex items-center gap-1"><div className="w-2 h-2 bg-indigo-600 rounded-full"></div> Done</div>
           <div className="flex items-center gap-1"><div className="w-2 h-2 bg-indigo-100 rounded-full"></div> Today</div>
        </div>
      </div>
    </div>
  );
};
