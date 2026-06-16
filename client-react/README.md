# AdHub Kenya - React (Vite) Client

## Tech Stack
- **Framework**: React 19 + Vite 8
- **Routing**: React Router DOM v7
- **Styling**: Tailwind CSS v4 + Custom CSS variables
- **API**: Axios-free fetch wrapper in `src/lib/api.js`

## Development

```bash
npm install
npm run dev       # http://localhost:5173
```

## Build & Deploy

```bash
npm run build     # outputs to dist/
npm run preview   # preview production build
```

## Cloudflare Pages Settings

| Setting | Value |
|---|---|
| Framework preset | None (or Vite) |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Root directory | `client-react` |
| Node version | 18+ |

## Environment Variables

| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend API base URL (e.g. `https://api.adhubkenya.com/api`) |

## Project Structure

```
src/
├── App.jsx              # Root component + routes
├── main.jsx             # Entry point
├── index.css            # Global design tokens + styles
├── pages/               # Route-level page components
│   ├── Home.jsx
│   ├── Browse.jsx
│   ├── Category.jsx
│   ├── Listing.jsx
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── PostAd.jsx
│   └── MyAds.jsx
├── components/          # Reusable UI components
│   ├── Navbar.jsx
│   ├── Footer.jsx
│   ├── ListingCard.jsx
│   ├── CategoryGrid.jsx
│   ├── ThemeSwitcher.jsx
│   ├── CountyTownSelect.jsx
│   └── ItemAttributesSelect.jsx
├── context/
│   └── AuthContext.jsx  # Auth state & helpers
└── lib/
    ├── api.js           # API fetch wrapper
    ├── categoryData.js  # Category definitions
    └── countyData.js    # Kenya county/town data
```
