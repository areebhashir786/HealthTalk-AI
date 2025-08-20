import { openai } from "@/config/OpenAiModel";
import { AIDoctorAgents } from "@/shared/list";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { notes } = await req.json();
  try {
    const completion = await openai.chat.completions.create({
      model: "openai/gpt-oss-20b:free",
      messages: [
        {
          role: "system",
          content: `You are a medical AI assistant. Based on the user's symptoms and notes, suggest the most appropriate doctors from this list: ${JSON.stringify(
            AIDoctorAgents
          )}. 

        IMPORTANT: You must return ONLY a JSON array of doctor objects. Do not include any other text, markdown formatting, or wrapper objects. The response should be a direct array that can be parsed as JSON.

        Example format:
        [
        {
            "id": 1,
            "specialist": "General Physician",
            "description": "Helps with everyday health concerns and common symptoms.",
            "image": "/doctor1.png",
            "agentPrompt": "You are a friendly General Physician AI...",
            "voiceId": "will",
            "subscriptionRequired": false
        }
        ]`,
        },
        {
          role: "user",
          content: `Based on these user notes/symptoms: "${notes}", suggest the most appropriate doctors from the provided list. Return ONLY a JSON array of doctor objects, no other text or formatting.`,
        },
      ],
    });

    const rawRes = completion.choices[0].message.content || "";

    // Clean markdown backticks and parse
    const cleaned = rawRes
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      console.error("Raw response:", rawRes);
      console.error("Cleaned response:", cleaned);
      return NextResponse.json(
        { error: "Invalid response format from AI" },
        { status: 500 }
      );
    }

    // Normalize the response to ensure it's always an array
    let doctorsArray;
    if (Array.isArray(parsed)) {
      doctorsArray = parsed;
    } else if (parsed && typeof parsed === "object") {
      // Handle cases where AI returns an object with different property names
      if (parsed.recommendations && Array.isArray(parsed.recommendations)) {
        doctorsArray = parsed.recommendations;
      } else if (
        parsed.suggestedDoctors &&
        Array.isArray(parsed.suggestedDoctors)
      ) {
        doctorsArray = parsed.suggestedDoctors;
      } else if (parsed.doctors && Array.isArray(parsed.doctors)) {
        doctorsArray = parsed.doctors;
      } else if (parsed.suggestions && Array.isArray(parsed.suggestions)) {
        doctorsArray = parsed.suggestions;
      } else {
        // If it's an object but we can't find a known array property, try to extract any array
        const arrayValues = Object.values(parsed).filter((val) =>
          Array.isArray(val)
        );
        doctorsArray = arrayValues.length > 0 ? arrayValues[0] : [];
      }
    } else {
      doctorsArray = [];
    }

    // Validate that all items in the array have the required structure
    const validatedDoctors = doctorsArray.filter(
      (doctor: any) =>
        doctor && typeof doctor === "object" && doctor.id && doctor.specialist
    );

    // If no valid doctors found, return a default suggestion
    if (validatedDoctors.length === 0) {
      validatedDoctors.push(AIDoctorAgents[0]); // Default to General Physician
    }

    // Send clean validated array
    return NextResponse.json(validatedDoctors);
  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
