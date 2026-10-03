"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { messages } from "@/i18n";
import { formatChf, formatDateRange, parseDateOnly } from "@/lib/format";
import { matchesOfferFilter, type OfferFilter } from "@/lib/offers/filter";
import type {
  CantonOption,
  CityOption,
  DisciplineOption,
  OfferListItem,
  RegionOption,
  VenueOption,
} from "@/lib/offers/types";

type OfferExplorerProps = {
  offers: OfferListItem[];
  disciplines: DisciplineOption[];
  regions: RegionOption[];
  cantons: CantonOption[];
  cities: CityOption[];
  venues: VenueOption[];
};

const inputClass =
  "block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 " +
  "focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-600/30";

type LocationValue = { kind: "region" | "canton" | "city" | "venue"; id: string };

/** Parses a location select value like "canton:<id>" into its kind and id. */
function parseLocationValue(value: string): LocationValue | null {
  if (!value) return null;
  const [kind, id] = value.split(":");
  if (
    kind === "region" ||
    kind === "canton" ||
    kind === "city" ||
    kind === "venue"
  ) {
    return { kind, id };
  }
  return null;
}

export function OfferExplorer({
  offers,
  disciplines,
  regions,
  cantons,
  cities,
  venues,
}: OfferExplorerProps) {
  const [disciplineId, setDisciplineId] = useState("");
  const [difficultyClassId, setDifficultyClassId] = useState("");
  const [location, setLocation] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // Only offer cities/venues that actually occur, to keep the list short.
  const availableCities = useMemo(() => {
    const ids = new Set(offers.map((o) => o.cityId).filter(Boolean));
    return cities.filter((city) => ids.has(city.id));
  }, [offers, cities]);

  const availableVenues = useMemo(() => {
    const ids = new Set(offers.map((o) => o.venueId).filter(Boolean));
    return venues.filter((venue) => ids.has(venue.id));
  }, [offers, venues]);

  const classes = useMemo(() => {
    if (!disciplineId) return [];
    return disciplines.find((d) => d.id === disciplineId)?.classes ?? [];
  }, [disciplines, disciplineId]);

  const filter = useMemo<OfferFilter>(() => {
    const selected = parseLocationValue(location);
    const from = dateFrom ? parseDateOnly(dateFrom) : null;
    const to = dateTo ? parseDateOnly(dateTo) : null;
    return {
      disciplineId: disciplineId || undefined,
      difficultyClassId: difficultyClassId || undefined,
      regionId: selected?.kind === "region" ? selected.id : undefined,
      cantonId: selected?.kind === "canton" ? selected.id : undefined,
      cityId: selected?.kind === "city" ? selected.id : undefined,
      venueId: selected?.kind === "venue" ? selected.id : undefined,
      dateFrom: from ?? undefined,
      dateTo: to ?? undefined,
    };
  }, [disciplineId, difficultyClassId, location, dateFrom, dateTo]);

  const filtered = useMemo(
    () => offers.filter((offer) => matchesOfferFilter(offer, filter)),
    [offers, filter],
  );

  const hasActiveFilter = Boolean(
    disciplineId || difficultyClassId || location || dateFrom || dateTo,
  );

  function handleDisciplineChange(value: string) {
    setDisciplineId(value);
    setDifficultyClassId("");
  }

  function reset() {
    setDisciplineId("");
    setDifficultyClassId("");
    setLocation("");
    setDateFrom("");
    setDateTo("");
  }

  return (
    <div className="space-y-5">
      <section className="rounded-xl border border-gray-200 bg-white p-4">
        <h2 className="mb-3 text-sm font-semibold text-gray-900">
          {messages.filter.title}
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label htmlFor="filterDiscipline" className="mb-1 block text-xs text-gray-600">
              {messages.filter.discipline}
            </label>
            <select
              id="filterDiscipline"
              className={inputClass}
              value={disciplineId}
              onChange={(e) => handleDisciplineChange(e.target.value)}
            >
              <option value="">{messages.filter.allDisciplines}</option>
              {disciplines.map((discipline) => (
                <option key={discipline.id} value={discipline.id}>
                  {discipline.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="filterClass" className="mb-1 block text-xs text-gray-600">
              {messages.filter.difficulty}
            </label>
            <select
              id="filterClass"
              className={inputClass}
              value={difficultyClassId}
              onChange={(e) => setDifficultyClassId(e.target.value)}
              disabled={classes.length === 0}
            >
              <option value="">{messages.filter.allClasses}</option>
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="filterLocation" className="mb-1 block text-xs text-gray-600">
              {messages.filter.location}
            </label>
            <select
              id="filterLocation"
              className={inputClass}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            >
              <option value="">{messages.filter.allLocations}</option>
              <optgroup label={messages.filter.groupRegions}>
                {regions.map((region) => (
                  <option key={region.id} value={`region:${region.id}`}>
                    {region.name}
                  </option>
                ))}
              </optgroup>
              <optgroup label={messages.filter.groupCantons}>
                {cantons.map((canton) => (
                  <option key={canton.id} value={`canton:${canton.id}`}>
                    {canton.name}
                  </option>
                ))}
              </optgroup>
              {availableCities.length > 0 ? (
                <optgroup label={messages.filter.groupCities}>
                  {availableCities.map((city) => (
                    <option key={city.id} value={`city:${city.id}`}>
                      {city.name}
                    </option>
                  ))}
                </optgroup>
              ) : null}
              {availableVenues.length > 0 ? (
                <optgroup label={messages.filter.groupVenues}>
                  {availableVenues.map((venue) => (
                    <option key={venue.id} value={`venue:${venue.id}`}>
                      {venue.name}
                    </option>
                  ))}
                </optgroup>
              ) : null}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="filterFrom" className="mb-1 block text-xs text-gray-600">
                {messages.filter.dateFrom}
              </label>
              <input
                id="filterFrom"
                type="date"
                className={inputClass}
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="filterTo" className="mb-1 block text-xs text-gray-600">
                {messages.filter.dateTo}
              </label>
              <input
                id="filterTo"
                type="date"
                className={inputClass}
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>
          </div>
        </div>

        {hasActiveFilter ? (
          <button
            type="button"
            onClick={reset}
            className="mt-3 text-sm font-medium text-green-800 underline"
          >
            {messages.filter.reset}
          </button>
        ) : null}
      </section>

      <p className="text-sm text-gray-500">
        {filtered.length} {messages.suche.resultCount}
      </p>

      {filtered.length === 0 ? (
        <p className="rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-600">
          {hasActiveFilter ? messages.filter.noResults : messages.offer.empty}
        </p>
      ) : (
        <ul className="space-y-3">
          {filtered.map((offer) => (
            <li key={offer.id}>
              <Link
                href={`/suche/${offer.id}`}
                className="block rounded-xl border border-gray-200 bg-white p-4 hover:border-green-600"
              >
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-base font-semibold text-gray-900">
                    {offer.eventName}
                  </h2>
                  <span className="whitespace-nowrap text-sm font-semibold text-gray-900">
                    {formatChf(offer.priceCents)}
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-600">
                  {formatDateRange(offer.dateFrom, offer.dateTo)} · {offer.locationLabel}
                </p>
                <p className="mt-1 text-sm text-gray-600">
                  {offer.disciplineName} · {offer.difficultyClassName}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
