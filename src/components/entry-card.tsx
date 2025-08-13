'use client';
import { format, formatDistanceToNow } from 'date-fns';
import { MapPin, User, Building, Tag, CalendarIcon, Trash2 } from 'lucide-react';

import { type JournalEntry } from '@/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

type EntryCardProps = {
  entry: JournalEntry;
  onDelete: (id: string) => void;
};

export function EntryCard({ entry, onDelete }: EntryCardProps) {
  return (
    <Card className="w-4/5 mx-auto transition-shadow duration-300 hover:shadow-md">
      <CardHeader>
        <div className="flex items-center justify-between">
            <div>
                 <CardTitle className="font-headline text-lg">
                    {format(new Date(entry.dateTime), 'EEEE, MMMM d, yyyy')}
                </CardTitle>
                <CardDescription>
                {format(new Date(entry.dateTime), 'p')} &middot;{' '}
                {formatDistanceToNow(new Date(entry.dateTime), { addSuffix: true })}
                </CardDescription>
            </div>
             <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={() => onDelete(entry.id)}>
                        <Trash2 className="h-4 w-4 text-muted-foreground transition-colors hover:text-destructive" />
                        <span className="sr-only">Delete Entry</span>
                    </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                    <p>Delete Entry</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent>
        <p className="whitespace-pre-wrap text-base">{entry.text}</p>
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2 text-sm">
        {entry.people?.map((person) => (
            <Badge key={person} variant="secondary" className="bg-pink-100 text-pink-800 hover:bg-pink-200 dark:bg-pink-900/50 dark:text-pink-300 dark:hover:bg-pink-900/70">
              <User className="mr-1 h-3 w-3" />
              {person}
            </Badge>
          ))}
        {entry.locations?.map((location) => (
          <Badge key={location} variant="secondary" className="bg-primary/10 text-primary/90 hover:bg-primary/20 dark:bg-primary/20 dark:text-primary-foreground/80 dark:hover:bg-primary/30">
            <MapPin className="mr-1 h-3 w-3" />
            {location}
          </Badge>
        ))}
        {entry.organizations?.map((org) => (
          <Badge key={org} variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:hover:bg-blue-900/70">
            <Building className="mr-1 h-3 w-3" />
            {org}
          </Badge>
        ))}
        {entry.dates?.map((date) => (
            <Badge key={date} variant="secondary" className="bg-purple-100 text-purple-800 hover:bg-purple-200 dark:bg-purple-900/50 dark:text-purple-300 dark:hover:bg-purple-900/70">
              <CalendarIcon className="mr-1 h-3 w-3" />
              {date}
            </Badge>
          ))}
        {entry.topics?.map((topic) => (
            <Badge key={topic} variant="outline">
              <Tag className="mr-1 h-3 w-3" />
              {topic}
            </Badge>
          ))}
      </CardFooter>
    </Card>
  );
}
