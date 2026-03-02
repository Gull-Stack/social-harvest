import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  MessageSquare,
  GraduationCap,
  Calendar,
  CreditCard,
  Users,
  Zap,
  Shield,
  BarChart3,
} from "lucide-react";

const features = [
  {
    icon: MessageSquare,
    title: "Rich Discussions",
    description:
      "Threaded conversations with rich media, @mentions, and real-time updates.",
  },
  {
    icon: GraduationCap,
    title: "Courses & Learning",
    description:
      "Build structured courses with video, text, and progress tracking.",
  },
  {
    icon: Calendar,
    title: "Events & Meetups",
    description:
      "Host virtual and in-person events with RSVP, reminders, and live rooms.",
  },
  {
    icon: CreditCard,
    title: "Memberships & Payments",
    description:
      "Monetize with paid spaces, subscription tiers, and Stripe-powered checkout.",
  },
  {
    icon: Users,
    title: "Member Directory",
    description:
      "Searchable profiles with custom fields, roles, and reputation.",
  },
  {
    icon: Zap,
    title: "Real-Time Everything",
    description:
      "Instant updates across posts, comments, chat, and notifications.",
  },
];

const tiers = [
  {
    name: "Starter",
    price: "$0",
    period: "/month",
    description: "For small communities getting started",
    features: ["Up to 100 members", "3 Spaces", "Basic analytics", "Community support"],
    cta: "Get Started Free",
    highlight: false,
  },
  {
    name: "Growth",
    price: "$49",
    period: "/month",
    description: "For growing communities that need more",
    features: [
      "Unlimited members",
      "Unlimited Spaces",
      "Courses & Events",
      "Custom branding",
      "Priority support",
    ],
    cta: "Start Free Trial",
    highlight: true,
  },
  {
    name: "Scale",
    price: "$149",
    period: "/month",
    description: "For organizations and enterprises",
    features: [
      "Everything in Growth",
      "Custom domain",
      "API access",
      "Advanced analytics",
      "White-label",
      "Dedicated support",
    ],
    cta: "Contact Sales",
    highlight: false,
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white font-bold text-sm">
              SH
            </div>
            <span className="text-lg font-semibold tracking-tight">
              Social Harvest
            </span>
          </Link>
          <nav className="hidden items-center gap-8 md:flex">
            <Link
              href="#features"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Features
            </Link>
            <Link
              href="#pricing"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Pricing
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Log in
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm">
                Get Started <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="relative mx-auto max-w-6xl px-6 pb-20 pt-24 text-center md:pt-32">
          <div className="mb-6 inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
            <Zap className="mr-2 h-3.5 w-3.5" />
            The modern community platform
          </div>
          <h1 className="mx-auto max-w-3xl text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
            Bring your community{" "}
            <span className="bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent">
              together
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed">
            Discussions, courses, events, and memberships — all in one beautiful
            place. Build the community your audience deserves.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link href="/signup">
              <Button size="lg" className="px-8 text-base">
                Start Your Community <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="#features">
              <Button variant="outline" size="lg" className="px-8 text-base">
                See How It Works
              </Button>
            </Link>
          </div>
          {/* Mock UI Preview */}
          <div className="mx-auto mt-16 max-w-4xl">
            <div className="rounded-xl border border-gray-200 bg-gray-50 shadow-2xl shadow-primary/10 overflow-hidden">
              <div className="flex h-8 items-center gap-2 border-b border-gray-200 bg-white px-4">
                <div className="h-3 w-3 rounded-full bg-red-400" />
                <div className="h-3 w-3 rounded-full bg-yellow-400" />
                <div className="h-3 w-3 rounded-full bg-green-400" />
              </div>
              <div className="flex h-80 md:h-96">
                {/* Sidebar mock */}
                <div className="hidden w-56 border-r border-gray-200 bg-gray-900 p-4 md:block">
                  <div className="mb-6 flex items-center gap-2">
                    <div className="h-6 w-6 rounded bg-primary" />
                    <div className="h-3 w-24 rounded bg-gray-700" />
                  </div>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className={`mb-2 flex items-center gap-2 rounded-md px-3 py-2 ${
                        i === 1 ? "bg-gray-800" : ""
                      }`}
                    >
                      <div
                        className={`h-4 w-4 rounded ${
                          i === 1 ? "bg-primary" : "bg-gray-700"
                        }`}
                      />
                      <div
                        className={`h-2.5 rounded ${
                          i === 1 ? "w-20 bg-gray-400" : "w-16 bg-gray-700"
                        }`}
                      />
                    </div>
                  ))}
                </div>
                {/* Content mock */}
                <div className="flex-1 bg-white p-6">
                  <div className="mb-4 h-4 w-32 rounded bg-gray-200" />
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="mb-4 rounded-lg border border-gray-100 p-4"
                    >
                      <div className="mb-2 flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-gray-200" />
                        <div>
                          <div className="h-2.5 w-24 rounded bg-gray-200" />
                          <div className="mt-1 h-2 w-16 rounded bg-gray-100" />
                        </div>
                      </div>
                      <div className="mt-2 h-2.5 w-full rounded bg-gray-100" />
                      <div className="mt-1.5 h-2.5 w-3/4 rounded bg-gray-100" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-t border-gray-100 bg-gray-50/50 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Everything you need to grow your community
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Stop stitching together a dozen tools. Social Harvest gives you one
              powerful platform.
            </p>
          </div>
          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-primary/20"
              >
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                  <feature.icon className="h-5 w-5" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="border-t border-gray-100 py-16">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <div className="flex flex-wrap items-center justify-center gap-12 opacity-40">
            {["Shield", "BarChart3", "Users", "Zap"].map((name, i) => {
              const Icon = [Shield, BarChart3, Users, Zap][i];
              return (
                <div key={name} className="flex items-center gap-2">
                  <Icon className="h-6 w-6" />
                  <span className="text-lg font-semibold">Brand {i + 1}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section
        id="pricing"
        className="border-t border-gray-100 bg-gray-50/50 py-24"
      >
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Simple, transparent pricing
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
              Start free, scale when you&apos;re ready. No hidden fees, no surprises.
            </p>
          </div>
          <div className="mt-16 grid gap-8 lg:grid-cols-3">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className={`relative rounded-xl border p-8 ${
                  tier.highlight
                    ? "border-primary bg-white shadow-lg shadow-primary/10 ring-1 ring-primary"
                    : "border-gray-200 bg-white"
                }`}
              >
                {tier.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-medium text-white">
                    Most Popular
                  </div>
                )}
                <h3 className="text-lg font-semibold">{tier.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {tier.description}
                </p>
                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl font-bold">{tier.price}</span>
                  <span className="text-muted-foreground">{tier.period}</span>
                </div>
                <ul className="mt-8 space-y-3">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button
                  className="mt-8 w-full"
                  variant={tier.highlight ? "default" : "outline"}
                >
                  {tier.cta}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-gray-100 py-24">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to build your community?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Join thousands of creators and brands building thriving communities
            with Social Harvest.
          </p>
          <Link href="/signup">
            <Button size="lg" className="mt-8 px-8 text-base">
              Get Started Free <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-gray-50 py-12">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded bg-primary text-white text-xs font-bold">
                SH
              </div>
              <span className="text-sm font-medium">Social Harvest</span>
            </div>
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Social Harvest. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
