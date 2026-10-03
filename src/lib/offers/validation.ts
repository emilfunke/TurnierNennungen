import { z } from "zod";
import { parseChfToCents, parseDateOnly } from "@/lib/format";
import type { ContactMethodValue } from "./types";

/**
 * Validation for the "Startplatz anbieten" form.
 *
 * Basic shape validation is done with zod; cross-field rules (event selection,
 * contact method, price/date parsing) are checked separately so the returned
 * field errors map cleanly to the form fields.
 */

function get(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

const baseSchema = z.object({
  mode: z.enum(["existing", "manual"]).catch("existing"),
  eventId: z.string().trim().optional(),
  eventName: z.string().trim().optional(),
  disciplineId: z.string().trim().min(1, "required"),
  difficultyClassId: z.string().trim().min(1, "required"),
  eventDate: z.string().trim().min(1, "invalidDate"),
  eventDateTo: z.string().trim().optional(),
  cantonId: z.string().trim().min(1, "required"),
  cityName: z.string().trim().optional(),
  venueName: z.string().trim().optional(),
  price: z.string().trim().min(1, "invalidPrice"),
  originalFee: z.string().trim().optional(),
  note: z.string().trim().max(2000).optional(),
  contactName: z.string().trim().min(1, "required"),
  contactMethod: z.enum(["PHONE", "WHATSAPP", "EMAIL"]),
  contactPhone: z.string().trim().optional(),
  contactWhatsapp: z.string().trim().optional(),
  contactEmail: z.string().trim().optional(),
  consent: z.string().optional(),
});

export type OfferInput = {
  mode: "existing" | "manual";
  eventId: string | null;
  eventName: string | null;
  disciplineId: string;
  difficultyClassId: string;
  eventDate: Date;
  eventDateTo: Date | null;
  cantonId: string;
  cityName: string | null;
  venueName: string | null;
  priceCents: number;
  originalFeeCents: number | null;
  note: string | null;
  contactName: string;
  contactMethod: ContactMethodValue;
  contactPhone: string | null;
  contactWhatsapp: string | null;
  contactEmail: string | null;
};

export type OfferParseResult =
  | { success: true; data: OfferInput }
  | { success: false; fieldErrors: Record<string, string> };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function parseOfferForm(formData: FormData): OfferParseResult {
  const raw = {
    mode: get(formData, "mode"),
    eventId: get(formData, "eventId"),
    eventName: get(formData, "eventName"),
    disciplineId: get(formData, "disciplineId"),
    difficultyClassId: get(formData, "difficultyClassId"),
    eventDate: get(formData, "eventDate"),
    eventDateTo: get(formData, "eventDateTo"),
    cantonId: get(formData, "cantonId"),
    cityName: get(formData, "cityName"),
    venueName: get(formData, "venueName"),
    price: get(formData, "price"),
    originalFee: get(formData, "originalFee"),
    note: get(formData, "note"),
    contactName: get(formData, "contactName"),
    contactMethod: get(formData, "contactMethod"),
    contactPhone: get(formData, "contactPhone"),
    contactWhatsapp: get(formData, "contactWhatsapp"),
    contactEmail: get(formData, "contactEmail"),
    consent: get(formData, "consent"),
  };

  const parsed = baseSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "");
      if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { success: false, fieldErrors };
  }

  const value = parsed.data;
  const fieldErrors: Record<string, string> = {};

  if (value.mode === "existing" && !value.eventId) {
    fieldErrors.eventId = "eventMissing";
  }
  if (value.mode === "manual" && !value.eventName) {
    fieldErrors.eventName = "eventMissing";
  }

  const eventDate = parseDateOnly(value.eventDate);
  if (!eventDate) fieldErrors.eventDate = "invalidDate";

  const eventDateTo = value.eventDateTo ? parseDateOnly(value.eventDateTo) : null;
  if (value.eventDateTo && !eventDateTo) fieldErrors.eventDateTo = "invalidDate";

  const priceCents = parseChfToCents(value.price);
  if (priceCents === null) fieldErrors.price = "invalidPrice";

  let originalFeeCents: number | null = null;
  if (value.originalFee) {
    originalFeeCents = parseChfToCents(value.originalFee);
    if (originalFeeCents === null) fieldErrors.originalFee = "invalidPrice";
  }

  if (value.contactMethod === "PHONE" && !value.contactPhone) {
    fieldErrors.contactPhone = "contactMethodMissing";
  }
  if (value.contactMethod === "WHATSAPP" && !value.contactWhatsapp) {
    fieldErrors.contactWhatsapp = "contactMethodMissing";
  }
  if (value.contactMethod === "EMAIL" && !value.contactEmail) {
    fieldErrors.contactEmail = "contactMethodMissing";
  }
  if (value.contactEmail && !EMAIL_RE.test(value.contactEmail)) {
    fieldErrors.contactEmail = "invalidEmail";
  }

  if (value.consent !== "on") {
    fieldErrors.consent = "consentMissing";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { success: false, fieldErrors };
  }

  return {
    success: true,
    data: {
      mode: value.mode,
      eventId: value.eventId || null,
      eventName: value.eventName || null,
      disciplineId: value.disciplineId,
      difficultyClassId: value.difficultyClassId,
      eventDate: eventDate!,
      eventDateTo,
      cantonId: value.cantonId,
      cityName: value.cityName || null,
      venueName: value.venueName || null,
      priceCents: priceCents!,
      originalFeeCents,
      note: value.note || null,
      contactName: value.contactName,
      contactMethod: value.contactMethod,
      contactPhone: value.contactPhone || null,
      contactWhatsapp: value.contactWhatsapp || null,
      contactEmail: value.contactEmail || null,
    },
  };
}
