import type { ContactDetails, ContactMethodValue } from "@/lib/offers/types";

/**
 * Abstraction over how a poster's contact details are exposed.
 *
 * v1 uses RevealToEveryone: the contact button shows details to any visitor,
 * including anonymous ones, and all conversation happens off-platform.
 * When accounts arrive, swap getContactService() to AuthGatedContactService
 * (or an in-platform chat implementation) without touching callers.
 */

export type ContactSource = {
  contactName: string;
  contactMethod: ContactMethodValue;
  contactPhone: string | null;
  contactWhatsapp: string | null;
  contactEmail: string | null;
};

export type Viewer = {
  isAuthenticated: boolean;
};

export interface ContactService {
  /**
   * Returns the contact details the given viewer may see, or null when the
   * viewer is not allowed to see them.
   */
  getContact(source: ContactSource, viewer: Viewer): ContactDetails | null;
}

function toDetails(source: ContactSource): ContactDetails {
  return {
    name: source.contactName,
    method: source.contactMethod,
    phone: source.contactPhone ?? undefined,
    whatsapp: source.contactWhatsapp ?? undefined,
    email: source.contactEmail ?? undefined,
  };
}

/** Default v1 behaviour: everyone may see the contact details. */
class RevealToEveryoneContactService implements ContactService {
  getContact(source: ContactSource): ContactDetails {
    return toDetails(source);
  }
}

/**
 * Future behaviour: only signed-in users see contact details.
 * Not enabled yet; kept here so the swap is a one-line change.
 */
export class AuthGatedContactService implements ContactService {
  getContact(source: ContactSource, viewer: Viewer): ContactDetails | null {
    return viewer.isAuthenticated ? toDetails(source) : null;
  }
}

export function getContactService(): ContactService {
  return new RevealToEveryoneContactService();
}

/** Builds a WhatsApp deep link, normalising Swiss national numbers to +41. */
export function whatsappLink(raw: string): string {
  let digits = raw.replace(/\D/g, "");
  if (digits.startsWith("00")) {
    digits = digits.slice(2);
  } else if (digits.startsWith("0")) {
    digits = `41${digits.slice(1)}`;
  }
  return `https://wa.me/${digits}`;
}

/** Builds a tel: link, keeping a leading plus but removing spaces. */
export function telLink(raw: string): string {
  const normalised = raw.replace(/[^\d+]/g, "");
  return `tel:${normalised}`;
}
