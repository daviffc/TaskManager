import { useState, useRef, useEffect } from "react";
import { useDraggable } from "@dnd-kit/core";
import { Task, TaskColor } from "@/types/task";
import { Trash2 } from "lucide-react";

type TaskCardProps = {
  task: Task;
  onDeleteTask: (id: string) => void;
  onChangeColor: (id:string,color: TaskColor | null) => void;
};

const colorMap: Record<TaskColor, string> = {
     red: "#E5484D",
    orange: "#F2994A",
    yellow: "#F2C94C",
    green: "#27AE60",
    blue: "#2F80ED",
    purple: "#9B51E0",
};

const colorOrder: TaskColor[] = ["red", "orange", "yellow", "green", "blue", "purple"];

export default function TaskCard({ task, onDeleteTask, onChangeColor }: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: task.id,
    });

    const[pickerOpen, setPickerOpen] = useState(false);
    const pickerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event:MouseEvent){
            if (pickerRef.current && !  pickerRef.current.contains(event.target as Node)){
                setPickerOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return() => document.removeEventListener("mousedown", handleClickOutside);
    },[]);

  const style = transform
    ? {
        transform: `translate(${transform.x}px, ${transform.y}px)`,
      }
    : undefined;

    const borderColor = task.color ? colorMap[task.color] : undefined;  

  return (
    <li
      ref={setNodeRef}
      style={{
        ...style,
        borderLeftColor:borderColor,
    }}
      {...listeners}
      {...attributes}
       className={`relative rounded-lg border border-border-default bg-background p-3 cursor-grab active:cursor-grabbing touch-none border-l-4 transition-all hover:shadow-md hover:-translate-y-0.5${
        !borderColor ? "border-l-border-default" : ""
      } ${isDragging ? "opacity-40" : ""}`}
    >
      <p className="text-foreground text-sm font-medium">{task.title}</p>

      <div className="mt-3 flex justify-between text-xs">
        <div className="relative" ref ={pickerRef}>
        <button
          onPointerDown={(e) => e.stopPropagation()}
          onClick={() => setPickerOpen((prev) => !prev)}
          className="flex h-5 w-5 items-center justify-center rounded-full border border-border-default hover:border-accent-interactive transition-colors"
          style={{backgroundColor: borderColor ?? "transparent"}}
        />

          {pickerOpen && (
            <div className="absolute left-0 top-7 z-10 flex items-center gap-1.5 rounded-full border border-border-default bg-surface p-2 shadow-lg">
              {colorOrder.map((color) => (
                <button
                  key={color}
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={() => {
                    onChangeColor(task.id, color);
                    setPickerOpen(false);
                  }}
                  className="h-4 w-4 rounded-full hover:scale-110 transition-transform"
                  style={{ backgroundColor: colorMap[color] }}
                />
              ))}
              <button
                onPointerDown={(e) => e.stopPropagation()}
                onClick={() => {
                  onChangeColor(task.id, null);
                  setPickerOpen(false);
                }}
                className="h-4 w-4 rounded-full border border-border-default bg-background"
                title="Remover cor"
              />
            </div>
          )}
        </div>

        <button
          onPointerDown={(e) => e.stopPropagation()}
          onClick={() => onDeleteTask(task.id)}
          className="text-foreground-secondary hover:text-red-500 transition-colors"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </li>
  );
}