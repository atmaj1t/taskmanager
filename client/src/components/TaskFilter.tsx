import { cn } from "@/lib/utils";

type FilterStatus = "all" | "active" | "completed";

interface TaskFilterProps {
  currentFilter: FilterStatus;
  onFilterChange: (filter: FilterStatus) => void;
}

export default function TaskFilter({ currentFilter, onFilterChange }: TaskFilterProps) {
  return (
    <div className="flex justify-center mb-6">
      <div className="inline-flex rounded-md shadow-sm" role="group">
        <button
          type="button"
          className={cn(
            "px-4 py-2 text-sm font-medium border border-gray-200 rounded-l-lg hover:bg-gray-100 focus:z-10 focus:ring-2 focus:ring-primary",
            currentFilter === "all" 
              ? "text-primary bg-blue-50" 
              : "text-gray-900 bg-white"
          )}
          onClick={() => onFilterChange("all")}
        >
          All
        </button>
        <button
          type="button"
          className={cn(
            "px-4 py-2 text-sm font-medium border-t border-b border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-primary",
            currentFilter === "active" 
              ? "text-primary bg-blue-50" 
              : "text-gray-900 bg-white"
          )}
          onClick={() => onFilterChange("active")}
        >
          Active
        </button>
        <button
          type="button"
          className={cn(
            "px-4 py-2 text-sm font-medium border border-gray-200 rounded-r-md hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-primary",
            currentFilter === "completed" 
              ? "text-primary bg-blue-50" 
              : "text-gray-900 bg-white"
          )}
          onClick={() => onFilterChange("completed")}
        >
          Completed
        </button>
      </div>
    </div>
  );
}
