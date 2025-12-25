# API Documentation

**Berlin Real Estate Analytics - tRPC API Reference**

This document provides comprehensive documentation for all API endpoints available in the Berlin Real Estate Analytics platform. The API is built using tRPC, which provides end-to-end type safety between the client and server.

---

## Base URL

All API endpoints are accessed through the tRPC router at `/api/trpc`. The client automatically handles request formatting and response parsing through the tRPC client library.

---

## Authentication

### Authentication Flow

The platform uses Manus OAuth for user authentication. The authentication flow is handled automatically by the framework, with session cookies managing user state across requests.

**Public Procedures** are accessible without authentication and include all demographic data, district information, and infrastructure queries.

**Protected Procedures** require valid authentication and include user-specific operations such as logout and profile management.

---

## Demographics Endpoints

### Get City Summary

**Endpoint:** `demographics.getCitySummary`

**Type:** Query

**Description:** Retrieves comprehensive city-level statistics including total population, foreign population, and religious infrastructure counts for a specified city and year. Returns both current year data and previous year data for comparison.

**Input Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| city | string | Yes | City name (Berlin, Munich, Hamburg, or Cologne) |
| year | number | Yes | Year for which to retrieve data (2020-2024) |

**Response:**

```typescript
{
  current: {
    city: string;
    year: number;
    mosquesCount: number;
    churchesCount: number;
    synagoguesCount: number;
    totalPopulation: number;
    foreignerPopulation: number;
  } | undefined;
  previous: {
    city: string;
    year: number;
    mosquesCount: number;
    churchesCount: number;
    synagoguesCount: number;
    totalPopulation: number;
    foreignerPopulation: number;
  } | undefined;
}
```

**Example Usage:**

```typescript
const { data } = trpc.demographics.getCitySummary.useQuery({
  city: "Berlin",
  year: 2024
});

console.log(`Total Population: ${data?.current?.totalPopulation}`);
console.log(`Mosques: ${data?.current?.mosquesCount}`);
```

---

### Get Community Composition

**Endpoint:** `demographics.getCommunityComposition`

**Type:** Query

**Description:** Returns the top communities by population percentage for a given city, including five-year historical progression data for trend analysis. Communities are ranked by their latest year population percentage in descending order.

**Input Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| city | string | Yes | City name (Berlin, Munich, Hamburg, or Cologne) |

**Response:**

```typescript
Array<{
  name: string;                    // Community name (e.g., "Turkish", "Polish")
  latestPercentage: number;        // Population percentage in most recent year
  progression: Array<{             // Historical data for last 5 years
    year: number;
    population: number;
  }>;
}>
```

**Example Usage:**

```typescript
const { data } = trpc.demographics.getCommunityComposition.useQuery({
  city: "Munich"
});

data?.forEach(community => {
  console.log(`${community.name}: ${community.latestPercentage}%`);
});
```

---

### Get Demographics by District

**Endpoint:** `demographics.getDemographicsByDistrict`

**Type:** Query

**Description:** Fetches detailed demographic breakdown for a specific district, including population counts for all communities tracked in the database. Data is sorted by year in descending order to show most recent data first.

**Input Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| districtId | number | Yes | Unique identifier of the district |

**Response:**

```typescript
Array<{
  id: number;
  districtId: number;
  year: number;
  community: string;
  population: number;
  percentageOfDistrict: number;
  createdAt: Date;
}>
```

**Example Usage:**

```typescript
const { data } = trpc.demographics.getDemographicsByDistrict.useQuery({
  districtId: 1
});

// Group by year
const byYear = data?.reduce((acc, demo) => {
  if (!acc[demo.year]) acc[demo.year] = [];
  acc[demo.year].push(demo);
  return acc;
}, {} as Record<number, typeof data>);
```

---

## Districts Endpoints

### Get All Districts

**Endpoint:** `districts.getAll`

**Type:** Query

**Description:** Lists all districts in the database with optional city filtering. Returns comprehensive district information including population statistics, geographic data, and dominant community identification.

**Input Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| city | string | No | Filter districts by city name |

**Response:**

```typescript
Array<{
  id: number;
  name: string;              // District name in original language
  nameEn: string;            // English translation of district name
  city: string;              // Parent city
  population: number;
  area: number;              // Area in square kilometers
  foreignerPercentage: number;
  dominantCommunity: string;
  latitude: string | null;
  longitude: string | null;
  createdAt: Date;
}>
```

**Example Usage:**

```typescript
// Get all districts
const { data: allDistricts } = trpc.districts.getAll.useQuery();

// Get districts for specific city
const { data: berlinDistricts } = trpc.districts.getAll.useQuery({
  city: "Berlin"
});
```

---

### Get District by ID

**Endpoint:** `districts.getById`

**Type:** Query

**Description:** Retrieves detailed information for a specific district using its unique identifier. Returns undefined if the district does not exist.

**Input Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| id | number | Yes | Unique identifier of the district |

**Response:**

```typescript
{
  id: number;
  name: string;
  nameEn: string;
  city: string;
  population: number;
  area: number;
  foreignerPercentage: number;
  dominantCommunity: string;
  latitude: string | null;
  longitude: string | null;
  createdAt: Date;
} | undefined
```

**Example Usage:**

```typescript
const { data: district } = trpc.districts.getById.useQuery({ id: 1 });

if (district) {
  console.log(`${district.nameEn} has ${district.population} residents`);
}
```

---

## Infrastructure Endpoints

### Get All Infrastructure

**Endpoint:** `infrastructure.getAll`

