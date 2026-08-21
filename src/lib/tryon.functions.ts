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
      model: "google/gemini-3-pro-image",
      modalities: ["image", "text"],
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: [
                "Photorealistic virtual try-on. IMAGE 1 is the person. IMAGE 2 is the garment reference.",
                "Output exactly ONE image of the SAME single person from IMAGE 1, now wearing the garment from IMAGE 2.",
                "Identity rule (critical): keep the person's face, hairstyle, body proportions, pose and skin tone IDENTICAL to IMAGE 1. Do not change the face. Preserve the exact facial features, identity, expression, eye shape, nose, lips, jawline, hairline and hair colour. The face in the output must be recognisably the same person as in IMAGE 1.",
                "Anatomy rules (critical): exactly one head, one neck, two arms, two hands with five fingers each, two legs, two feet.",
                "Never duplicate, mirror, merge or add extra limbs, hands, arms, shoulders or people. Do not copy the model, mannequin, hanger or body parts from IMAGE 2 — take ONLY the garment's colour, print, fabric, cut and length from it.",
                "The garment must follow the person's real body and pose with correct sleeve length and natural fabric drape; arms stay in their original position and are visible through/over the garment correctly.",
                "Single subject, full-body framing, sharp realistic hands, correct perspective and scale.",
                "Photography quality: shot on a full-frame camera with an 85mm lens at f/2.8, high-end fashion editorial look, crisp focus on the face and garment, soft natural falloff in the background.",
                "Lighting: large soft key light with gentle fill and a subtle rim light; realistic contact shadows where the garment meets the body and where the feet meet the floor.",
                "Rendering: true-to-life skin texture with pores and fine detail, visible fabric weave, embroidery and sheen, natural colour grading, balanced white balance, no plastic or over-smoothed skin, no HDR halos, no oversaturation.",
                "Output a clean high-resolution image with no text, watermark, logo, border, collage or split panels.",
                `Styling context: ${occasion}.`,

              ].join(" "),
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