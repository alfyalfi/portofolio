export const locales = ["en", "id"] as const;

export type AppLocale = (typeof locales)[number];

/**
 * Served when there is no language cookie and no matching Accept-Language,
 * which is how search engines and link-preview bots request the page. Every
 * language shares the same URL, so this is the only language they index.
 */
export const defaultLocale: AppLocale = "en";

/** Remembers the language picked with the EN/ID switch (or an old /en, /id link). */
export const localeCookie = "i18nlang";
export const localeCookieMaxAge = 60 * 60 * 24 * 180;

export const isLocale = (value: string | undefined): value is AppLocale =>
  locales.includes(value as AppLocale);
