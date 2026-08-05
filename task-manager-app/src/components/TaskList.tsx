"use client";

import { useState } from "react";
import { Task, TaskStatus } from "@/types/task";
import TaskColumn from "./TaskColumn";

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");

  function handleAddTask() {
    if (newTask.trim() === "") return;

    const task: Task = {
      id: crypto.randomUUID(),
      title: newTask,
      status: "todo",
    };

    setTasks([...tasks, task]);
    setNewTask("");
  }

  function handleDeleteTask(id: string) {
    setTasks(tasks.filter((task) => task.id !== id));
  }

  function handleMoveTask(id: string, newStatus: TaskStatus) {
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