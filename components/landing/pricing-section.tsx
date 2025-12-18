import { Button } from "@/components/ui/button"
import Link from "next/link"

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for getting started",
    icon: "fa-solid fa-gift",
    features: [
      "Browse all professionals",
      "Read reviews",
      "Basic search filters",
      "Email support",
      "Up to 3 bookings/month",
    ],
    cta: "Get Started",
    featured: false,
  },
  {
    name: "Pro",
    price: "$19",
    period: "per month",
    description: "For regular users",
    icon: "fa-solid fa-crown",
    features: [
      "Everything in Free",
      "Unlimited bookings",
      "Priority support",
      "Advanced filters",
      "Save favorite pros",
      "Booking reminders",
      "10% discount on services",
    ],
    cta: "Start Free Trial",
    featured: true,
  },
  {
    name: "Business",
    price: "$49",
    period: "per month",
    description: "For businesses & teams",
    icon: "fa-solid fa-building",
    features: [
      "Everything in Pro",
      "Team management",
      "Bulk bookings",
      "Dedicated account manager",
      "Custom contracts",
      "Invoice management",
      "Priority matching",
      "20% discount on services",
    ],
    cta: "Contact Sales",
    featured: false,
  },
]

export function PricingSection() {
  return (
    <section className="border-b bg-background py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border bg-card px-4 py-2 text-sm mb-4 shadow-sm">
            <i className="fa-solid fa-tag text-primary"></i>
            <span className="font-medium">Pricing</span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-balance md:text-4xl">Simple, Transparent Pricing</h2>
          <p className="mt-4 text-lg text-muted-foreground text-pretty">Choose the plan that works best for you</p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-2xl border p-8 ${
                plan.featured ? "border-primary bg-primary/5 shadow-lg ring-1 ring-primary/20" : "bg-card"
              }`}
            >
              {plan.featured && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="rounded-full bg-primary px-4 py-1 text-xs font-semibold text-primary-foreground flex items-center gap-1">
                    <i className="fa-solid fa-fire"></i>
                    Most Popular
                  </span>
                </div>
              )}

              <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${plan.featured ? 'bg-primary text-primary-foreground' : 'bg-primary/10 text-primary'}`}>
                    <i className={plan.icon}></i>
                  </div>
                  <h3 className="text-2xl font-bold">{plan.name}</h3>
                </div>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">/{plan.period}</span>
                </div>
              </div>

              <ul className="mb-8 space-y-3">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <i className="fa-solid fa-check text-primary mt-0.5"></i>
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button className="w-full rounded-xl" variant={plan.featured ? "default" : "outline"} asChild>
                <Link href="/signup">
                  {plan.featured && <i className="fa-solid fa-rocket mr-2"></i>}
                  {plan.cta}
                </Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
