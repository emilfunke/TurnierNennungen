/**
 * Seed script for Startplatz-Börse.
 *
 * Seeds the location hierarchy, the discipline/difficulty taxonomy and a few
 * sample events and offers so the app is usable locally.
 *
 * Run with: npm run db:seed
 *
 * NOTE ON TAXONOMY DATA
 * The discipline classes below reflect a best-effort understanding of the
 * current Swiss Equestrian classification. They are clearly marked with
 * "TO BE VERIFIED" and are stored as ordinary rows so an admin can correct
 * them without a code change.
 */
import {
  ContactMethod,
  EventSource,
  OfferStatus,
  PrismaClient,
} from "@prisma/client";

const prisma = new PrismaClient();

const DAY_MS = 24 * 60 * 60 * 1000;

/** Returns a date n days from now, at 12:00 local time. */
function daysFromNow(days: number): Date {
  const d = new Date(Date.now() + days * DAY_MS);
  d.setHours(12, 0, 0, 0);
  return d;
}

// ---------------------------------------------------------------------------
// Regions (Swiss "Grossregionen")
// ---------------------------------------------------------------------------
const REGIONS: { slug: string; name: string }[] = [
  { slug: "genferseeregion", name: "Genferseeregion" },
  { slug: "mittelland", name: "Espace Mittelland" },
  { slug: "nordwestschweiz", name: "Nordwestschweiz" },
  { slug: "zuerich", name: "Zürich" },
  { slug: "ostschweiz", name: "Ostschweiz" },
  { slug: "zentralschweiz", name: "Zentralschweiz" },
  { slug: "ticino", name: "Südschweiz" },
];

// ---------------------------------------------------------------------------
// Cantons with their region
// ---------------------------------------------------------------------------
const CANTONS: { code: string; name: string; region: string }[] = [
  { code: "CH-GE", name: "Genf", region: "genferseeregion" },
  { code: "CH-VD", name: "Waadt", region: "genferseeregion" },
  { code: "CH-VS", name: "Wallis", region: "genferseeregion" },
  { code: "CH-BE", name: "Bern", region: "mittelland" },
  { code: "CH-FR", name: "Freiburg", region: "mittelland" },
  { code: "CH-JU", name: "Jura", region: "mittelland" },
  { code: "CH-NE", name: "Neuenburg", region: "mittelland" },
  { code: "CH-SO", name: "Solothurn", region: "mittelland" },
  { code: "CH-AG", name: "Aargau", region: "nordwestschweiz" },
  { code: "CH-BL", name: "Basel-Landschaft", region: "nordwestschweiz" },
  { code: "CH-BS", name: "Basel-Stadt", region: "nordwestschweiz" },
  { code: "CH-ZH", name: "Zürich", region: "zuerich" },
  { code: "CH-AI", name: "Appenzell Innerrhoden", region: "ostschweiz" },
  { code: "CH-AR", name: "Appenzell Ausserrhoden", region: "ostschweiz" },
  { code: "CH-GL", name: "Glarus", region: "ostschweiz" },
  { code: "CH-GR", name: "Graubünden", region: "ostschweiz" },
  { code: "CH-SG", name: "St. Gallen", region: "ostschweiz" },
  { code: "CH-SH", name: "Schaffhausen", region: "ostschweiz" },
  { code: "CH-TG", name: "Thurgau", region: "ostschweiz" },
  { code: "CH-LU", name: "Luzern", region: "zentralschweiz" },
  { code: "CH-NW", name: "Nidwalden", region: "zentralschweiz" },
  { code: "CH-OW", name: "Obwalden", region: "zentralschweiz" },
  { code: "CH-SZ", name: "Schwyz", region: "zentralschweiz" },
  { code: "CH-UR", name: "Uri", region: "zentralschweiz" },
  { code: "CH-ZG", name: "Zug", region: "zentralschweiz" },
  { code: "CH-TI", name: "Tessin", region: "ticino" },
];

