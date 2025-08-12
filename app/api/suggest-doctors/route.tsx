import { openai } from "@/config/OpenAiModel";
import { AIDoctorAgents } from "@/shared/list";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { notes } = await req.json();
  try {
    const completion = await openai.chat.completions.create({
      model: "openai/gpt-oss-20b:free",
      messages: [
        { role: "system", content: JSON.stringify(AIDoctorAgents) },
        {
          role: "user",
          content:
            "User Notes/Symptoms:" +
            notes +
            ", Depends on user notes and symptoms, suggest a list of doctors, Return Object in JSON only",
        },
      ],
    });

    const rawRes = completion.choices[0].message;
    // @ts-ignore
    const Resp = rawRes.content.trim().replace("```json", "").replace("```");
    return NextResponse.json(rawRes);
  } catch (error) {
    return NextResponse.json(error);
  }
}
