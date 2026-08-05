import { Task, TaskStatus } from "@/types/task";

type TaskColumnProps = {
  title: string;
  status: TaskStatus;
  tasks: Task[];
  onDeleteTask: (id: string) => void;
  onMoveTask: (id: string, newStatus: TaskStatus) => void;
};

export default function TaskColumn({
  title,
  status,
  tasks,
  onDeleteTask,
  onMoveTask,
}: TaskColumnProps) {
  const columnTasks = tasks.filter((task) => task.status === status);

  return (
    <div className="w-full max-w-xs rounded bg-zinc-100 p-4">
      <h2 className="mb-3 font-semibold text-zinc-700">
        {title} ({columnTasks.length})
      </h2>

      <ul className="flex flex-col gap-2">
        {columnTasks.map((task) => (
          <li
            key={task.id}
            className="rounded border border-zinc-200 bg-white p-3"
          >
            <p className="text-zinc-800">{task.title}</p>

            <div className="mt-2 flex items-center justify-between text-sm">
              <select
                value={task.status}
                onChange={(e) =>
                  onMoveTask(task.id, e.target.value as TaskStatus)
                }
                className="rounded border border-zinc-300 text-zinc-700"
              >
                <option value="todo">A Fazer</option>
                <option value="doing">Fazendo</option>
                <option value="done">Feito</option>
              </select>

              <button
                onClick={() => onDeleteTask(task.id)}
                className="text-red-500 hover:text-red-700"
              >
                Excluir
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}