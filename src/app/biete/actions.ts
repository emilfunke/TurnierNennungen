"use server";

import { EventSource } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { resolveLocation } from "@/lib/location";
import { parseOfferForm } from "@/lib/offers/validation";

export type CreateOfferState = {
  fieldErrors?: Record<string, string>;
  values?: Record<string, string>;
} | null;

const TEXT_FIELDS = [
  "mode",
  "eventId",
  "eventName",
  "disciplineId",
  "difficultyClassId",
  "eventDate",
  "eventDateTo",
  "cantonId",
  "cityName",
  "venueName",
  "price",
  "originalFee",
  "note",
  "contactName",
  "contactMethod",
  "contactPhone",
  "contactWhatsapp",
  "contactEmail",
] as const;

/** Captures submitted text so the form can be repopulated after an error. */
function captureValues(formData: FormData): Record<string, string> {
  const values: Record<string, string> = {};
  for (const field of TEXT_FIELDS) {
    const value = formData.get(field);
    if (typeof value === "string") values[field] = value;
  }
  return values;
}

export async function createOffer(
  _prevState: CreateOfferState,
  formData: FormData,
): Promise<CreateOfferState> {
  const parsed = parseOfferForm(formData);
  if (!parsed.success) {
    return { fieldErrors: parsed.fieldErrors, values: captureValues(formData) };
  }

  const input = parsed.data;

  const difficultyClass = await prisma.difficultyClass.findUnique({
    where: { id: input.difficultyClassId },
    select: { disciplineId: true },
  });
  if (!difficultyClass || difficultyClass.disciplineId !== input.disciplineId) {
    return {
      fieldErrors: { difficultyClassId: "required" },
      values: captureValues(formData),
    };
  }

  let eventId: string;

  if (input.mode === "existing" && input.eventId) {
    const event = await prisma.event.findUnique({
      where: { id: input.eventId },
      select: { id: true },
    });
    if (!event) {
      return {
        fieldErrors: { eventId: "eventMissing" },
        values: captureValues(formData),
      };
    }
    eventId = event.id;
  } else {
    const { cityId, venueId } = await resolveLocation({
      cantonId: input.cantonId,
      cityName: input.cityName,
      venueName: input.venueName,
    });

    const event = await prisma.event.create({
      data: {
        name: input.eventName!,
        dateFrom: input.eventDate,
        dateTo: input.eventDateTo,
        source: EventSource.USER,
        cantonId: input.cantonId,
        cityId,
        venueId,
        disciplines: { connect: { id: input.disciplineId } },
      },
    });
    eventId = event.id;
  }

  const offer = await prisma.offer.create({
    data: {
      eventId,
      disciplineId: input.disciplineId,
      difficultyClassId: input.difficultyClassId,
      priceCents: input.priceCents,
      originalFeeCents: input.originalFeeCents,
      note: input.note,
      // Offers expire after the event date.
      expiresAt: input.eventDate,
      contactName: input.contactName,
      contactMethod: input.contactMethod,
      contactPhone: input.contactPhone,
      contactWhatsapp: input.contactWhatsapp,
      contactEmail: input.contactEmail,
    },
  });

  revalidatePath("/suche");
  redirect(`/biete/danke/${offer.id}`);
}
