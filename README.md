# SODAM 소담

A simple Korean restaurant demo: warm paper, muted green, one original food image, an understated menu, and generous spacing.

## Run locally

No build or package installation is required. With Python installed:

```sh
python -m http.server 4173 --bind 127.0.0.1
```

Open http://127.0.0.1:4173.

## Interactions

- Menu filters: all, grill, kitchen.
- Responsive mobile navigation.
- Accessible reservation dialog with date validation, Monday closure, and a clearly labeled demo preview.
- Reservation data remains in memory only; nothing is sent or stored.

SODAM is a fictional restaurant. Location, hours, menu, and prices are illustrative. No real bookings are accepted.

## Deployment and storage

```sh
vercel link --scope jour --project sodam-korean-restaurant-demo
vercel deploy --prod --scope jour
```

The website consists of five static files totaling about 167 KiB. The Vercel configuration needs no build, functions, dependencies, database, or external assets. Automatic Git deployments are disabled to avoid deployment accumulation; deploy updates manually after local verification. All site files are in the repository root.

See ASSETS.md for the image provenance and generation prompt.
