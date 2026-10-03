import { describe, expect, it } from "vitest";
import type { FilterableOffer } from "./filter";
import { matchesOfferFilter } from "./filter";

const day = (iso: string) => new Date(`${iso}T12:00:00.000Z`);

function offer(overrides: Partial<FilterableOffer> = {}): FilterableOffer {
  return {
    disciplineId: "springen",
    difficultyClassId: "b",
    priceCents: 8000,
    dateFrom: day("2026-06-14"),
    dateTo: null,
    cantonId: "be",
    regionId: "mittelland",
    cityId: "bern",
    venueId: null,
    ...overrides,
  };
}

describe("matchesOfferFilter", () => {
  it("matches an empty filter", () => {
    expect(matchesOfferFilter(offer(), {})).toBe(true);
  });

  it("filters by discipline and difficulty", () => {
    expect(matchesOfferFilter(offer(), { disciplineId: "springen" })).toBe(true);
    expect(matchesOfferFilter(offer(), { disciplineId: "dressur" })).toBe(false);
    expect(matchesOfferFilter(offer(), { difficultyClassId: "b" })).toBe(true);
    expect(matchesOfferFilter(offer(), { difficultyClassId: "r" })).toBe(false);
  });

  it("filters by canton and by region (higher level)", () => {
    expect(matchesOfferFilter(offer(), { cantonId: "be" })).toBe(true);
    expect(matchesOfferFilter(offer(), { cantonId: "zh" })).toBe(false);
    expect(matchesOfferFilter(offer(), { regionId: "mittelland" })).toBe(true);
    expect(matchesOfferFilter(offer(), { regionId: "zuerich" })).toBe(false);
  });

  it("filters by city and venue (finer levels)", () => {
    const withVenue = offer({ venueId: "pdz", cityId: "bern" });
    expect(matchesOfferFilter(withVenue, { cityId: "bern" })).toBe(true);
    expect(matchesOfferFilter(withVenue, { cityId: "thun" })).toBe(false);
    expect(matchesOfferFilter(withVenue, { venueId: "pdz" })).toBe(true);
    expect(matchesOfferFilter(withVenue, { venueId: "other" })).toBe(false);
    // An offer without a venue never matches a venue filter.
    expect(matchesOfferFilter(offer(), { venueId: "pdz" })).toBe(false);
  });

  it("filters by price range", () => {
    expect(matchesOfferFilter(offer(), { priceMinCents: 5000 })).toBe(true);
    expect(matchesOfferFilter(offer(), { priceMinCents: 9000 })).toBe(false);
    expect(matchesOfferFilter(offer(), { priceMaxCents: 8000 })).toBe(true);
    expect(matchesOfferFilter(offer(), { priceMaxCents: 7000 })).toBe(false);
  });

  it("matches dates by range overlap", () => {
    expect(
      matchesOfferFilter(offer(), { dateFrom: day("2026-06-01"), dateTo: day("2026-06-30") }),
    ).toBe(true);
    expect(
      matchesOfferFilter(offer(), { dateFrom: day("2026-07-01") }),
    ).toBe(false);
    expect(
      matchesOfferFilter(offer(), { dateTo: day("2026-06-01") }),
    ).toBe(false);
  });

  it("uses dateTo as the end of a multi-day offer when present", () => {
    const multiDay = offer({ dateFrom: day("2026-06-14"), dateTo: day("2026-06-16") });
    expect(matchesOfferFilter(multiDay, { dateTo: day("2026-06-15") })).toBe(true);
    expect(matchesOfferFilter(multiDay, { dateFrom: day("2026-06-16") })).toBe(true);
    expect(matchesOfferFilter(multiDay, { dateFrom: day("2026-06-17") })).toBe(false);
  });

  it("combines multiple filters", () => {
    expect(
      matchesOfferFilter(offer(), {
        disciplineId: "springen",
        cantonId: "be",
        priceMaxCents: 10000,
      }),
    ).toBe(true);
    expect(
      matchesOfferFilter(offer(), {
        disciplineId: "springen",
        cantonId: "zh",
      }),
    ).toBe(false);
  });
});
