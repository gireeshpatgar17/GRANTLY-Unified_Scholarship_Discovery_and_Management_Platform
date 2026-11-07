# GRANTLY

GRANTLY is a scholarship discovery and management dashboard for students. Explore opportunities, compare eligibility, save scholarships, track applications, and keep a student profile in one place.

## Built with

- React and TypeScript
- Vite
- Tailwind CSS
- Lucide React
- Framer Motion
- Browser localStorage for saved scholarships, profile details, and application status

## Run locally

```bash
npm ci
npm run dev
```

## Production build

```bash
npm run build
npm run preview
```

The sample scholarship data is included in the frontend. No backend is required for this MVP.

## Deployment

The project is configured for Vercel in `vercel.json` with `npm ci`, `npm run build`, and `dist` as the output directory. Import this public repository in Vercel and connect the `main` branch to enable automatic production deployments. Vite uses the root asset path required by Vercel.

## Quality checks

```bash
npm test
npm run build
```

Scholarship eligibility rules and search/filter behavior are covered by unit tests. Browser data is validated before it is loaded from localStorage, and profile text is trimmed and length-limited before persistence.
