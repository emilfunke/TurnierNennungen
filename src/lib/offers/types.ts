/**
 * Serializable types shared between server components and client components.
 * These intentionally avoid importing Prisma value types so they are safe in
 * the browser bundle.
 */

export type ContactMethodValue = "PHONE" | "WHATSAPP" | "EMAIL";

export type OfferStatusValue = "ACTIVE" | "RESERVED" | "GIVEN_AWAY" | "EXPIRED";

export type ClassOption = {
  id: string;
  slug: string;
  name: string;
  sortOrder: number;
};

export type DisciplineOption = {
  id: string;
  slug: string;
  name: string;
  sortOrder: number;
  classes: ClassOption[];
};

export type CantonOption = {
  id: string;
  code: string;
  name: string;
  regionId: string;
  regionName: string;
};

export type EventOption = {
  id: string;
  name: string;
  /** Date-only value, "yyyy-mm-dd". */
  dateFrom: string;
  /** Date-only value, "yyyy-mm-dd", or null. */
  dateTo: string | null;
  cantonId: string;
  cityName: string | null;
  venueName: string | null;
  disciplineSlugs: string[];
};

export type ContactDetails = {
  name: string;
  method: ContactMethodValue;
  phone?: string;
  whatsapp?: string;
  email?: string;
};

export type RegionOption = {
  id: string;
  name: string;
};

export type CityOption = {
  id: string;
  name: string;
  cantonId: string;
};

export type VenueOption = {
  id: string;
  name: string;
  cityId: string;
};

/**
 * Everything the offer list and its filter need. All fields are serializable so
 * the list can be filtered in the browser without a server round-trip.
 */
export type OfferListItem = {
  id: string;
  eventName: string;
  dateFrom: Date;
  dateTo: Date | null;
  locationLabel: string;
  disciplineId: string;
  disciplineName: string;
  difficultyClassId: string;
  difficultyClassName: string;
  priceCents: number;
  regionId: string;
  cantonId: string;
  cityId: string | null;
  venueId: string | null;
};
