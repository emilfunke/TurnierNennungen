import Link from "next/link";
import { notFound } from "next/navigation";
import { messages } from "@/i18n";
import { getContactService } from "@/lib/contact/contact-service";
import { formatChf, formatDateRange } from "@/lib/format";
import { getOfferById } from "@/lib/offers/queries";
import { ContactReveal } from "./ContactReveal";

export const dynamic = "force-dynamic";

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-4 border-b border-gray-100 py-2 last:border-b-0">
      <dt className="text-sm text-gray-500">{label}</dt>
      <dd className="text-right text-sm font-medium text-gray-900">{value}</dd>
    </div>
  );
}

export default async function OfferDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const offer = await getOfferById(id);

  if (!offer) notFound();

  const details = getContactService().getContact(
    {
      contactName: offer.contactName,
      contactMethod: offer.contactMethod,
      contactPhone: offer.contactPhone,
      contactWhatsapp: offer.contactWhatsapp,
      contactEmail: offer.contactEmail,
    },
    { isAuthenticated: false },
  );

  const location = [
    offer.event.venue?.name,
    offer.event.city?.name,
    offer.event.canton.name,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="space-y-6">
      <Link href="/suche" className="text-sm font-medium text-green-800 underline">
        ← {messages.nav.search}
      </Link>

      <div>
        <div className="flex items-start justify-between gap-3">
          <h1 className="text-2xl font-bold text-gray-900">{offer.event.name}</h1>
          <span className="whitespace-nowrap rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-800">
            {messages.status[offer.status]}
          </span>
        </div>
        <p className="mt-1 text-sm text-gray-600">
          {offer.discipline.name} · {offer.difficultyClass.name}
        </p>
      </div>

      <dl className="rounded-xl border border-gray-200 bg-white p-4">
        <Row
          label={messages.offer.date}
          value={formatDateRange(offer.event.dateFrom, offer.event.dateTo)}
        />
        <Row label={messages.offer.location} value={location} />
        <Row label={messages.offer.price} value={formatChf(offer.priceCents)} />
        {offer.originalFeeCents !== null ? (
          <Row
            label={messages.offer.originalFee}
            value={formatChf(offer.originalFeeCents)}
          />
        ) : null}
        {offer.event.organiser ? (
          <Row label={messages.offer.organiser} value={offer.event.organiser} />
        ) : null}
        {offer.note ? <Row label={messages.offer.note} value={offer.note} /> : null}
      </dl>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-gray-900">
          {messages.contact.title}
        </h2>
        <p className="text-sm text-gray-600">{messages.contact.intro}</p>
        <ContactReveal details={details} />
      </section>

      <p className="rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-900">
        <strong>{messages.disclaimer.title}:</strong> {messages.disclaimer.body}
      </p>
    </div>
  );
}
