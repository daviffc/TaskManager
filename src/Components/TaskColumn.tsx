import { Task, TaskStatus } from "@/types/task";

type TaskColumnProps = {
  title: string;
  status: TaskStatus;
  tasks: Task[];
  onDeleteTask: (id: string) => void;
  onMoveTask: (id: string, newStatus: TaskStatus) => void;
};

const accentMap: Record<TaskStatus, string> = {
  todo: "bg-accent-todo",
  doing: "bg-accent-doing",
  done: "bg-accent-done",
};

const statusOrder: TaskStatus[] = ["todo", "doing", "done"];

export default function TaskColumn({
  title,
  status,
  tasks,
  onDeleteTask,
  onMoveTask,
}: TaskColumnProps) {
  const columnTasks = tasks.filter((task) => task.status === status);
  const count = String(columnTasks.length).padStart(2, "0");

  return (
    <div className="w-full max-w-xs rounded-xl bg-surface border border-border-default overflow-hidden">
      {/* barra de assinatura */}
      <div className={`h-1 w-full ${accentMap[status]}`} />

      <div className="p-4">
        <h2 className="mb-4 flex items-center justify-between font-heading font-semibold text-foreground">
          <span>{title}</span>
          <span className="font-mono text-xs text-foreground-secondary tracking-wide">
            {title.toUpperCase()} · {count}
          </span>
        </h2>

        <ul className="flex flex-col gap-2">
          {columnTasks.map((task) => (
            <li
              key={task.id}
              className="rounded-lg border border-border-default bg-background p-3"
            >
              <p className="text-foreground text-sm">{task.title}</p>

              <div className="mt-3 flex items-center justify-between text-xs">
                <div className="flex gap-1">
                  {statusOrder
                    .filter((s) => s !== task.status)
                    .map((s) => (
                      <button
                        key={s}
                        onClick={() => onMoveTask(task.id, s)}
                        className="rounded-full border border-border-default px-2 py-1 font-mono text-foreground-secondary hover:border-accent-interactive hover:text-accent-interactive transition-colors"
                      >
                        {s}
                      </button>
                    ))}
                </div>

                <button
                  onClick={() => onDeleteTask(task.id)}
                  className="text-foreground-secondary hover:text-red-500 transition-colors"
                >
                  excluir
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}