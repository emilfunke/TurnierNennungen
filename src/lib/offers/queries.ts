import { prisma } from "@/lib/db";
import { toDateInputValue } from "@/lib/format";
import type {
  CantonOption,
  DisciplineOption,
  EventOption,
} from "./types";

/**
 * Server-side read helpers. They map Prisma rows to serializable DTOs so the
 * results can be passed straight to client components.
 */

export async function getDisciplineOptions(): Promise<DisciplineOption[]> {
  const disciplines = await prisma.discipline.findMany({
    where: { active: true },
    orderBy: { sortOrder: "asc" },
    include: {
      classes: { orderBy: { sortOrder: "asc" } },
    },
  });

  return disciplines.map((discipline) => ({
    id: discipline.id,
    slug: discipline.slug,
    name: discipline.name,
    sortOrder: discipline.sortOrder,
    classes: discipline.classes.map((cls) => ({
      id: cls.id,
      slug: cls.slug,
      name: cls.name,
      sortOrder: cls.sortOrder,
    })),
  }));
}

export async function getCantonOptions(): Promise<CantonOption[]> {
  const cantons = await prisma.canton.findMany({
    orderBy: { sortOrder: "asc" },
    include: { region: true },
  });

  return cantons.map((canton) => ({
    id: canton.id,
    code: canton.code,
    name: canton.name,
    regionId: canton.regionId,
    regionName: canton.region.name,
  }));
}

export async function getEventOptions(): Promise<EventOption[]> {
  const events = await prisma.event.findMany({
    orderBy: { dateFrom: "asc" },
    include: {
      city: true,
      venue: true,
      disciplines: { select: { slug: true } },
    },
  });

  return events.map((event) => ({
    id: event.id,
    name: event.name,
    dateFrom: toDateInputValue(event.dateFrom),
    dateTo: event.dateTo ? toDateInputValue(event.dateTo) : null,
    cantonId: event.cantonId,
    cityName: event.city?.name ?? null,
    venueName: event.venue?.name ?? null,
    disciplineSlugs: event.disciplines.map((d) => d.slug),
  }));
}

/** Active offers with everything the list view needs, newest event first. */
export async function listActiveOffers() {
  return prisma.offer.findMany({
    where: { status: "ACTIVE" },
    orderBy: { expiresAt: "asc" },
    include: {
      discipline: true,
      difficultyClass: true,
      event: {
        include: { canton: true, city: true, venue: true },
      },
    },
  });
}

export async function getOfferById(id: string) {
  return prisma.offer.findUnique({
    where: { id },
    include: {
      discipline: true,
      difficultyClass: true,
      event: {
        include: { canton: true, city: true, venue: true },
      },
    },
  });
}
