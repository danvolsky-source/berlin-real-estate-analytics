# Database Schema Documentation

**Berlin Real Estate Analytics - Database Architecture**

This document provides comprehensive documentation of the database schema, relationships, and data models used in the Berlin Real Estate Analytics platform.

---

## Database Technology

The application uses **MySQL 8.0** (or compatible **TiDB**) as the relational database management system. The schema is managed through **Drizzle ORM**, which provides type-safe database operations and automatic migration generation.

---

## Schema Overview

The database consists of five primary tables that store demographic data, geographic information, infrastructure locations, and property market data. The schema is designed to support multi-city analysis with historical tracking capabilities.

### Entity Relationship Diagram

```
┌─────────────────┐
│   districts     │
│─────────────────│
│ id (PK)         │◄──┐
│ name            │   │
│ city            │   │
│ population      │   │
│ area            │   │
└─────────────────┘   │
                      │
         ┌────────────┼────────────┬────────────┐
         │            │            │            │
┌────────▼────────┐  │  ┌─────────▼────────┐  │
│  demographics   │  │  │ communityInfra   │  │
│─────────────────│  │  │──────────────────│  │
│ id (PK)         │  │  │ id (PK)          │  │
│ districtId (FK) │  │  │ districtId (FK)  │  │
│ year            │  │  │ type             │  │
│ community       │  │  │ name             │  │
│ population      │  │  │ latitude         │  │
└─────────────────┘  │  │ longitude        │  │
                     │  └──────────────────┘  │
         ┌───────────┘                        │
         │                                    │
┌────────▼────────┐              ┌───────────▼────────┐
│ propertyPrices  │              │   citySummary      │
│─────────────────│              │────────────────────│
│ id (PK)         │              │ id (PK)            │
│ districtId (FK) │              │ city               │
│ year            │              │ year               │
│ month           │              │ totalPopulation    │
│ avgPricePerSqm  │              │ mosquesCount       │
└─────────────────┘              └────────────────────┘
```

---

## Table Definitions

### Districts Table

**Table Name:** `districts`

**Description:** Stores comprehensive information about city districts including population statistics, geographic boundaries, and dominant community identification. Each district belongs to one of the four supported cities.

**Columns:**

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier for the district |
| name | VARCHAR(255) | NOT NULL | District name in original language (German) |
| nameEn | VARCHAR(255) | NOT NULL | English translation of district name |
| city | VARCHAR(100) | NOT NULL | Parent city (Berlin, Munich, Hamburg, Cologne) |
| population | INT | NOT NULL | Total population count |
| area | INT | NOT NULL | Geographic area in square kilometers |
| foreignerPercentage | INT | NOT NULL | Percentage of foreign residents (0-100) |
| dominantCommunity | VARCHAR(100) | NOT NULL | Largest ethnic/religious community |
| latitude | VARCHAR(50) | NULL | Geographic latitude coordinate |
| longitude | VARCHAR(50) | NULL | Geographic longitude coordinate |
| createdAt | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Record creation timestamp |

**Indexes:**
- Primary key on `id`
- Index on `city` for efficient city-based filtering

**Sample Data:**

```sql
INSERT INTO districts (name, nameEn, city, population, area, foreignerPercentage, dominantCommunity)
VALUES ('Mitte', 'Mitte', 'Berlin', 385748, 39, 35, 'Turkish');
```

---

### Demographics Table

**Table Name:** `demographics`

**Description:** Contains yearly demographic data for each district broken down by ethnic and religious communities. This table enables historical trend analysis and community composition tracking over time.

**Columns:**

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier for the demographic record |
| districtId | INT | NOT NULL, FOREIGN KEY | References districts.id |
| year | INT | NOT NULL | Year of the demographic data (2020-2024) |
| community | VARCHAR(100) | NOT NULL | Community name (Turkish, Polish, Italian, etc.) |
| population | INT | NOT NULL | Population count for this community |
| percentageOfDistrict | INT | NOT NULL | Percentage of district population (stored as integer, divide by 10 for decimal) |
| createdAt | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Record creation timestamp |

**Foreign Keys:**
- `districtId` references `districts(id)`

**Indexes:**
- Primary key on `id`
- Composite index on `(districtId, year, community)` for efficient queries
- Index on `year` for temporal queries

**Sample Data:**

```sql
INSERT INTO demographics (districtId, year, community, population, percentageOfDistrict)
VALUES (1, 2024, 'Turkish', 65000, 168);  -- 16.8% of district population
```

**Data Range:**
- Years: 2020-2024 (5 years of historical data)
- Communities tracked: Turkish, Polish, Italian, Syrian, Greek, Croatian, Russian, Vietnamese, Afghan

