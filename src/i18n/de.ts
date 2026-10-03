/**
 * German UI strings. This is the single source of truth for user-facing text.
 *
 * To add French or Italian later, create a sibling file (fr.ts / it.ts) with the
 * same shape and select it in ../index.ts. Components never hardcode text.
 */
export const de = {
  common: {
    appName: "Startplatz-Börse",
    tagline: "Turniernennungen weitergeben und finden",
    loading: "Wird geladen…",
    optional: "optional",
    required: "Pflichtfeld",
    unknown: "Unbekannt",
  },
  nav: {
    search: "Suche",
    offer: "Biete",
    requests: "Gesuche",
    home: "Start",
  },
  home: {
    title: "Startplätze finden und weitergeben",
    subtitle:
      "Du kannst nicht an ein Turnier oder suchst kurzfristig einen Startplatz? Hier findest du Rennende, die ihre Nennung weitergeben möchten.",
    ctaSearch: "Startplatz suchen",
    ctaOffer: "Startplatz anbieten",
    howItWorksTitle: "So funktioniert es",
    stepSearch:
      "Stöbere in den verfügbaren Startplätzen und filtere nach Disziplin, Klasse, Datum und Region.",
    stepContact:
      "Nimm direkt Kontakt mit der Person auf, die ihren Startplatz weitergibt.",
    stepTransfer:
      "Die Ummeldung beim Veranstalter regelst du direkt mit ihm. Die Plattform vermittelt nur.",
  },
  offer: {
    listTitle: "Verfügbare Startplätze",
    listIntro:
      "Alle aktiven Angebote. Kontaktdaten siehst du auf der Detailseite.",
    empty:
      "Zurzeit sind keine Startplätze verfügbar. Schau später wieder vorbei oder erstelle ein Gesuch.",
    detailTitle: "Startplatz",
    event: "Anlass",
    discipline: "Disziplin",
    difficulty: "Klasse",
    date: "Datum",
    location: "Ort",
    price: "Nenngebühr",
    originalFee: "Ursprüngliche Nenngebühr",
    note: "Bemerkung",
    organiser: "Veranstalter",
    status: "Status",
  },
  status: {
    ACTIVE: "Verfügbar",
    RESERVED: "Reserviert",
    GIVEN_AWAY: "Vergeben",
    EXPIRED: "Abgelaufen",
  },
  contact: {
    title: "Kontakt aufnehmen",
    intro:
      "Melde dich direkt bei der Person. Alle Absprachen laufen ausserhalb der Plattform.",
    name: "Name",
    method: "Bevorzugter Kontakt",
    phone: "Telefon",
    whatsapp: "WhatsApp",
    email: "E-Mail",
    show: "Kontakt anzeigen",
    call: "Anrufen",
    writeWhatsapp: "Per WhatsApp schreiben",
    writeEmail: "E-Mail schreiben",
  },
  disclaimer: {
    title: "Wichtiger Hinweis",
    body:
      "Die Plattform vermittelt nur den Kontakt. Die Ummeldung (Namenswechsel) muss vom Veranstalter bewilligt werden. Reiter/in und Pferd müssen für die Klasse zugelassen sein. Die Plattform wickelt keine Zahlungen ab und garantiert keine Übertragung.",
  },
  biete: {
    title: "Startplatz anbieten",
    intro:
      "Fülle das Formular aus, um deine Nennung weiterzugeben. Pflichtfelder sind mit * markiert.",
    eventSection: "Anlass",
    eventModeExisting: "Vorhandenen Anlass wählen",
    eventModeManual: "Anlass manuell erfassen",
    eventSelect: "Anlass",
    eventSelectPlaceholder: "Anlass auswählen…",
    eventName: "Name des Anlasses",
    eventNamePlaceholder: "z. B. Regionales Springturnier Aarau",
    disciplineSection: "Prüfung",
    discipline: "Disziplin",
    disciplinePlaceholder: "Disziplin auswählen…",
    difficulty: "Klasse",
    difficultyPlaceholder: "Klasse auswählen…",
    difficultyNeedsDiscipline: "Bitte zuerst eine Disziplin wählen.",
    dateFrom: "Datum (von)",
    dateTo: "Datum (bis)",
    priceSection: "Nenngebühr",
    price: "Geforderter Betrag (CHF)",
    originalFee: "Ursprüngliche Nenngebühr (CHF)",
    priceWarning:
      "Achtung: Der geforderte Betrag liegt über der ursprünglichen Nenngebühr. Bitte fair bleiben.",
    locationSection: "Ort",
    canton: "Kanton",
    cantonPlaceholder: "Kanton auswählen…",
    city: "Ort",
    cityPlaceholder: "z. B. Aarau",
    venue: "Anlage / Treffpunkt",
    venuePlaceholder: "z. B. Pferdesportzentrum Aarau",
    note: "Bemerkung (optional)",
    notePlaceholder:
      "z. B. Pferd auch zur Miete verfügbar, Bedingungen der Übergabe …",
    contactSection: "Kontakt",
    contactName: "Name",
    contactMethod: "Bevorzugter Kontakt",
    contactPhone: "Telefon",
    contactWhatsapp: "WhatsApp",
    contactEmail: "E-Mail",
    consent:
      "Ich bin damit einverstanden, dass meine Kontaktdaten öffentlich sichtbar sind.",
    submit: "Startplatz anbieten",
    submitting: "Wird gesendet…",
    successTitle: "Dein Angebot ist online",
    successBody:
      "Vielen Dank! Dein Startplatz ist jetzt für andere sichtbar.",
    viewOffer: "Angebot ansehen",
    viewList: "Zur Übersicht",
  },
  suche: {
    title: "Startplatz suchen",
    intro:
      "Durchsuche verfügbare Startplätze. Filter und Kalenderansicht folgen in Kürze.",
    resultCount: "Angebote gefunden",
  },
  errors: {
    generic: "Es ist ein Fehler aufgetreten. Bitte versuche es erneut.",
    required: "Bitte fülle dieses Feld aus.",
    invalidPrice: "Bitte gib einen gültigen Betrag ein.",
    invalidDate: "Bitte gib ein gültiges Datum ein.",
    invalidEmail: "Bitte gib eine gültige E-Mail-Adresse ein.",
    contactMethodMissing:
      "Bitte gib die Kontaktangabe für die gewählte Methode an.",
    eventMissing: "Bitte wähle einen Anlass oder erfasse einen neuen.",
    consentMissing: "Bitte stimme der öffentlichen Anzeige der Kontaktdaten zu.",
  },
} as const;

export type Messages = typeof de;
