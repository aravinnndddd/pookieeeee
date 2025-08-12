'use client';

import * as React from 'react';
import {
  BookText,
  CalendarDays,
  Download,
  ScrollText,
  Search as SearchIcon,
} from 'lucide-react';
import { format } from 'date-fns';

import { type JournalEntry } from '@/types';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EntryForm } from '@/components/entry-form';
import { Timeline } from '@/components/timeline';
import { CalendarView } from '@/components/calendar-view';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

export default function Home() {
  const [entries, setEntries] = useLocalStorage<JournalEntry[]>(
    'pookie-entries',
    []
  );
  const [view, setView] = React.useState<'timeline' | 'calendar'>('timeline');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>();

  const handleNewEntry = (entry: JournalEntry) => {
    setEntries(prevEntries =>
      [...prevEntries, entry].sort(
        (a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime()
      )
    );
  };
  
  const handleExport = () => {
    if (entries.length === 0) return;
    const dataStr = JSON.stringify(entries, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = `pookie_journal_${format(new Date(), 'yyyy-MM-dd')}.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    document.body.appendChild(linkElement);
    linkElement.click();
    document.body.removeChild(linkElement);
  };
  
  const filteredEntries = React.useMemo(() => {
    let result = entries;

    if (view === 'calendar' && selectedDate) {
      result = result.filter(
        entry =>
          new Date(entry.dateTime).toDateString() === selectedDate.toDateString()
      );
    }

    if (searchQuery) {
      result = result.filter(entry =>
        Object.values(entry).some(value => {
            if (typeof value === 'string') {
                return value.toLowerCase().includes(searchQuery.toLowerCase());
            }
            if (Array.isArray(value)) {
                return value.some(item => typeof item === 'string' && item.toLowerCase().includes(searchQuery.toLowerCase()));
            }
            return false;
        })
      );
    }
    
    return result;
  }, [entries, searchQuery, view, selectedDate]);

  return (
    <TooltipProvider>
      <div className="flex h-screen w-full flex-col bg-background text-foreground">
        <header className="flex shrink-0 items-center justify-between border-b bg-background/95 px-4 py-2 backdrop-blur-sm sm:px-6">
          <div className="flex items-center gap-2">
            <BookText className="h-6 w-6 text-primary" />
            <h1 className="font-headline text-xl font-bold">Pookie Journal</h1>
          </div>
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={handleExport} disabled={entries.length === 0}>
                  <Download className="h-5 w-5" />
                  <span className="sr-only">Export Data</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Export all entries as JSON</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 overflow-hidden p-4 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full max-w-sm">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search entries..."
                className="pl-9"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
            <Tabs
              value={view}
              onValueChange={value => setView(value as 'timeline' | 'calendar')}
              className="w-full sm:w-auto"
            >
              <TabsList className="grid w-full grid-cols-2 sm:w-auto">
                <TabsTrigger value="timeline">
                  <ScrollText className="mr-2 h-4 w-4" />
                  Timeline
                </TabsTrigger>
                <TabsTrigger value="calendar">
                  <CalendarDays className="mr-2 h-4 w-4" />
                  Calendar
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <main className="flex-1 overflow-auto rounded-lg p-2">
            {view === 'timeline' ? (
              <Timeline entries={filteredEntries} />
            ) : (
              <CalendarView
                entries={entries}
                onDateSelect={setSelectedDate}
                selectedDate={selectedDate}
              />
            )}
             {view === 'calendar' && selectedDate && (
                <div className="mt-4 h-full">
                    <h2 className="text-lg font-semibold mb-2 font-headline px-2">Entries for {format(selectedDate, 'PPP')}</h2>
                    <Timeline entries={filteredEntries} />
                </div>
            )}
          </main>
        </div>

        <footer className="shrink-0 border-t bg-background/95 px-4 py-3 backdrop-blur-sm sm:px-6">
          <EntryForm onNewEntry={handleNewEntry} />
        </footer>
      </div>
    </TooltipProvider>
  );
}
