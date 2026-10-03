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
