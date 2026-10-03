import Link from "next/link";
import { messages } from "@/i18n";

export function SiteHeader() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex w-full max-w-3xl flex-wrap items-center justify-between gap-2 px-4 py-3">
        <Link href="/" className="text-base font-bold text-green-800">
          {messages.common.appName}
        </Link>
        <nav className="flex items-center gap-4 text-sm font-medium text-gray-700">
          <Link href="/suche" className="hover:text-green-800">
            {messages.nav.search}
          </Link>
          <Link href="/biete" className="hover:text-green-800">
            {messages.nav.offer}
          </Link>
        </nav>
      </div>
    </header>
  );
}
