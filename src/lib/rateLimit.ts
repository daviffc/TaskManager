const requests = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(identifier: string, limit: number, windowMs: number)  {
    const now = Date.now();
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