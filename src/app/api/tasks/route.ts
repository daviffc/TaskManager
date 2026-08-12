import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { createTaskSchema } from "@/lib/validations";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const tasks = await prisma.task.findMany({
    where: {userId: session.user.id},
    orderBy: { createdAt: "asc"},
  });

return NextResponse.json(tasks);
} 

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id){
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = createTaskSchema.safeParse(body);

  if(!parsed.success){
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 }
    );
  }

  const task = await prisma.task.create({
      data: {
      title: parsed.data.title,
      userId: session.user.id,
    },
  });

  return NextResponse.json(task, { status: 201 });
}