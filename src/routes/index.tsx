import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowRight, Camera, MessageSquareQuote, Sparkles } from "lucide-react";
import heroDress from "@/assets/hero-dress.jpg";
import { SiteHeader } from "@/components/SiteHeader";
import { Reveal } from "@/components/Reveal";
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

const MARQUEE = [
  "Photoreal try-on",
  "Stylist's verdict",
  "Fit & colour analysis",
  "Your looks, saved",
  "12 second render",
];

function Index() {
  const { scrollYProgress } = useScroll();
  const heroY = useTransform(scrollYProgress, [0, 0.35], [0, -60]);
  const heroScale = useTransform(scrollYProgress, [0, 0.35], [1, 1.06]);

  return (
    <div className="min-h-screen overflow-x-clip bg-background">
      <SiteHeader />

      <main>
        <section className="relative isolate overflow-hidden bg-aurora">
          <motion.div
            aria-hidden
            className="pointer-events-none absolute -top-40 left-1/2 -z-10 size-[46rem] -translate-x-1/2 rounded-full bg-gold opacity-25 blur-3xl"
            animate={{ scale: [1, 1.12, 1], opacity: [0.18, 0.3, 0.18] }}
            transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="mx-auto grid w-full max-w-7xl items-center gap-14 px-5 py-24 lg:grid-cols-2 lg:py-32">
            <div>
              <motion.p
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center gap-2 rounded-full glass-panel px-4 py-2 text-[10px] tracking-luxe text-muted-foreground"
              >
                <Sparkles className="size-3 text-accent" /> The AI fitting room
              </motion.p>

              <h1 className="mt-7 font-display text-5xl leading-[1.03] md:text-7xl">
                {["See yourself in", "the dress before", "you buy it."].map((line, i) => (
                  <motion.span
                    key={line}
                    className="block"
                    initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{ duration: 0.9, delay: 0.15 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {i === 2 ? <span className="text-gold">{line}</span> : line}
                  </motion.span>
                ))}
              </h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="mt-7 max-w-md text-base leading-relaxed text-muted-foreground"
              >
                Upload your photo and any dress you have your eye on. Maison Mirror generates the
                look on you and gives you a stylist's honest opinion.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.72 }}
                className="mt-10 flex flex-wrap gap-4"
              >
                <Button
                  asChild
                  className="group rounded-none px-8 py-6 text-[11px] tracking-luxe transition-transform hover:-translate-y-0.5"
                >
                  <Link to="/studio">
                    Start a try-on
                    <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="rounded-none px-8 py-6 text-[11px] tracking-luxe transition-transform hover:-translate-y-0.5"
                >
                  <Link to="/auth">Create account</Link>
                </Button>
              </motion.div>
            </div>

            <motion.div
              className="relative"
              style={{ y: heroY }}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="overflow-hidden shadow-lift">
                <motion.img
                  src={heroDress}
                  alt="Model wearing a champagne silk slip dress in a warm studio"
                  width={1280}
                  height={1600}
                  style={{ scale: heroScale }}
                  className="w-full object-cover"
                />
              </div>
              <motion.div
                className="absolute -bottom-6 -left-6 hidden glass-panel px-7 py-5 shadow-soft md:block"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              >
                <p className="font-display text-3xl">12s</p>
                <p className="text-[10px] tracking-luxe text-muted-foreground">Average try-on</p>
              </motion.div>
            </motion.div>
          </div>

          <div className="overflow-hidden border-y border-border/60 py-4">
            <div className="animate-marquee flex w-max gap-14 whitespace-nowrap text-[10px] tracking-luxe text-muted-foreground">
              {Array.from({ length: 2 }).map((_, dup) =>
                MARQUEE.map((item) => (
                  <span key={`${dup}-${item}`} className="flex items-center gap-14">
                    {item} <span className="text-accent">◆</span>
                  </span>
                )),
              )}
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-7xl px-5 py-28">
          <Reveal>
            <h2 className="max-w-lg font-display text-4xl md:text-5xl">
              How the fitting room works
            </h2>
          </Reveal>
          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {STEPS.map((step, i) => (
              <Reveal key={step.title} delay={i * 0.12}>
                <motion.div
                  whileHover={{ y: -8 }}
                  transition={{ type: "spring", stiffness: 280, damping: 22 }}
                  className="h-full glass-panel p-8"
                >
                  <span className="text-[10px] tracking-luxe text-muted-foreground">
                    0{i + 1}
                  </span>
                  <step.icon className="mt-6 size-5 text-accent" />
                  <h3 className="mt-5 font-display text-2xl">{step.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
                </motion.div>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="relative isolate overflow-hidden bg-primary text-primary-foreground">
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 -bottom-32 -z-10 mx-auto h-72 w-[80%] rounded-full bg-gold opacity-30 blur-3xl"
            animate={{ opacity: [0.18, 0.36, 0.18] }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-8 px-5 py-28 text-center">
            <Reveal>
              <h2 className="max-w-2xl font-display text-4xl md:text-6xl">
                Stop guessing your size from a stranger's photo.
              </h2>
            </Reveal>
            <Reveal delay={0.12}>
              <Button
                asChild
                variant="secondary"
                className="rounded-none px-10 py-6 text-[11px] tracking-luxe transition-transform hover:-translate-y-0.5"
              >
                <Link to="/studio">Try a dress on now</Link>
              </Button>
            </Reveal>
          </div>
        </section>
      </main>

      <footer className="mx-auto w-full max-w-7xl px-5 py-12 text-[10px] tracking-luxe text-muted-foreground">
        Maison Mirror · AI virtual try-on
      </footer>
    </div>
  );
}
