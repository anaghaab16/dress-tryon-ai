import { useEffect, useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { motion } from "motion/react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useAuth } from "@/hooks/useAuth";
import { Eyebrow, TypeReveal } from "@/components/TypeReveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — Maison Mirror" },
      { name: "description", content: "Create an account to try dresses on virtually with AI." },
      { property: "og:title", content: "Sign in — Maison Mirror" },
      { property: "og:description", content: "Create an account to try dresses on virtually." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [busy, setBusy] = useState(false);

  // Already signed in? The auth page has nothing to offer.
  useEffect(() => {
    if (!loading && user) navigate({ to: "/studio", replace: true });
  }, [loading, user, navigate]);

  async function signIn(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    await navigate({ to: "/studio" });
  }

  async function signUp(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: { full_name: fullName },
      },
    });
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    if (!data.session) toast.success("Check your email to confirm your account.");
  }

  async function googleSignIn() {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      toast.error("Google sign-in failed.");
      return;
    }
    if (result.redirected) return;
    await navigate({ to: "/studio" });
  }

  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-aurora lg:block">
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -top-32 left-1/3 size-[34rem] rounded-full bg-gold opacity-25 blur-3xl"
          animate={{ scale: [1, 1.15, 1], opacity: [0.16, 0.3, 0.16] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="flex h-full flex-col justify-between p-14">
          <Link to="/" className="font-display text-2xl font-semibold">
            Maison<span className="text-accent">Mirror</span>
          </Link>
          <div>
            <TypeReveal
              as="h1"
              text="Wear it before you buy it."
              accentFrom={3}
              className="max-w-md font-display text-5xl leading-[1.08]"
            />
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="mt-5 max-w-sm text-sm text-muted-foreground"
            >
              Upload a photo of yourself and any dress. Our AI shows the look on you and tells you
              honestly whether it works.
            </motion.p>
          </div>
          <p className="text-[11px] tracking-luxe text-muted-foreground">AI Fitting Room · 2026</p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 22, filter: "blur(8px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="flex items-center justify-center px-6 py-16"
      >
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <Eyebrow>AI fitting room</Eyebrow>
            <TypeReveal
              as="h1"
              text="Wear it before you buy it."
              accentFrom={3}
              delay={0.1}
              className="mt-3 font-display text-3xl leading-[1.1]"
            />
          </div>
          <Tabs defaultValue="signin">
            <TabsList className="grid w-full grid-cols-2 rounded-none">
              <TabsTrigger value="signin">Sign in</TabsTrigger>
              <TabsTrigger value="signup">Create account</TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              <form onSubmit={signIn} className="mt-8 space-y-4">
                <Field id="email" label="Email" type="email" value={email} onChange={setEmail} />
                <Field
                  id="password"
                  label="Password"
                  type="password"
                  value={password}
                  onChange={setPassword}
                />
                <Button type="submit" disabled={busy} className="w-full rounded-none">
                  {busy ? "Signing in…" : "Sign in"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={signUp} className="mt-8 space-y-4">
                <Field id="name" label="Full name" value={fullName} onChange={setFullName} />
                <Field
                  id="email2"
                  label="Email"
                  type="email"
                  value={email}
                  onChange={setEmail}
                />
                <Field
                  id="password2"
                  label="Password"
                  type="password"
                  value={password}
                  onChange={setPassword}
                />
                <Button type="submit" disabled={busy} className="w-full rounded-none">
                  {busy ? "Creating…" : "Create account"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="my-7 flex items-center gap-4 text-[10px] tracking-luxe text-muted-foreground">
            <span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" />
          </div>

          <Button variant="outline" className="w-full rounded-none" onClick={googleSignIn}>
            Continue with Google
          </Button>
        </div>
      </motion.div>
    </main>
  );
}

function Field({
  id,
  label,
  type = "text",
  value,
  onChange,
}: {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-[10px] tracking-luxe text-muted-foreground">
        {label}
      </Label>
      <Input
        id={id}
        type={type}
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-none border-x-0 border-t-0 px-0 focus-visible:ring-0"
      />
    </div>
  );
}