"use client";

import { useState, useEffect } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { Task, TaskStatus, TaskColor } from "@/types/task";
import TaskColumn from "./TaskColumn";
import TaskCard from "./TaskCard";

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    }),
    useSensor(KeyboardSensor)
  );

  useEffect(() => {
    async function fetchTasks() {
      const response = await fetch("/api/tasks");

      if (!response.ok) {
        setTasks([]);
        return;
      }

      const data: Task[] = await response.json();
      setTasks(
        data.map((task) => ({
          ...task,
          status: task.status.toLowerCase() as TaskStatus,
        }))
      );
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

    if (!response.ok) {
      return;
    }

    const rawTask = await response.json();
    const task: Task = {
      ...rawTask,
      status: rawTask.status.toLowerCase() as TaskStatus,
    };

    setTasks([...tasks, task]);
    setNewTask("");
  }

  async function handleDeleteTask(id: string) {
    await fetch(`/api/tasks/${id}`, {
      method: "DELETE",
    });

    setTasks(tasks.filter((task) => task.id !== id));
  }

 function handleMoveTask(id: string, newStatus: TaskStatus) {
  const previousTasks = tasks;

  setTasks(
    tasks.map((task) =>
      task.id === id ? { ...task, status: newStatus } : task
    )
  );

  fetch(`/api/tasks/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status: newStatus.toUpperCase() }),
  }).catch(() => {
    setTasks(previousTasks);
  });
}
  function handleDragStart(event: DragStartEvent) {
    const task = tasks.find((t) => t.id === event.active.id);
    setActiveTask(task ?? null);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const taskId = active.id as string;
    const newStatus = over.id as TaskStatus;
    const task = tasks.find((t) => t.id === taskId);

    if (!task || task.status === newStatus) return;

    handleMoveTask(taskId, newStatus);
  }

  function handleChangeColor(id: string, color: TaskColor | null) {
  const previousTasks = tasks;

  setTasks((prev) =>
    prev.map((task) => (task.id === id ? { ...task, color } : task))
  );

  fetch(`/api/tasks/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ color: color ? color.toUpperCase() : null }),
  }).catch(() => {
    setTasks(previousTasks);
  });
}

  return (
    <div className="w-full max-w-6xl">
      <div className="mb-8 flex gap-2">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
          placeholder="Nova tarefa..."
          className="flex-1 rounded-lg border border-border-default bg-surface px-3 py-2 text-foreground placeholder:text-foreground-secondary focus:outline-none focus:ring-2 focus:ring-accent-interactive/40"
        />
        <button
          onClick={handleAddTask}
          className="rounded-lg bg-accent-interactive px-4 py-2 text-white font-medium hover:opacity-90 transition-opacity"
        >
          Adicionar
        </button>
      </div>

      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex flex-col gap-4 sm:flex-row">
          <TaskColumn
            title="A Fazer"
            status="todo"
            tasks={tasks}
            onDeleteTask={handleDeleteTask}
            onChangeColor={handleChangeColor}
          />
          <TaskColumn
            title="Fazendo"
            status="doing"
            tasks={tasks}
            onDeleteTask={handleDeleteTask}
            onChangeColor={handleChangeColor}
          />
          <TaskColumn
            title="Feito"
            status="done"
            tasks={tasks}
            onDeleteTask={handleDeleteTask}
            onChangeColor={handleChangeColor}
          />
        </div>

        <DragOverlay>
          {activeTask ? (
            <div className="rounded-lg border border-accent-interactive bg-background p-3 shadow-lg rotate-2">
              <p className="text-foreground text-sm">{activeTask.title}</p>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}