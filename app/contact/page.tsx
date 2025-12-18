import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Phone, MessageSquare, Clock } from "lucide-react"

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto max-w-6xl px-6 py-12 md:px-8">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight">Contact & Support</h1>
          <p className="mt-4 text-lg text-muted-foreground">We're here to help 24/7</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Contact Information */}
          <div className="space-y-6">
            <Card className="p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 font-semibold">Email Support</h3>
              <p className="mb-4 text-sm text-muted-foreground">Send us an email anytime</p>
              <p className="text-sm font-medium">support@elite.com</p>
            </Card>

            <Card className="p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Phone className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 font-semibold">Phone Support</h3>
              <p className="mb-4 text-sm text-muted-foreground">24/7 support hotline</p>
              <p className="text-sm font-medium">+1 (555) 123-4567</p>
            </Card>

            <Card className="p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 font-semibold">Live Chat</h3>
              <p className="mb-4 text-sm text-muted-foreground">Chat with our team</p>
              <Button className="w-full">Start Chat</Button>
            </Card>

            <Card className="p-6">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 font-semibold">Response Times</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>Email: Within 24 hours</p>
                <p>Phone: Immediate</p>
                <p>Chat: Within 5 minutes</p>
              </div>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="p-8">
              <h2 className="mb-6 text-2xl font-semibold">Send us a Message</h2>

              <form className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" placeholder="Your name" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" placeholder="you@example.com" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number (Optional)</Label>
                  <Input id="phone" type="tel" placeholder="+1 (555) 123-4567" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" placeholder="How can we help?" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">Select a category</option>
                    <option value="technical">Technical Support</option>
                    <option value="account">Account Issues</option>
                    <option value="billing">Billing & Payments</option>
                    <option value="safety">Safety Concerns</option>
                    <option value="feedback">Feedback & Suggestions</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" rows={8} placeholder="Describe your issue or question in detail..." required />
                </div>

                <div className="flex items-start gap-3">
                  <input type="checkbox" id="consent" className="mt-1 h-4 w-4 rounded border-input" required />
                  <Label htmlFor="consent" className="text-sm font-normal leading-relaxed">
                    I agree to be contacted regarding my inquiry and understand my information will be handled according
                    to the Privacy Policy
                  </Label>
                </div>

                <Button type="submit" size="lg" className="w-full">
                  Send Message
                </Button>
              </form>
            </Card>

            {/* FAQ Quick Links */}
            <Card className="mt-6 p-6">
              <h3 className="mb-4 font-semibold">Frequently Asked Questions</h3>
              <div className="space-y-3">
                <a href="#" className="block text-sm text-primary hover:underline">
                  How do I verify my account?
                </a>
                <a href="#" className="block text-sm text-primary hover:underline">
                  How do I update my subscription?
                </a>
                <a href="#" className="block text-sm text-primary hover:underline">
                  What payment methods do you accept?
                </a>
                <a href="#" className="block text-sm text-primary hover:underline">
                  How do I report a safety concern?
                </a>
                <a href="#" className="block text-sm text-primary hover:underline">
                  Can I delete my account?
                </a>
              </div>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
