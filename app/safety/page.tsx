import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Shield, AlertTriangle, Phone, Users, Lock, CheckCircle } from "lucide-react"

export default function SafetyGuidelinesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto max-w-4xl px-6 py-12 md:px-8">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight">Safety Guidelines</h1>
          <p className="mt-4 text-lg text-muted-foreground">Your safety is our top priority</p>
        </div>

        <div className="space-y-6">
          <Card className="p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="mb-4 text-2xl font-semibold">Meeting Safety</h2>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 shrink-0 text-primary" />
                    <span>Always meet in public places for first meetings</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 shrink-0 text-primary" />
                    <span>Inform a trusted friend or family member of your plans</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 shrink-0 text-primary" />
                    <span>Trust your instincts - if something feels wrong, leave immediately</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 shrink-0 text-primary" />
                    <span>Arrange your own transportation to and from meetings</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 shrink-0 text-primary" />
                    <span>Keep your phone charged and accessible at all times</span>
                  </li>
                </ul>
              </div>
            </div>
          </Card>

          <Card className="p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Lock className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="mb-4 text-2xl font-semibold">Privacy Protection</h2>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 shrink-0 text-primary" />
                    <span>Never share sensitive personal information (SSN, bank details, etc.)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 shrink-0 text-primary" />
                    <span>Use platform messaging until you feel comfortable sharing contact info</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 shrink-0 text-primary" />
                    <span>Be cautious about sharing your home address or workplace</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 shrink-0 text-primary" />
                    <span>Review privacy settings regularly to control information visibility</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 shrink-0 text-primary" />
                    <span>Report any requests for inappropriate personal information</span>
                  </li>
                </ul>
              </div>
            </div>
          </Card>

          <Card className="p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-red-500/10">
                <AlertTriangle className="h-6 w-6 text-red-500" />
              </div>
              <div>
                <h2 className="mb-4 text-2xl font-semibold">Red Flags & Warning Signs</h2>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 shrink-0 text-red-500" />
                    <span>Requests for money or financial assistance</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 shrink-0 text-red-500" />
                    <span>Pressure to move communication off the platform immediately</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 shrink-0 text-red-500" />
                    <span>Inconsistent or suspicious profile information</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 shrink-0 text-red-500" />
                    <span>Aggressive or threatening behavior</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 shrink-0 text-red-500" />
                    <span>Refusal to verify identity or meet in public first</span>
                  </li>
                </ul>
              </div>
            </div>
          </Card>

          <Card className="p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Phone className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h2 className="mb-4 text-2xl font-semibold">Emergency Resources</h2>
                <div className="space-y-4 text-muted-foreground">
                  <div>
                    <p className="mb-2 font-medium text-foreground">Platform Safety Team</p>
                    <p>Email: safety@elite.com</p>
                    <p>Phone: +1 (555) 123-4567 (24/7)</p>
                  </div>
                  <div>
                    <p className="mb-2 font-medium text-foreground">Emergency Services</p>
                    <p>Dial 911 for immediate danger</p>
                  </div>
                  <div>
                    <p className="mb-2 font-medium text-foreground">National Hotlines</p>
                    <p>National Domestic Violence Hotline: 1-800-799-7233</p>
                    <p>National Sexual Assault Hotline: 1-800-656-4673</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="bg-primary/5 p-8">
            <h2 className="mb-4 text-2xl font-semibold">Reporting Concerns</h2>
            <p className="mb-4 text-muted-foreground leading-relaxed">
              If you encounter suspicious behavior, harassment, or safety concerns, please report them immediately. Our
              safety team reviews all reports and takes appropriate action within 24 hours.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              You can report issues through the profile report button, in-app messaging, or by contacting our safety
              team directly. All reports are confidential.
            </p>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
