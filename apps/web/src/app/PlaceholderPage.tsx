import { useQuery } from "@tanstack/react-query";
import { useTheme } from "./providers";
import { api } from "../lib/api";
import { formatPKR } from "../lib/money";
import { strings } from "../lib/strings";

interface HealthResponse {
  status: string;
  environment: string;
  timestamp: string;
}

export function PlaceholderPage() {
  const { theme, toggleTheme } = useTheme();
  const health = useQuery({
    queryKey: ["health"],
    queryFn: () => api.get<HealthResponse>("/health"),
    retry: false,
  });

  return (
    <main className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-background text-foreground">
      <section className="max-w-md w-full bg-surface border border-border rounded-card p-6 shadow-sm">
        <header className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold font-display">{strings.app.name}</h1>
            <p className="text-sm text-muted">{strings.app.tagline}</p>
          </div>
          <button
            type="button"
            id="theme-toggle-btn"
            onClick={toggleTheme}
            aria-label={strings.foundation.toggleTheme}
            aria-pressed={theme === "dark"}
            className="min-h-11 px-4 rounded-input border border-border text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
          >
            {theme === "light" ? strings.foundation.dark : strings.foundation.light}
          </button>
        </header>
        <div className="space-y-4">
          <div className="p-4 rounded-input border border-border">
            <h2 className="text-lg font-semibold font-display">{strings.foundation.title}</h2>
            <p className="text-sm text-muted mt-2">{strings.foundation.description}</p>
          </div>
          <div className="p-4 rounded-input border border-border">
            <h2 className="text-sm text-muted">{strings.foundation.moneyLabel}</h2>
            <p className="text-2xl font-bold font-display tabular-nums">{formatPKR(600000)}</p>
          </div>
          <div className="p-4 rounded-input border border-border" role="status">
            <h2 className="text-sm text-muted mb-2">{strings.foundation.apiLabel}</h2>
            {health.isPending ? <p>{strings.foundation.checking}</p> :
              health.data?.status === "ok" ? <p>{strings.foundation.connected} ({health.data.environment})</p> :
                <div>
                  <p>{strings.foundation.offline}</p>
                  <button type="button" onClick={() => void health.refetch()} className="min-h-11 underline">
                    {strings.common.retry}
                  </button>
                </div>}
          </div>
          <p className="text-sm text-muted">{strings.foundation.next}</p>
        </div>
      </section>
    </main>
  );
}
