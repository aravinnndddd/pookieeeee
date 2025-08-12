'use client';
import { format, formatDistanceToNow } from 'date-fns';
import { MapPin, User, Tag } from 'lucide-react';

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
        {entry.peopleMentioned.length > 0 &&
          entry.peopleMentioned.map((person) => (
            <Badge key={person} variant="secondary" className="bg-accent/20 text-accent-foreground/80 hover:bg-accent/30">
              <User className="mr-1 h-3 w-3" />
              {person}
            </Badge>
          ))}
        {entry.location && (
          <Badge variant="secondary" className="bg-primary/10 text-primary/90 hover:bg-primary/20">
            <MapPin className="mr-1 h-3 w-3" />
            {entry.location}
          </Badge>
        )}
      </CardFooter>
    </Card>
  );
}
