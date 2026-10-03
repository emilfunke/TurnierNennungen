import { prisma } from "@/lib/db";
import { toDateInputValue } from "@/lib/format";
import type {
  CantonOption,
  CityOption,
  DisciplineOption,
  EventOption,
  OfferListItem,
  RegionOption,
  VenueOption,
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

export async function getRegionOptions(): Promise<RegionOption[]> {
  const regions = await prisma.region.findMany({ orderBy: { sortOrder: "asc" } });
  return regions.map((region) => ({ id: region.id, name: region.name }));
}

export async function getCityOptions(): Promise<CityOption[]> {
  const cities = await prisma.city.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true, cantonId: true },
  });
  return cities;
}

export async function getVenueOptions(): Promise<VenueOption[]> {
  const venues = await prisma.venue.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true, cityId: true },
  });
  return venues;
}

/**
 * Active offers mapped to serializable list items, soonest event first.
 * Filtering happens in the browser against this list, so no DB query per filter.
 */
export async function getOfferListItems(): Promise<OfferListItem[]> {
  const offers = await prisma.offer.findMany({
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

  return offers.map((offer) => ({
    id: offer.id,
    eventName: offer.event.name,
    dateFrom: offer.event.dateFrom,
    dateTo: offer.event.dateTo,
    locationLabel: [
      offer.event.venue?.name,
      offer.event.city?.name,
      offer.event.canton.name,
    ]
      .filter(Boolean)
      .join(", "),
    disciplineId: offer.disciplineId,
    disciplineName: offer.discipline.name,
    difficultyClassId: offer.difficultyClassId,
    difficultyClassName: offer.difficultyClass.name,
    priceCents: offer.priceCents,
    regionId: offer.event.canton.regionId,
    cantonId: offer.event.cantonId,
    cityId: offer.event.cityId,
    venueId: offer.event.venueId,
  }));
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
