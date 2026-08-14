export type TaskStatus = "todo" | "doing" | "done";

export type TaskColor = "red" | "orange" | "yellow" | "green" | "blue" | "purple";

export type Task = {
  id: string;
  title: string;
  status: TaskStatus;
  color: TaskColor | null;
};