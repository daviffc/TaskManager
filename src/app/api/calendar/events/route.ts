import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getValidAccessToken } from "@/lib/googleCalendar";
import { rateLimit } from "@/lib/rateLimit";

export async function GET(request:Request) {
  const { searchParams } = new URL(request.url)
  const timeMinParam = searchParams.get("timeMin")
  const timeMaxParam = searchParams.get("timeMax")
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { success } =  rateLimit(session.user.id,30,120_000);
  if (!success) {
    return NextResponse.json({ error:"Too many requests" }, { status: 429 });
  }
  const accessToken = await getValidAccessToken(session.user.id);

  if (!accessToken) {
    return NextResponse.json({ error: "Google Calendar not connected" }, { status: 400 });
  }
  const params: Record<string, string> = {
    timeMin: timeMinParam ?? new Date().toISOString(),
    maxResults: "250",
    singleEvents: "true",
    orderBy: "startTime",
  };

  if(timeMaxParam) {
    params.timeMax = timeMaxParam;
  }

  const response = await fetch(
    "https://www.googleapis.com/calendar/v3/calendars/primary/events?" +
      new URLSearchParams(params),
      {
      headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    
    const data = await response.json();
    return NextResponse.json(data.items ?? []);
  }
