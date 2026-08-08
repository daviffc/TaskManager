"use client";

import { useState, useEffect } from "react";
import { Task, TaskStatus } from "@/types/task";
import TaskColumn from "./TaskColumn";

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");

  useEffect(() => {
    async function fetchTasks() {
      const response = await fetch("/api/tasks");
      const data: Task[] = await response.json();
      setTasks(data.map((task) => ({ ...task, status: task.status.toLowerCase() as TaskStatus })));
    }
    fetchTasks();
  }, []);

    async function handleAddTask() {
      if (newTask.trim() === "") return;

      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTask }),
      }); 

      const rawTask = await response.json();
      const task: Task = { ...rawTask, status: rawTask.status.toLowerCase() as TaskStatus }; 

      setTasks([...tasks, task]);
      setNewTask("");
    }

 async function handleDeleteTask(id: string) {
  await fetch(`/api/tasks/${id}`, {
    method: "DELETE",
  });

  setTasks(tasks.filter((task) => task.id !== id));
}
  async function handleMoveTask(id: string, newStatus: TaskStatus) {
  await fetch(`/api/tasks/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: newStatus.toUpperCase() }),
  });

  setTasks(
    tasks.map((task) =>
      task.id === id ? { ...task, status: newStatus } : task
    )
  );
}
  return (
    <div className="w-full max-w-4xl">
      <div className="mb-6 flex gap-2">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Nova tarefa..."
          className="flex-1 rounded border border-zinc-300 px-3 py-2 text-zinc-900"
        />
        <button
          onClick={handleAddTask}
          className="rounded bg-zinc-900 px-4 py-2 text-white hover:bg-zinc-700"
        >
          Adicionar
        </button>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <TaskColumn
          title="A Fazer"
          status="todo"
          tasks={tasks}
          onDeleteTask={handleDeleteTask}
          onMoveTask={handleMoveTask}
        />
        <TaskColumn
          title="Fazendo"
          status="doing"
          tasks={tasks}
          onDeleteTask={handleDeleteTask}
          onMoveTask={handleMoveTask}
        />
        <TaskColumn
          title="Feito"
          status="done"
          tasks={tasks}
          onDeleteTask={handleDeleteTask}
          onMoveTask={handleMoveTask}
        />
      </div>
    </div>
  );
}