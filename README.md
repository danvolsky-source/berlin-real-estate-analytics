# Berlin Real Estate Analytics

[![CI](https://github.com/danvolsky-source/berlin-real-estate-analytics/workflows/CI/badge.svg)](https://github.com/danvolsky-source/berlin-real-estate-analytics/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D22.0.0-brightgreen)](https://nodejs.org/)

A comprehensive demographic analysis and property market visualization platform for major German cities, featuring interactive maps, community composition tracking, and religious infrastructure monitoring.

![Platform Screenshot](https://via.placeholder.com/1200x600/1a1a1a/3b82f6?text=Berlin+Real+Estate+Analytics)

## Features

### Multi-City Support
Track demographic trends across four major German cities: **Berlin**, **Munich**, **Hamburg**, and **Cologne**. Switch between cities seamlessly using the integrated city selector.

### Demographic Dashboard
View real-time demographic snapshots including:
- **Religious Infrastructure Counts**: Mosques, churches, and synagogues with year-over-year change indicators
- **Community Composition**: Top 5 ethnic/religious communities with population percentages
- **5-Year Progression Charts**: Sparkline visualizations showing demographic trends over time

### Interactive Maps
Explore city districts through Mapbox-powered interactive maps featuring:
- District boundaries color-coded by dominant community
- Infrastructure markers for religious and cultural centers
- Click-to-view district profiles with detailed statistics
- Real-time data overlays

### District Profiles
Deep-dive into individual districts with:
- Population demographics and foreign resident percentages
- Property price trends over time
- Infrastructure listings by type
- Correlation analysis between demographics and property values

### Data Visualization
- Line charts for demographic trends
- Property price evolution graphs
- Sparkline indicators for quick trend analysis
- Interactive tooltips and legends

## Technology Stack

### Backend
- **Node.js** with **Express** for server runtime
- **tRPC** for end-to-end type-safe APIs
- **Drizzle ORM** for database operations
- **MySQL/TiDB** for data persistence
- **Vitest** for comprehensive testing (9/9 tests passing)

### Frontend
- **React 19** with TypeScript for UI components
- **Tailwind CSS 4** for styling
- **Mapbox GL** for interactive maps
- **Recharts** for data visualization
- **shadcn/ui** for component library
- **Wouter** for client-side routing

### Database Schema
- `districts`: City district information with geospatial data
- `demographics`: Historical demographic data by community
- `communityInfrastructure`: Religious and cultural infrastructure locations
- `citySummary`: Aggregated city-level statistics
- `propertyPrices`: Historical property price data

## Installation

### Prerequisites
- Node.js 22.x or higher
- MySQL 8.0+ or TiDB compatible database
- pnpm package manager

### Setup Steps

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/berlin-real-estate-analytics.git
cd berlin-real-estate-analytics
```

2. **Install dependencies**
```bash
pnpm install
```

3. **Configure environment variables**

Create a `.env` file in the project root:

```env
DATABASE_URL=mysql://user:password@host:port/database
JWT_SECRET=your-jwt-secret-key
VITE_APP_ID=your-app-id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://oauth.manus.im
VITE_MAPBOX_ACCESS_TOKEN=your-mapbox-token
```

> **For GitHub Actions CI/CD**: See [GitHub Secrets Configuration Guide](docs/GITHUB_SECRETS.md) for setting up environment variables in GitHub Actions.

4. **Initialize the database**

Push the schema to your database:
```bash
pnpm db:push
```

5. **Seed initial data**

Populate the database with Berlin data:
```bash
npx tsx scripts/seed-berlin-data.mjs
```

Add Munich, Hamburg, and Cologne data:
```bash
npx tsx scripts/seed-german-cities.mjs
```

6. **Start the development server**
```bash
pnpm dev
```

The application will be available at `http://localhost:3000`

## Project Structure

```
berlin-real-estate-analytics/
├── client/                  # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── contexts/       # React contexts (City, Theme)
│   │   ├── pages/          # Page components (Home, MapView, DistrictDetail)
│   │   ├── lib/            # Utilities and tRPC client
│   │   └── index.css       # Global styles and theme
│   └── public/             # Static assets
├── server/                  # Backend tRPC server
│   ├── _core/              # Core server infrastructure
│   ├── db.ts               # Database query helpers
│   ├── routers.ts          # tRPC API routes
│   └── *.test.ts           # Vitest test files
├── drizzle/                 # Database schema and migrations
│   └── schema.ts           # Table definitions
├── scripts/                 # Data seeding scripts
│   ├── seed-berlin-data.mjs
│   └── seed-german-cities.mjs
└── shared/                  # Shared types and constants
```

## API Documentation

### Cities Endpoint
```typescript
// Get list of all available cities
trpc.cities.list.useQuery()
// Returns: string[]
```

### Districts Endpoint
```typescript
// Get districts for a specific city
trpc.districts.list.useQuery({ city: "Berlin" })
// Returns: District[]

// Get district by ID
trpc.districts.getById.useQuery({ id: 1 })
// Returns: District | undefined
```

### Demographics Endpoint
```typescript
// Get city summary with infrastructure counts
trpc.demographics.citySummary.useQuery({ 
  city: "Berlin", 
  year: 2024 
})
// Returns: { current, previous, history }

// Get community composition
trpc.demographics.communityComposition.useQuery({ 
  city: "Berlin" 
})
// Returns: CommunityData[]

// Get demographics by district
trpc.demographics.byDistrict.useQuery({ 
  districtId: 1 
})
// Returns: Demographic[]
```

### Infrastructure Endpoint
```typescript
// Get all infrastructure
trpc.infrastructure.all.useQuery()
// Returns: Infrastructure[]

// Get infrastructure by district
trpc.infrastructure.byDistrict.useQuery({ 
  districtId: 1 
})
// Returns: Infrastructure[]
```

### Property Prices Endpoint
```typescript
// Get property prices by district
trpc.propertyPrices.byDistrict.useQuery({ 
  districtId: 1 
})
// Returns: PropertyPrice[]
```

## Testing

Run the comprehensive test suite:

```bash
pnpm test
```

All tests validate:
- City summary data retrieval
- Community composition calculations
- District queries with city filtering
- Infrastructure data access
- Property price data integrity

## Development

### Adding a New City

1. **Add district data** to the seed script:
```javascript
const newCityDistricts = [
  { 
    name: "District Name", 
    nameEn: "District Name EN",
    city: "NewCity",
    population: 100000,
    area: 50,
    foreignerPercentage: 25,
    dominantCommunity: "Turkish"
  },
  // ... more districts
];
```

2. **Add demographics, infrastructure, and property prices** following the same pattern in `scripts/seed-german-cities.mjs`

3. **Run the seed script**:
```bash
npx tsx scripts/seed-german-cities.mjs
```

4. The new city will automatically appear in the city selector

### Database Migrations

When modifying the schema in `drizzle/schema.ts`:

```bash
pnpm db:push
```

This generates migration files and applies them to the database.

## Deployment

### Build for Production

```bash
pnpm build
```

This creates:
- Optimized frontend bundle in `dist/client`
- Compiled backend server in `dist/server`

### Start Production Server

```bash
pnpm start
```

### Environment Variables for Production

Ensure all required environment variables are set:
- `DATABASE_URL`: Production database connection string
- `JWT_SECRET`: Secure random string for session signing
- `NODE_ENV=production`

## Data Sources

The platform uses demographic data from:
- German Federal Statistical Office (Destatis)
- City-level census data
- OpenStreetMap for infrastructure locations
- Historical property price indices

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style
- Use TypeScript for all new code
- Follow existing naming conventions
- Add tests for new features
- Update documentation as needed

## License

MIT License - see LICENSE file for details

## Acknowledgments

- Built with [Manus](https://manus.im) platform
- Maps powered by [Mapbox](https://www.mapbox.com/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Charts by [Recharts](https://recharts.org/)

## Support

For issues and questions:
- Open an issue on GitHub
- Contact: [your-email@example.com]

## Roadmap

- [ ] Add more European cities (Paris, Amsterdam, Vienna)
- [ ] Implement heatmap visualization for community density
- [ ] Add filters for specific ethnic/religious groups
- [ ] Export data to CSV/PDF reports
- [ ] Mobile app version
- [ ] Real-time data updates via WebSocket
- [ ] User accounts and saved searches
- [ ] Predictive analytics for property prices

---

**Built with ❤️ by Manus AI**
