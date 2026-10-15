"use client";

import { business, telHref } from "@/lib/business";

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  const phone = business.phones[0];
  return (
    <main className="not-found">
      <p className="eyebrow">Something went wrong</p>
      <h1>
        Sorry, <em>that didn’t work.</em>
      </h1>
      <p>Please try again. If it keeps happening, you can still order by phone or WhatsApp.</p>
      <div className="hero-actions">
        <button type="button" className="button button-primary" onClick={reset}>
          Try again
        </button>
        <a className="button button-quiet" href={telHref(phone)}>
          Call {phone.display}
        </a>
      </div>
    </main>
  );
}
