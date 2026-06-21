import { createFileRoute } from "@tanstack/react-router";
import {
  Search,
  MapPin,
  PlusCircle,
  ShieldCheck,
  BadgeCheck,
  Sparkles,
  ArrowUpRight,
  Heart,
  Flame,
  TrendingUp,
  Clock,
  ChevronRight,
  Car,
  Smartphone,
  Home,
  Shirt,
  Laptop,
  Sofa,
  Briefcase,
  Wrench,
} from "lucide-react";
import heroNairobi from "@/assets/hero-nairobi.jpg";
import catVehicles from "@/assets/cat-vehicles.jpg";
import catPhones from "@/assets/cat-phones.jpg";
import catProperty from "@/assets/cat-property.jpg";
import catFashion from "@/assets/cat-fashion.jpg";
import catElectronics from "@/assets/cat-electronics.jpg";
import catFurniture from "@/assets/cat-furniture.jpg";
import catServices from "@/assets/cat-services.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AdHub Kenya — Buy, Sell & Discover Across Kenya" },
      {
        name: "description",
        content:
          "Kenya's trusted marketplace for cars, phones, property, fashion and services. 12,000+ verified listings, free posting, real sellers near you.",
      },
      { property: "og:title", content: "AdHub Kenya — Kenya's Trusted Marketplace" },
      {
        property: "og:description",
        content:
          "Buy, sell and discover deals near you. Verified sellers, free posting, and the freshest listings across all 47 counties.",
      },
    ],
  }),
  component: Index,
});

const categories = [
  { name: "Vehicles", count: "3,420", icon: Car, img: catVehicles, tint: "from-emerald-900/70" },
  { name: "Phones & Tablets", count: "2,180", icon: Smartphone, img: catPhones, tint: "from-amber-900/60" },
  { name: "Property", count: "1,940", icon: Home, img: catProperty, tint: "from-stone-900/60" },
  { name: "Fashion", count: "1,560", icon: Shirt, img: catFashion, tint: "from-orange-900/60" },
  { name: "Electronics", count: "1,330", icon: Laptop, img: catElectronics, tint: "from-emerald-900/60" },
  { name: "Furniture", count: "870", icon: Sofa, img: catFurniture, tint: "from-amber-900/60" },
  { name: "Jobs", count: "640", icon: Briefcase, img: catServices, tint: "from-stone-900/60" },
  { name: "Services", count: "1,210", icon: Wrench, img: catServices, tint: "from-emerald-900/60" },
];

const trending = [
  {
    title: "Toyota Fielder 2015",
    price: "KSh 1,250,000",
    location: "Nairobi · Westlands",
    img: catVehicles,
    badge: "Verified",
    posted: "2h ago",
  },
  {
    title: "iPhone 15 Pro Max — 256GB",
    price: "KSh 165,000",
    location: "Mombasa · Nyali",
    img: catPhones,
    badge: "Hot",
    posted: "37m ago",
  },
  {
    title: "3BR Apartment, Kilimani",
    price: "KSh 95,000 / mo",
    location: "Nairobi · Kilimani",
    img: catProperty,
    badge: "Verified",
    posted: "5h ago",
  },
  {
    title: "MacBook Pro M3 14\"",
    price: "KSh 245,000",
    location: "Nairobi · CBD",
    img: catElectronics,
    badge: "New",
    posted: "1d ago",
  },
];

