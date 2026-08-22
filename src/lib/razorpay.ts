const SCRIPT_SRC = "https://checkout.razorpay.com/v1/checkout.js";

type RazorpayResponse = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

type RazorpayConstructor = new (options: Record<string, unknown>) => { open: () => void };

/** Loads Razorpay's checkout script once and resolves with the constructor. */
export async function loadRazorpay(): Promise<RazorpayConstructor> {
  const w = window as unknown as { Razorpay?: RazorpayConstructor };
  if (w.Razorpay) return w.Razorpay;

  await new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${SCRIPT_SRC}"]`);
    const script = existing ?? document.createElement("script");
    script.src = SCRIPT_SRC;
    script.async = true;
    script.addEventListener("load", () => resolve(), { once: true });
    script.addEventListener("error", () => reject(new Error("Could not load Razorpay.")), {
      once: true,
    });
    if (!existing) document.body.appendChild(script);
  });

  if (!w.Razorpay) throw new Error("Could not load Razorpay.");
  return w.Razorpay;
}

/** Opens the Razorpay modal and resolves once the customer pays (or rejects). */
export async function openCheckout(options: {
  keyId: string;
  orderId: string;
  amount: number;
  currency: string;
  itemName: string;
  email?: string | undefined;
}): Promise<RazorpayResponse> {
  const Razorpay = await loadRazorpay();

  return new Promise<RazorpayResponse>((resolve, reject) => {
    const checkout = new Razorpay({
      key: options.keyId,
      amount: options.amount,
      currency: options.currency,
      name: "Maison Mirror",
      description: options.itemName,
      order_id: options.orderId,
      prefill: options.email ? { email: options.email } : {},
      theme: { color: "#111111" },
      handler: (response: RazorpayResponse) => resolve(response),
      modal: { ondismiss: () => reject(new Error("Payment cancelled.")) },
    });
    checkout.open();
  });
}
