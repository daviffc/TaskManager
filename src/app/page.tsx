import TaskList from "@/Components/TaskList";
import AccountMenu from "@/Components/AccountMenu";
import CalendarEvents from "@/Components/CalendarEvents";
import { auth } from "@/lib/auth";
import MiniCalendar from "@/Components/MiniCalendar";

export default async function Home() {
  const session = await auth();

  return (
    <main className="flex min-h-screen flex-col items-center gap-8 bg-background p-8">
      <header className="flex w-full max-w-6xl items-center justify-between border-b border-border-default pb-4">
        <div>
          <h1 className="text-2xl font-heading font-semibold text-foreground">
            Task Manager
          </h1>
          <p className="text-sm text-foreground-secondary">
            Organize suas tarefas em quadros, do seu jeito.
          </p>
        </div>
        <AccountMenu
          name={session?.user?.name ?? "Usuário"}
          provider={session?.user?.provider ?? "credentials"}
        />
      </header>

      <CalendarEvents />
      <MiniCalendar />

      <TaskList />
    </main>
  );
}