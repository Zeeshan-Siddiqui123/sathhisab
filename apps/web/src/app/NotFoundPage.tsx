import { Link } from "react-router-dom";
import { strings } from "../lib/strings";

export function NotFoundPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-4 p-6 text-center">
      <h1 className="text-4xl font-bold">404</h1>
      <p>{strings.foundation.notFound}</p>
      <Link to="/" className="underline min-h-11">{strings.foundation.home}</Link>
    </main>
  );
}
