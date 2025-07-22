"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, History } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

export function AppHeader() {
  const [currentDate, setCurrentDate] = useState('');
  const pathname = usePathname();

  useEffect(() => {
    setCurrentDate(new Date().toLocaleDateString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }));
  }, []);

  return (
    <header className="text-center relative">
      <h1 className="text-5xl font-bold font-headline text-primary-foreground tracking-tight">TaskDay</h1>
      <p className="mt-2 text-lg text-muted-foreground flex items-center justify-center gap-2">
        <Calendar className="h-5 w-5" />
        <span>{currentDate || 'Loading date...'}</span>
      </p>
      <nav className="absolute top-0 right-0">
        <Button asChild variant="ghost" size="icon">
           <Link href={pathname === '/history' ? '/' : '/history'} className="text-muted-foreground hover:text-primary-foreground">
            {pathname === '/history' ? (
                <Calendar className="h-6 w-6" />
            ) : (
                <History className="h-6 w-6" />
            )}
            <span className="sr-only">{pathname === '/history' ? 'Today' : 'History'}</span>
           </Link>
        </Button>
      </nav>
    </header>
  );
}
