import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import TaskForm from "@/components/TaskForm";
import TaskList from "@/components/TaskList";
import TaskFilter from "@/components/TaskFilter";
import { apiRequest } from "@/lib/queryClient";
import { Task } from "@shared/schema";

type FilterStatus = "all" | "active" | "completed";

export default function Home() {
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");

  // Fetch tasks
  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["/api/tasks"],
  });

  // Add task mutation
  const addTaskMutation = useMutation({
    mutationFn: (newTask: Omit<Task, "id" | "completed">) => {
      return apiRequest("POST", "/api/tasks", newTask);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
    },
  });

  // Toggle task completion status
  const toggleTaskMutation = useMutation({
    mutationFn: ({ id, completed }: { id: number; completed: boolean }) => {
      return apiRequest("PATCH", `/api/tasks/${id}`, { completed });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
    },
  });

  // Delete task
  const deleteTaskMutation = useMutation({
    mutationFn: (id: number) => {
      return apiRequest("DELETE", `/api/tasks/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
    },
  });

  // Filter tasks based on current filter status
  const filteredTasks = tasks.filter((task: Task) => {
    if (filterStatus === "all") return true;
    if (filterStatus === "active") return !task.completed;
    if (filterStatus === "completed") return task.completed;
    return true;
  });

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header Section */}
      <header className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 py-5 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-800">Daily Task Manager</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          {/* Task Form */}
          <TaskForm 
            onAddTask={(newTask) => addTaskMutation.mutate(newTask)} 
            isSubmitting={addTaskMutation.isPending} 
          />
          
          {/* Task Filters */}
          <TaskFilter 
            currentFilter={filterStatus} 
            onFilterChange={setFilterStatus} 
          />
          
          {/* Task List */}
          <TaskList 
            tasks={filteredTasks} 
            isLoading={isLoading}
            onToggleComplete={(id, completed) => toggleTaskMutation.mutate({ id, completed })}
            onDeleteTask={(id) => deleteTaskMutation.mutate(id)}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="max-w-4xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-3">
            <p className="text-center text-sm text-gray-500">
              Daily Task Manager - Keep track of what matters
            </p>
            <a 
              href="/api/download-project" 
              download
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-sm font-medium rounded-md shadow-sm hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Download Project Source Code
            </a>
            <p className="text-xs text-gray-400 mt-1 max-w-md text-center">
              Download the complete source code to explore or modify the project locally. Extract the ZIP file and run 'npm install' followed by 'npm run dev' to start the development server.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
