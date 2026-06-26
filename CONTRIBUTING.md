# Contributing to Access Layer Client

Thanks for contributing to the frontend for Access Layer, a Stellar-native creator keys marketplace.

## Before you start

- Read the [README](./README.md) for product context.
- Review the scoped backlog in [docs/open-source/issue-backlog.md](./docs/open-source/issue-backlog.md).
- Prefer one issue per pull request.
- Open a discussion issue first if your change is large or changes architecture.

## Local setup

1. Install Node.js 20+ and `pnpm`.
2. Copy `.env.example` to `.env` and add any local values you need.
3. Install dependencies:

```bash
pnpm install
```

4. Start the dev server:

```bash
pnpm dev
```

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
- See [docs/adding-page-routes.md](./docs/adding-page-routes.md) for how to register a new page, the file naming convention, and the recommended pattern for auth-protected routes.

## Good first issue guidance

Issues labeled `good first issue` should:

- have a narrow file scope
- include acceptance criteria
- avoid blockchain integration blockers
- be completable without hidden product context

## Questions

If something is unclear, open a documentation issue or ask in the repo before starting implementation.
