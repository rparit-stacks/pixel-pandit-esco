"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const faqs = [
  {
    question: "How do you verify professionals?",
    answer:
      "We conduct comprehensive background checks including identity verification, license validation, reference checks, and review of past work history. Every professional must meet our strict standards before joining the platform.",
    icon: "fa-solid fa-user-check",
  },
  {
    question: "What if I'm not satisfied with the service?",
    answer:
      "We offer a satisfaction guarantee. If you're not happy with the service, contact our support team within 48 hours and we'll work to resolve the issue or provide a refund according to our policy.",
    icon: "fa-solid fa-face-smile",
  },
  {
    question: "How does pricing work?",
    answer:
      "Service providers set their own rates, which are displayed on their profiles. You'll see the cost upfront before booking. There are no hidden fees, and payment is only processed after you confirm the service.",
    icon: "fa-solid fa-dollar-sign",
  },
  {
    question: "Can I cancel or reschedule a booking?",
    answer:
      "Yes, you can cancel or reschedule bookings according to the professional's cancellation policy, which is displayed on their profile. Most providers offer free cancellation up to 24 hours before the scheduled service.",
    icon: "fa-solid fa-calendar-xmark",
  },
  {
    question: "How do I become a service provider?",
    answer:
      "Click 'Sign Up' and select 'Join as a Pro'. Complete the application, provide necessary documentation, and pass our verification process. Once approved, you can create your profile and start accepting bookings.",
    icon: "fa-solid fa-user-plus",
  },
  {
    question: "Is my payment information secure?",
    answer:
      "Absolutely. We use bank-level encryption and partner with trusted payment processors. Your financial information is never stored on our servers and all transactions are fully secure.",
    icon: "fa-solid fa-lock",
  },
  {
    question: "How do reviews work?",
    answer:
      "After a service is completed, both parties can leave reviews. Reviews are verified and can only be left by users who actually booked and received the service, ensuring authenticity.",
    icon: "fa-solid fa-star",
  },
  {
    question: "What happens if there's a dispute?",
    answer:
      "Our support team is available 24/7 to help resolve disputes. We have a structured resolution process that protects both customers and service providers, ensuring fair outcomes.",
    icon: "fa-solid fa-handshake",
  },
]

export function FaqSection() {
  return (
    <section className="border-b bg-muted/30 py-16 md:py-24">
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-24">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full border bg-card px-4 py-2 text-sm mb-4 shadow-sm">
              <i className="fa-solid fa-circle-question text-primary"></i>
              <span className="font-medium">FAQ</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-balance">Frequently Asked Questions</h2>
            <p className="mt-4 text-base sm:text-lg text-muted-foreground text-pretty">
              Everything you need to know about our platform
            </p>
          </div>

          <Accordion type="single" collapsible className="mt-8 sm:mt-12">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border rounded-xl mb-3 sm:mb-4 px-3 sm:px-4 bg-card">
                <AccordionTrigger className="text-left text-sm sm:text-base md:text-lg font-semibold hover:no-underline py-4">
                  <span className="flex items-center gap-2 sm:gap-3">
                    <i className={`${faq.icon} text-primary text-sm sm:text-base`}></i>
                    {faq.question}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-sm sm:text-base text-muted-foreground leading-relaxed pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
