# Environment variables

This reference lists every `VITE_` variable consumed by the client, along with its purpose, whether it is required or optional, and its default value when optional.

## .env setup

1. Copy `.env.example` to a local `.env` file.
2. Adjust any values needed for your environment.
3. Restart the dev server after changing `.env`.

```bash
cp .env.example .env
pnpm dev
```

## Variables

| Variable                    | Description                                      | Required | Default                    |
| --------------------------- | ------------------------------------------------ | -------- | -------------------------- |
| `VITE_BACKEND_URL`          | Base URL for API requests.                       | No       | `/api`                     |
| `VITE_DEFAULT_CHAIN_ID`     | Chain ID used when configuring Web3 connections. | No       | `84532`                    |
| `VITE_ANVIL_RPC_URL`        | RPC endpoint for local Anvil development.        | No       | `http://127.0.0.1:8545`    |
| `VITE_BASE_SEPOLIA_RPC_URL` | RPC endpoint for Base Sepolia.                   | No       | `https://sepolia.base.org` |
| `VITE_SEPOLIA_RPC_URL`      | RPC endpoint for Sepolia.                        | No       | _not set_                  |
| `VITE_MAINNET_RPC_URL`      | RPC endpoint for mainnet.                        | No       | _not set_                  |
| `VITE_UTM_SOURCE`           | UTM source appended to shared profile links.     | No       | _not set_                  |
| `VITE_UTM_MEDIUM`           | UTM medium appended to shared profile links.     | No       | _not set_                  |
| `VITE_UTM_CAMPAIGN`         | UTM campaign appended to shared profile links.   | No       | _not set_                  |
| `VITE_UTM_TERM`             | UTM term appended to shared profile links.       | No       | _not set_                  |
| `VITE_UTM_CONTENT`          | UTM content appended to shared profile links.    | No       | _not set_                  |

## Build-time vs runtime

These variables are read at build time via Vite's `import.meta.env`. Because Vite inlines `import.meta.env` values during the build, changing them after build requires rebuilding the client.

- `VITE_BACKEND_URL`
- `VITE_DEFAULT_CHAIN_ID`
- `VITE_ANVIL_RPC_URL`
- `VITE_BASE_SEPOLIA_RPC_URL`
- `VITE_SEPOLIA_RPC_URL`
- `VITE_MAINNET_RPC_URL`
- `VITE_UTM_SOURCE`
- `VITE_UTM_MEDIUM`
- `VITE_UTM_CAMPAIGN`
- `VITE_UTM_TERM`
- `VITE_UTM_CONTENT`
