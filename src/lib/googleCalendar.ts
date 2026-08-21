import { prisma } from "@/lib/prisma"
import { decrypt, encrypt } from "@/lib/crypto"

export async function getValidAccessToken(userId: string): Promise<string | null> {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user?.accessToken || !user.refreshToken) return null;

  const isExpired = user.tokenExpiry ? new Date() > user.tokenExpiry : false;

  if (!isExpired) return decrypt(user.accessToken);

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      refresh_token: decrypt(user.refreshToken),
      grant_type: "refresh_token",
    }),
  });

  const data = await response.json();

  if (!data.access_token) {
    await prisma.user.update({
      where: { id: userId},
      data: { accessToken: null, refreshToken: null, tokenExpiry: null},
    });
    return null;
  };

  await prisma.user.update({
    where: { id: userId },
    data: {
      accessToken: encrypt(data.access_token),
      tokenExpiry: new Date(Date.now() + data.expires_in * 1000),
    },
  });

  return data.access_token as string;
}

export async function createCalendarEvent(
  title: string,
  dueDate: Date,
  accessToken: string
): Promise<string | null> {
  const dateStr = dueDate.toISOString().split("T")[0];

  const response = await fetch(
    "https://www.googleapis.com/calendar/v3/calendars/primary/events",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        summary: title,
        start: { date: dateStr },
        end: { date: dateStr },
      }),
    }
  );

  if (!response.ok) return null;

  const event = await response.json();
  return event.id as string;
}

export async function deleteCalendarEvent(
  eventId: string,
  accessToken: string
): Promise<void> {
  await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`,
    {
      method: "DELETE",
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );
}