**Type:** Query

**Description:** Returns all community infrastructure locations in the database, including mosques, churches, synagogues, and cultural centers. Each record includes precise geographic coordinates for mapping.

**Input Parameters:** None

**Response:**

```typescript
Array<{
  id: number;
  districtId: number;
  type: "mosque" | "church" | "synagogue" | "cultural_center";
  name: string;
  address: string;
  community: string;
  latitude: string;
  longitude: string;
  createdAt: Date;
}>
```

**Example Usage:**

```typescript
const { data: infrastructure } = trpc.infrastructure.getAll.useQuery();

// Filter by type
const mosques = infrastructure?.filter(i => i.type === "mosque");
const churches = infrastructure?.filter(i => i.type === "church");
```

---

### Get Infrastructure by District

**Endpoint:** `infrastructure.getByDistrict`

**Type:** Query

**Description:** Fetches all infrastructure locations within a specific district. Useful for displaying district-specific facilities on maps or in district detail pages.

**Input Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| districtId | number | Yes | Unique identifier of the district |

**Response:**

```typescript
Array<{
  id: number;
  districtId: number;
  type: "mosque" | "church" | "synagogue" | "cultural_center";
  name: string;
  address: string;
  community: string;
  latitude: string;
  longitude: string;
  createdAt: Date;
}>
```

**Example Usage:**

```typescript
const { data: districtInfra } = trpc.infrastructure.getByDistrict.useQuery({
  districtId: 1
});

console.log(`Found ${districtInfra?.length} facilities in this district`);
```

---

## Property Prices Endpoints

### Get Property Prices by District

**Endpoint:** `properties.getPricesByDistrict`

**Type:** Query

**Description:** Retrieves historical property price data for a specific district, including average price per square meter over time. Data is sorted by year and month in descending order to show most recent prices first.

**Input Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| districtId | number | Yes | Unique identifier of the district |

**Response:**

```typescript
Array<{
  id: number;
  districtId: number;
  year: number;
  month: number;
  averagePricePerSqm: number;  // Price in euros
  createdAt: Date;
}>
```

**Example Usage:**

```typescript
const { data: prices } = trpc.properties.getPricesByDistrict.useQuery({
  districtId: 1
});

// Calculate year-over-year change
if (prices && prices.length >= 2) {
  const latest = prices[0].averagePricePerSqm;
  const previous = prices[1].averagePricePerSqm;
  const change = ((latest - previous) / previous) * 100;
  console.log(`Price change: ${change.toFixed(1)}%`);
}
```

---

## Authentication Endpoints

### Get Current User

**Endpoint:** `auth.me`

**Type:** Query

**Description:** Returns the currently authenticated user's information. Returns null if no user is authenticated.

**Input Parameters:** None

**Response:**

```typescript
{
  openId: string;
  name: string;
  email: string;
  role: "admin" | "user";
} | null
```

**Example Usage:**

```typescript
const { data: user } = trpc.auth.me.useQuery();

if (user) {
  console.log(`Logged in as: ${user.name}`);
}
```

---

### Logout

**Endpoint:** `auth.logout`

**Type:** Mutation

**Description:** Logs out the current user by clearing their session cookie. This is a protected procedure that requires authentication.

**Input Parameters:** None

**Response:**

```typescript
{
  success: boolean;
}
```

**Example Usage:**

```typescript
const logoutMutation = trpc.auth.logout.useMutation();

const handleLogout = async () => {
  await logoutMutation.mutateAsync();
  // Redirect to login page
};
```

---

## Error Handling

All tRPC procedures return typed errors that can be handled on the client side. Common error codes include:

**UNAUTHORIZED** - Returned when attempting to access protected procedures without authentication.

**NOT_FOUND** - Returned when requesting a resource that does not exist (e.g., invalid district ID).

**BAD_REQUEST** - Returned when input parameters are invalid or missing required fields.

**INTERNAL_SERVER_ERROR** - Returned when an unexpected server error occurs.

**Example Error Handling:**

```typescript
const { data, error, isError } = trpc.districts.getById.useQuery({ id: 999 });

if (isError) {
  if (error.data?.code === "NOT_FOUND") {
    console.log("District not found");
  } else {
    console.error("An error occurred:", error.message);
  }
}
```

---

## Rate Limiting

The API does not currently implement rate limiting, but clients should implement reasonable request throttling to avoid overwhelming the server. Consider using tRPC's built-in caching and deduplication features to minimize redundant requests.

---

## Data Freshness

**City Summary Data** is updated annually as new census data becomes available.

**Demographics Data** includes historical data from 2020-2024, with new data added annually.

**Infrastructure Data** is updated as new facilities are built or existing ones are closed.

**Property Prices** are updated monthly with the latest market data.

---

## Best Practices

**Use React Query Hooks** - The tRPC client integrates with React Query, providing automatic caching, background refetching, and optimistic updates. Always use the provided hooks (\`useQuery\`, \`useMutation\`) rather than calling procedures directly.

**Implement Loading States** - Always handle loading states in your UI to provide feedback while data is being fetched.

**Handle Errors Gracefully** - Display user-friendly error messages and provide fallback UI when data fails to load.

**Cache Appropriately** - Configure React Query's \`staleTime\` and \`cacheTime\` based on how frequently your data changes. City summary data can be cached longer than real-time property prices.

**Batch Requests** - When fetching data for multiple districts, consider using Promise.all() with multiple queries rather than sequential requests.

---

**Last Updated:** December 2024

**API Version:** 1.0.0

**Maintained by:** Manus AI