---

### Community Infrastructure Table

**Table Name:** `communityInfrastructure`

**Description:** Maps the geographic locations of religious and cultural facilities including mosques, churches, synagogues, and cultural centers. Each facility is associated with a specific district and community.

**Columns:**

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier for the infrastructure |
| districtId | INT | NOT NULL, FOREIGN KEY | References districts.id |
| type | ENUM | NOT NULL | Facility type: 'mosque', 'church', 'synagogue', 'cultural_center' |
| name | VARCHAR(255) | NOT NULL | Official name of the facility |
| address | TEXT | NOT NULL | Full street address |
| community | VARCHAR(100) | NOT NULL | Associated community (Turkish, German, Jewish, etc.) |
| latitude | VARCHAR(50) | NOT NULL | Geographic latitude for mapping |
| longitude | VARCHAR(50) | NOT NULL | Geographic longitude for mapping |
| createdAt | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Record creation timestamp |

**Foreign Keys:**
- `districtId` references `districts(id)`

**Indexes:**
- Primary key on `id`
- Index on `districtId` for district-based queries
- Index on `type` for filtering by facility type
- Spatial index on `(latitude, longitude)` for geographic queries

**Sample Data:**

```sql
INSERT INTO communityInfrastructure (districtId, type, name, address, community, latitude, longitude)
VALUES (1, 'mosque', 'Şehitlik Mosque', 'Columbiadamm 128', 'Turkish', '52.4842', '13.3907');
```

---

### City Summary Table

**Table Name:** `citySummary`

**Description:** Aggregates city-level statistics including total population, foreign population, and religious infrastructure counts. This table provides high-level metrics for city comparison and year-over-year analysis.

**Columns:**

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier for the summary record |
| city | VARCHAR(100) | NOT NULL | City name (Berlin, Munich, Hamburg, Cologne) |
| year | INT | NOT NULL | Year of the summary data |
| mosquesCount | INT | NOT NULL | Total number of mosques in the city |
| churchesCount | INT | NOT NULL | Total number of churches in the city |
| synagoguesCount | INT | NOT NULL | Total number of synagogues in the city |
| totalPopulation | INT | NOT NULL | Total city population |
| foreignerPopulation | INT | NOT NULL | Total foreign resident population |
| createdAt | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Record creation timestamp |

**Indexes:**
- Primary key on `id`
- Unique composite index on `(city, year)` to prevent duplicate entries
- Index on `year` for temporal queries

**Sample Data:**

```sql
INSERT INTO citySummary (city, year, mosquesCount, churchesCount, synagoguesCount, totalPopulation, foreignerPopulation)
VALUES ('Berlin', 2024, 102, 540, 12, 3850000, 850000);
```

---

### Property Prices Table

**Table Name:** `propertyPrices`

**Description:** Tracks average property prices per square meter by district over time. This data enables analysis of real estate market trends and their correlation with demographic changes.

**Columns:**

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | Unique identifier for the price record |
| districtId | INT | NOT NULL, FOREIGN KEY | References districts.id |
| year | INT | NOT NULL | Year of the price data |
| month | INT | NOT NULL | Month of the price data (1-12) |
| averagePricePerSqm | INT | NOT NULL | Average price per square meter in euros |
| createdAt | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Record creation timestamp |

**Foreign Keys:**
- `districtId` references `districts(id)`

**Indexes:**
- Primary key on `id`
- Composite index on `(districtId, year, month)` for efficient time-series queries
- Index on `year` for temporal analysis

**Sample Data:**

```sql
INSERT INTO propertyPrices (districtId, year, month, averagePricePerSqm)
VALUES (1, 2024, 12, 6500);  -- €6,500 per square meter
```

**Data Granularity:**
- Monthly data points for detailed market trend analysis
- Historical data from 2020-2024
- Prices stored in euros as integers

---

## Data Relationships

### One-to-Many Relationships

**Districts → Demographics:** Each district has multiple demographic records (one per year per community). This relationship enables tracking of community population changes over time within each district.

**Districts → Community Infrastructure:** Each district contains multiple infrastructure facilities. This relationship supports mapping and spatial analysis of community resources.

**Districts → Property Prices:** Each district has multiple property price records (monthly data points). This relationship enables real estate market trend analysis at the district level.

### Aggregation Relationships

**Districts → City Summary:** District-level data is aggregated to produce city-level summaries. The citySummary table stores pre-computed aggregations for performance optimization.

---

## Query Patterns

### Common Query Examples

**Get all districts for a city:**

```sql
SELECT * FROM districts 
WHERE city = 'Berlin' 
ORDER BY population DESC;
```

