# Axios Interceptors + Retry — Global Error Handling — Starter

A `client/` + `server/` monorepo. Move error handling out of every component and into **one**
shared layer: an Axios request/response interceptor for auth and global failures, and a
`QueryClient` retry policy with exponential backoff.

## Structure
```
.
├── package.json            # root scripts (setup, dev via concurrently)
├── server/                 # Express API on :3001
│   └── index.js            # /api/threads + test routes: /unauthorized, /broken, /flaky
└── client/                 # Vite + React app on :5173
    ├── .env.development.example
    └── src/
        ├── app/App.jsx              # provided — list + test buttons
        ├── app/queryClient.js        # YOU complete TODO 3 (retry)
        ├── main.jsx                  # provided — QueryClientProvider
        └── services/apiClient.js     # YOU complete TODO 1 & 2 (interceptors)
```

## Setup & run
```bash
npm run setup                                   # install root + server + client
cp client/.env.development.example client/.env.development
npm run dev                                      # Express :3001, Vite :5173
#   open http://localhost:5173
```

## What you complete
- `client/src/services/apiClient.js` — request interceptor (TODO 1) + response interceptor (TODO 2).
- `client/src/app/queryClient.js` — `retry` + `retryDelay` (TODO 3).

## How to test (buttons on the page)
- **Trigger 401** → interceptor should send the browser to `/login`.
- **Trigger 500** → interceptor should show a global message.
- **Load flaky data** → `/flaky` fails once then succeeds; with `retry: 1` you'll see **two**
  requests in the Network tab, then the success message.

dfghjk