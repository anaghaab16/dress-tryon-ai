import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { confirmOrder, createOrder } from "@/lib/payments.functions";
import { openCheckout } from "@/lib/razorpay";
import { useAuth } from "@/hooks/useAuth";

/** Runs the full buy flow: create order → Razorpay modal → verify → confirm. */
export function useCheckout() {
  const start = useServerFn(createOrder);
  const confirm = useServerFn(confirmOrder);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [pendingId, setPendingId] = useState<string | null>(null);

  async function buy(itemId: string) {
    if (!user) {
      toast.info("Please sign in to complete your purchase.");
      navigate({ to: "/auth" });
      return;
    }
    setPendingId(itemId);
    try {
      const order = await start({ data: { itemId } });
      const response = await openCheckout({ ...order, email: user.email });
      await confirm({
        data: {
          razorpayOrderId: response.razorpay_order_id,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpaySignature: response.razorpay_signature,
        },
      });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Payment received — your order is confirmed.");
      navigate({ to: "/orders" });
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setPendingId(null);
    }
  }

  return { buy, pendingId };
}
