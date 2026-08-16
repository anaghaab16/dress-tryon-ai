import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "motion/react";
import { Loader2, Upload, Wand2 } from "lucide-react";
import { toast } from "sonner";
import { createTryOn } from "@/lib/tryon.functions";
import { fileToCompressedDataUrl } from "@/lib/images";
import { PageHeading } from "@/components/PageHeading";
import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/_authenticated/studio")({
  head: () => ({
    meta: [
      { title: "Try-On Studio — Maison Mirror" },
      { name: "description", content: "Upload your photo and a dress to generate your look." },
      { property: "og:title", content: "Try-On Studio — Maison Mirror" },
      { property: "og:description", content: "Generate a virtual try-on in seconds." },
    ],
  }),
  component: Studio,
});

type Result = { result_image_url: string | null; advice: string | null };

function Studio() {
  const run = useServerFn(createTryOn);
  const queryClient = useQueryClient();
  const [person, setPerson] = useState<string | null>(null);
  const [dress, setDress] = useState<string | null>(null);
  const [occasion, setOccasion] = useState("");
  const [title, setTitle] = useState("");
  const [result, setResult] = useState<Result | null>(null);

  const mutation = useMutation({
    mutationFn: async () => {
      if (!person || !dress) throw new Error("Add both photos first.");
      return run({ data: { personImage: person, dressImage: dress, occasion, title } });
    },
    onSuccess: (row) => {
      setResult(row as Result);
      queryClient.invalidateQueries({ queryKey: ["tryons"] });
      toast.success("Your look is ready.");
    },
    onError: (error: Error) => toast.error(error.message),
  });

  return (
    <main className="mx-auto w-full max-w-7xl px-5 py-14">
      <PageHeading eyebrow="The fitting room" title="Try-On Studio" accentFrom={1} />

      <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_1.1fr]">
        <Reveal className="space-y-8">
          <div className="grid gap-6 sm:grid-cols-2">
            <PhotoInput id="person" label="Your photo" value={person} onChange={setPerson} />
            <PhotoInput id="dress" label="The dress" value={dress} onChange={setDress} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="title" className="text-[10px] tracking-luxe text-muted-foreground">
              Name this look
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Cousin's wedding"
              className="rounded-none"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="occasion" className="text-[10px] tracking-luxe text-muted-foreground">
              Occasion (optional)
            </Label>
            <Input
              id="occasion"
              value={occasion}
              onChange={(e) => setOccasion(e.target.value)}
              placeholder="Evening reception, outdoors"
              className="rounded-none"
            />
          </div>

          <Button
            className="w-full rounded-none py-6 text-[11px] tracking-luxe"
            disabled={mutation.isPending || !person || !dress}
            onClick={() => mutation.mutate()}
          >
            {mutation.isPending ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" /> Styling you…
              </>
            ) : (
              <>
                <Wand2 className="mr-2 size-4" /> See me in this
              </>
            )}
          </Button>
        </Reveal>

        <motion.section
          initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="glass-panel p-8 shadow-soft"
        >
          {mutation.isPending && (
            <div className="flex h-96 items-center justify-center text-[11px] tracking-luxe text-muted-foreground">
              Generating your look…
            </div>
          )}

          {!mutation.isPending && !result && (
            <div className="flex h-96 flex-col items-center justify-center gap-3 text-center text-sm text-muted-foreground">
              <Wand2 className="size-6 text-accent" />
              Your generated look and styling notes will appear here.
            </div>
          )}

          {!mutation.isPending && result && (
            <div className="space-y-6">
              {result.result_image_url && (
                <img
                  src={result.result_image_url}
                  alt="AI generated try-on of you wearing the dress"
                  className="w-full object-cover"
                />
              )}
              {result.advice && (
                <div>
                  <h2 className="font-display text-2xl">Stylist's notes</h2>
                  <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                    {result.advice}
                  </p>
                </div>
              )}
            </div>
          )}
        </motion.section>
      </div>
    </main>
  );
}

function PhotoInput({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: string | null;
  onChange: (v: string) => void;
}) {
  async function handleFile(file: File | undefined) {
    if (!file) return;
    try {
      onChange(await fileToCompressedDataUrl(file));
    } catch {
      toast.error("That image could not be read.");
    }
  }

  return (
    <label
      htmlFor={id}
      className="flex aspect-[3/4] cursor-pointer flex-col items-center justify-center gap-3 border border-dashed border-border bg-secondary/50 text-center transition-colors hover:border-accent"
    >
      {value ? (
        <img src={value} alt={label} className="size-full object-cover" />
      ) : (
        <>
          <Upload className="size-5 text-accent" />
          <span className="text-[10px] tracking-luxe text-muted-foreground">{label}</span>
        </>
      )}
      <input
        id={id}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
    </label>
  );
}