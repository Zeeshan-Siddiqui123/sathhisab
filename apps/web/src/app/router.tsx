import { createBrowserRouter } from "react-router-dom";
import { PlaceholderPage } from "./PlaceholderPage";
import { NotFoundPage } from "./NotFoundPage";

export const router = createBrowserRouter([
  ...(import.meta.env.DEV ? [{ path: "/_playground/:section?", lazy: async () => ({ Component: (await import("../playground/PlaygroundPage")).default }) }] : []),
  { path: "/", element: <PlaceholderPage /> },
  { path: "*", element: <NotFoundPage /> },
]);
