# Livestock Certificate System

Production React + TypeScript + Tailwind CSS + Vite recreation of the Horn Livestock Gate Consultant design (certificate lifecycle, finance workflow, role-based views, bilingual EN/AR UI).

## Stack
- React 18 + TypeScript
- Vite
- Tailwind CSS
- React Router v6
- lucide-react icons

## Getting started locally

```bash
npm install
npm run dev
```

Opens at http://localhost:5173. Build for production with `npm run build` (outputs to `dist/`), preview with `npm run preview`.

## Project structure

```
src/
  components/       Layout (sidebar/topbar), Modal, StatusBadge, MetricCard, BarChart
  context/          AppContext.tsx — global state: certificates, payments, accounts, role, language
  data/mockData.ts  Seed/sample data (certificates, payments, exporters, importers, users)
  i18n/             English + Arabic translation dictionary
  pages/            One file per screen (Dashboard, Observer, FieldCollector, Certificates, Payments, Income, Expenses, Reports, Users, Exporters, Importers, Animals, Settings)
  types.ts          Shared TypeScript interfaces
  App.tsx           Route table
  main.tsx          Entry point
```

## Roles
Switch roles from the topbar dropdown: Admin, Veterinary Officer, Data Entry Clerk, Finance Officer, Data Field Collector, Observer. The sidebar and available routes adapt per role, matching the original design's role-based navigation.

## Data
All data is in-memory mock data (`src/data/mockData.ts`) held in React Context (`src/context/AppContext.tsx`). Replace the initial state and the mutator functions (`addCertificate`, `verifyPayment`, `addIncome`, `addExpense`, etc.) with real API calls when a backend is available — the context is the single integration point.

## Language
Toggle English/Arabic from the topbar. RTL layout direction is applied automatically via the `dir` attribute on the root layout element. Add more strings to `src/i18n/translations.ts` as the app grows.

## Deploying

### Vercel
1. Push this repository to GitHub/GitLab/Bitbucket.
2. In Vercel, "Add New Project" → import the repo.
3. Framework preset: **Vite**. Build command: `npm run build`. Output directory: `dist`.
4. Deploy. Add your custom domain under Project Settings → Domains.

### Netlify
1. Push this repository to a git provider.
2. In Netlify, "Add new site" → "Import an existing project".
3. Build command: `npm run build`. Publish directory: `dist`.
4. Deploy. Add your custom domain under Site settings → Domain management.

Both platforms auto-redeploy on every push to the connected branch.

## Notes on fidelity
This codebase reproduces the layouts, navigation, forms, tables, modals, and color/typography language of the original design (indigo primary, slate neutrals, Manrope/Noto Sans Arabic type). Some visual details (icons, exact spacing) were rebuilt using Tailwind utility classes rather than pixel-copied — review each screen against the original design and adjust Tailwind classes/tokens as needed for exact match.
