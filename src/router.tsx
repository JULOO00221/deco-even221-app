import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import { pb } from "./lib/pb";

export interface RouterAuth {
  isAuthenticated: () => boolean;
}

export const getRouter = () => {
  const queryClient = new QueryClient();
  const auth: RouterAuth = {
    isAuthenticated: () => pb.authStore.isValid,
  };

  const router = createRouter({
    routeTree,
    context: { queryClient, auth },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
  });

  return router;
};

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
