"use client";

import { useState, useEffect } from "react";
import { format, parseISO, isToday } from "date-fns";
import { AppHeader } from "@/components/taskday/header";
import { Timeline } from "@/components/taskday/timeline";
import { Task, getTasks, saveTasks } from "@/lib/task-storage";
import { Separator } from "@/components/ui/separator";

const groupTasksByDate = (tasks: Task[]) => {
  const pastTasks = tasks.filter(task => !isToday(parseISO(task.date)));
  
  return pastTasks.reduce((acc, task) => {
    const date = task.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(task);
    return acc;
  }, {} as Record<string, Task[]>);
};

export default function HistoryPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [groupedTasks, setGroupedTasks] = useState<Record<string, Task[]>>({});

  useEffect(() => {
    const allTasks = getTasks();
    setTasks(allTasks);
    setGroupedTasks(groupTasksByDate(allTasks));
  }, []);

  const handleToggleComplete = (id: number) => {
    const newTasks = tasks.map((task) => {
      if (task.id === id) {
        return { ...task, completed: !task.completed };
      }
      return task;
    });
    setTasks(newTasks);
    saveTasks(newTasks);
    setGroupedTasks(groupTasksByDate(newTasks));
  };
  
  const sortedDates = Object.keys(groupedTasks).sort((a, b) => b.localeCompare(a));

  return (
    <div className="flex flex-col items-center min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-2xl mx-auto">
        <AppHeader />
        <main className="mt-8">
          <h2 className="text-2xl font-bold text-primary-foreground mb-4">Task History</h2>
          {sortedDates.length > 0 ? (
            sortedDates.map((date, index) => (
              <div key={date}>
                <h3 className="text-lg font-semibold my-4">
                  {format(parseISO(date), "EEEE, MMMM d, yyyy")}
                </h3>
                <Timeline tasks={groupedTasks[date]} onToggleComplete={handleToggleComplete} />
                {index < sortedDates.length - 1 && <Separator className="my-8" />}
              </div>
            ))
          ) : (
            <div className="text-center py-16 px-4 border-2 border-dashed rounded-lg">
              <h3 className="text-lg font-medium text-muted-foreground">No past tasks.</h3>
              <p className="text-sm text-muted-foreground/80">Your completed tasks from previous days will appear here.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
