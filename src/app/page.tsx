import TaskList from "@/Components/TaskList";
import LogoutButton from "@/Components/LogoutButton";
import { auth } from "@/lib/auth";

export default async function Home() {

  const session = await auth();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-8 bg-zinc-50 p-8">
      <div className="flex w-full max-w-4xl items-center justify between">
        <div className="text-center flex-1">
          <h1 className="text-4xl font-bold text-zinc-900">Task Manager</h1>
        <p className="mt-4 text-lg text-zinc-600">
          Organize suas tarefas em quadros, do seu jeito.
        </p>
      </div>
    </div>

    <div className="flex w-full max-w-4xl items-center justify-between">
      <p className="text-sm text-zinc-500">
        Signed In as {session?.user?.name}
      </p>
      <LogoutButton />
    </div>

      <TaskList />
    </main>
  );
}