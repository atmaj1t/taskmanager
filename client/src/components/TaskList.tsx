import { Task } from "@shared/schema";
import TaskItem from "./TaskItem";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface TaskListProps {
  tasks: Task[];
  isLoading: boolean;
  onToggleComplete: (id: number, completed: boolean) => void;
  onDeleteTask: (id: number) => void;
}

export default function TaskList({ 
  tasks, 
  isLoading, 
  onToggleComplete, 
  onDeleteTask 
}: TaskListProps) {
  return (
    <div id="tasks-container">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Tasks</h2>
      
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-6">
              <div className="flex items-start space-x-3">
                <Skeleton className="h-5 w-5 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-1/4" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : tasks.length === 0 ? (
        <Card className="bg-white rounded-lg shadow-sm p-6 text-center">
          <p className="text-gray-500">You don't have any tasks yet. Add a task to get started!</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggleComplete={onToggleComplete}
              onDeleteTask={onDeleteTask}
            />
          ))}
        </div>
      )}
    </div>
  );
}
