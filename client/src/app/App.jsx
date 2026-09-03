import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import apiClient from "../services/apiClient";

// Plain service calls.
// No try/catch here — errors are handled by the shared API layer.
const getThreads = () =>
  apiClient.get("/threads").then((response) => response.data);

const getFlaky = () =>
  apiClient.get("/flaky").then((response) => response.data);

export default function App() {
  const [showFlaky, setShowFlaky] = useState(false);

  // Load threads immediately.
  const threads = useQuery({
    queryKey: ["threads"],
    queryFn: getThreads,
  });

  // Only runs after the button is pressed.
  const flaky = useQuery({
    queryKey: ["flaky"],
    queryFn: getFlaky,
    enabled: showFlaky,
  });

  return (
    <main>
      <h1>Thread Feed</h1>

      {/* Threads loading state */}
      {threads.isPending && <p>Loading threads...</p>}

      {/* Threads error state */}
      {threads.isError && (
        <p role="alert">Could not load threads.</p>
      )}

      {/* Threads data */}
      <ul>
        {threads.data?.map((thread) => (
          <li key={thread.id}>{thread.title}</li>
        ))}
      </ul>

      <section className="tests">
        <h2>Test the shared layer</h2>

        <div className="buttons">
          {/* 401 test */}
          <button onClick={() => apiClient.get("/unauthorized")}>
            Trigger 401 (redirect to /login)
          </button>

          {/* 500 test */}
          <button onClick={() => apiClient.get("/broken")}>
            Trigger 500 (global message)
          </button>

          {/* Flaky request */}
          <button onClick={() => setShowFlaky(true)}>
            Load flaky data (retry)
          </button>
        </div>

        {/* Flaky loading */}
        {showFlaky && flaky.isPending && (
          <p>Loading flaky data...</p>
        )}

        {/* Flaky error */}
        {showFlaky && flaky.isError && (
          <p role="alert">
            Flaky request failed even after retry.
          </p>
        )}

        {/* Flaky success */}
        {showFlaky && flaky.data && (
          <p>✅ {flaky.data.message}</p>
        )}
      </section>
    </main>
  );
}