import { QueryClient } from "@tanstack/react-query";

// TODO 3 — Configure the retry policy for all queries.
// - retry: 1  (one automatic retry after the first failure)
// - retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30000)
//   (exponential backoff, capped at 30 seconds)
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // add retry and retryDelay here
    },
  },
});
