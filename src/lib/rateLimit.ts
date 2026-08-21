const requests = new Map<string, { count: number; resetAt: number }>();

const CLEANUP_INTERVAL_MS = 5 * 60_000;
let lastCleanup = Date.now();

function cleanupExpired(now: number) {
    if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;
    lastCleanup = now;
    for (const [key, entry] of requests) {
        if (now > entry.resetAt) requests.delete(key);
    }
}

export function rateLimit(identifier: string, limit: number, windowMs: number)  {
    const now = Date.now();
    cleanupExpired(now);

    const entry = requests.get(identifier);

    if (!entry || now > entry.resetAt) {
        requests.set(identifier, { count: 1, resetAt: now+windowMs });
        return { success: true };
    }

    if (entry.count >= limit) {
        return { success: false };
    }

    entry.count++;
    return { success: true };
}