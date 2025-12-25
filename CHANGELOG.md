# Changelog

All notable changes to the Berlin Real Estate Analytics project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added
- GitHub Secrets configuration documentation for CI/CD setup
- CI status badge and additional badges (License, Node.js version) in README
- Link to GitHub Secrets guide in installation section

---

## [1.2.0] - 2025-12-25

### Added
- GitHub Actions CI/CD workflow with automated testing
- TypeScript type checking in CI pipeline
- Build verification step in CI workflow
- Prettier linting job in CI workflow
- Bug report issue template with structured format
- Feature request issue template with use case examples
- Pull request template with comprehensive checklist
- Workflow triggers on push and pull requests to main and develop branches

### Changed
- Updated contribution guidelines to include issue and PR templates
- Enhanced project documentation for open source collaboration

---

## [1.1.0] - 2025-12-25

### Added
- Interactive trend chart modal - click on sparkline graphs to view detailed 5-year historical data with Recharts
- District filtering by infrastructure count - filter districts by minimum/maximum number of mosques, churches, and synagogues
- District comparison feature - select up to 3 districts for side-by-side comparison with visual charts
- Districts page with comprehensive filtering and comparison capabilities
- TrendChartModal component for detailed demographic visualization
- DistrictComparison component for multi-district analysis

### Changed
- Enhanced Districts page with interactive checkboxes for comparison selection
- Improved user experience with modal-based detailed views

---

## [1.0.0] - 2025-12-25

### Added
- Custom illustrated religious building icons (mosque with crescent moon, church with cross, synagogue with Magen David)
- AI-generated icons with transparent backgrounds using PIL image processing
- Icon integration across homepage and infrastructure displays
- Mapbox access token configuration via environment variables
- Vitest test for Mapbox token validation

### Changed
- Replaced generic Lucide icons with culturally-appropriate custom illustrations
- Updated religious infrastructure section to use custom PNG icons

### Fixed
- Mapbox map loading issue - configured proper token via VITE_MAPBOX_ACCESS_TOKEN
- Icon cultural accuracy - replaced generic star with Magen David for synagogues

---

## [0.9.0] - 2025-12-24

### Added
- Complete project documentation for Git workflow
- Comprehensive README.md with project overview, features, and installation guide
- API documentation (docs/API.md) with all tRPC endpoints and examples
- Database schema documentation (docs/DATABASE.md) with ERD diagram
- Deployment guide (docs/DEPLOYMENT.md) for Manus, VPS, and Docker
- CONTRIBUTING.md with development guidelines and code style rules
- MIT LICENSE file
- Architecture documentation and project structure overview

### Changed
- Organized documentation into dedicated docs/ directory
- Enhanced README with detailed setup instructions and technology stack

---

## [0.8.0] - 2025-12-24

### Added
- Multi-city support for Munich, Hamburg, and Cologne
- Optimized database seed script with batch inserts for faster data loading
- Complete demographic data for all 4 German cities (Berlin, Munich, Hamburg, Cologne)
- Infrastructure data (mosques, churches, synagogues) for all cities
- Property price historical data for all cities
- City selector dropdown on homepage for seamless city switching

### Fixed
- City Comparison page showing zeros - populated database with complete data for all cities
- Empty charts on comparison page - resolved by running optimized seed script
- Missing demographic data - created seed-fast.ts with batch insert optimization

---

## [0.7.0] - 2025-12-24

### Added
- Interactive Mapbox-powered map visualization
- District boundaries color-coded by dominant community
- Infrastructure markers for mosques, churches, and synagogues
- Map legend with toggleable infrastructure layers
- Click-to-view district profiles on map

### Fixed
- Map route 404 error - registered MapView component in App.tsx routing
- Map loading issue - configured Mapbox token properly

---

## [0.6.0] - 2025-12-24

### Added
- City Comparison page with side-by-side analysis of Berlin, Munich, Hamburg, and Cologne
- Comparative bar charts for population, infrastructure, and demographics
- Detailed comparison table with all city statistics
- Top communities section for each city with growth trends

