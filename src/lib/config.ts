/**
 * Application-wide configuration.
 *
 * Feature flags are read from environment variables so behaviour can change
 * without a code change. See .env for the local defaults.
 */
export const appConfig = {
  appName: "Startplatz-Börse",
  /**
   * When true, the offer form warns if the asking price is above the original
   * entry fee. This is a soft nudge to discourage profiteering, never a block.
   */
  warnPriceAboveOriginal:
    (process.env.WARN_PRICE_ABOVE_ORIGINAL ?? "true").toLowerCase() !== "false",
} as const;
