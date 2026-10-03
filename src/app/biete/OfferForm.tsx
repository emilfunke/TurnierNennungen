"use client";

import { useActionState, useMemo, useState } from "react";
import { messages } from "@/i18n";
import { parseChfToCents } from "@/lib/format";
import type {
  CantonOption,
  DisciplineOption,
  EventOption,
} from "@/lib/offers/types";
import { createOffer, type CreateOfferState } from "./actions";

type OfferFormProps = {
  disciplines: DisciplineOption[];
  cantons: CantonOption[];
  events: EventOption[];
  warnPriceAboveOriginal: boolean;
};

const inputClass =
  "block w-full rounded-lg border border-gray-300 bg-white px-3 py-3 text-base text-gray-900 " +
  "focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-600/30";

function fieldClass(hasError: boolean): string {
  return hasError
    ? inputClass.replace("border-gray-300", "border-red-500")
    : inputClass;
}

function FieldError({ code }: { code?: string }) {
  if (!code) return null;
  const text =
    messages.errors[code as keyof typeof messages.errors] ?? messages.errors.generic;
  return <p className="mt-1 text-sm text-red-600">{text}</p>;
}

function Label({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="mb-1 block text-sm font-medium text-gray-800">
      {children}
    </label>
  );
}

export function OfferForm({
  disciplines,
  cantons,
  events,
  warnPriceAboveOriginal,
}: OfferFormProps) {
  const [state, formAction, pending] = useActionState<CreateOfferState, FormData>(
    createOffer,
    null,
  );
  const values = state?.values ?? {};
  const errors = state?.fieldErrors ?? {};

  const [mode, setMode] = useState(values.mode ?? "existing");
  const [eventId, setEventId] = useState(values.eventId ?? "");
  const [disciplineId, setDisciplineId] = useState(values.disciplineId ?? "");
  const [difficultyClassId, setDifficultyClassId] = useState(
    values.difficultyClassId ?? "",
  );
  const [eventDate, setEventDate] = useState(values.eventDate ?? "");
  const [eventDateTo, setEventDateTo] = useState(values.eventDateTo ?? "");
  const [cantonId, setCantonId] = useState(values.cantonId ?? "");
  const [cityName, setCityName] = useState(values.cityName ?? "");
  const [venueName, setVenueName] = useState(values.venueName ?? "");
  const [price, setPrice] = useState(values.price ?? "");
  const [originalFee, setOriginalFee] = useState(values.originalFee ?? "");
  const [contactMethod, setContactMethod] = useState(
    values.contactMethod ?? "PHONE",
  );

  const classes = useMemo(() => {
    const discipline = disciplines.find((d) => d.id === disciplineId);
    return discipline?.classes ?? [];
  }, [disciplines, disciplineId]);

  const showPriceWarning = useMemo(() => {
    if (!warnPriceAboveOriginal) return false;
    const priceCents = parseChfToCents(price);
    const originalCents = parseChfToCents(originalFee);
    if (priceCents === null || originalCents === null) return false;
    return priceCents > originalCents;
  }, [warnPriceAboveOriginal, price, originalFee]);

  function handleDisciplineChange(nextId: string) {
    setDisciplineId(nextId);
    setDifficultyClassId("");
  }

  function handleEventChange(nextId: string) {
    setEventId(nextId);
    const event = events.find((e) => e.id === nextId);
    if (!event) return;

    setEventDate(event.dateFrom);
    setEventDateTo(event.dateTo ?? "");
    setCantonId(event.cantonId);
    setCityName(event.cityName ?? "");
    setVenueName(event.venueName ?? "");

    if (event.disciplineSlugs.length === 1) {
      const discipline = disciplines.find(
        (d) => d.slug === event.disciplineSlugs[0],
      );
      if (discipline) {
        setDisciplineId(discipline.id);
        setDifficultyClassId("");
      }
    }
  }

  function handleModeChange(nextMode: string) {
    setMode(nextMode);
    if (nextMode === "manual") {
      setEventId("");
    }
  }

  return (
    <form action={formAction} className="space-y-8">
      <input type="hidden" name="mode" value={mode} />
      <input type="hidden" name="eventId" value={eventId} />

      {/* Anlass */}
      <fieldset className="space-y-4">
        <legend className="text-lg font-semibold text-gray-900">
          {messages.biete.eventSection}
        </legend>

        <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
          <label className="flex items-center gap-2 text-sm text-gray-800">
            <input
              type="radio"
              name="eventModeChoice"
              value="existing"
              checked={mode === "existing"}
              onChange={() => handleModeChange("existing")}
            />
            {messages.biete.eventModeExisting}
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-800">
            <input
              type="radio"
              name="eventModeChoice"
              value="manual"
              checked={mode === "manual"}
              onChange={() => handleModeChange("manual")}
            />
            {messages.biete.eventModeManual}
          </label>
        </div>

        {mode === "existing" ? (
          <div>
            <Label htmlFor="eventId_select">{messages.biete.eventSelect} *</Label>
            <select
              id="eventId_select"
              className={fieldClass(Boolean(errors.eventId))}
              value={eventId}
              onChange={(e) => handleEventChange(e.target.value)}
            >
              <option value="">{messages.biete.eventSelectPlaceholder}</option>
              {events.map((event) => (
                <option key={event.id} value={event.id}>
                  {event.name} ({event.dateFrom})
                </option>
              ))}
            </select>
            <FieldError code={errors.eventId} />
          </div>
        ) : (
          <div>
            <Label htmlFor="eventName">{messages.biete.eventName} *</Label>
            <input
              id="eventName"
              name="eventName"
              type="text"
              className={fieldClass(Boolean(errors.eventName))}
              defaultValue={values.eventName ?? ""}
              placeholder={messages.biete.eventNamePlaceholder}
            />
            <FieldError code={errors.eventName} />
          </div>
        )}
      </fieldset>

      {/* Prüfung */}
      <fieldset className="space-y-4">
        <legend className="text-lg font-semibold text-gray-900">
          {messages.biete.disciplineSection}
        </legend>

        <div>
          <Label htmlFor="disciplineId">{messages.biete.discipline} *</Label>
          <select
            id="disciplineId"
            name="disciplineId"
            className={fieldClass(Boolean(errors.disciplineId))}
            value={disciplineId}
            onChange={(e) => handleDisciplineChange(e.target.value)}
          >
            <option value="">{messages.biete.disciplinePlaceholder}</option>
            {disciplines.map((discipline) => (
              <option key={discipline.id} value={discipline.id}>
                {discipline.name}
              </option>
            ))}
          </select>
          <FieldError code={errors.disciplineId} />
        </div>

        <div>
          <Label htmlFor="difficultyClassId">{messages.biete.difficulty} *</Label>
          <select
            id="difficultyClassId"
            name="difficultyClassId"
            className={fieldClass(Boolean(errors.difficultyClassId))}
            value={difficultyClassId}
            onChange={(e) => setDifficultyClassId(e.target.value)}
            disabled={classes.length === 0}
          >
            <option value="">
              {classes.length === 0
                ? messages.biete.difficultyNeedsDiscipline
                : messages.biete.difficultyPlaceholder}
            </option>
            {classes.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.name}
              </option>
            ))}
          </select>
          <FieldError code={errors.difficultyClassId} />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="eventDate">{messages.biete.dateFrom} *</Label>
            <input
              id="eventDate"
              name="eventDate"
              type="date"
              className={fieldClass(Boolean(errors.eventDate))}
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
            />
            <FieldError code={errors.eventDate} />
          </div>
          <div>
            <Label htmlFor="eventDateTo">
              {messages.biete.dateTo} ({messages.common.optional})
            </Label>
            <input
              id="eventDateTo"
              name="eventDateTo"
              type="date"
              className={fieldClass(Boolean(errors.eventDateTo))}
              value={eventDateTo}
              onChange={(e) => setEventDateTo(e.target.value)}
            />
            <FieldError code={errors.eventDateTo} />
          </div>
        </div>
      </fieldset>

      {/* Nenngebühr */}
      <fieldset className="space-y-4">
        <legend className="text-lg font-semibold text-gray-900">
          {messages.biete.priceSection}
        </legend>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="price">{messages.biete.price} *</Label>
            <input
              id="price"
              name="price"
              type="text"
              inputMode="decimal"
              className={fieldClass(Boolean(errors.price))}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="80"
            />
            <FieldError code={errors.price} />
          </div>
          <div>
            <Label htmlFor="originalFee">
              {messages.biete.originalFee} ({messages.common.optional})
            </Label>
            <input
              id="originalFee"
              name="originalFee"
              type="text"
              inputMode="decimal"
              className={fieldClass(Boolean(errors.originalFee))}
              value={originalFee}
              onChange={(e) => setOriginalFee(e.target.value)}
              placeholder="80"
            />
            <FieldError code={errors.originalFee} />
          </div>
        </div>

        {showPriceWarning ? (
          <p className="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">
            {messages.biete.priceWarning}
          </p>
        ) : null}
      </fieldset>

      {/* Ort */}
      <fieldset className="space-y-4">
        <legend className="text-lg font-semibold text-gray-900">
          {messages.biete.locationSection}
        </legend>

        <div>
          <Label htmlFor="cantonId">{messages.biete.canton} *</Label>
          <select
            id="cantonId"
            name="cantonId"
            className={fieldClass(Boolean(errors.cantonId))}
            value={cantonId}
            onChange={(e) => setCantonId(e.target.value)}
          >
            <option value="">{messages.biete.cantonPlaceholder}</option>
            {cantons.map((canton) => (
              <option key={canton.id} value={canton.id}>
                {canton.name} ({canton.regionName})
              </option>
            ))}
          </select>
          <FieldError code={errors.cantonId} />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="cityName">
              {messages.biete.city} ({messages.common.optional})
            </Label>
            <input
              id="cityName"
              name="cityName"
              type="text"
              className={fieldClass(Boolean(errors.cityName))}
              value={cityName}
              onChange={(e) => setCityName(e.target.value)}
              placeholder={messages.biete.cityPlaceholder}
            />
            <FieldError code={errors.cityName} />
          </div>
          <div>
            <Label htmlFor="venueName">
              {messages.biete.venue} ({messages.common.optional})
            </Label>
            <input
              id="venueName"
              name="venueName"
              type="text"
              className={fieldClass(Boolean(errors.venueName))}
              value={venueName}
              onChange={(e) => setVenueName(e.target.value)}
              placeholder={messages.biete.venuePlaceholder}
            />
            <FieldError code={errors.venueName} />
          </div>
        </div>
      </fieldset>

      {/* Bemerkung */}
      <div>
        <Label htmlFor="note">{messages.biete.note}</Label>
        <textarea
          id="note"
          name="note"
          rows={3}
          className={fieldClass(Boolean(errors.note))}
          defaultValue={values.note ?? ""}
          placeholder={messages.biete.notePlaceholder}
        />
        <FieldError code={errors.note} />
      </div>

      {/* Kontakt */}
      <fieldset className="space-y-4">
        <legend className="text-lg font-semibold text-gray-900">
          {messages.biete.contactSection}
        </legend>

        <div>
          <Label htmlFor="contactName">{messages.biete.contactName} *</Label>
          <input
            id="contactName"
            name="contactName"
            type="text"
            className={fieldClass(Boolean(errors.contactName))}
            defaultValue={values.contactName ?? ""}
          />
          <FieldError code={errors.contactName} />
        </div>

        <div>
          <Label htmlFor="contactMethod">{messages.biete.contactMethod} *</Label>
          <select
            id="contactMethod"
            name="contactMethod"
            className={fieldClass(Boolean(errors.contactMethod))}
            value={contactMethod}
            onChange={(e) => setContactMethod(e.target.value)}
          >
            <option value="PHONE">{messages.contact.phone}</option>
            <option value="WHATSAPP">{messages.contact.whatsapp}</option>
            <option value="EMAIL">{messages.contact.email}</option>
          </select>
          <FieldError code={errors.contactMethod} />
        </div>

        <div>
          <Label htmlFor="contactPhone">{messages.biete.contactPhone}</Label>
          <input
            id="contactPhone"
            name="contactPhone"
            type="tel"
            className={fieldClass(Boolean(errors.contactPhone))}
            defaultValue={values.contactPhone ?? ""}
          />
          <FieldError code={errors.contactPhone} />
        </div>

        <div>
          <Label htmlFor="contactWhatsapp">{messages.biete.contactWhatsapp}</Label>
          <input
            id="contactWhatsapp"
            name="contactWhatsapp"
            type="tel"
            className={fieldClass(Boolean(errors.contactWhatsapp))}
            defaultValue={values.contactWhatsapp ?? ""}
          />
          <FieldError code={errors.contactWhatsapp} />
        </div>

        <div>
          <Label htmlFor="contactEmail">{messages.biete.contactEmail}</Label>
          <input
            id="contactEmail"
            name="contactEmail"
            type="email"
            className={fieldClass(Boolean(errors.contactEmail))}
            defaultValue={values.contactEmail ?? ""}
          />
          <FieldError code={errors.contactEmail} />
        </div>

        <label className="flex items-start gap-2 text-sm text-gray-800">
          <input type="checkbox" name="consent" className="mt-1" />
          <span>
            {messages.biete.consent} *
            <FieldError code={errors.consent} />
          </span>
        </label>
      </fieldset>

      <p className="rounded-lg bg-gray-100 px-3 py-3 text-sm text-gray-700">
        <strong>{messages.disclaimer.title}:</strong> {messages.disclaimer.body}
      </p>

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-green-700 px-4 py-3 text-base font-semibold text-white hover:bg-green-800 disabled:opacity-60 sm:w-auto"
      >
        {pending ? messages.biete.submitting : messages.biete.submit}
      </button>
    </form>
  );
}
