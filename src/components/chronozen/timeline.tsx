"use client";

import type { Task } from "@/app/page";
import { TaskItem } from "./task-item";

interface TimelineProps {
  tasks: Task[];
  onToggleComplete: (id: number) => void;
}

export function Timeline({ tasks, onToggleComplete }: TimelineProps) {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-16 px-4 border-2 border-dashed rounded-lg">
        <h3 className="text-lg font-medium text-muted-foreground">No tasks for today.</h3>
        <p className="text-sm text-muted-foreground/80">Add a new task to get started!</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="flex flex-col">
        {tasks.map((task) => (
          <TaskItem key={task.id} task={task} onToggleComplete={onToggleComplete} />
        ))}
      </div>
    </div>
  );
}
