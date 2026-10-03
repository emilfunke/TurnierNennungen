import { prisma } from "@/lib/db";

export type ResolvedLocation = {
  cityId: string | null;
  venueId: string | null;
};

/**
 * Finds or creates the city and venue for a manually entered location.
 *
 * City and venue names are free text in v1 (there is no admin UI yet), so we
 * normalise by finding a case-insensitive match within the parent and creating
 * the row when it does not exist. A venue requires a city.
 */
export async function resolveLocation(input: {
  cantonId: string;
  cityName?: string | null;
  venueName?: string | null;
}): Promise<ResolvedLocation> {
  const cityName = input.cityName?.trim();
  let cityId: string | null = null;

  if (cityName) {
    const existing = await prisma.city.findFirst({
      where: {
        cantonId: input.cantonId,
        name: { equals: cityName, mode: "insensitive" },
      },
    });
    if (existing) {
      cityId = existing.id;
    } else {
      try {
        const created = await prisma.city.create({
          data: { name: cityName, cantonId: input.cantonId },
        });
        cityId = created.id;
      } catch {
        // Lost a race with a concurrent create; fall back to the existing row.
        const raced = await prisma.city.findFirst({
          where: {
            cantonId: input.cantonId,
            name: { equals: cityName, mode: "insensitive" },
          },
        });
        cityId = raced?.id ?? null;
      }
    }
  }

  const venueName = input.venueName?.trim();
  let venueId: string | null = null;

  if (venueName && cityId) {
    const existing = await prisma.venue.findFirst({
      where: {
        cityId,
        name: { equals: venueName, mode: "insensitive" },
      },
    });
    if (existing) {
      venueId = existing.id;
    } else {
      try {
        const created = await prisma.venue.create({
          data: { name: venueName, cityId },
        });
        venueId = created.id;
      } catch {
        const raced = await prisma.venue.findFirst({
          where: {
            cityId,
            name: { equals: venueName, mode: "insensitive" },
          },
        });
        venueId = raced?.id ?? null;
      }
    }
  }

  return { cityId, venueId };
}
