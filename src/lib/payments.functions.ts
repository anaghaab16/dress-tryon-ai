import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { findCatalogItem } from "@/lib/catalog";

const RAZORPAY_API = "https://api.razorpay.com/v1";

function credentials() {
  const keyId = process.env["RAZORPAY_KEY_ID"];
  const keySecret = process.env["RAZORPAY_KEY_SECRET"];
  if (!keyId || !keySecret) throw new Error("Payments are not configured yet.");
  return { keyId, keySecret, basic: btoa(`${keyId}:${keySecret}`) };
}

/** Creates a Razorpay order for a catalogue item and records it as pending. */
export const createOrder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => z.object({ itemId: z.string().min(1).max(64) }).parse(data))
  .handler(async ({ data, context }) => {
    const item = findCatalogItem(data.itemId);
    if (!item) throw new Error("That item is not available.");

    const { keyId, basic } = credentials();

    const res = await fetch(`${RAZORPAY_API}/orders`, {
      method: "POST",
      headers: { Authorization: `Basic ${basic}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        // Razorpay works in the smallest currency unit (paise).
        amount: item.price * 100,
        currency: "INR",
        receipt: `${context.userId.slice(0, 8)}-${Date.now()}`,
        notes: { item_id: item.id, user_id: context.userId },
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error(`[razorpay] create order failed [${res.status}]: ${body}`);
      throw new Error("Could not start the payment. Please try again.");
    }

    const order = (await res.json()) as { id: string; amount: number; currency: string };

    const { error } = await context.supabase.from("orders").insert({
      user_id: context.userId,
      item_id: item.id,
      item_name: item.name,
      item_image: item.image,
      amount_inr: item.price,
      razorpay_order_id: order.id,
    });
    if (error) throw new Error(error.message);

    return {
      keyId,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      itemName: item.name,
    };
  });

/** Verifies the Razorpay checkout signature and marks the order paid. */
export const confirmOrder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z
      .object({
        razorpayOrderId: z.string().min(1).max(64),
        razorpayPaymentId: z.string().min(1).max(64),
        razorpaySignature: z.string().min(1).max(256),
      })
      .parse(data),
  )
  .handler(async ({ data, context }) => {
    const { keySecret } = credentials();
    const { createHmac, timingSafeEqual } = await import("crypto");

    const expected = createHmac("sha256", keySecret)
      .update(`${data.razorpayOrderId}|${data.razorpayPaymentId}`)
      .digest("hex");
    const given = Buffer.from(data.razorpaySignature);
    const exp = Buffer.from(expected);
    if (given.length !== exp.length || !timingSafeEqual(given, exp)) {
      throw new Error("Payment could not be verified.");
    }

    // Service role: the signature is verified, and customers may not edit orders.
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("orders")
      .update({ status: "paid", razorpay_payment_id: data.razorpayPaymentId })
      .eq("razorpay_order_id", data.razorpayOrderId)
      .eq("user_id", context.userId);
    if (error) throw new Error(error.message);

    return { ok: true };
  });

/** The signed-in customer's order history, newest first. */
export const listOrders = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("orders")
      .select("id, item_name, item_image, amount_inr, status, created_at")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  });
