"use client";

import { useState, useEffect } from "react";
import type { LucideIcon } from "lucide-react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { AddTaskDialog } from "@/components/taskday/add-task-dialog";
import { AppHeader } from "@/components/taskday/header";
import { Timeline } from "@/components/taskday/timeline";
import { useToast } from "@/hooks/use-toast";

export interface Task {
  id: number;
  time: string;
  description: string;
  icon: string;
  completed: boolean;
  reminded: boolean;
  completionTime?: string;
}

const initialTasks: Task[] = [
  { id: 1, time: "07:30", description: "Morning meditation", icon: "Sunrise", completed: true, reminded: true, completionTime: "07:35" },
  { id: 2, time: "08:30", description: "Breakfast and planning", icon: "Coffee", completed: true, reminded: true, completionTime: "08:40" },
  { id: 3, time: "09:00", description: "Begin deep work session", icon: "Briefcase", completed: false, reminded: true },
  { id: 4, time: "12:30", description: "Lunch break", icon: "Salad", completed: false, reminded: false },
  { id: 5, time: "14:00", description: "Client call", icon: "Phone", completed: false, reminded: false },
  { id: 6, time: "18:00", description: "Evening workout", icon: "Dumbbell", completed: false, reminded: false },
  { id: 7, time: "21:00", description: "Read a book", icon: "BookOpen", completed: false, reminded: false },
];

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      const currentTime = now.getHours() * 60 + now.getMinutes();

      tasks.forEach((task) => {
        if (!task.completed && !task.reminded) {
          const [hours, minutes] = task.time.split(":").map(Number);
          const taskTime = hours * 60 + minutes;

          if (taskTime > currentTime && taskTime - currentTime <= 5) {
            toast({
              title: "Upcoming Task Reminder",
              description: `Your task "${task.description}" is scheduled for ${task.time}.`,
            });
            setTasks((prevTasks) =>
              prevTasks.map((t) =>
                t.id === task.id ? { ...t, reminded: true } : t
              )
            );
          }
        }
      });
    };

    const intervalId = setInterval(checkReminders, 60000); // Check every minute

    return () => clearInterval(intervalId);
  }, [tasks, toast]);
  

  const handleAddTask = (description: string, time: string, icon: string) => {
    const newTask: Task = {
      id: Date.now(),
      time,
      description,
      icon,
      completed: false,
      reminded: false,
    };
    setTasks((prevTasks) => [...prevTasks, newTask].sort((a, b) => a.time.localeCompare(b.time)));
  };

  const handleToggleComplete = (id: number) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.id === id) {
          const isCompleted = !task.completed;
          return {
            ...task,
            completed: isCompleted,
            completionTime: isCompleted
              ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
              : undefined,
          };
        }
        return task;
      })
    );
  };
  
  return (
    <div className="flex flex-col items-center min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-2xl mx-auto">
        <AppHeader />
        <main className="mt-8">
          <Timeline tasks={tasks} onToggleComplete={handleToggleComplete} />
        </main>
      </div>
      <AddTaskDialog 
        isOpen={isDialogOpen} 
        setIsOpen={setIsDialogOpen}
        onAddTask={handleAddTask}
      >
        <Button 
          onClick={() => setIsDialogOpen(true)}
          className="fixed bottom-8 right-8 h-16 w-16 rounded-full shadow-lg bg-accent hover:bg-accent/90"
          aria-label="Add new task"
        >
          <Plus className="h-8 w-8 text-primary-foreground" />
        </Button>
      </AddTaskDialog>
    </div>
  );
}
