import { db } from "@/config/db";
import { v4 as uuidv4 } from "uuid";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { SessionChatTable } from "@/config/schema";
import { desc, eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  const { notes, selectedDoctor } = await req.json();
  const user = await currentUser();

  try {
    const sessionId = uuidv4();
    const result = await db
      .insert(SessionChatTable)
      .values({
        sessionId: sessionId,
        createdBy: user?.primaryEmailAddress?.emailAddress,
        notes: notes,
        selectedDoctor: selectedDoctor,
        createdOn: new Date().toString(),
      })
      // @ts-ignore
      .returning({ SessionChatTable });

    return NextResponse.json(result[0]?.SessionChatTable);
  } catch (error) {
    return NextResponse.json(error);
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const sessionId = searchParams.get("sessionId");
  const user = await currentUser();

  if (!sessionId) {
    return NextResponse.json({ error: "Missing sessionId" }, { status: 400 });
  }

  try {
    if (sessionId == "all") {
      const result = await db
        .select()
        .from(SessionChatTable)

        .where(
          // @ts-ignore
          eq(
            SessionChatTable.createdBy,
            user?.primaryEmailAddress?.emailAddress
          )
        )
        .orderBy(desc(SessionChatTable.id));

      return NextResponse.json(result);
    } else {
      const result = await db
        .select()
        .from(SessionChatTable)
        // @ts-ignore
        .where(eq(SessionChatTable.sessionId, sessionId));

      return NextResponse.json(result[0]);
    }
  } catch (error) {
    return NextResponse.json(error);
  }
}
