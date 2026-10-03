/**
 * Pure filtering logic for offers.
 *
 * Kept free of database and framework imports so it can be unit tested and
 * reused by both the list view and (later) the matching logic.
 */

export type OfferFilter = {
  disciplineId?: string;
  difficultyClassId?: string;
  dateFrom?: Date;
  dateTo?: Date;
  regionId?: string;
  cantonId?: string;
  cityId?: string;
  venueId?: string;
  priceMinCents?: number;
  priceMaxCents?: number;
};

/**
 * The subset of an offer needed to evaluate a filter. An offer's date and
 * location come from its event; region is derived from the canton and city and
 * venue from the event's location.
 */
export type FilterableOffer = {
  disciplineId: string;
  difficultyClassId: string;
  priceCents: number;
  /** Inclusive start of the offer's date range. */
  dateFrom: Date;
  /** Inclusive end of the offer's date range, or null when it is a single day. */
  dateTo: Date | null;
  regionId: string;
  cantonId: string;
  cityId: string | null;
  venueId: string | null;
};

/**
 * Returns true when an offer satisfies every populated filter field.
 *
 * A filter field that is undefined is ignored. Date filters use range overlap,
 * so an offer matches if its event range intersects the requested range.
 * Canton and region filters are matched at their own level: filtering by region
 * matches every canton in it.
 */
export function matchesOfferFilter(
  offer: FilterableOffer,
  filter: OfferFilter,
): boolean {
  if (filter.disciplineId && offer.disciplineId !== filter.disciplineId) {
    return false;
  }

  if (
    filter.difficultyClassId &&
    offer.difficultyClassId !== filter.difficultyClassId
  ) {
    return false;
  }

  if (filter.priceMinCents !== undefined && offer.priceCents < filter.priceMinCents) {
    return false;
  }
  if (filter.priceMaxCents !== undefined && offer.priceCents > filter.priceMaxCents) {
    return false;
  }

  if (filter.cantonId && offer.cantonId !== filter.cantonId) {
    return false;
  }
  if (filter.cityId && offer.cityId !== filter.cityId) {
    return false;
  }
  if (filter.venueId && offer.venueId !== filter.venueId) {
    return false;
  }
  if (filter.regionId && offer.regionId !== filter.regionId) {
    return false;
  }

  const offerEnd = offer.dateTo ?? offer.dateFrom;
  if (filter.dateFrom && offerEnd.getTime() < filter.dateFrom.getTime()) {
    return false;
  }
  if (filter.dateTo && offer.dateFrom.getTime() > filter.dateTo.getTime()) {
    return false;
  }

  return true;
}
