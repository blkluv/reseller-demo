# Unstoppable Domains Reseller SDK Demo

A full-stack web application demonstrating the [Unstoppable Domains Reseller Go SDK](https://github.com/unstoppabledomains/reseller-sdk-go). Built with a Go backend and React frontend.

## Features

- **Domain Search** — Search and get suggestions for available domains
- **Domain Registration** — Purchase domains with ICANN contact management
- **DNS Management** — Create and delete DNS records
- **Domain Flags** — Toggle transfer lock, WHOIS privacy, and more
- **Domain Renewal** — Check eligibility and renew domains
- **Pending Operations** — Track async operations with automatic polling

## Prerequisites

- [Go](https://go.dev/dl/) 1.23+
- [Node.js](https://nodejs.org/) 18+
- An Unstoppable Domains Reseller API token ([get one here](https://unstoppabledomains.com/resellers))

## Quick Start

**1. Clone and configure**

```bash
git clone https://github.com/unstoppabledomains/reseller-go-sdk-demo.git
cd reseller-go-sdk-demo
cp .env.example .env
```

Edit `.env` and add your API token:

```
UNSTOPPABLEDOMAINSSDK_BEARER=your-api-token-here
UD_SANDBOX=true
```

**2. Build the frontend**

```bash
cd frontend
npm install
npm run build
cd ..
```

**3. Run the server**

```bash
source .env && export UNSTOPPABLEDOMAINSSDK_BEARER UD_SANDBOX
go run .
```

The app is now running at **http://localhost:8080**.

Open it in your browser, register an account, and start searching for domains.

## Development

For live-reloading during development, run the Go backend and Vite dev server separately:

**Terminal 1 — Go backend:**

```bash
source .env && export UNSTOPPABLEDOMAINSSDK_BEARER UD_SANDBOX
go run .
```

Or with [Air](https://github.com/air-verse/air) for auto-reload:

```bash
air
```

**Terminal 2 — Frontend dev server:**

```bash
cd frontend
npm run dev
```

The Vite dev server runs at `http://localhost:5173` and proxies `/api` requests to the Go backend on port 8080.

## Project Structure

```
├── main.go                  # HTTP server and routing
├── internal/
│   ├── auth/                # Session-based authentication
│   ├── config/              # Environment variable loading
│   ├── handlers/            # API request handlers
│   ├── models/              # Data models
│   ├── sdk/                 # Unstoppable Domains SDK wrapper
│   └── store/               # JSON file-based persistence
└── frontend/
    └── src/
        ├── pages/           # React page components
        ├── components/      # Layout and route guards
        ├── hooks/           # Auth context provider
        ├── api.ts           # API client
        └── types.ts         # TypeScript interfaces
```

## Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `UNSTOPPABLEDOMAINSSDK_BEARER` | Yes | — | Reseller API token |
| `UD_SANDBOX` | No | `false` | Use sandbox API (`true`/`false`) |
| `LISTEN_ADDR` | No | `:8080` | Server listen address |
| `DB_PATH` | No | `./data.json` | Path to JSON database file |

## Tech Stack

- **Backend:** Go, stdlib `net/http`
- **Frontend:** React, TypeScript, Vite, React Router
- **SDK:** [reseller-sdk-go](https://github.com/unstoppabledomains/reseller-sdk-go)
- **Styling:** [Pico CSS](https://picocss.com/)
- **Storage:** JSON file (no database required)
