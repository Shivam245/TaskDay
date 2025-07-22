"use client";

import { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';

export function AppHeader() {
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    setCurrentDate(new Date().toLocaleDateString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }));
  }, []);

  return (
    <header className="text-center">
      <h1 className="text-5xl font-bold font-headline text-primary-foreground tracking-tight">TaskDay</h1>
      <p className="mt-2 text-lg text-muted-foreground flex items-center justify-center gap-2">
        <Calendar className="h-5 w-5" />
        <span>{currentDate || 'Loading date...'}</span>
      </p>
    </header>
  );
}
