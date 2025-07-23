"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { format } from 'date-fns';

import { Button } from "@/components/ui/button";
import { AddTaskDialog } from "@/components/taskday/add-task-dialog";
import { AppHeader } from "@/components/taskday/header";
import { Timeline } from "@/components/taskday/timeline";
import { useToast } from "@/hooks/use-toast";
import { Task, getTasks, saveTasks } from "@/lib/task-storage";


const getToday = () => format(new Date(), 'yyyy-MM-dd');

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setTasks(getTasks());
  }, []);

  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      const currentTime = now.getHours() * 60 + now.getMinutes();
      const today = getToday();

      tasks.forEach((task) => {
        if (task.date === today && !task.completed && !task.reminded) {
          const [hours, minutes] = task.time.split(":").map(Number);
          const taskTime = hours * 60 + minutes;

          if (taskTime > currentTime && taskTime - currentTime <= 5) {
            toast({
              title: "Upcoming Task Reminder",
              description: `Your task "${task.description}" is scheduled for ${task.time}.`,
            });
            const newTasks = tasks.map((t) =>
              t.id === task.id ? { ...t, reminded: true } : t
            );
            setTasks(newTasks);
            saveTasks(newTasks);
          }
        }
      });
    };

    const intervalId = setInterval(checkReminders, 60000); 

    return () => clearInterval(intervalId);
  }, [tasks, toast]);
  

  const handleAddTask = (description: string, time: string, icon: string) => {
    const newTask: Task = {
      id: Date.now(),
      date: getToday(),
      time,
      description,
      icon,
      completed: false,
      reminded: false,
    };
    const newTasks = [...tasks, newTask].sort((a, b) => {
      if (a.date === b.date) {
        return a.time.localeCompare(b.time);
      }
      return a.date.localeCompare(b.date);
    });
    setTasks(newTasks);
    saveTasks(newTasks);
  };

  const handleToggleComplete = (id: number) => {
    const newTasks = tasks.map((task) => {
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
    });
    setTasks(newTasks);
    saveTasks(newTasks);
  };

  const todaysTasks = tasks.filter(task => task.date === getToday());
  
  return (
    <div className="flex flex-col items-center min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-2xl mx-auto">
        <AppHeader />
        <main className="mt-8">
          <Timeline tasks={todaysTasks} onToggleComplete={handleToggleComplete} />
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
