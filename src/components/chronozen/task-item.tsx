"use client";

import { cn } from "@/lib/utils";
import type { Task } from "@/app/page";
import { Checkbox } from "@/components/ui/checkbox";
import { Briefcase, Coffee, BookOpen, Salad, Dumbbell, Sunrise, Phone, GraduationCap, type LucideProps } from "lucide-react";

interface TaskItemProps {
  task: Task;
  onToggleComplete: (id: number) => void;
}

const icons: { [key: string]: React.FC<LucideProps> } = {
  Briefcase,
  Coffee,
  BookOpen,
  Salad,
  Dumbbell,
  Sunrise,
  Phone,
  Study: GraduationCap,
};

export function TaskItem({ task, onToggleComplete }: TaskItemProps) {
  const IconComponent = icons[task.icon] || Briefcase;

  return (
    <div className="flex items-center gap-4 group">
      <div className="flex flex-col items-center">
        <div className="w-px h-6 bg-border -mt-1 group-first:hidden" />
        <div className="w-4 h-4 rounded-full bg-border border-2 border-background ring-2 ring-border" />
        <div className="w-px flex-1 bg-border group-last:hidden" />
      </div>
      <div className="flex-1 flex items-start gap-4 py-4">
        <div className="w-16 text-right text-muted-foreground font-medium shrink-0">{task.time}</div>
        <div className={cn("flex-1 bg-card p-4 rounded-lg shadow-sm border transition-all duration-300", 
            task.completed ? "bg-secondary/50" : "bg-card"
        )}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <IconComponent className={cn("h-5 w-5 transition-colors", task.completed ? "text-muted-foreground" : "text-accent")} />
              <span
                className={cn(
                  "font-medium transition-all duration-300",
                  task.completed ? "line-through text-muted-foreground" : "text-card-foreground"
                )}
              >
                {task.description}
              </span>
            </div>
            <Checkbox
              id={`task-${task.id}`}
              checked={task.completed}
              onCheckedChange={() => onToggleComplete(task.id)}
              className="h-5 w-5 rounded-full"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
