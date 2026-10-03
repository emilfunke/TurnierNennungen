import { messages } from "@/i18n";
import { appConfig } from "@/lib/config";
import {
  getCantonOptions,
  getDisciplineOptions,
  getEventOptions,
} from "@/lib/offers/queries";
import { OfferForm } from "./OfferForm";

export const dynamic = "force-dynamic";

export const metadata = {
  title: `${messages.biete.title} – ${messages.common.appName}`,
};

export default async function BietePage() {
  const [disciplines, cantons, events] = await Promise.all([
    getDisciplineOptions(),
    getCantonOptions(),
    getEventOptions(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{messages.biete.title}</h1>
        <p className="mt-2 text-sm text-gray-600">{messages.biete.intro}</p>
      </div>
      <OfferForm
        disciplines={disciplines}
        cantons={cantons}
        events={events}
        warnPriceAboveOriginal={appConfig.warnPriceAboveOriginal}
      />
    </div>
  );
}
