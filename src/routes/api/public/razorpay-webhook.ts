import { createFileRoute } from "@tanstack/react-router";
import { createHmac, timingSafeEqual } from "crypto";

/**
 * Razorpay calls this URL when a payment succeeds or fails, so orders are
 * settled even if the customer closes the tab before the browser confirms.
 */
export const Route = createFileRoute("/api/public/razorpay-webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const secret = process.env["RAZORPAY_WEBHOOK_SECRET"];
        if (!secret) return new Response("Not configured", { status: 503 });

        const signature = request.headers.get("x-razorpay-signature") ?? "";
        const raw = await request.text();

        const expected = createHmac("sha256", secret).update(raw).digest("hex");
        const given = Buffer.from(signature);
        const exp = Buffer.from(expected);
        if (given.length !== exp.length || !timingSafeEqual(given, exp)) {
          return new Response("Invalid signature", { status: 401 });
        }

        let event: {
          event?: string;
          payload?: { payment?: { entity?: { id?: string; order_id?: string } } };
        };
        try {
          event = JSON.parse(raw);
        } catch {
          return new Response("Bad payload", { status: 400 });
        }

        const payment = event.payload?.payment?.entity;
        if (!payment?.order_id) return new Response("ok");

        const status =
          event.event === "payment.captured" || event.event === "payment.authorized"
            ? "paid"
            : event.event === "payment.failed"
              ? "failed"
              : null;
        if (!status) return new Response("ok");

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { error } = await supabaseAdmin
          .from("orders")
          .update({ status, razorpay_payment_id: payment.id ?? null })
          .eq("razorpay_order_id", payment.order_id)
          .neq("status", "paid");
        if (error) console.error(`[razorpay-webhook] ${error.message}`);

        return new Response("ok");
      },
    },
  },
});