// ---------------------------------------------------------------------------
// A handful of cities per canton (users can add more by typing them in).
// ---------------------------------------------------------------------------
const CITIES: Record<string, string[]> = {
  "CH-ZH": ["Zürich", "Winterthur", "Wädenswil"],
  "CH-BE": ["Bern", "Thun", "Biel/Bienne", "Spiez"],
  "CH-LU": ["Luzern", "Sursee"],
  "CH-UR": ["Altdorf"],
  "CH-SZ": ["Schwyz", "Pfäffikon SZ"],
  "CH-OW": ["Sarnen"],
  "CH-NW": ["Stans"],
  "CH-GL": ["Glarus"],
  "CH-ZG": ["Zug", "Baar"],
  "CH-FR": ["Freiburg", "Bulle"],
  "CH-SO": ["Solothurn", "Grenchen"],
  "CH-BS": ["Basel"],
  "CH-BL": ["Liestal", "Pratteln"],
  "CH-SH": ["Schaffhausen"],
  "CH-AR": ["Herisau"],
  "CH-AI": ["Appenzell"],
  "CH-SG": ["St. Gallen", "Rapperswil-Jona", "Wil"],
  "CH-GR": ["Chur", "Davos"],
  "CH-AG": ["Aarau", "Baden", "Oftringen"],
  "CH-TG": ["Frauenfeld", "Kreuzlingen"],
  "CH-TI": ["Lugano", "Bellinzona", "Locarno"],
  "CH-VD": ["Lausanne", "Yverdon-les-Bains", "Avenches"],
  "CH-VS": ["Sion", "Brig", "Martigny"],
  "CH-NE": ["Neuenburg", "La Chaux-de-Fonds"],
  "CH-GE": ["Genf"],
  "CH-JU": ["Delsberg", "Porrentruy"],
};

// Sample venues only. Users may type any venue; these are for the demo data.
const VENUES: Record<string, string[]> = {
  Avenches: ["IENA Avenches"],
  Bern: ["Nationales Pferdesportzentrum Bern"],
  "St. Gallen": ["Pferdesportzentrum St. Gallen"],
  Zürich: ["Pferdesportanlage Zürich"],
  Luzern: ["Pferdesportpark Luzern"],
  Aarau: ["Pferdesportzentrum Aarau"],
};

// ---------------------------------------------------------------------------
// Disciplines and their ordered classes.
// Every class is marked TO BE VERIFIED against current Swiss Equestrian
// regulations. This is plain data: edit the lists below and re-run
// `npm run db:seed` to update the dropdowns in the app.
// ---------------------------------------------------------------------------
type ClassSeed = { slug: string; name: string; notes?: string };
type DisciplineSeed = {
  slug: string;
  name: string;
  classes: ClassSeed[];
};

/**
 * Builds graded classes such as Springen "B80" from a level prefix and a list
 * of values (jump heights in cm, or dressage test numbers).
 *
 * @example gradedClasses([{ prefix: "B", values: ["60", "65"] }], "TO BE VERIFIED")
 *   -> B60, B65
 */
function gradedClasses(
  grades: { prefix: string; values: string[] }[],
  notes: string,
): ClassSeed[] {
  return grades.flatMap(({ prefix, values }) =>
    values.map((value) => ({
      slug: `${prefix.toLowerCase()}${value}`,
      name: `${prefix}${value}`,
      notes,
    })),
  );
}

