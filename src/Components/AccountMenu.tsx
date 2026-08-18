"use client";

import { useState, useRef, useEffect } from "react";
import { signOut } from "next-auth/react";
import { useTheme } from "@/lib/useTheme";

type AccountMenuProps = {
  name: string;
  provider: string;
};

export default function AccountMenu({ name, provider }: AccountMenuProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const initial = name?.charAt(0).toUpperCase() ?? "?";

  
  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 rounded-full pr-3 pl-1 py-1 border border-border-default bg-surface hover:border-accent-interactive transition-colors"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-accent-interactive text-white text-sm font-heading font-semibold">
          {initial}
        </span>
        <span className="text-sm font-medium text-foreground">{name}</span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 rounded-lg border border-border-default bg-surface shadow-lg overflow-hidden z-10">
          <div className="px-4 py-3 border-b border-border-default">
            <p className="text-sm font-medium text-foreground">{name}</p>
            <p className="text-xs text-foreground-secondary">
                {provider === "Google" ? "Conectado via Google" : "Conta local"}
                </p>
          </div>

          <button
            onClick={toggleTheme}
            className="w-full text-left px-4 py-2 text-sm text-foreground-secondary hover:bg-background hover:text-foreground transition-colors flex items-center justify-between"
          >
            <span>Tema</span>
            <span className="font-mono text-xs">
              {theme === "dark" ? "Escuro" : "Claro"}
            </span>
          </button>

          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="w-full text-left px-4 py-2 text-sm text-foreground-secondary hover:bg-background hover:text-red-500 transition-colors border-t border-border-default"
          >
            Sair
          </button>
        </div>
      )}
    </div>
  );
}