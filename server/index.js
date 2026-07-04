const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const threads = [
  { id: 1, title: "Welcome to the forum", body: "Say hello here." },
  { id: 2, title: "Posting rules", body: "Be kind and stay on topic." },
];

// Normal, stable endpoint.
app.get("/api/threads", (req, res) => {
  res.json(threads);
});

// Always returns 401 — use it to test the interceptor's redirect to /login.
app.get("/api/unauthorized", (req, res) => {
  res.status(401).json({ error: "No token provided" });
});

// Always returns 500 — use it to test the interceptor's global message.
app.get("/api/broken", (req, res) => {
  res.status(500).json({ error: "Internal server error" });
});

// Flaky endpoint: fails with 503 on the FIRST call, succeeds on the next.
// With retry: 1, one automatic retry turns this failure into a success —
// you'll see two requests in the Network tab, then data.
let flakyCalls = 0;
app.get("/api/flaky", (req, res) => {
  flakyCalls += 1;
  if (flakyCalls % 2 === 1) {
    return res.status(503).json({ error: "Service temporarily unavailable" });
  }
  res.json({ ok: true, message: "Recovered after a retry", attempt: flakyCalls });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