const DISCIPLINES: DisciplineSeed[] = [
  {
    slug: "springen",
    name: "Springen",
    classes: gradedClasses(
      [
        { prefix: "E", values: ["60", "70", "80"] },
        { prefix: "B", values: ["60", "65", "70", "75", "80", "85", "90", "95", "100"] },
        { prefix: "R", values: ["100", "105", "110", "115"] },
        { prefix: "N", values: ["115", "120", "125", "130"] },
        { prefix: "S", values: ["130", "135", "140", "145", "150"] },
      ],
      "TO BE VERIFIED (Höhe in cm)",
    ),
  },
  {
    slug: "dressur",
    name: "Dressur",
    classes: gradedClasses(
      [
        { prefix: "E", values: ["1", "2", "3"] },
        { prefix: "A", values: ["1", "2", "3", "4", "5"] },
        { prefix: "L", values: ["1", "2", "3", "4", "5"] },
        { prefix: "M", values: ["1", "2", "3", "4", "5"] },
        { prefix: "S", values: ["1", "2", "3"] },
      ],
      "TO BE VERIFIED (Aufgabennummer)",
    ),
  },
  {
    slug: "vielseitigkeit",
    name: "Vielseitigkeit",
    classes: [
      { slug: "e", name: "E", notes: "TO BE VERIFIED" },
      { slug: "a", name: "A", notes: "TO BE VERIFIED" },
      { slug: "l", name: "L", notes: "TO BE VERIFIED" },
      { slug: "m", name: "M", notes: "TO BE VERIFIED" },
      { slug: "s", name: "S", notes: "TO BE VERIFIED" },
      { slug: "1star", name: "1*", notes: "TO BE VERIFIED (international)" },
      { slug: "2star", name: "2*", notes: "TO BE VERIFIED (international)" },
      { slug: "3star", name: "3*", notes: "TO BE VERIFIED (international)" },
      { slug: "4star", name: "4*", notes: "TO BE VERIFIED (international)" },
    ],
  },
  {
    slug: "cross",
    name: "Cross",
    classes: gradedClasses(
      [
        { prefix: "E", values: ["80"] },
        { prefix: "B", values: ["80", "90", "100"] },
        { prefix: "R", values: ["100", "110"] },
        { prefix: "N", values: ["110", "120"] },
        { prefix: "S", values: ["120", "130"] },
      ],
      "TO BE VERIFIED (Höhe in cm)",
    ),
  },
  {
    slug: "fahren",
    name: "Fahren",
    classes: [
      { slug: "e", name: "E", notes: "TO BE VERIFIED" },
      { slug: "a", name: "A", notes: "TO BE VERIFIED" },
      { slug: "l", name: "L", notes: "TO BE VERIFIED" },
      { slug: "m", name: "M", notes: "TO BE VERIFIED" },
      { slug: "s", name: "S", notes: "TO BE VERIFIED" },
    ],
  },
  {
    slug: "reining",
    name: "Reining",
    classes: [
      { slug: "beginner", name: "Beginner", notes: "TO BE VERIFIED" },
      { slug: "rookie", name: "Rookie", notes: "TO BE VERIFIED" },
      { slug: "youth", name: "Youth", notes: "TO BE VERIFIED" },
      { slug: "limited-non-pro", name: "Limited Non Pro", notes: "TO BE VERIFIED" },
      { slug: "intermediate-non-pro", name: "Intermediate Non Pro", notes: "TO BE VERIFIED" },
      { slug: "non-pro", name: "Non Pro", notes: "TO BE VERIFIED" },
      { slug: "limited-open", name: "Limited Open", notes: "TO BE VERIFIED" },
      { slug: "intermediate-open", name: "Intermediate Open", notes: "TO BE VERIFIED" },
      { slug: "open", name: "Open", notes: "TO BE VERIFIED" },
    ],
  },
  {
    slug: "distanzreiten",
    name: "Distanzreiten",
    classes: [
      { slug: "40", name: "40 km", notes: "TO BE VERIFIED" },
      { slug: "60", name: "60 km", notes: "TO BE VERIFIED" },
      { slug: "80", name: "80 km", notes: "TO BE VERIFIED" },
      { slug: "100", name: "100 km", notes: "TO BE VERIFIED" },
      { slug: "120", name: "120 km", notes: "TO BE VERIFIED" },
      { slug: "cei1", name: "CEI 1*", notes: "TO BE VERIFIED (international)" },
      { slug: "cei2", name: "CEI 2*", notes: "TO BE VERIFIED (international)" },
      { slug: "cei3", name: "CEI 3*", notes: "TO BE VERIFIED (international)" },
    ],
  },
  {
    slug: "voltige",
    name: "Voltige",
    classes: [
      { slug: "e", name: "E", notes: "TO BE VERIFIED" },
      { slug: "a", name: "A", notes: "TO BE VERIFIED" },
      { slug: "l", name: "L", notes: "TO BE VERIFIED" },
      { slug: "m", name: "M", notes: "TO BE VERIFIED" },
      { slug: "s", name: "S", notes: "TO BE VERIFIED" },
    ],
  },
];

