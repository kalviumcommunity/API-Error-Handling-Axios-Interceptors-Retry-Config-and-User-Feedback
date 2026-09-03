const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const threads = [
  {
    id: 1,
    title: "Welcome to the forum",
    body: "Say hello here.",
  },
  {
    id: 2,
    title: "Posting rules",
    body: "Be kind and stay on topic.",
  },
];

// GET /api/threads
// Normal, stable endpoint.
app.get("/api/threads", (req, res) => {
  res.json(threads);
});

// GET /api/unauthorized
// Always returns 401.
app.get("/api/unauthorized", (req, res) => {
  res.status(401).json({
    error: "No token provided",
  });
});

// GET /api/broken
// Always returns 500.
app.get("/api/broken", (req, res) => {
  res.status(500).json({
    error: "Internal server error",
  });
});

// GET /api/flaky
// First request → 503
// Second request → success
// Third request → 503
// Fourth request → success
let flakyCalls = 0;

app.get("/api/flaky", (req, res) => {
  flakyCalls += 1;

  if (flakyCalls % 2 === 1) {
    return res.status(503).json({
      error: "Service temporarily unavailable",
    });
  }

  res.json({
    ok: true,
    message: "Recovered after a retry",
    attempt: flakyCalls,
  });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});