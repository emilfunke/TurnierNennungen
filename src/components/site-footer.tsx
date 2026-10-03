import { messages } from "@/i18n";

export function SiteFooter() {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="mx-auto w-full max-w-3xl px-4 py-6 text-xs text-gray-500">
        <p className="mb-2">
          <strong className="text-gray-700">{messages.disclaimer.title}:</strong>{" "}
          {messages.disclaimer.body}
        </p>
        <p>
          {messages.common.appName} · Version 1 · {messages.common.tagline}
        </p>
      </div>
    </footer>
  );
}
