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

The repository is configured for Vercel (`vercel.json`): use `npm ci`, `npm run build`, and publish `dist`. Import the GitHub repository in Vercel and connect the `main` branch for automatic production deployments. The GitHub Pages workflow in `.github/workflows/deploy.yml` is also retained as a backup deployment target; the Vite asset base is selected for the host.
