# Contributing to Access Layer Client

Thanks for contributing to the frontend for Access Layer, a Stellar-native creator keys marketplace.

## Before you start

- Read the [README](./README.md) for product context.
- Review the scoped backlog in [docs/open-source/issue-backlog.md](./docs/open-source/issue-backlog.md).
- Prefer one issue per pull request.
- Open a discussion issue first if your change is large or changes architecture.

## Local setup

1. Install Node.js 20+ and `pnpm`.
2. Copy `.env.example` to `.env` and adjust values as needed (see [Environment variables](#environment-variables)):

   ```bash
   cp .env.example .env
   ```

3. Install dependencies:

```bash
pnpm install
```

4. Start the dev server:

```bash
pnpm dev
```

## Environment variables

All client-exposed variables are prefixed with `VITE_` so Vite can expose them to the
browser. The defaults in `.env.example` are enough to run the client locally — you only
need to fill in optional values for the networks you actually want to test against.
Validation lives in [`src/utils/env.utils.ts`](./src/utils/env.utils.ts).

### Required (defaults provided)

| Variable | Description |
| --- | --- |
| `VITE_BACKEND_URL` | Base URL for the backend API. Point this at your local backend during development (e.g. `http://localhost:3000/api/v1`). |
| `VITE_DEFAULT_CHAIN_ID` | Chain ID selected by default on load. `84532` is Base Sepolia, the recommended testnet. |
| `VITE_ANVIL_RPC_URL` | RPC URL for a local [Anvil](https://book.getfoundry.sh/anvil/) node (chain `31337`), used when developing against a local chain. |
| `VITE_BASE_SEPOLIA_RPC_URL` | RPC URL for the Base Sepolia testnet (chain `84532`). The public default `https://sepolia.base.org` works without an account. |

### Optional

| Variable | Description |
| --- | --- |
| `VITE_SEPOLIA_RPC_URL` | RPC URL for the Ethereum Sepolia testnet (chain `11155111`). Only needed when testing on Sepolia. |
| `VITE_MAINNET_RPC_URL` | RPC URL for Ethereum mainnet (chain `1`). Only needed when testing against mainnet. |
| `VITE_UTM_SOURCE`, `VITE_UTM_MEDIUM`, `VITE_UTM_CAMPAIGN`, `VITE_UTM_TERM`, `VITE_UTM_CONTENT` | UTM parameters appended to shared profile links. Leave blank to disable UTM tracking. |

### Where to get testnet RPC URLs

- **Base Sepolia** — the public endpoint `https://sepolia.base.org` is preconfigured and
  needs no account. For higher rate limits, create a free Base Sepolia endpoint at
  [Alchemy](https://www.alchemy.com/) or [Infura](https://www.infura.io/).
- **Ethereum Sepolia** — create a free Sepolia endpoint at
  [Alchemy](https://www.alchemy.com/) or [Infura](https://www.infura.io/), or use a public
  endpoint from [Chainlist](https://chainlist.org/?testnets=true&search=sepolia).
- **Local Anvil** — no URL to fetch; run `anvil` from [Foundry](https://book.getfoundry.sh/)
  and it serves the default `http://127.0.0.1:8545`.

## Verification commands

Run these before opening a pull request:

```bash
pnpm lint
pnpm build
```

The repository also uses Husky plus `lint-staged` to run lightweight checks on staged files before commit.

## Issue and PR rules

- Keep issue scopes concrete and implementation-ready.
- Reference the issue or backlog item in your pull request.
- Include screenshots for UI changes when possible.
- Avoid unrelated refactors in issue-scoped PRs.
- Update docs when setup, commands, or workflows change.

## Frontend conventions

- Preserve the product direction: Stellar-native creator keys marketplace.
- Keep copy concise and product-specific.
- Do not reintroduce old template-era pages or branding.
- Prefer accessible, keyboard-friendly UI behavior.
- Keep new routes focused and incremental until the main marketplace flows land.

## Good first issue guidance

Issues labeled `good first issue` should:

- have a narrow file scope
- include acceptance criteria
- avoid blockchain integration blockers
- be completable without hidden product context

## Questions

If something is unclear, open a documentation issue or ask in the repo before starting implementation.
