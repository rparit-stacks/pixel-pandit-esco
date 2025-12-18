import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto max-w-4xl px-6 py-12 md:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight">Terms & Conditions</h1>
          <p className="mt-4 text-muted-foreground">Last updated: December 20, 2024</p>
        </div>

        <Card className="p-8">
          <div className="prose prose-sm max-w-none">
            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-semibold">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                By accessing and using Elite Companions ("the Platform"), you agree to be bound by these Terms and
                Conditions. If you do not agree to these terms, please do not use our services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-semibold">2. Eligibility</h2>
              <p className="mb-4 text-muted-foreground leading-relaxed">
                You must meet the following requirements to use our Platform:
              </p>
              <ul className="mb-4 list-disc space-y-2 pl-6 text-muted-foreground">
                <li>Be at least 18 years of age</li>
                <li>Have the legal capacity to enter into binding contracts</li>
                <li>Not be prohibited by law from accessing adult content</li>
                <li>Comply with all local laws and regulations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-semibold">3. User Accounts</h2>
              <h3 className="mb-3 text-lg font-semibold">3.1 Account Registration</h3>
              <p className="mb-4 text-muted-foreground leading-relaxed">
                You must provide accurate and complete information when creating an account. You are responsible for
                maintaining the confidentiality of your account credentials.
              </p>

              <h3 className="mb-3 text-lg font-semibold">3.2 Account Security</h3>
              <p className="text-muted-foreground leading-relaxed">
                You are responsible for all activities that occur under your account. Notify us immediately of any
                unauthorized access or security breaches.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-semibold">4. Platform Usage</h2>
              <h3 className="mb-3 text-lg font-semibold">4.1 Permitted Use</h3>
              <p className="mb-4 text-muted-foreground leading-relaxed">
                The Platform is intended for facilitating connections between clients and companion service providers
                for legal entertainment purposes only.
              </p>

              <h3 className="mb-3 text-lg font-semibold">4.2 Prohibited Activities</h3>
              <p className="mb-2 text-muted-foreground leading-relaxed">Users must not:</p>
              <ul className="mb-4 list-disc space-y-2 pl-6 text-muted-foreground">
                <li>Engage in illegal activities or solicit illegal services</li>
                <li>Harass, abuse, or threaten other users</li>
                <li>Post false, misleading, or fraudulent information</li>
                <li>Use the Platform for commercial purposes without authorization</li>
                <li>Attempt to access unauthorized areas or data</li>
                <li>Share accounts or transfer access to others</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-semibold">5. Content Guidelines</h2>
              <h3 className="mb-3 text-lg font-semibold">5.1 User Content</h3>
              <p className="mb-4 text-muted-foreground leading-relaxed">
                You retain ownership of content you post but grant us a license to use, display, and distribute it on
                the Platform. Content must comply with our community guidelines and applicable laws.
              </p>

              <h3 className="mb-3 text-lg font-semibold">5.2 Prohibited Content</h3>
              <ul className="mb-4 list-disc space-y-2 pl-6 text-muted-foreground">
                <li>Content involving minors or depicting illegal activities</li>
                <li>Explicit sexual content (nudity allowed in tasteful context)</li>
                <li>Hate speech, discrimination, or violence</li>
                <li>Copyrighted material without permission</li>
                <li>Spam, malware, or malicious code</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-semibold">6. Payments and Fees</h2>
              <p className="mb-4 text-muted-foreground leading-relaxed">
                Subscription fees are charged in advance and are non-refundable except as required by law. We reserve
                the right to change pricing with 30 days notice.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-semibold">7. Verification and Safety</h2>
              <p className="text-muted-foreground leading-relaxed">
                We implement verification processes to enhance safety but cannot guarantee the accuracy of user
                information. Users are responsible for their own safety and should exercise caution when meeting others.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-semibold">8. Disclaimer of Warranties</h2>
              <p className="text-muted-foreground leading-relaxed">
                The Platform is provided "as is" without warranties of any kind. We do not guarantee uninterrupted
                access, accuracy of content, or fitness for any particular purpose.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-semibold">9. Limitation of Liability</h2>
              <p className="text-muted-foreground leading-relaxed">
                We are not liable for indirect, incidental, or consequential damages arising from your use of the
                Platform. Our total liability shall not exceed the amount paid by you in the past 12 months.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-2xl font-semibold">10. Termination</h2>
              <p className="text-muted-foreground leading-relaxed">
                We reserve the right to suspend or terminate accounts that violate these terms or engage in harmful
                behavior. You may terminate your account at any time through account settings.
              </p>
            </section>

            <section>
              <h2 className="mb-4 text-2xl font-semibold">11. Contact Information</h2>
              <p className="text-muted-foreground leading-relaxed">
                For questions about these Terms, contact us at:
                <br />
                Email: legal@elite.com
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
