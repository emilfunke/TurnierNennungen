import { describe, expect, it } from "vitest";
import { parseOfferForm } from "./validation";

const base: Record<string, string> = {
  mode: "manual",
  eventName: "Regionales Springturnier Aarau",
  disciplineId: "d-springen",
  difficultyClassId: "c-b",
  eventDate: "2026-06-14",
  cantonId: "k-ag",
  price: "80",
  contactName: "Anna Beispiel",
  contactMethod: "PHONE",
  contactPhone: "+41 79 000 00 00",
  consent: "on",
};

function formData(overrides: Record<string, string | undefined> = {}): FormData {
  const data = new FormData();
  const merged = { ...base, ...overrides };
  for (const [key, value] of Object.entries(merged)) {
    if (value !== undefined) data.set(key, value);
  }
  return data;
}

describe("parseOfferForm", () => {
  it("parses a valid manual offer", () => {
    const result = parseOfferForm(formData());
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.priceCents).toBe(8000);
      expect(result.data.eventName).toBe("Regionales Springturnier Aarau");
      expect(result.data.eventDate.toISOString()).toBe("2026-06-14T12:00:00.000Z");
      expect(result.data.originalFeeCents).toBeNull();
    }
  });

  it("parses an optional original fee and flags nothing", () => {
    const result = parseOfferForm(formData({ originalFee: "75.50" }));
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.originalFeeCents).toBe(7550);
  });

  it("rejects an invalid price", () => {
    const result = parseOfferForm(formData({ price: "abc" }));
    expect(result.success).toBe(false);
    if (!result.success) expect(result.fieldErrors.price).toBe("invalidPrice");
  });

  it("rejects an invalid date", () => {
    const result = parseOfferForm(formData({ eventDate: "14.06.2026" }));
    expect(result.success).toBe(false);
    if (!result.success) expect(result.fieldErrors.eventDate).toBe("invalidDate");
  });

  it("requires a manual event name", () => {
    const result = parseOfferForm(formData({ eventName: undefined }));
    expect(result.success).toBe(false);
    if (!result.success) expect(result.fieldErrors.eventName).toBe("eventMissing");
  });

  it("requires an existing event id in existing mode", () => {
    const result = parseOfferForm(
      formData({ mode: "existing", eventName: undefined, eventId: undefined }),
    );
    expect(result.success).toBe(false);
    if (!result.success) expect(result.fieldErrors.eventId).toBe("eventMissing");
  });

  it("requires the contact value matching the chosen method", () => {
    const result = parseOfferForm(formData({ contactMethod: "EMAIL" }));
    expect(result.success).toBe(false);
    if (!result.success) expect(result.fieldErrors.contactEmail).toBe("contactMethodMissing");
  });

  it("rejects an invalid email", () => {
    const result = parseOfferForm(
      formData({ contactMethod: "EMAIL", contactEmail: "not-an-email" }),
    );
    expect(result.success).toBe(false);
    if (!result.success) expect(result.fieldErrors.contactEmail).toBe("invalidEmail");
  });

  it("requires consent to publish contact details", () => {
    const result = parseOfferForm(formData({ consent: undefined }));
    expect(result.success).toBe(false);
    if (!result.success) expect(result.fieldErrors.consent).toBe("consentMissing");
  });
});
