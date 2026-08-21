import { NextResponse } from "next/server";
import bcrypt from "bcrypt"
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validations";
import { rateLimit } from "@/lib/rateLimit";

function getClientIp(request: Request): string {
    const forwardedFor = request.headers.get("x-forwarded-for");
    if (forwardedFor) return forwardedFor.split(",")[0].trim();
    return request.headers.get("x-real-ip") ?? "unknown";
}

export async function POST (request: Request){
    const ip = getClientIp(request);
    const { success } = rateLimit(ip, 5, 60_000);

    if (!success) {
        return NextResponse.json(
            { error: "Too many requests. Please try again later." },
            { status: 429 }
        );
    }

    const body = await request.json();

    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
        return NextResponse.json(
            { error: parsed.error.issues[0].message },
            { status: 400 }
        );
    }

    const { email, name, password} = parsed.data;

    try {

    const existingUser = await prisma.user.findUnique({
        where: { email },
    });

    if (existingUser) {
        return NextResponse.json(
            { error: "This email already exists" },
            { status: 409 }
        );
    }


const hashedPassword = await bcrypt.hash(password, 10);

const user = await prisma.user.create({
    data: {
        email,
        name,
        password: hashedPassword,
    },
});

return NextResponse.json(
    {id: user.id, email: user.email, name: user.name},
    { status: 201}

);
} catch (error) {
    return NextResponse.json(
            { error: "Something went wrong. Please try again." },
            { status: 500 }
        );
    }
}
