import { de, type Messages } from "./de";

/**
 * i18n entry point.
 *
 * German is the only implemented locale for now. French and Italian can be
 * added by creating fr.ts / it.ts with the same shape and selecting the bundle
 * here based on a user preference.
 */
export const locales = ["de", "fr", "it"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "de";

const bundles: Partial<Record<Locale, Messages>> = {
  de,
};

export function getMessages(locale: Locale = defaultLocale): Messages {
  return bundles[locale] ?? de;
}

/** The active messages bundle, for direct import in components. */
export const messages = de;
