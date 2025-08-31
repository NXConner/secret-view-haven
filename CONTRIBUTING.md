## Contributing

### Setup

1. Node 20+
2. Install deps: `npm ci`
3. Run dev server: `npm run dev`

### Tests & Lint

- Run tests: `npm test` (watch: `npm run test:watch`)
- Coverage: `npm run test:coverage`
- Lint: `npm run lint`

### CI

CI runs lint, build, and tests on pushes/PRs to `main`.

### Code Style

- TypeScript, React 18, Vite
- Prefer accessibility (ARIA labels, keyboard support)
- Keep components cohesive; avoid deep prop drilling