async function main(): Promise<void> {
  // Reset in dependency order.
  await prisma.offer.deleteMany();
  await prisma.request.deleteMany();
  await prisma.event.deleteMany();
  await prisma.difficultyClass.deleteMany();
  await prisma.discipline.deleteMany();
  await prisma.venue.deleteMany();
  await prisma.city.deleteMany();
  await prisma.canton.deleteMany();
  await prisma.region.deleteMany();

  // Locations
  const regionIdBySlug = new Map<string, string>();
  for (const [index, region] of REGIONS.entries()) {
    const created = await prisma.region.create({
      data: { slug: region.slug, name: region.name, sortOrder: index },
    });
    regionIdBySlug.set(region.slug, created.id);
  }

  const cantonIdByCode = new Map<string, string>();
  for (const [index, canton] of CANTONS.entries()) {
    const created = await prisma.canton.create({
      data: {
        code: canton.code,
        name: canton.name,
        sortOrder: index,
        regionId: regionIdBySlug.get(canton.region)!,
      },
    });
    cantonIdByCode.set(canton.code, created.id);
  }

  const cityIdByKey = new Map<string, string>();
  for (const [cantonCode, names] of Object.entries(CITIES)) {
    const cantonId = cantonIdByCode.get(cantonCode)!;
    for (const name of names) {
      const city = await prisma.city.create({ data: { name, cantonId } });
      cityIdByKey.set(`${cantonCode}:${name}`, city.id);
    }
  }

  const venueIdByName = new Map<string, string>();
  for (const [cityName, venues] of Object.entries(VENUES)) {
    const entry = [...cityIdByKey.entries()].find(([key]) =>
      key.endsWith(`:${cityName}`),
    );
    if (!entry) continue;
    for (const name of venues) {
      const venue = await prisma.venue.create({
        data: { name, cityId: entry[1] },
      });
      venueIdByName.set(name, venue.id);
    }
  }

  // Taxonomy
  const disciplineIdBySlug = new Map<string, string>();
  const classIdByKey = new Map<string, string>();
  for (const [dIndex, discipline] of DISCIPLINES.entries()) {
    const created = await prisma.discipline.create({
      data: { slug: discipline.slug, name: discipline.name, sortOrder: dIndex },
    });
    disciplineIdBySlug.set(discipline.slug, created.id);
    for (const [cIndex, cls] of discipline.classes.entries()) {
      const createdClass = await prisma.difficultyClass.create({
        data: {
          disciplineId: created.id,
          slug: cls.slug,
          name: cls.name,
          notes: cls.notes,
          sortOrder: cIndex,
        },
      });
      classIdByKey.set(`${discipline.slug}:${cls.slug}`, createdClass.id);
    }
  }

  // Sample events
  const eventData: {
    name: string;
    canton: string;
    city: string;
    venue?: string;
    disciplines: string[];
    daysFrom: number;
    daysTo?: number;
    organiser: string;
  }[] = [
    {
      name: "Regionales Springturnier Aarau",
      canton: "CH-AG",
      city: "Aarau",
      venue: "Pferdesportzentrum Aarau",
      disciplines: ["springen"],
      daysFrom: 14,
      daysTo: 15,
      organiser: "Pferdesportverein Aarau",
    },
    {
      name: "CSI Zürich",
      canton: "CH-ZH",
      city: "Zürich",
      venue: "Pferdesportanlage Zürich",
      disciplines: ["springen"],
      daysFrom: 28,
      daysTo: 31,
      organiser: "Reitclub Zürich",
    },
    {
      name: "CDI Dressur Bern",
      canton: "CH-BE",
      city: "Bern",
      venue: "Nationales Pferdesportzentrum Bern",
      disciplines: ["dressur"],
      daysFrom: 45,
      daysTo: 46,
      organiser: "Dressurclub Bern",
    },
    {
      name: "Vielseitigkeitsturnier Thun",
      canton: "CH-BE",
      city: "Thun",
      disciplines: ["vielseitigkeit", "cross"],
      daysFrom: 60,
      organiser: "Reitverein Thun",
    },
    {
      name: "Distanzritt Sion",
      canton: "CH-VS",
      city: "Sion",
      disciplines: ["distanzreiten"],
      daysFrom: 90,
      organiser: "Distanzreitclub Wallis",
    },
    {
      name: "Fahrturnier Avenches",
      canton: "CH-VD",
      city: "Avenches",
      venue: "IENA Avenches",
      disciplines: ["fahren"],
      daysFrom: 40,
      organiser: "Fahrverein Avenches",
    },
  ];

  const eventIdByName = new Map<string, string>();
  for (const e of eventData) {
    const created = await prisma.event.create({
      data: {
        name: e.name,
        dateFrom: daysFromNow(e.daysFrom),
        dateTo: e.daysTo ? daysFromNow(e.daysTo) : null,
        organiser: e.organiser,
        source: EventSource.ADMIN,
        cantonId: cantonIdByCode.get(e.canton)!,
        cityId: cityIdByKey.get(`${e.canton}:${e.city}`) ?? null,
        venueId: e.venue ? (venueIdByName.get(e.venue) ?? null) : null,
        disciplines: {
          connect: e.disciplines.map((slug) => ({
            id: disciplineIdBySlug.get(slug)!,
          })),
        },
      },
    });
    eventIdByName.set(e.name, created.id);
  }

  // Sample offers
  const offerData: {
    event: string;
    discipline: string;
    cls: string;
    priceCents: number;
    originalFeeCents?: number;
    note?: string;
    status?: OfferStatus;
    contactName: string;
    contactMethod: ContactMethod;
    contactPhone?: string;
    contactWhatsapp?: string;
    contactEmail?: string;
  }[] = [
    {
      event: "Regionales Springturnier Aarau",
      discipline: "springen",
      cls: "b80",
      priceCents: 8000,
      originalFeeCents: 8000,
      note: "Pferd ist gesund, ich kann wegen Umzug nicht starten.",
      contactName: "Andrea Muster",
      contactMethod: ContactMethod.PHONE,
      contactPhone: "+41 79 123 45 67",
    },
    {
      event: "CSI Zürich",
      discipline: "springen",
      cls: "r110",
      priceCents: 15000,
      originalFeeCents: 14000,
      note: "Startplatz in einer R110-Prüfung.",
      contactName: "Beat Beispiel",
      contactMethod: ContactMethod.WHATSAPP,
      contactWhatsapp: "+41 78 987 65 43",
    },
    {
      event: "CDI Dressur Bern",
      discipline: "dressur",
      cls: "a3",
      priceCents: 6500,
      originalFeeCents: 6500,
      contactName: "Claudia Demo",
      contactMethod: ContactMethod.EMAIL,
      contactEmail: "claudia.demo@example.com",
    },
    {
      event: "Vielseitigkeitsturnier Thun",
      discipline: "cross",
      cls: "b90",
      priceCents: 9000,
      originalFeeCents: 9000,
      note: "Nur der Geländeritt, Dressur und Springen bereits vergeben.",
      contactName: "Daniel Test",
      contactMethod: ContactMethod.PHONE,
      contactPhone: "+41 76 222 33 44",
    },
    {
      event: "Distanzritt Sion",
      discipline: "distanzreiten",
      cls: "80",
      priceCents: 7000,
      originalFeeCents: 7000,
      contactName: "Elena Musterfrau",
      contactMethod: ContactMethod.EMAIL,
      contactEmail: "elena.musterfrau@example.com",
    },
    {
      event: "Fahrturnier Avenches",
      discipline: "fahren",
      cls: "a",
      priceCents: 6000,
      originalFeeCents: 6000,
      status: OfferStatus.GIVEN_AWAY,
      contactName: "Franz Beispiel",
      contactMethod: ContactMethod.PHONE,
      contactPhone: "+41 79 555 66 77",
    },
  ];

  for (const o of offerData) {
    const eventId = eventIdByName.get(o.event)!;
    const event = await prisma.event.findUniqueOrThrow({
      where: { id: eventId },
      select: { dateFrom: true },
    });
    await prisma.offer.create({
      data: {
        eventId,
        disciplineId: disciplineIdBySlug.get(o.discipline)!,
        difficultyClassId: classIdByKey.get(`${o.discipline}:${o.cls}`)!,
        priceCents: o.priceCents,
        originalFeeCents: o.originalFeeCents ?? null,
        note: o.note ?? null,
        status: o.status ?? OfferStatus.ACTIVE,
        // Offers expire after the event date.
        expiresAt: event.dateFrom,
        contactName: o.contactName,
        contactMethod: o.contactMethod,
        contactPhone: o.contactPhone ?? null,
        contactWhatsapp: o.contactWhatsapp ?? null,
        contactEmail: o.contactEmail ?? null,
      },
    });
  }

  const counts = {
    regions: await prisma.region.count(),
    cantons: await prisma.canton.count(),
    cities: await prisma.city.count(),
    venues: await prisma.venue.count(),
    disciplines: await prisma.discipline.count(),
    classes: await prisma.difficultyClass.count(),
    events: await prisma.event.count(),
    offers: await prisma.offer.count(),
  };
  console.log("Seed complete:", counts);
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
