import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t bg-card">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <i className="fa-solid fa-heart text-xl text-primary-foreground"></i>
              </div>
              <span className="text-xl font-semibold">Elite Companions</span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
              Premium companion services connecting discerning clients with verified professionals. Discreet, safe, and
              sophisticated.
            </p>
            <div className="mt-6 flex gap-4">
              <Link
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                <i className="fa-brands fa-instagram text-lg"></i>
              </Link>
              <Link
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                <i className="fa-brands fa-twitter text-lg"></i>
              </Link>
              <Link
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                <i className="fa-brands fa-facebook text-lg"></i>
              </Link>
              <Link
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                <i className="fa-brands fa-tiktok text-lg"></i>
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <i className="fa-solid fa-link text-primary"></i>
              Quick Links
            </h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link href="/listings" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                  <i className="fa-solid fa-grid-2"></i>
                  Browse Escorts
                </Link>
              </li>
              <li>
                <Link href="/cities" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                  <i className="fa-solid fa-location-dot"></i>
                  Cities
                </Link>
              </li>
              <li>
                <Link
                  href="/escort/signup"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                >
                  <i className="fa-solid fa-star"></i>
                  Become an Escort
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                  <i className="fa-solid fa-tag"></i>
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <i className="fa-solid fa-headset text-primary"></i>
              Support
            </h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link href="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                  <i className="fa-solid fa-envelope"></i>
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/safety" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                  <i className="fa-solid fa-shield"></i>
                  Safety Guidelines
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                  <i className="fa-solid fa-circle-question"></i>
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/reports" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                  <i className="fa-solid fa-flag"></i>
                  Report Issues
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <i className="fa-solid fa-scale-balanced text-primary"></i>
              Legal
            </h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                  <i className="fa-solid fa-lock"></i>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                  <i className="fa-solid fa-file-contract"></i>
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/age-verification"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                >
                  <i className="fa-solid fa-id-card"></i>
                  Age Verification
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                  <i className="fa-solid fa-cookie"></i>
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Contact Info */}
        <div className="mt-8 border-t pt-8">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                <i className="fa-solid fa-envelope text-lg text-primary"></i>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="text-sm font-medium">support@elite.com</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                <i className="fa-solid fa-phone text-lg text-primary"></i>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">24/7 Support</p>
                <p className="text-sm font-medium">+1 (555) 123-4567</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                <i className="fa-solid fa-globe text-lg text-primary"></i>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Headquarters</p>
                <p className="text-sm font-medium">Global Service</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 border-t pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            <i className="fa-regular fa-copyright mr-1"></i>
            {new Date().getFullYear()} Elite Companions. All rights reserved.
            <span className="mx-2">•</span>
            <i className="fa-solid fa-circle-exclamation mr-1"></i>
            18+ Only
            <span className="mx-2">•</span>
            <i className="fa-solid fa-masks-theater mr-1"></i>
            For Entertainment Purposes
          </p>
        </div>
      </div>
    </footer>
  )
}
