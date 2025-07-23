import { format } from 'date-fns';

export interface Task {
  id: number;
  date: string; // YYYY-MM-DD
  time: string;
  description: string;
  icon: string;
  completed: boolean;
  reminded: boolean;
  completionTime?: string;
}

const initialTasks: Task[] = [
  { id: 1, date: format(new Date(), 'yyyy-MM-dd'), time: "07:30", description: "Morning meditation", icon: "Sunrise", completed: true, reminded: true, completionTime: "07:35" },
  { id: 2, date: format(new Date(), 'yyyy-MM-dd'), time: "08:30", description: "Breakfast and planning", icon: "Coffee", completed: true, reminded: true, completionTime: "08:40" },
  { id: 3, date: format(new Date(), 'yyyy-MM-dd'), time: "09:00", description: "Begin deep work session", icon: "Briefcase", completed: false, reminded: true },
  { id: 4, date: format(new Date(), 'yyyy-MM-dd'), time: "12:30", description: "Lunch break", icon: "Salad", completed: false, reminded: false },
  { id: 5, date: format(new Date(), 'yyyy-MM-dd'), time: "14:00", description: "Client call", icon: "Phone", completed: false, reminded: false },
  { id: 6, date: format(new Date(), 'yyyy-MM-dd'), time: "18:00", description: "Evening workout", icon: "Dumbbell", completed: false, reminded: false },
  { id: 7, date: format(new Date(), 'yyyy-MM-dd'), time: "21:00", description: "Read a book", icon: "BookOpen", completed: false, reminded: false },
];


const isLocalStorageAvailable = () => typeof window !== 'undefined' && window.localStorage;

export const getTasks = (): Task[] => {
  if (!isLocalStorageAvailable()) return initialTasks;
  try {
    const tasksJson = localStorage.getItem("tasks");
    if (tasksJson) {
      return JSON.parse(tasksJson);
    } else {
      // For first-time users, set the initial tasks
      localStorage.setItem("tasks", JSON.stringify(initialTasks));
      return initialTasks;
    }
  } catch (error) {
    console.error("Failed to parse tasks from localStorage", error);
    return initialTasks;
  }
};

export const saveTasks = (tasks: Task[]) => {
  if (!isLocalStorageAvailable()) return;
  try {
    const tasksJson = JSON.stringify(tasks);
    localStorage.setItem("tasks", tasksJson);
  } catch (error) {
    console.error("Failed to save tasks to localStorage", error);
  }
};
