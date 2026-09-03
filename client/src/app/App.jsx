import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import apiClient from "../services/apiClient";

const getThreads = () => apiClient.get("/threads").then((r) => r.data);
const getFlaky = () => apiClient.get("/flaky").then((r) => r.data);
const getBroken = () => apiClient.get("/broken").then((r) => r.data);

export default function App() {
  const [showFlaky, setShowFlaky] = useState(false);
  const [showBroken, setShowBroken] = useState(false);

  const threads = useQuery({ queryKey: ["threads"], queryFn: getThreads });

  const flaky = useQuery({
    queryKey: ["flaky"],
    queryFn: getFlaky,
    enabled: showFlaky,
  });

  const broken = useQuery({
    queryKey: ["broken", showBroken],
    queryFn: getBroken,
    enabled: showBroken,
  });

  return (
    <main>
      <h1>Thread Feed</h1>
      {threads.isPending && <p>Loading threads...</p>}
      {threads.isError && <p role="alert">Could not load threads.</p>}
      <ul>
        {threads.data?.map((t) => (
          <li key={t.id}>{t.title}</li>
        ))}
      </ul>
      <section className="tests">
        <h2>Test the shared layer</h2>
        <div className="buttons">
          <button onClick={() => apiClient.get("/unauthorized")}>
            Trigger 401 (redirect to /login)
          </button>
          <button onClick={() => setShowBroken(true)}>
            Trigger 500 (global message)
          </button>
          <button onClick={() => setShowFlaky(true)}>
            Load flaky data (retry)
          </button>
        </div>
        {showBroken && broken.isPending && <p>Loading...</p>}
        {showBroken && broken.isError && (
          <p role="alert">Server error - please try again later.</p>
        )}
        {showFlaky && flaky.isPending && <p>Loading flaky data...</p>}
        {showFlaky && flaky.isError && (
          <p role="alert">Flaky request failed even after retry.</p>
        )}
        {showFlaky && flaky.data && <p>Recovered: {flaky.data.message}</p>}
      </section>
    </main>
  );
}