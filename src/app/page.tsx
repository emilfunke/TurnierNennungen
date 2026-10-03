import Link from "next/link";
import { messages } from "@/i18n";

export default function HomePage() {
  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          {messages.home.title}
        </h1>
        <p className="mt-3 text-base text-gray-600">{messages.home.subtitle}</p>
        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/suche"
            className="rounded-lg bg-green-700 px-4 py-3 text-center text-base font-semibold text-white hover:bg-green-800"
          >
            {messages.home.ctaSearch}
          </Link>
          <Link
            href="/biete"
            className="rounded-lg border border-green-700 px-4 py-3 text-center text-base font-semibold text-green-800 hover:bg-green-50"
          >
            {messages.home.ctaOffer}
          </Link>
        </div>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-4">
        <h2 className="text-lg font-semibold text-gray-900">
          {messages.home.howItWorksTitle}
        </h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-gray-700">
          <li>{messages.home.stepSearch}</li>
          <li>{messages.home.stepContact}</li>
          <li>{messages.home.stepTransfer}</li>
        </ol>
      </section>
    </div>
  );
}
