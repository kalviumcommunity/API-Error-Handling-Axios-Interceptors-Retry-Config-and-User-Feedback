import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import apiClient from "../services/apiClient";

// Plain service calls — no try/catch, no error handling here.
// Global concerns (401, 5xx, retry) live in the shared layer.
const getThreads = () => apiClient.get("/threads").then((r) => r.data);
const getFlaky = () => apiClient.get("/flaky").then((r) => r.data);

export default function App() {
  const [showFlaky, setShowFlaky] = useState(false);

  const threads = useQuery({ queryKey: ["threads"], queryFn: getThreads });

  // Only runs when the button is pressed. /flaky fails once then succeeds,
  // so with retry: 1 you should see two requests, then success.
  const flaky = useQuery({
    queryKey: ["flaky"],
    queryFn: getFlaky,
    enabled: showFlaky,
  });

  return (
    <main>
      <h1>Thread Feed</h1>

      {threads.isPending && <p>Loading threads…</p>}
      {threads.isError && <p role="alert">Could not load threads.</p>}
      <ul>
        {threads.data?.map((t) => (
          <li key={t.id}>{t.title}</li>
        ))}
      </ul>

      <section className="tests">
        <h2>Test the shared layer</h2>
        <div className="buttons">
          {/* These fire through apiClient, so the interceptor runs. */}
          <button onClick={() => apiClient.get("/unauthorized")}>
            Trigger 401 (redirect to /login)
          </button>
          <button onClick={() => apiClient.get("/broken")}>
            Trigger 500 (global message)
          </button>
          <button onClick={() => setShowFlaky(true)}>
            Load flaky data (retry)
          </button>
        </div>

        {showFlaky && flaky.isPending && <p>Loading flaky data…</p>}
        {showFlaky && flaky.isError && (
          <p role="alert">Flaky request failed even after retry.</p>
        )}
        {showFlaky && flaky.data && <p>✅ {flaky.data.message}</p>}
      </section>
    </main>
  );
}
