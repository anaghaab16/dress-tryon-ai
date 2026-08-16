import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth, useIsAdmin } from "@/hooks/useAuth";
import { PageHeading } from "@/components/PageHeading";
import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_authenticated/profile")({
  head: () => ({
    meta: [
      { title: "Profile — Maison Mirror" },
      { name: "description", content: "Your measurements and styling preferences." },
      { property: "og:title", content: "Profile — Maison Mirror" },
      { property: "og:description", content: "Manage your fit profile." },
    ],
  }),
  component: Profile,
});

function Profile() {
  const { user } = useAuth();
  const isAdmin = useIsAdmin(user?.id);
  const [form, setForm] = useState({ full_name: "", height_cm: "", dress_size: "", skin_tone: "" });

  const { data } = useQuery({
    queryKey: ["profile", user?.id],
    enabled: Boolean(user?.id),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user!.id)
        .maybeSingle();
      if (error) throw new Error(error.message);
      return data;
    },
  });

  useEffect(() => {
    if (data) {
      setForm({
        full_name: data.full_name ?? "",
        height_cm: data.height_cm?.toString() ?? "",
        dress_size: data.dress_size ?? "",
        skin_tone: data.skin_tone ?? "",
      });
    }
  }, [data]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await supabase.from("profiles").upsert({
      id: user!.id,
      full_name: form.full_name || null,
      height_cm: form.height_cm ? Number(form.height_cm) : null,
      dress_size: form.dress_size || null,
      skin_tone: form.skin_tone || null,
    });
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Profile saved.");
  }

  return (
    <main className="mx-auto w-full max-w-2xl px-5 py-14">
      <PageHeading eyebrow="Account" title="Profile">
        <div className="flex items-center gap-3">
          <p className="text-sm text-muted-foreground">{user?.email}</p>
          {isAdmin && <Badge className="rounded-none text-[10px] tracking-luxe">Admin</Badge>}
        </div>
      </PageHeading>

      <form onSubmit={save} className="mt-10 space-y-6">
        {(
          [
            ["full_name", "Full name", "text"],
            ["height_cm", "Height (cm)", "number"],
            ["dress_size", "Usual dress size", "text"],
            ["skin_tone", "Skin tone", "text"],
          ] as const
        ).map(([key, label, type], i) => (
          <Reveal key={key} delay={i * 0.08} y={18} className="space-y-2">
            <Label htmlFor={key} className="text-[10px] tracking-luxe text-muted-foreground">
              {label}
            </Label>
            <Input
              id={key}
              type={type}
              value={form[key]}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              className="rounded-none border-x-0 border-t-0 px-0 focus-visible:ring-0"
            />
          </Reveal>
        ))}
        <Button
          type="submit"
          className="rounded-none px-8 text-[11px] tracking-luxe transition-transform hover:-translate-y-0.5"
        >
          Save profile
        </Button>
      </form>
    </main>
  );
}