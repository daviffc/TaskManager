"use client";

import { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Sun, Moon } from "lucide-react"
import { useTheme } from "@/lib/useTheme";

export default function LoginPage() {
    const { theme, toggleTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    useEffect(() => {
        setMounted(true);
    },[]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");

        const result = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        if (result?.error) {
            setError("invalid email or password");
            return;
        }

        router.push("/");
    }
    return (
        <div className = "relative flex min-h-screen items-center justify-center bg-background">
            <button
            type="button"
            onClick={toggleTheme}
            aria-label="Alternar tema"
            className="absolute right-6 top-6 flex h-9 w-9 items-center justify-center rounded-full border border-border-default bg-surface text-foreground-secondary transition-colors hover:text-foreground"
            >
               {mounted ? (
                    theme === "dark" ? <Sun size={16} /> : <Moon size={16} />
                ) : (
                    <span className="block h-4 w-4" />
                )}
            </button>

    
            <form
            onSubmit={handleSubmit}
            className="flex w-full max-w-sm flex-col gap-4 rounded-2xl border border-border-default bg-surface p-8 shadow-xl shadow-black/5"
        >
            <h1 className="text-2xl font-bold text-foreground">Login</h1>

            {error && <p className="text-red-500">{error}</p>}

            <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="rounded-lg border border-border-default bg-background px-3 py-2.5 text-foreground placeholder:text-foreground-secondary/70 outline-none transition-colors focus:border-accent-interactive focus:ring-2 focus:ring-accent-interactive/20"
            />
            <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="rounded-lg border border-border-default bg-background px-3 py-2.5 text-foreground placeholder:text-foreground-secondary/70 outline-none transition-colors focus:border-accent-interactive focus:ring-2 focus:ring-accent-interactive/20"
            />
            <button
            type="submit"
            className="rounded-lg bg-accent-interactive px-3 py-2.5 text-white hover:opacity-90 transition-opacity"
            >
            Sign in
            </button>
            <button
            onClick={() => signIn("google", { callbackUrl: "/" })}
            className="rounded-lg border border-border-default bg-transparent px-3 py-2.5 text-foreground transition-colors hover:bg-background"
            >
            Entrar com Google
            </button>
        </form>
        </div>
            );
                
        }
