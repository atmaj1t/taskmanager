import { Check, Trash2 } from "lucide-react";
import { formatRelativeDate } from "@/lib/utils";
import { Task } from "@shared/schema";

interface TaskItemProps {
  task: Task;
  onToggleComplete: (id: number, completed: boolean) => void;
  onDeleteTask: (id: number) => void;
}

export default function TaskItem({ task, onToggleComplete, onDeleteTask }: TaskItemProps) {
  const { id, title, description, dueDate, completed } = task;

  return (
    <div className="task-item bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <button
              onClick={() => onToggleComplete(id, !completed)}
              className={`mt-0.5 h-5 w-5 rounded-full border-2 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 flex items-center justify-center ${
                completed
                  ? "bg-success border-success"
                  : "border-gray-300"
              }`}
              aria-label={completed ? "Mark as incomplete" : "Mark as complete"}
            >
              {completed && (
                <Check className="h-3 w-3 text-white" />
              )}
            </button>
            <div>
              <h3 
                className={`text-lg font-medium ${
                  completed ? "text-gray-500 line-through" : "text-gray-800"
                }`}
              >
                {title}
              </h3>
              {description && (
                <p 
                  className={`mt-1 text-sm ${
                    completed ? "text-gray-400 line-through" : "text-gray-600"
                  }`}
                >
                  {description}
                </p>
              )}
              <div 
                className={`mt-2 flex items-center text-sm ${
                  completed ? "text-gray-400" : "text-gray-500"
                }`}
              >
                <span className="inline-flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{formatRelativeDate(dueDate)}</span>
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={() => onDeleteTask(id)}
            className="text-gray-400 hover:text-danger focus:outline-none"
            aria-label="Delete task"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
