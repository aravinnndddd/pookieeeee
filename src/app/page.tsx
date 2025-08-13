'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, BookHeart, CalendarCheck, ArrowRight, BookText } from 'lucide-react';

export default function WelcomePage() {
  const features = [
    {
      icon: <Sparkles className="h-8 w-8 text-primary" />,
      title: 'AI-Powered Tagging',
      description: 'Our smart AI automatically tags your entries with people, places, and topics, making it easy to find memories.',
      image: 'https://placehold.co/600x400.png',
      hint: 'magic journal',
    },
    {
      icon: <BookHeart className="h-8 w-8 text-primary" />,
      title: 'Timeline View',
      description: 'Scroll through your memories in a beautiful, chronological timeline. Relive your moments day by day.',
      image: 'https://placehold.co/600x400.png',
      hint: 'diary book',
    },
    {
      icon: <CalendarCheck className="h-8 w-8 text-primary" />,
      title: 'Calendar View',
      description: 'Get a bird\'s-eye view of your month. See which days you\'ve written entries for at a glance.',
      image: 'https://placehold.co/600x400.png',
      hint: 'cute calendar',
    },
  ];

  return (
    <div className="flex min-h-screen w-full flex-col bg-background text-foreground">
       <header className="flex shrink-0 items-center justify-between border-b bg-background/95 px-4 py-2 backdrop-blur-sm sm:px-6">
          <div className="flex items-center gap-2">
            <BookText className="h-6 w-6 text-primary" />
            <h1 className="font-headline text-xl font-bold">Pookie Journal</h1>
          </div>
        </header>
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-20 md:py-32 lg:py-40 bg-primary/10">
          <div className="container mx-auto px-4 md:px-6 text-center">
             <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
              Rediscover Your
              <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent"> Memories</span>
              {' '} & {' '}
              <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">Moments</span>
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl mt-4">
              Explore how AI is transforming personal journaling, helping you
              capture and recall life's important moments with incredible detail.
            </p>
            <div className="mt-8">
              <Button asChild size="lg" className="rounded-full font-bold">
                <Link href="/journal">
                  Get Started <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm">Key Features</div>
              <h2 className="text-3xl font-headline font-bold tracking-tighter sm:text-5xl">Why You'll Love It</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Pookie Journal is more than just a diary; it's a smart companion that helps you organize your life with a touch of magic.
              </p>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:grid-cols-3 lg:gap-12">
              {features.map((feature) => (
                <Card key={feature.title} className="overflow-hidden transition-shadow hover:shadow-lg h-full flex flex-col">
                   <Image
                      src={feature.image}
                      alt={feature.title}
                      width={600}
                      height={400}
                      className="w-full h-40 object-cover"
                      data-ai-hint={feature.hint}
                    />
                  <CardHeader className="flex flex-row items-center gap-4 pb-2">
                    {feature.icon}
                    <CardTitle className="font-headline text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="flex items-center justify-center py-6 border-t">
        <p className="text-sm text-muted-foreground">Made with ♡ for Pookie</p>
      </footer>
    </div>
  );
}
