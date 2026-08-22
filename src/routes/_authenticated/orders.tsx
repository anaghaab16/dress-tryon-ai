import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { listOrders } from "@/lib/payments.functions";
import { formatINR } from "@/lib/catalog";
import { PageHeading } from "@/components/PageHeading";
import { Reveal } from "@/components/Reveal";

export const Route = createFileRoute("/_authenticated/orders")({
  head: () => ({
    meta: [
      { title: "Your Orders — Maison Mirror" },
      { name: "description", content: "Track the dresses you have purchased from Maison Mirror." },
      { property: "og:title", content: "Your Orders — Maison Mirror" },
      { property: "og:description", content: "Every Maison Mirror purchase, in one place." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Orders,
});

function Orders() {
  const fetchOrders = useServerFn(listOrders);
  const { data, isPending } = useQuery({ queryKey: ["orders"], queryFn: () => fetchOrders() });

  return (
    <main className="mx-auto w-full max-w-5xl px-5 py-14">
      <PageHeading eyebrow="Your purchases" title="Orders" accentFrom={0} />

      {isPending && (
        <p className="mt-12 text-[11px] tracking-luxe text-muted-foreground">Loading your orders…</p>
      )}

      {!isPending && (data?.length ?? 0) === 0 && (
        <p className="mt-12 text-sm text-muted-foreground">
          No orders yet — anything you buy from the shop will appear here.
        </p>
      )}

      <div className="mt-12 space-y-4">
        {data?.map((order) => (
          <Reveal key={order.id}>
            <article className="flex items-center gap-5 border border-border p-4">
              {order.item_image && (
                <img
                  src={order.item_image}
                  alt={order.item_name}
                  loading="lazy"
                  className="size-20 shrink-0 object-cover"
                />
              )}
              <div className="min-w-0 flex-1">
                <h2 className="font-display text-lg leading-snug">{order.item_name}</h2>
                <p className="mt-1 text-[10px] tracking-luxe text-muted-foreground">
                  {new Date(order.created_at).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm">{formatINR(order.amount_inr)}</p>
                <p className="mt-1 text-[10px] tracking-luxe text-muted-foreground">
                  {order.status === "paid"
                    ? "Paid"
                    : order.status === "failed"
                      ? "Payment failed"
                      : "Awaiting payment"}
                </p>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </main>
  );
}
