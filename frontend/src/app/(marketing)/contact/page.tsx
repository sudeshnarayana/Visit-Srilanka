import type { Metadata } from "next";
import { Mail, Phone, Facebook, Instagram, Twitter, Youtube } from "lucide-react";

import { SectionHeading } from "@/components/shared/SectionHeading";
import { ContactForm } from "@/components/contact/ContactForm";
import { MapSection } from "@/components/contact/MapSection";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with the Visit Sri Lanka team — questions, partnership inquiries, or feedback.",
};

const SOCIAL_LINKS = [
  { icon: Facebook, label: "Facebook", href: "#" },
  { icon: Instagram, label: "Instagram", href: "#" },
  { icon: Twitter, label: "Twitter / X", href: "#" },
  { icon: Youtube, label: "YouTube", href: "#" },
];

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-background px-4 py-16 sm:py-24">
      <div className="mx-auto mb-12 max-w-2xl">
        <SectionHeading
          eyebrow="Contact"
          title="We'd love to hear from you"
          subtitle="Questions about a destination, feedback on the platform, or partnership inquiries — reach out below."
        />
      </div>

      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-10 lg:grid-cols-2">
        <div className="flex flex-col gap-8">
          <ContactForm />

          <div className="flex flex-col gap-3 border-t border-border pt-6">
            <a href="mailto:hello@visitsrilanka.com" className="flex items-center gap-3 text-sm text-foreground hover:text-primary">
              <Mail className="h-4 w-4 text-primary" /> hello@visitsrilanka.com
            </a>
            <a href="tel:+94112345678" className="flex items-center gap-3 text-sm text-foreground hover:text-primary">
              <Phone className="h-4 w-4 text-primary" /> +94 11 234 5678
            </a>
            <div className="mt-2 flex gap-3">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <MapSection />
      </div>
    </main>
  );
}
