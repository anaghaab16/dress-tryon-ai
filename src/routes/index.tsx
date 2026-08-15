import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Camera, MessageSquareQuote, Sparkles } from "lucide-react";
import heroDress from "@/assets/hero-dress.jpg";
import { SiteHeader } from "@/components/SiteHeader";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Maison Mirror — See Yourself In Any Dress" },
      {
        name: "description",
        content:
          "Upload your photo and a dress, and our AI shows you wearing it plus honest styling advice.",
      },
      { property: "og:title", content: "Maison Mirror — See Yourself In Any Dress" },
      {
        property: "og:description",
        content: "AI virtual try-on for dresses, with a stylist's verdict on fit and colour.",
      },
    ],
  }),
  component: Index,
});

const STEPS = [
  {
    icon: Camera,
    title: "Upload two photos",
    body: "One of you, one of the dress — from any shop, screenshot or catalogue.",
  },
  {
    icon: Sparkles,
    title: "AI dresses you",
    body: "The model keeps your face and proportions while fitting the garment to your body.",
  },
  {
    icon: MessageSquareQuote,
    title: "Get the verdict",
    body: "A short, honest read on fit, colour and how to style it for your occasion.",
  },
];

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main>
        <section className="bg-runway">
          <div className="mx-auto grid w-full max-w-7xl items-center gap-14 px-5 py-20 lg:grid-cols-2 lg:py-28">
            <div>
              <p className="text-[10px] tracking-luxe text-muted-foreground">
                The AI fitting room · New season
              </p>
              <h1 className="mt-6 font-display text-5xl leading-[1.05] md:text-7xl">
                See yourself in the dress before you buy it.
              </h1>
              <p className="mt-6 max-w-md text-base leading-relaxed text-muted-foreground">
                Upload your photo and any dress you have your eye on. Maison Mirror generates the
                look on you and gives you a stylist's honest opinion.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <Button asChild className="rounded-none px-8 py-6 text-[11px] tracking-luxe">
                  <Link to="/studio">
                    Start a try-on <ArrowRight className="ml-2 size-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="rounded-none px-8 py-6 text-[11px] tracking-luxe"
                >
                  <Link to="/auth">Create account</Link>
                </Button>
              </div>
            </div>

            <div className="relative">
              <img
                src={heroDress}
                alt="Model wearing a champagne silk slip dress in a warm studio"
                width={1280}
                height={1600}
                className="w-full object-cover shadow-lift"
              />
              <div className="absolute -bottom-6 -left-6 hidden bg-card px-7 py-5 shadow-soft md:block">
                <p className="font-display text-3xl">12s</p>
                <p className="text-[10px] tracking-luxe text-muted-foreground">Average try-on</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-7xl px-5 py-24">
          <h2 className="max-w-lg font-display text-4xl">How the fitting room works</h2>
          <div className="mt-14 grid gap-10 md:grid-cols-3">
            {STEPS.map((step) => (
              <div key={step.title} className="border-t border-border pt-7">
                <step.icon className="size-5 text-accent" />
                <h3 className="mt-5 font-display text-2xl">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-primary text-primary-foreground">
          <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-8 px-5 py-24 text-center">
            <h2 className="max-w-2xl font-display text-4xl md:text-5xl">
              Stop guessing your size from a stranger's photo.
            </h2>
            <Button
              asChild
              variant="secondary"
              className="rounded-none px-10 py-6 text-[11px] tracking-luxe"
            >
              <Link to="/studio">Try a dress on now</Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="mx-auto w-full max-w-7xl px-5 py-12 text-[10px] tracking-luxe text-muted-foreground">
        Maison Mirror · AI virtual try-on
      </footer>
    </div>
  );
}