const counties = ["All Kenya", "Nairobi", "Mombasa", "Kisumu", "Nakuru", "Eldoret", "Thika"];
const popularSearches = ["Toyota Fielder", "Bedsitter Nairobi", "iPhone 15", "Mitsubishi FH", "PlayStation 5"];

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Announcement strip */}
      <div className="gradient-emerald text-primary-foreground">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 py-2 text-xs sm:text-sm">
          <Sparkles className="h-3.5 w-3.5 text-gold" />
          <span className="opacity-90">Free posting all June — list your ad in under 60 seconds.</span>
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto grid max-w-7xl grid-cols-[auto_1fr_auto] items-center gap-4 px-4 py-4 sm:px-6">
          <a href="/" className="flex shrink-0 items-center gap-2">
            <div className="grid h-10 w-10 place-items-center rounded-xl gradient-emerald text-primary-foreground shadow-elevated">
              <span className="font-display text-lg font-bold">A</span>
            </div>
            <div className="leading-none">
              <div className="font-display text-lg font-bold tracking-tight">
                Ad<span className="text-primary">Hub</span>
              </div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Kenya
              </div>
            </div>
          </a>

          <div className="hidden min-w-0 md:flex">
            <div className="flex w-full items-center gap-2 rounded-full border border-border bg-card px-4 py-2.5 shadow-sm transition focus-within:border-primary/50 focus-within:shadow-elevated">
              <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
              <input
                placeholder="Search Toyota, iPhone, apartment…"
                className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
              <kbd className="hidden rounded-md border border-border bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground lg:inline">
                ⌘ K
              </kbd>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <button className="hidden items-center gap-2 rounded-full gradient-emerald px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-elevated transition hover:opacity-95 sm:inline-flex">
              <PlusCircle className="h-4 w-4" />
              Post Ad — Free
            </button>
            <button className="hidden rounded-full border border-border px-4 py-2 text-sm font-medium hover:bg-muted sm:inline-block">
              Login
            </button>
            <button className="rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90">
              Register
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <img
            src={heroNairobi}
            alt="Nairobi marketplace at golden hour"
            width={1920}
            height={1080}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-background/70 to-background" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/30 to-background/80" />
        </div>

        <div className="mx-auto max-w-7xl px-4 pb-16 pt-14 sm:px-6 sm:pt-20 lg:pb-24 lg:pt-28">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-3 py-1 text-xs font-medium backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Live from 47 counties · 236 ads today
            </span>
            <h1 className="mt-5 font-display text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
              Kenya's trusted{" "}
              <span className="text-gold-grad">marketplace</span>
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground sm:text-lg">
              Buy, sell and discover real deals near you — from Westlands to Mombasa.
              Verified sellers. Zero listing fees.
            </p>
          </div>

          {/* Search card */}
          <div className="mx-auto mt-10 max-w-4xl rounded-3xl border border-border bg-card p-3 shadow-elevated sm:p-4">
            <div className="flex items-center gap-3 rounded-2xl bg-background px-4 py-3 ring-1 ring-border focus-within:ring-2 focus-within:ring-primary/40">
              <Search className="h-5 w-5 text-muted-foreground" />
              <input
                placeholder="What are you looking for today?"
                className="min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground"
              />
            </div>

            <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-[1fr_1fr_auto]">
              <label className="group flex items-center gap-2 rounded-xl bg-background px-3 py-2.5 ring-1 ring-border hover:ring-primary/40">
                <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  Category
                </span>
                <select className="min-w-0 flex-1 bg-transparent text-sm font-medium outline-none">
                  <option>All categories</option>
                  {categories.map((c) => (
                    <option key={c.name}>{c.name}</option>
                  ))}
                </select>
              </label>

              <label className="group flex items-center gap-2 rounded-xl bg-background px-3 py-2.5 ring-1 ring-border hover:ring-primary/40">
                <MapPin className="h-4 w-4 shrink-0 text-primary" />
                <select className="min-w-0 flex-1 bg-transparent text-sm font-medium outline-none">
                  {counties.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </label>

              <button className="inline-flex items-center justify-center gap-2 rounded-xl gradient-emerald px-6 py-3 text-sm font-semibold text-primary-foreground shadow-elevated transition hover:opacity-95">
                <Search className="h-4 w-4" />
                Search
              </button>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2 px-1">
              <span className="text-xs font-semibold uppercase tracking-widest text-gold">
                Popular
              </span>
              {popularSearches.map((s) => (
                <button
                  key={s}
                  className="rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-foreground/80 hover:border-primary/40 hover:text-primary"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Trust strip */}
          <div className="mx-auto mt-8 grid max-w-3xl grid-cols-3 gap-4 text-center">
            {[
              { icon: BadgeCheck, label: "12,000+ Live Ads" },
              { icon: ShieldCheck, label: "Verified Sellers" },
              { icon: Sparkles, label: "Always Free Posting" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center justify-center gap-2 text-xs sm:text-sm">
                <Icon className="h-4 w-4 text-primary" />
                <span className="font-medium text-muted-foreground">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live counters band */}
      <section className="gradient-emerald text-primary-foreground">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-6 sm:grid-cols-3 sm:px-6">
          {[
            { icon: Flame, n: "236", l: "New ads today" },
            { icon: TrendingUp, n: "42", l: "Posted this hour" },
            { icon: Clock, n: "1,200", l: "Added this week" },
          ].map(({ icon: Icon, n, l }) => (
            <div key={l} className="flex items-center justify-center gap-3 sm:justify-start">
              <div className="grid h-10 w-10 place-items-center rounded-full bg-primary-foreground/10 ring-1 ring-primary-foreground/20">
                <Icon className="h-5 w-5 text-gold" />
              </div>
              <div>
                <div className="font-display text-2xl font-bold leading-none">{n}</div>
                <div className="text-xs opacity-80">{l}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Categories */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
              Browse
            </span>
            <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">
              Featured categories
            </h2>
          </div>
          <a href="#" className="hidden items-center gap-1 text-sm font-semibold text-primary hover:underline sm:inline-flex">
            All categories <ChevronRight className="h-4 w-4" />
          </a>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {categories.map((c) => (
            <a
              key={c.name}
              href="#"
              className="group relative aspect-[5/4] overflow-hidden rounded-2xl border border-border bg-card transition hover:-translate-y-0.5 hover:shadow-elevated"
            >
              <img
                src={c.img}
                alt={c.name}
                loading="lazy"
                width={800}
                height={800}
                className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
              <div className={`absolute inset-0 bg-gradient-to-t ${c.tint} via-transparent to-transparent`} />
              <div className="absolute inset-0 flex flex-col justify-between p-4">
                <div className="flex items-center justify-between">
                  <div className="grid h-9 w-9 place-items-center rounded-full bg-background/90 backdrop-blur">
                    <c.icon className="h-4 w-4 text-primary" />
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-background opacity-0 transition group-hover:opacity-100" />
                </div>
                <div className="text-background">
                  <div className="font-display text-lg font-bold leading-tight">{c.name}</div>
                  <div className="text-xs opacity-90">{c.count} ads</div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Trending listings */}
      <section className="bg-secondary/50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
                Trending now
              </span>
              <h2 className="mt-2 font-display text-3xl font-bold sm:text-4xl">
                Fresh deals near you
              </h2>
            </div>
            <a href="#" className="hidden items-center gap-1 text-sm font-semibold text-primary hover:underline sm:inline-flex">
              See all listings <ChevronRight className="h-4 w-4" />
            </a>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {trending.map((t) => (
              <article
                key={t.title}
                className="group overflow-hidden rounded-2xl border border-border bg-card transition hover:-translate-y-0.5 hover:shadow-elevated"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img
                    src={t.img}
                    alt={t.title}
                    loading="lazy"
                    width={800}
                    height={600}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-background/95 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-primary backdrop-blur">
                    <BadgeCheck className="h-3 w-3" />
                    {t.badge}
                  </span>
                  <button className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-background/95 text-foreground/70 backdrop-blur hover:text-destructive">
                    <Heart className="h-4 w-4" />
                  </button>
                </div>
                <div className="p-4">
                  <h3 className="line-clamp-1 font-display text-base font-semibold">
                    {t.title}
                  </h3>
                  <div className="mt-1 font-display text-lg font-bold text-primary">
                    {t.price}
                  </div>
                  <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {t.location}
                    </span>
                    <span>{t.posted}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Sell CTA */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
        <div className="relative overflow-hidden rounded-3xl gradient-emerald p-8 text-primary-foreground sm:p-14">
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-gold/30 blur-3xl" />
          <div className="relative grid items-center gap-8 lg:grid-cols-[1.5fr_1fr]">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">
                Sell smarter
              </span>
              <h2 className="mt-3 font-display text-3xl font-bold leading-tight sm:text-5xl">
                Got something to sell?
                <br />
                <span className="text-gold-grad">Reach 12,000+ buyers today.</span>
              </h2>
              <p className="mt-4 max-w-lg text-sm opacity-90 sm:text-base">
                Snap a photo, set your price, get offers in minutes. No fees,
                no middlemen — just real Kenyans buying and selling.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <button className="inline-flex items-center gap-2 rounded-full bg-background px-5 py-3 text-sm font-semibold text-primary shadow-elevated hover:bg-cream">
                  <PlusCircle className="h-4 w-4" />
                  Post your free ad
                </button>
                <button className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/30 px-5 py-3 text-sm font-semibold hover:bg-primary-foreground/10">
                  How it works
                </button>
              </div>
            </div>
            <ul className="grid gap-3 text-sm">
              {[
                "List in under 60 seconds",
                "Reach buyers across 47 counties",
                "Verified seller badges build trust",
                "Chat directly — no commissions",
              ].map((p) => (
                <li
                  key={p}
                  className="flex items-center gap-3 rounded-xl bg-primary-foreground/10 px-4 py-3 ring-1 ring-primary-foreground/15"
                >
                  <BadgeCheck className="h-4 w-4 shrink-0 text-gold" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="grid h-9 w-9 place-items-center rounded-xl gradient-emerald text-primary-foreground">
                  <span className="font-display font-bold">A</span>
                </div>
                <div className="font-display text-lg font-bold">
                  Ad<span className="text-primary">Hub</span>{" "}
                  <span className="text-xs font-semibold tracking-widest text-muted-foreground">
                    KENYA
                  </span>
                </div>
              </div>
              <p className="mt-4 max-w-xs text-sm text-muted-foreground">
                Kenya's home for buying and selling — built for real sellers and
                serious buyers, from Nairobi to Kisumu.
              </p>
            </div>

            {[
              {
                title: "Marketplace",
                links: ["All categories", "Featured ads", "Verified sellers", "Post an ad"],
              },
              {
                title: "Support",
                links: ["Help centre", "Safety tips", "Contact us", "Report a listing"],
              },
              {
                title: "Company",
                links: ["About AdHub", "Careers", "Terms of service", "Privacy"],
              },
            ].map((col) => (
              <div key={col.title}>
                <div className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">
                  {col.title}
                </div>
                <ul className="mt-4 space-y-2 text-sm">
                  {col.links.map((l) => (
                    <li key={l}>
                      <a href="#" className="text-muted-foreground hover:text-primary">
                        {l}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row">
            <div>© {new Date().getFullYear()} AdHub Kenya. Made in Nairobi.</div>
            <div className="flex items-center gap-4">
              <a href="#" className="hover:text-primary">Terms</a>
              <a href="#" className="hover:text-primary">Privacy</a>
              <a href="#" className="hover:text-primary">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
