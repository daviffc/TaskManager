import TaskList from "@/Components/TaskList";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 bg-zinc-50 p-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-zinc-900">
          Task Manager
        </h1>
        <p className="mt-4 text-lg text-zinc-600">
          Organize suas tarefas em quadros, do seu jeito.
        </p>
      </div>

      <TaskList />
    </main>
  );
}