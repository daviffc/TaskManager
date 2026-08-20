export type TaskStatus = "todo" | "doing" | "done";

export type TaskColor = "red" | "orange" | "yellow" | "green" | "blue" | "purple";

export type Task = {
  id: string;
  title: string;
  status: TaskStatus;
  color: TaskColor | null;
};

export type CalendarEvent = {
  id:string;
  summary:string;
  start: {
    dateTime?:string;
    date?:string;
    timeZone?:string;
  };
  end: {
    dateTime?: string;
    date?: string;
  };
  htmlLink: string;
};