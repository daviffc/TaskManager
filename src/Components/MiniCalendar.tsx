"use client"

import { useState } from "react"

function getDaysInMonth(date:Date): Date[]{
    const year = date.getFullYear();
    const month = date.getMonth();

    const firstDayOfMonth = new Date(year, month,1);
    const lastDayOfMonth = new Date(year, month + 1,0);

    const startWeekDay = firstDayOfMonth.getDay();
    
    const days: Date[] = [];

    for (let i = 0; i < startWeekDay; i++){
        days.push(new Date(year, month, 1 - (startWeekDay - i)));
    }

    for (let day = 1; day <= lastDayOfMonth.getDate();day++){
        days.push(new Date(year, month, day));
    }

    return days;
}

export default function MiniCalendar(){
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const days = getDaysInMonth(currentMonth);

    return (
        <div className="w-full max-w-6xl">
      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => (
          <div
            key={day.toISOString()}
            className="flex h-8 w-8 items-center justify-center rounded text-xs text-foreground"
          >
            {day.getDate()}
          </div>
        ))}
      </div>
    </div>

    );
}