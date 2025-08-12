'use client';

import * as React from 'react';
import {
  BookText,
  CalendarDays,
  Download,
  ScrollText,
  Search as SearchIcon,
  LogOut,
} from 'lucide-react';
import { format } from 'date-fns';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollection } from 'react-firebase-hooks/firestore';
import { collection, query, where, orderBy, addDoc } from 'firebase/firestore';
import { GoogleAuthProvider, EmailAuthProvider, signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import StyledFirebaseAuth from 'firebaseui-react/StyledFirebaseAuth';


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
import { auth, db } from '@/lib/firebase';
import { getTagsForEntry } from '@/app/actions';

const uiConfig = {
  signInFlow: 'popup',
  signInOptions: [
    GoogleAuthProvider.PROVIDER_ID,
    EmailAuthProvider.PROVIDER_ID,
  ],
  callbacks: {
    signInSuccessWithAuthResult: () => false,
  },
};


function SignIn() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-background text-foreground">
        <div className="text-center space-y-4">
            <h1 className="text-4xl font-headline font-bold">Pookie Journal</h1>
            <p className="text-muted-foreground">Please sign in to continue</p>
            <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={auth} />
        </div>
    </div>
  );
}

function JournalPage() {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();

  const [view, setView] = React.useState<'timeline' | 'calendar'>('timeline');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>();

  const entriesRef = collection(db, 'entries');
  const entriesQuery = user ? query(entriesRef, where('uid', '==', user.uid), orderBy('dateTime', 'desc')) : null;
  const [entriesSnapshot] = useCollection(entriesQuery);

  const entries: JournalEntry[] = React.useMemo(() => {
    if (!entriesSnapshot) return [];
    return entriesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as JournalEntry));
  }, [entriesSnapshot]);


  const handleNewEntry = async (text: string) => {
    if (!user) return;
    const tags = await getTagsForEntry(text);

    const newEntry: Omit<JournalEntry, 'id'> = {
      uid: user.uid,
      text: text,
      dateTime: new Date().toISOString(),
      peopleMentioned: tags?.people || [],
      location: tags?.location || null,
      tags: [],
      media: [],
    };
    await addDoc(collection(db, 'entries'), newEntry);
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

  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/');
  }
  
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

  if (loading) {
    return (
        <div className="flex h-screen items-center justify-center">
            <p>Loading...</p>
        </div>
    );
  }

  if (!user) {
    return <SignIn />;
  }


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
             <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={handleSignOut}>
                  <LogOut className="h-5 w-5" />
                  <span className="sr-only">Sign Out</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Sign Out</p>
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

export default JournalPage;
