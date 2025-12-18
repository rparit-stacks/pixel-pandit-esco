import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto max-w-4xl px-6 py-12 md:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight">Privacy Policy</h1>
          <p className="mt-4 text-muted-foreground">Last updated: December 20, 2024</p>
        </div>

        <Card className="p-8">
          <div className="prose prose-sm max-w-none">
            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-semibold">1. Introduction</h2>
              <p className="text-muted-foreground leading-relaxed">
                Elite Companions ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy
                explains how we collect, use, disclose, and safeguard your information when you use our platform.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-semibold">2. Information We Collect</h2>
              <h3 className="mb-3 text-lg font-semibold">2.1 Personal Information</h3>
              <p className="mb-4 text-muted-foreground leading-relaxed">
                We collect personal information that you provide directly to us, including:
              </p>
              <ul className="mb-4 list-disc space-y-2 pl-6 text-muted-foreground">
                <li>Name, email address, and phone number</li>
                <li>Profile information and photos</li>
                <li>Payment and billing information</li>
                <li>Government-issued ID for verification purposes</li>
                <li>Communication preferences</li>
              </ul>

              <h3 className="mb-3 text-lg font-semibold">2.2 Automatically Collected Information</h3>
              <ul className="mb-4 list-disc space-y-2 pl-6 text-muted-foreground">
                <li>Device information and IP address</li>
                <li>Browser type and operating system</li>
                <li>Usage data and analytics</li>
                <li>Cookies and tracking technologies</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-semibold">3. How We Use Your Information</h2>
              <ul className="mb-4 list-disc space-y-2 pl-6 text-muted-foreground">
                <li>To provide and maintain our services</li>
                <li>To process transactions and send confirmations</li>
                <li>To verify identity and prevent fraud</li>
                <li>To communicate with you about services and updates</li>
                <li>To improve our platform and user experience</li>
                <li>To comply with legal obligations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-semibold">4. Information Sharing and Disclosure</h2>
              <p className="mb-4 text-muted-foreground leading-relaxed">
                We do not sell your personal information. We may share your information with:
              </p>
              <ul className="mb-4 list-disc space-y-2 pl-6 text-muted-foreground">
                <li>Service providers who assist in operating our platform</li>
                <li>Payment processors for transaction handling</li>
                <li>Law enforcement when required by law</li>
                <li>Other users as necessary to facilitate services (limited profile information)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-semibold">5. Data Security</h2>
              <p className="text-muted-foreground leading-relaxed">
                We implement appropriate technical and organizational measures to protect your personal information
                against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission
                over the internet is 100% secure.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-semibold">6. Your Rights</h2>
              <ul className="mb-4 list-disc space-y-2 pl-6 text-muted-foreground">
                <li>Access and review your personal information</li>
                <li>Request corrections to your information</li>
                <li>Delete your account and associated data</li>
                <li>Opt-out of marketing communications</li>
                <li>Export your data in a portable format</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-semibold">7. Cookies and Tracking</h2>
              <p className="text-muted-foreground leading-relaxed">
                We use cookies and similar tracking technologies to enhance your experience, analyze usage patterns, and
                deliver personalized content. You can control cookie preferences through your browser settings.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-semibold">8. Changes to This Policy</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the
                new policy on this page and updating the "Last updated" date.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-semibold">9. Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have questions about this Privacy Policy, please contact us at:
                <br />
                Email: privacy@elite.com
                <br />
                Phone: +1 (555) 123-4567
              </p>
            </section>
          </div>
        </Card>
      </main>

      <Footer />
    </div>
  )
}
