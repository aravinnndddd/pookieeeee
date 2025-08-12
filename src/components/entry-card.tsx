'use client';
import { format, formatDistanceToNow } from 'date-fns';
import { MapPin, User, Building, Tag, CalendarIcon } from 'lucide-react';

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

type EntryCardProps = {
  entry: JournalEntry;
};

export function EntryCard({ entry }: EntryCardProps) {
  return (
    <Card className="w-full transition-shadow duration-300 hover:shadow-md">
      <CardHeader>
        <CardTitle className="font-headline text-lg">
          {format(new Date(entry.dateTime), 'EEEE, MMMM d, yyyy')}
        </CardTitle>
        <CardDescription>
          {format(new Date(entry.dateTime), 'p')} &middot;{' '}
          {formatDistanceToNow(new Date(entry.dateTime), { addSuffix: true })}
        </CardDescription>
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
