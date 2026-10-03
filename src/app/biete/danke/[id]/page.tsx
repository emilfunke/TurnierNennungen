import Link from "next/link";
import { messages } from "@/i18n";

export const dynamic = "force-dynamic";

export default async function DankePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="space-y-6 text-center">
      <h1 className="text-2xl font-bold text-gray-900">
        {messages.biete.successTitle}
      </h1>
      <p className="text-base text-gray-600">{messages.biete.successBody}</p>
      <div className="flex flex-col justify-center gap-3 sm:flex-row">
        <Link
          href={`/suche/${id}`}
          className="rounded-lg bg-green-700 px-4 py-3 text-base font-semibold text-white hover:bg-green-800"
        >
          {messages.biete.viewOffer}
        </Link>
        <Link
          href="/suche"
          className="rounded-lg border border-green-700 px-4 py-3 text-base font-semibold text-green-800 hover:bg-green-50"
        >
          {messages.biete.viewList}
        </Link>
      </div>
    </div>
  );
}
