'use client';

import { type JournalEntry } from '@/types';
import { EntryCard } from './entry-card';
import { ScrollArea } from './ui/scroll-area';

type TimelineProps = {
  entries: JournalEntry[];
};

export function Timeline({ entries }: TimelineProps) {
  if (entries.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center text-muted-foreground">
          <p className="text-lg font-semibold">No entries yet.</p>
          <p>Start writing to fill your journal.</p>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="space-y-4 pr-4">
        {entries.map((entry) => (
          <EntryCard key={entry.id} entry={entry} />
        ))}
      </div>
    </ScrollArea>
  );
}
