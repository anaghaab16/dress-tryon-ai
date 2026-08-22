import { Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "motion/react";
import { Menu, Search, ShoppingBag, Sparkles, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const NAV = [
  { label: "Home", to: "/" },
  { label: "Shop", to: "/shop" },
  { label: "Try-On Studio", to: "/studio" },
  { label: "My Looks", to: "/looks" },
];

export function SiteHeader() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/70 bg-background/85 backdrop-blur">
      <div className="hidden items-center justify-center bg-primary py-2 text-center text-[11px] tracking-luxe text-primary-foreground md:flex">
        Free AI try-ons this week · See it on you before you buy
      </div>
      <div className="mx-auto flex h-20 w-full max-w-7xl items-center gap-6 px-5">
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" aria-label="Open menu">
              <Menu className="size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-8">
            <nav className="mt-8 flex flex-col gap-6 text-sm tracking-luxe">
              {NAV.map((item) => (
                <Link key={item.to} to={item.to} className="hover:text-accent">
                  {item.label}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>

        <Link to="/" className="font-display text-2xl font-semibold tracking-tight">
          <span className="type-slot">
            <motion.span
              className="inline-block"
              initial={{ y: "110%" }}
              animate={{ y: "0%" }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              Maison<span className="text-accent">Mirror</span>
            </motion.span>
          </span>
        </Link>

        <nav className="ml-10 hidden items-center gap-9 text-[11px] tracking-luxe md:flex">
          {NAV.map((item, i) => (
            <motion.div
              key={item.to}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link
                to={item.to}
                className="story-link text-muted-foreground transition-colors hover:text-foreground"
                activeProps={{ className: "text-foreground" }}
              >
                {item.label}
              </Link>
            </motion.div>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1">
          <Button variant="ghost" size="icon" aria-label="Search">
            <Search className="size-[18px]" />
          </Button>
          <Button variant="ghost" size="icon" aria-label="Bag" className="hidden sm:inline-flex">
            <ShoppingBag className="size-[18px]" />
          </Button>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Account">
                  <User className="size-[18px]" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5 text-xs text-muted-foreground">{user.email}</div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => navigate({ to: "/studio" })}>
                  Try-On Studio
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => navigate({ to: "/looks" })}>
                  My Looks
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => navigate({ to: "/orders" })}>
                  Orders
                </DropdownMenuItem>

                <DropdownMenuItem onSelect={() => navigate({ to: "/profile" })}>
                  Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={signOut}>Sign out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild size="sm" className="ml-2 rounded-none px-5 text-[11px] tracking-luxe">
              <Link to="/auth">
                <Sparkles className="mr-2 size-3.5" /> Sign in
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}