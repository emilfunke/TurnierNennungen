import { messages } from "@/i18n";
import {
  getCantonOptions,
  getCityOptions,
  getDisciplineOptions,
  getOfferListItems,
  getRegionOptions,
  getVenueOptions,
} from "@/lib/offers/queries";
import { OfferExplorer } from "./OfferExplorer";

export const dynamic = "force-dynamic";

export const metadata = {
  title: `${messages.suche.title} – ${messages.common.appName}`,
};

export default async function SuchePage() {
  const [offers, disciplines, regions, cantons, cities, venues] = await Promise.all([
    getOfferListItems(),
    getDisciplineOptions(),
    getRegionOptions(),
    getCantonOptions(),
    getCityOptions(),
    getVenueOptions(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{messages.suche.title}</h1>
        <p className="mt-2 text-sm text-gray-600">{messages.suche.intro}</p>
      </div>
      <OfferExplorer
        offers={offers}
        disciplines={disciplines}
        regions={regions}
        cantons={cantons}
        cities={cities}
        venues={venues}
      />
    </div>
  );
}
