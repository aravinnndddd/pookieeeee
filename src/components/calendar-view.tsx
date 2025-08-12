'use client';

import * as React from 'react';
import { type JournalEntry } from '@/types';
import { Calendar } from '@/components/ui/calendar';

type CalendarViewProps = {
  entries: JournalEntry[];
  onDateSelect: (date: Date | undefined) => void;
  selectedDate?: Date;
};

export function CalendarView({ entries, onDateSelect, selectedDate }: CalendarViewProps) {
  const daysWithEntries = React.useMemo(() => {
    return entries.map(entry => new Date(entry.dateTime));
  }, [entries]);

  const modifiers = {
    hasEntry: daysWithEntries,
  };

  const modifiersStyles = {
    hasEntry: {
      position: 'relative' as React.CSSProperties['position'],
      color: 'hsl(var(--primary-foreground))',
      backgroundColor: 'hsl(var(--primary))',
    },
  };
  
  const today = new Date();

  return (
    <div className="flex flex-col items-center">
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={onDateSelect}
        modifiers={modifiers}
        modifiersStyles={modifiersStyles}
        className="rounded-md border"
        month={selectedDate || today}
        onMonthChange={(month) => onDateSelect(undefined)} // Clear selection on month change
        footer={
          <p className="text-sm text-muted-foreground pt-2 text-center">
            {selectedDate ? `You selected ${selectedDate.toLocaleDateString()}.` : 'Select a day to see entries.'}
          </p>
        }
      />
    </div>
  );
}
