import { NextResponse } from "next/server";
import bcrypt from "bcrypt"
import { prisma } from "@/lib/prisma";

export async function POST (request: Request){
    const body = await request.json();
    const { email, name, password} = body;

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
}  );

return NextResponse.json(
    {id: user.id, email: user.email, name: user.name},
    { status: 201}

);
}
