import { createFileRoute } from "@tanstack/react-router";

import { ClientsPage } from "./clients";

export const Route = createFileRoute(
  "/_authenticated/clients/"
)({
  component: ClientsPage,
});