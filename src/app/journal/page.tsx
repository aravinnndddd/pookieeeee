'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  BookText,
  CalendarDays,
  Download,
  Home,
  ScrollText,
  Search as SearchIcon,
  Trash2,
} from 'lucide-react';
import { format } from 'date-fns';

import { type JournalEntry } from '@/types';
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { useLocalStorage } from '@/hooks/use-local-storage';

function JournalPage() {
  const [view, setView] = useLocalStorage<'timeline' | 'calendar'>('journal-view', 'timeline');
  const [searchQuery, setSearchQuery] = useLocalStorage('journal-search', '');
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>();
  const [entries, setEntries] = useLocalStorage<JournalEntry[]>('journal-entries', []);
  const [loading, setLoading] = React.useState(true);
  const [isClient, setIsClient] = React.useState(false);
  const [entryToDelete, setEntryToDelete] = React.useState<string | null>(null);

  React.useEffect(() => {
    // This runs only on the client, after the component has mounted.
    setIsClient(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500); 
    return () => clearTimeout(timer);
  }, []);

  const handleNewEntry = (newEntry: Omit<JournalEntry, 'id'>) => {
    const entryWithId = { ...newEntry, id: new Date().toISOString() };
    const updatedEntries = [entryWithId, ...entries];
    setEntries(updatedEntries.sort((a,b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime()));
  };

  const handleDeleteRequest = (id: string) => {
    setEntryToDelete(id);
  };

  const handleDeleteConfirm = () => {
    if (entryToDelete) {
      setEntries(entries.filter(entry => entry.id !== entryToDelete));
      setEntryToDelete(null);
    }
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
                  <Button variant="ghost" size="icon" asChild>
                    <Link href="/">
                      <Home className="h-5 w-5" />
                      <span className="sr-only">Go Home</span>
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Back to Home</p>
                </TooltipContent>
              </Tooltip>
            {isClient && (
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
            )}
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
            {loading ? (
              <div className="space-y-4">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
            ) : view === 'timeline' ? (
              <Timeline entries={filteredEntries} onDelete={handleDeleteRequest} />
            ) : (
              <CalendarView
                entries={entries}
                onDateSelect={setSelectedDate}
                selectedDate={selectedDate}
              />
            )}
             {view === 'calendar' && selectedDate && !loading && (
                <div className="mt-4 h-full">
                    <h2 className="text-lg font-semibold mb-2 font-headline px-2">Entries for {format(selectedDate, 'PPP')}</h2>
                    <Timeline entries={filteredEntries} onDelete={handleDeleteRequest} />
                </div>
            )}
          </main>
        </div>

        <footer className="shrink-0 border-t bg-background/95 px-4 py-3 backdrop-blur-sm sm:px-6">
          <EntryForm onNewEntry={handleNewEntry} />
        </footer>
      </div>

       <AlertDialog open={entryToDelete !== null} onOpenChange={(open) => !open && setEntryToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              journal entry.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setEntryToDelete(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </TooltipProvider>
  );
}

export default JournalPage;
