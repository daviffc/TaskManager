import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

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

  const task = await prisma.task.create({
      data: {
      title: body.title,
      userId: session.user.id,
    },
  });

  return NextResponse.json(task, { status: 201 });
}