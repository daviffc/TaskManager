"use client";

import { useEffect, useState } from "react";
import { CalendarEvent } from "@/types/task";
import { Calendar, ExternalLink } from "lucide-react";

export default function CalendarEvents() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const response = await fetch("/api/calendar/events");

        if (!response.ok) {
          const data = await response.json();
          if (data.error === "Google Calendar not connected") {
            setError("not_connected");
          } else {
            setError("failed");
          }
          return;
        }

        const data: CalendarEvent[] = await response.json();
        setEvents(data);
      } catch {
        setError("failed");
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  function formatDate(event: CalendarEvent): string {
    const raw = event.start.dateTime ?? event.start.date;
    if (!raw) return "";

    const date = new Date(raw);
    return date.toLocaleString("pt-BR", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      hour: event.start.dateTime ? "2-digit" : undefined,
      minute: event.start.dateTime ? "2-digit" : undefined,
    });
  }

  if (loading) {
    return (
      <div className="w-full max-w-6xl">
        <div className="h-24 rounded-xl border border-border-default bg-surface animate-pulse" />
      </div>
    );
  }

  if (error === "not_connected") {
    return null;
  }

  if (error === "failed" || events.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-6xl">
      <div className="mb-3 flex items-center gap-2">
        <Calendar size={14} className="text-foreground-secondary" />
        <span className="font-mono text-xs text-foreground-secondary/70 tracking-wide uppercase">
          Próximos eventos
        </span>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2">
        {events.map((event) => (
          
           <a key={event.id}
            href={event.htmlLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex min-w-48 flex-col gap-1 rounded-lg border border-border-default bg-surface p-3 transition-all hover:border-accent-interactive hover:shadow-md"
          >
            <p className="text-sm font-medium text-foreground line-clamp-1">
              {event.summary ?? "Sem título"}
            </p>
            <p className="font-mono text-xs text-foreground-secondary/70">
              {formatDate(event)}
            </p>
            <ExternalLink
              size={10}
              className="mt-1 self-end text-foreground-secondary/40"
            />
          </a>
        ))}
      </div>
    </div>
  );
}