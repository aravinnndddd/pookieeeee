'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Send, Loader2 } from 'lucide-react';

import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { getTagsForEntry } from '@/app/actions';
import { type JournalEntry } from '@/types';

const formSchema = z.object({
  text: z.string().min(1, 'Entry cannot be empty.'),
});

type EntryFormProps = {
  onNewEntry: (entry: Omit<JournalEntry, 'id'>) => void;
};

export function EntryForm({ onNewEntry }: EntryFormProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!values.text.trim()) return;
    setIsSubmitting(true);

    try {
      const tags = await getTagsForEntry(values.text);
      const newEntry: Omit<JournalEntry, 'id'> = {
        text: values.text,
        dateTime: new Date().toISOString(),
        people: tags.people || [],
        locations: tags.locations || [],
        organizations: tags.organizations || [],
        dates: tags.dates || [],
        topics: tags.topics || [],
        media: [],
      };
      
      onNewEntry(newEntry);

      form.reset();
      toast({
        title: 'Memory Saved',
        description: 'Your new journal entry has been saved.',
      });
    } catch (error) {
      console.error('Failed to save entry:', error);
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem saving your entry.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      if (!isSubmitting) {
        form.handleSubmit(onSubmit)();
      }
    }
  };

  return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-start gap-2">
          <FormField
            control={form.control}
            name="text"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Textarea
                    placeholder="Tell me about your day... (⌘ + Enter to save)"
                    className="resize-none"
                    onKeyDown={handleKeyDown}
                    rows={1}
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Button type="submit" size="icon" disabled={isSubmitting || !form.formState.isValid} className="shrink-0">
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            <span className="sr-only">Save Entry</span>
          </Button>
        </form>
      </Form>
  );
}
