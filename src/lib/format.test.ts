import { describe, expect, it } from "vitest";
import { formatChf, parseChfToCents, parseDateOnly } from "./format";

describe("parseChfToCents", () => {
  it("parses whole and decimal amounts", () => {
    expect(parseChfToCents("80")).toBe(8000);
    expect(parseChfToCents("80.50")).toBe(8050);
    expect(parseChfToCents("80,50")).toBe(8050);
    expect(parseChfToCents("CHF 120")).toBe(12000);
  });

  it("rejects invalid input", () => {
    expect(parseChfToCents("")).toBeNull();
    expect(parseChfToCents("abc")).toBeNull();
    expect(parseChfToCents("-5")).toBeNull();
    expect(parseChfToCents("1.234")).toBeNull();
  });
});

describe("formatChf", () => {
  it("formats cents as a CHF amount", () => {
    expect(formatChf(8000)).toContain("80");
    expect(formatChf(8050)).toContain("80.50");
  });
});

describe("parseDateOnly", () => {
  it("anchors a date-only value at noon UTC", () => {
    expect(parseDateOnly("2026-06-14")?.toISOString()).toBe(
      "2026-06-14T12:00:00.000Z",
    );
  });

  it("rejects non date-only input", () => {
    expect(parseDateOnly("14.06.2026")).toBeNull();
    expect(parseDateOnly("")).toBeNull();
  });
});
