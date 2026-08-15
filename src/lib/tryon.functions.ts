import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";

const inputSchema = z.object({
  personImage: z.string().startsWith("data:image/"),
  dressImage: z.string().startsWith("data:image/"),
  occasion: z.string().max(120).optional(),
  title: z.string().max(80).optional(),
});

/** Generates the try-on image plus written styling advice, then saves the look. */
export const createTryOn = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => inputSchema.parse(data))
  .handler(async ({ data, context }) => {
    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) throw new Error("AI is not configured for this project.");

    const occasion = data.occasion?.trim() || "an everyday outing";

    const call = async (body: Record<string, unknown>) => {
      const res = await fetch(GATEWAY, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      if (res.status === 429) throw new Error("Too many requests right now — try again in a minute.");
      if (res.status === 402) throw new Error("AI credits exhausted. Please top up in Cloud settings.");
      if (!res.ok) throw new Error(`AI request failed (${res.status})`);
      return (await res.json()) as {
        choices: Array<{
          message: { content?: string; images?: Array<{ image_url: { url: string } }> };
        }>;
      };
    };

    // 1. Image model: fuse the person photo with the dress photo.
    const visual = await call({
      model: "google/gemini-3.1-flash-image",
      modalities: ["image", "text"],
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Photorealistic virtual try-on. Dress the person from the first photo in the garment from the second photo. Keep the person's face, hair, body proportions and skin tone exactly the same. Match the garment's colour, print, fabric and cut faithfully. Natural lighting and a clean studio background, full-body framing, styled for ${occasion}.`,
            },
            { type: "image_url", image_url: { url: data.personImage } },
            { type: "image_url", image_url: { url: data.dressImage } },
          ],
        },
      ],
    });
    const resultImage = visual.choices?.[0]?.message?.images?.[0]?.image_url?.url ?? null;

    // 2. Text model: short, concrete styling verdict.
    const written = await call({
      model: "google/gemini-2.5-flash",
      messages: [
        {
          role: "system",
          content:
            "You are a warm, precise personal stylist. Answer in 3 short labelled sections: Fit, Colour, Styling. Max 90 words total. No markdown headers, no emojis.",
        },
        {
          role: "user",
          content: [
            { type: "text", text: `How does this dress suit this person for ${occasion}?` },
            { type: "image_url", image_url: { url: data.personImage } },
            { type: "image_url", image_url: { url: data.dressImage } },
          ],
        },
      ],
    });
    const advice = written.choices?.[0]?.message?.content ?? null;

    // 3. Persist under the caller's own user id; RLS enforces ownership.
    const { data: row, error } = await context.supabase
      .from("tryons")
      .insert({
        user_id: context.userId,
        title: data.title?.trim() || "Untitled look",
        person_image_url: data.personImage,
        dress_image_url: data.dressImage,
        result_image_url: resultImage,
        advice,
        status: resultImage ? "complete" : "advice_only",
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return row;
  });