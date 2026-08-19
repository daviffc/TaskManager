import { useDroppable } from "@dnd-kit/core";
import { Task, TaskStatus, TaskColor } from "@/types/task";
import TaskCard from "./TaskCard";
import { Inbox } from "lucide-react";

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
         <span className="text-sm">{title}</span>
         <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-background px-1.5 font-mono text-xs text-foreground-secondary">
          {columnTasks.length}
        </span>
       </h2>

        <ul className="flex flex-col gap-2 min-h-[80px]">
          {columnTasks.length === 0 && (
            <li 
            className={`flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed py-8 text-xs transition-colors ${
              isOver
            ? "border-accent-interactive bg-accent-interactive/5 text-accent-interactive"
            : "border-border-default text-foreground-secondary/60"
            }`}
            >
              <Inbox size={20} className={isOver ? "opacity-100" : "opacity-40"} />
              {isOver ? "Solte aqui" : "Arraste tarefas pra cá"}
            </li>
          )}
          
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