import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { Footer } from "@/components/sections";
import { business, telHref } from "@/lib/business";
import logoStacked from "@/public/brand/logo-stacked.png";

export const metadata: Metadata = {
  title: "Privacy | Golden Bite",
  description: "What Golden Bite collects when you order, and how it is used.",
  alternates: { canonical: "/privacy" },
};

export default function Privacy() {
  const phone = business.phones[0];
  return (
    <>
      <main className="not-found privacy-page">
        <Image src={logoStacked} alt="Golden Bite" width={140} priority />
        <p className="eyebrow">Privacy</p>
        <h1>
          Your details, <em>kept simple.</em>
        </h1>
        <div style={{ maxWidth: "36rem", textAlign: "left", display: "grid", gap: "1rem" }}>
          <p>
            <strong>What we collect.</strong> When you send an order or a catering enquiry, the
            details you type (your name, delivery area or landmark, notes, and what you ordered) are
            put into a WhatsApp message to Golden Bite. The website does not store them on a server.
          </p>
          <p>
            <strong>Why.</strong> Only to prepare, confirm and deliver your order, and to reply to
            your enquiry. Staff may see your WhatsApp number when you message us.
          </p>
          <p>
            <strong>Your basket.</strong> It is saved on your own phone so it survives a refresh.
            Clear your browser data to remove it.
          </p>
          <p>
            <strong>Visitor stats.</strong> We use PostHog in cookie-free mode to count visits and a
            few actions (such as adding a dish to the basket). It never receives your name, phone
            number, location or notes.
          </p>
          <p>
            <strong>Questions or removal.</strong> Call {phone.display} or message us on WhatsApp
            and we will delete the order messages we hold about you.
          </p>
        </div>
        <div className="hero-actions">
          <Link className="button button-primary" href="/">
            Back to the menu
          </Link>
          <a className="button button-quiet" href={telHref(phone)}>
            Call {phone.display}
          </a>
        </div>
      </main>
      <Footer />
    </>
  );
}
