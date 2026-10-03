"use client";

import { useState } from "react";
import { messages } from "@/i18n";
import { telLink, whatsappLink } from "@/lib/contact/contact-service";
import type { ContactDetails } from "@/lib/offers/types";

/**
 * Reveals the poster's contact details on demand.
 * Swapping the contact mechanism later only changes what is passed in.
 */
export function ContactReveal({ details }: { details: ContactDetails | null }) {
  const [revealed, setRevealed] = useState(false);

  if (!details) return null;

  if (!revealed) {
    return (
      <button
        type="button"
        onClick={() => setRevealed(true)}
        className="w-full rounded-lg bg-green-700 px-4 py-3 text-base font-semibold text-white hover:bg-green-800"
      >
        {messages.contact.show}
      </button>
    );
  }

  return (
    <div className="space-y-3 rounded-lg border border-green-200 bg-green-50 p-4">
      <p className="text-sm font-medium text-gray-900">{details.name}</p>
      {details.phone ? (
        <a
          href={telLink(details.phone)}
          className="block text-sm font-medium text-green-800 underline"
        >
          {messages.contact.call}: {details.phone}
        </a>
      ) : null}
      {details.whatsapp ? (
        <a
          href={whatsappLink(details.whatsapp)}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-sm font-medium text-green-800 underline"
        >
          {messages.contact.writeWhatsapp}: {details.whatsapp}
        </a>
      ) : null}
      {details.email ? (
        <a
          href={`mailto:${details.email}`}
          className="block text-sm font-medium text-green-800 underline"
        >
          {messages.contact.writeEmail}: {details.email}
        </a>
      ) : null}
    </div>
  );
}