---

## [0.5.0] - 2025-12-24

### Added
- Homepage demographic dashboard for Berlin
- Religious infrastructure counts with year-over-year change indicators
- Community composition display with top 5 ethnic/religious communities
- Sparkline visualizations showing 5-year demographic trends
- City selector for multi-city support
- District list with basic information

---

## [0.4.0] - 2025-12-24

### Added
- tRPC API endpoints for cities, districts, demographics, infrastructure, and property prices
- Database schema with Drizzle ORM (districts, demographics, communityInfrastructure, citySummary, propertyPrices)
- Database query helpers in server/db.ts
- Comprehensive Vitest test suite (10 tests covering all major features)
- CSV export functionality for demographic data

---

## [0.3.0] - 2025-12-24

### Added
- React 19 frontend with TypeScript
- Tailwind CSS 4 styling with custom theme
- shadcn/ui component library integration
- Wouter client-side routing
- City context for global city state management
- Theme context for dark/light mode support

---

## [0.2.0] - 2025-12-24

### Added
- Express 4 backend server
- tRPC 11 for type-safe API communication
- Manus OAuth authentication integration
- Session management with JWT
- Protected and public procedure patterns

---

## [0.1.0] - 2025-12-24

### Added
- Initial project scaffolding with Manus template (tRPC + Auth + Database)
- Node.js 22.x runtime environment
- pnpm package manager setup
- MySQL/TiDB database configuration
- Development server with hot module replacement
- Basic project structure (client, server, drizzle, shared)

---

## Release Notes

### Version 1.2.0 - CI/CD and Collaboration
This release focuses on enabling open source collaboration through automated testing and structured contribution workflows. GitHub Actions now automatically validates all code changes, ensuring quality and preventing regressions.

### Version 1.1.0 - Interactive Features
Major UX improvements with interactive trend analysis, advanced filtering, and multi-district comparison capabilities. Users can now dive deeper into demographic data and compare multiple districts side-by-side.

### Version 1.0.0 - Visual Identity
First stable release with custom-designed religious building icons that respect cultural authenticity. The platform now features beautiful, hand-crafted illustrations that enhance visual appeal and cultural sensitivity.

### Version 0.9.0 - Documentation Complete
Comprehensive documentation for developers and contributors, making the project ready for open source collaboration and external deployment.

### Version 0.8.0 - Multi-City Launch
Expanded coverage to four major German cities with complete demographic and infrastructure data, enabling comparative analysis across urban centers.

---

[Unreleased]: https://github.com/danvolsky-source/berlin-real-estate-analytics/compare/v1.2.0...HEAD
[1.2.0]: https://github.com/danvolsky-source/berlin-real-estate-analytics/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/danvolsky-source/berlin-real-estate-analytics/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/danvolsky-source/berlin-real-estate-analytics/compare/v0.9.0...v1.0.0
[0.9.0]: https://github.com/danvolsky-source/berlin-real-estate-analytics/compare/v0.8.0...v0.9.0
[0.8.0]: https://github.com/danvolsky-source/berlin-real-estate-analytics/compare/v0.7.0...v0.8.0
[0.7.0]: https://github.com/danvolsky-source/berlin-real-estate-analytics/compare/v0.6.0...v0.7.0
[0.6.0]: https://github.com/danvolsky-source/berlin-real-estate-analytics/compare/v0.5.0...v0.6.0
[0.5.0]: https://github.com/danvolsky-source/berlin-real-estate-analytics/compare/v0.4.0...v0.5.0
[0.4.0]: https://github.com/danvolsky-source/berlin-real-estate-analytics/compare/v0.3.0...v0.4.0
[0.3.0]: https://github.com/danvolsky-source/berlin-real-estate-analytics/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/danvolsky-source/berlin-real-estate-analytics/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/danvolsky-source/berlin-real-estate-analytics/releases/tag/v0.1.0
