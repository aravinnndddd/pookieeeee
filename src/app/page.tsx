'use client';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function WelcomePage() {
  const router = useRouter();

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-background text-foreground">
        <div className="text-center space-y-4">
            <h1 className="text-4xl font-headline font-bold">Welcome to Pookie Journal</h1>
            <p className="text-muted-foreground text-lg">Your personal AI-powered journal.</p>
            <Button onClick={() => router.push('/journal')} size="lg">Get Started</Button>
        </div>
    </div>
  );
}
