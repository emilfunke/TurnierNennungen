import Link from "next/link";
import { messages } from "@/i18n";
import { formatChf, formatDateRange } from "@/lib/format";
import { listActiveOffers } from "@/lib/offers/queries";

export const dynamic = "force-dynamic";

export const metadata = {
  title: `${messages.suche.title} – ${messages.common.appName}`,
};

export default async function SuchePage() {
  const offers = await listActiveOffers();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{messages.suche.title}</h1>
        <p className="mt-2 text-sm text-gray-600">{messages.suche.intro}</p>
      </div>

      {offers.length === 0 ? (
        <p className="rounded-xl border border-gray-200 bg-white p-4 text-sm text-gray-600">
          {messages.offer.empty}
        </p>
      ) : (
        <>
          <p className="text-sm text-gray-500">
            {offers.length} {messages.suche.resultCount}
          </p>
          <ul className="space-y-3">
            {offers.map((offer) => {
              const location = [
                offer.event.venue?.name,
                offer.event.city?.name,
                offer.event.canton.name,
              ]
                .filter(Boolean)
                .join(", ");

              return (
                <li key={offer.id}>
                  <Link
                    href={`/suche/${offer.id}`}
                    className="block rounded-xl border border-gray-200 bg-white p-4 hover:border-green-600"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <h2 className="text-base font-semibold text-gray-900">
                        {offer.event.name}
                      </h2>
                      <span className="whitespace-nowrap text-sm font-semibold text-gray-900">
                        {formatChf(offer.priceCents)}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-600">
                      {formatDateRange(offer.event.dateFrom, offer.event.dateTo)} ·{" "}
                      {location}
                    </p>
                    <p className="mt-1 text-sm text-gray-600">
                      {offer.discipline.name} · {offer.difficultyClass.name}
                    </p>
                  </Link>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </div>
  );
}
