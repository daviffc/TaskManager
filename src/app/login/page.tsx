"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

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
        <div className = "flex min-h-screen items-center justify-center ">
            <form
            onSubmit={handleSubmit}
            className = "flex w-full max-w-sm flex-col gap-4 rounded border border-zinc-300 p-6 "
            >
                <h1 className = "text-2xl font-bold">Login</h1>

                {error && <p className = "text-red-600">{error}</p>}

                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className = "rounded border border-zinc-300 px-3 py-2 text-zinc-900"
                    />
                <input
                    type = "password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                     className="rounded border border-zinc-300 px-3 py-2 text-zinc-900"
                     />
                     <button
                     type="submit"
                     className = "rounded bg-blue-500 px-3 py-2 text-white hover:bg-blue-600"
                     >
                        Sign in
                     </button>
                 </form>
             </div>
    );
        
}
