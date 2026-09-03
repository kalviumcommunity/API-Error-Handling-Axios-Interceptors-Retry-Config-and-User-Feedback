import { QueryClient } from "@tanstack/react-query";

// Configure the retry policy for all queries.
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Retry a failed query only once.
      retry: 1,

      // Exponential backoff, capped at 30 seconds.
      retryDelay: (attempt) =>
        Math.min(1000 * 2 ** attempt, 30000),
    },
  },
});