**Get demographic trends for a district:**

```sql
SELECT year, community, population, percentageOfDistrict
FROM demographics
WHERE districtId = 1
ORDER BY year DESC, percentageOfDistrict DESC;
```

**Get infrastructure by type in a city:**

```sql
SELECT ci.*, d.city
FROM communityInfrastructure ci
JOIN districts d ON ci.districtId = d.id
WHERE d.city = 'Munich' AND ci.type = 'mosque';
```

**Calculate year-over-year city population change:**

```sql
SELECT 
  current.city,
  current.totalPopulation as current_pop,
  previous.totalPopulation as previous_pop,
  ((current.totalPopulation - previous.totalPopulation) / previous.totalPopulation * 100) as change_percent
FROM citySummary current
JOIN citySummary previous ON current.city = previous.city AND current.year = previous.year + 1
WHERE current.year = 2024;
```

**Get property price trends:**

```sql
SELECT year, month, averagePricePerSqm
FROM propertyPrices
WHERE districtId = 1
ORDER BY year DESC, month DESC
LIMIT 12;  -- Last 12 months
```

---

## Data Integrity

### Foreign Key Constraints

All foreign key relationships are enforced at the database level to maintain referential integrity. Attempting to insert a demographic record with a non-existent districtId will result in a constraint violation error.

### Data Validation

**Population Values:** Must be positive integers representing actual population counts.

**Percentage Values:** Stored as integers (0-1000) representing percentages with one decimal place precision. Divide by 10 to get the actual percentage.

**Geographic Coordinates:** Stored as strings in decimal degree format. Latitude ranges from -90 to 90, longitude from -180 to 180.

**Year Values:** Must be between 2020 and 2024 for historical data consistency.

**Month Values:** Must be between 1 and 12 for property price records.

---

## Performance Optimization

### Indexing Strategy

The schema implements strategic indexing to optimize common query patterns. Composite indexes on `(districtId, year, community)` enable efficient filtering and sorting in demographic queries. Single-column indexes on `city` and `year` support temporal and geographic filtering.

### Query Optimization

For large result sets, consider implementing pagination using LIMIT and OFFSET clauses. When aggregating data across multiple districts, use database-level aggregation functions (SUM, AVG, COUNT) rather than fetching all records and aggregating in application code.

### Caching Recommendations

City summary data changes infrequently and should be cached at the application level with a TTL of 24 hours. District information is relatively static and can be cached for extended periods. Property prices and demographics should be cached with shorter TTLs to reflect market changes.

---

## Migration Management

### Schema Changes

All schema modifications are managed through Drizzle ORM migration files. To create a new migration after modifying the schema:

```bash
pnpm db:push
```

This command generates migration SQL and applies it to the database. Always test migrations on a development database before applying to production.

### Backup Strategy

Regular database backups should be scheduled to prevent data loss. Recommended backup frequency:
- **Full backup:** Daily at off-peak hours
- **Incremental backup:** Every 6 hours
- **Retention period:** 30 days for daily backups, 7 days for incremental

---

## Data Seeding

### Initial Data Population

The database is populated using TypeScript seeding scripts located in the `scripts/` directory. The seed scripts insert:

- **23 districts** across 4 cities
- **2,300 demographic records** (5 years × 5 communities × 23 districts)
- **460 property price records** (5 years × 23 districts × 4 quarters)
- **City summaries** for all cities and years
- **Sample infrastructure** locations for mapping

### Running Seed Scripts

```bash
# Fast batch insert method (recommended)
pnpm exec tsx scripts/seed-fast.ts

# Individual city seeding
pnpm exec tsx scripts/seed-berlin-data.mjs
pnpm exec tsx scripts/seed-german-cities.mjs
```

---

## Security Considerations

### SQL Injection Prevention

All database queries use parameterized statements through Drizzle ORM, which automatically escapes user input and prevents SQL injection attacks.

### Access Control

Database credentials should be stored in environment variables and never committed to version control. Use read-only database users for application queries when possible, reserving write access for administrative operations.

### Data Privacy

The database contains aggregated demographic data and does not store personally identifiable information. All population statistics are derived from public census data and anonymized surveys.

---

## Monitoring and Maintenance

### Performance Monitoring

Monitor slow query logs to identify optimization opportunities. Queries taking longer than 1 second should be analyzed and optimized through better indexing or query restructuring.

### Data Quality Checks

Implement periodic data quality checks to ensure:
- No negative population values
- Percentage values sum to reasonable totals
- Geographic coordinates fall within valid ranges
- No orphaned records with invalid foreign keys

---

**Last Updated:** December 2024

**Schema Version:** 1.0.0

**Maintained by:** Manus AI
