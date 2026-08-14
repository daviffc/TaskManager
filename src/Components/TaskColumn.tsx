import { useDroppable } from "@dnd-kit/core";
import { Task, TaskStatus, TaskColor } from "@/types/task";
import TaskCard from "./TaskCard";

type TaskColumnProps = {
  title: string;
  status: TaskStatus;
  tasks: Task[];
  onDeleteTask: (id: string) => void;
  onChangeColor: (id: string, color: TaskColor | null) => void;
};

const accentMap: Record<TaskStatus, string> = {
  todo: "bg-accent-todo",
  doing: "bg-accent-doing",
  done: "bg-accent-done",
};

export default function TaskColumn({
  title,
  status,
  tasks,
  onDeleteTask,
  onChangeColor,
}: TaskColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: status });
  const columnTasks = tasks.filter((task) => task.status === status);
  const count = String(columnTasks.length).padStart(2, "0");

  return (
    <div
      ref={setNodeRef}
      className={`w-full max-w-xs rounded-xl bg-surface border overflow-hidden transition-colors ${
        isOver ? "border-accent-interactive" : "border-border-default"
      }`}
    >
      <div className={`h-1 w-full ${accentMap[status]}`} />

      <div className="p-4">
        <h2 className="mb-4 flex items-center justify-between font-heading font-semibold text-foreground">
          <span>{title}</span>
          <span className="font-mono text-xs text-foreground-secondary tracking-wide">
            {title.toUpperCase()} · {count}
          </span>
        </h2>

        <ul className="flex flex-col gap-2 min-h-[40px]">
          {columnTasks.map((task) => (
            <TaskCard 
            key={task.id} 
            task={task}
            onDeleteTask={onDeleteTask} 
            onChangeColor={onChangeColor}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}