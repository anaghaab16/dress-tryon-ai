import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/looks")({
  head: () => ({
    meta: [
      { title: "My Looks — Maison Mirror" },
      { name: "description", content: "Every dress you have virtually tried on, saved." },
      { property: "og:title", content: "My Looks — Maison Mirror" },
      { property: "og:description", content: "Your saved AI try-ons and styling notes." },
    ],
  }),
  component: Looks,
});

function Looks() {
  const queryClient = useQueryClient();

  // RLS already limits rows to the signed-in user, so no user filter is needed.
  const { data, isLoading } = useQuery({
    queryKey: ["tryons"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tryons")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw new Error(error.message);
      return data;
    },
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("tryons").delete().eq("id", id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tryons"] });
      toast.success("Look removed.");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  return (
    <main className="mx-auto w-full max-w-7xl px-5 py-14">
      <p className="text-[10px] tracking-luxe text-muted-foreground">Your wardrobe</p>
      <h1 className="mt-3 font-display text-4xl md:text-5xl">My Looks</h1>

      {isLoading && <p className="mt-10 text-sm text-muted-foreground">Loading…</p>}
      {!isLoading && !data?.length && (
        <p className="mt-10 text-sm text-muted-foreground">
          Nothing saved yet — generate your first look in the studio.
        </p>
      )}

      <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {data?.map((look) => (
          <article key={look.id} className="group border border-border bg-card shadow-soft">
            <img
              src={look.result_image_url ?? look.dress_image_url}
              alt={look.title ?? "Saved try-on"}
              loading="lazy"
              className="aspect-[3/4] w-full object-cover"
            />
            <div className="space-y-3 p-5">
              <h2 className="font-display text-xl">{look.title}</h2>
              {look.advice && (
                <p className="line-clamp-4 whitespace-pre-line text-xs leading-relaxed text-muted-foreground">
                  {look.advice}
                </p>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="px-0 text-[10px] tracking-luxe text-muted-foreground hover:text-destructive"
                onClick={() => remove.mutate(look.id)}
              >
                <Trash2 className="mr-2 size-3.5" /> Delete
              </Button>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}