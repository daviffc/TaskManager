import TaskList from "@/Components/TaskList";
import AccountMenu from "@/Components/AccountMenu";
import { auth } from "@/lib/auth";

export default async function Home() {
  const session = await auth();

  return (
    <main className="flex min-h-screen flex-col items-center gap-8 bg-background p-8">
      <div className="flex w-full max-w-6xl items-center justify-end">
        <AccountMenu name={session?.user?.name ?? "Usuário"} />
      </div>

      <div className="text-center">
        <h1 className="text-4xl font-heading font-bold text-foreground">
          Task Manager
        </h1>
        <p className="mt-4 text-lg text-foreground-secondary">
          Organize suas tarefas em quadros, do seu jeito.
        </p>
      </div>

      <TaskList />
    </main>
  );
}