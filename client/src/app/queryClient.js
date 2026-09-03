import { QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Retry a failed query only once
      retry: 1,

      // Exponential backoff:
      // attempt 0 → 1 second
      // attempt 1 → 2 seconds
      // attempt 2 → 4 seconds
      // etc.
      // Maximum delay = 30 seconds
      retryDelay: (attempt) =>
        Math.min(1000 * 2 ** attempt, 30000),
    },
  },
});

export default queryClient;