# Contributing to Berlin Real Estate Analytics

Thank you for your interest in contributing to the Berlin Real Estate Analytics project! This document provides guidelines and best practices for contributing code, documentation, and improvements to the platform.

---

## Code of Conduct

We are committed to providing a welcoming and inclusive environment for all contributors. Please be respectful, constructive, and professional in all interactions. Harassment, discrimination, or inappropriate behavior will not be tolerated.

---

## Getting Started

### Fork and Clone

Begin by forking the repository to your GitHub account, then clone your fork locally:

```bash
git clone https://github.com/your-username/berlin-real-estate-analytics.git
cd berlin-real-estate-analytics
```

### Install Dependencies

Install all project dependencies using pnpm:

```bash
pnpm install
```

### Set Up Environment

Copy the example environment file and configure with your local settings:

```bash
cp .env.example .env
# Edit .env with your database credentials and API keys
```

### Initialize Database

Create the database schema and seed with sample data:

```bash
pnpm db:push
pnpm exec tsx scripts/seed-fast.ts
```

### Start Development Server

Launch the development server with hot reload:

```bash
pnpm dev
```

The application will be available at `http://localhost:3000`.

---

## Development Workflow

### Branch Strategy

Create a new branch for each feature or bug fix:

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

**Branch Naming Conventions:**
- `feature/` - New features or enhancements
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring without behavior changes
- `test/` - Adding or updating tests

### Making Changes

**Write Clean Code** - Follow the existing code style and patterns. Use meaningful variable names and add comments for complex logic.

**Keep Changes Focused** - Each pull request should address a single feature or bug. Avoid mixing unrelated changes.

**Test Your Changes** - Ensure all existing tests pass and add new tests for new functionality:

```bash
pnpm test
```

**Update Documentation** - If your changes affect the API, database schema, or user-facing features, update the relevant documentation files.

### Commit Messages

Write clear, descriptive commit messages following the conventional commits format:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation changes
- `style` - Code style changes (formatting, no logic change)
- `refactor` - Code refactoring
- `test` - Adding or updating tests
- `chore` - Maintenance tasks

**Examples:**

```
feat(demographics): add support for age group filtering

Implement age group filtering in demographics API to enable
analysis by age ranges (0-18, 19-35, 36-65, 65+).

Closes #123
```

```
fix(map): correct district boundary rendering

Fix issue where district boundaries were not rendering correctly
on Mapbox when zoomed out beyond level 10.

Fixes #456
```

### Pull Request Process

**1. Update Your Branch**

Before creating a pull request, ensure your branch is up to date with the main branch:

```bash
git checkout main
git pull upstream main
git checkout your-branch
git rebase main
```

**2. Run Tests**

Verify all tests pass:

```bash
pnpm test
pnpm build  # Ensure production build succeeds
```

**3. Create Pull Request**

Push your branch to your fork and create a pull request on GitHub:

```bash
git push origin your-branch
```

**Pull Request Template:**

```markdown
## Description
Brief description of the changes and their purpose.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Code refactoring

## Testing
Describe how you tested your changes.

## Screenshots (if applicable)
Add screenshots for UI changes.

## Checklist
- [ ] Tests pass locally
- [ ] Code follows project style guidelines
- [ ] Documentation updated
- [ ] No breaking changes
```

**4. Code Review**

A maintainer will review your pull request. Be responsive to feedback and make requested changes promptly. Once approved, your pull request will be merged.

---

## Code Style Guidelines

### TypeScript

**Use Type Annotations** - Always specify types for function parameters and return values:

```typescript
// Good
function calculatePercentage(value: number, total: number): number {
  return (value / total) * 100;
}

// Avoid
function calculatePercentage(value, total) {
  return (value / total) * 100;
}
```

**Prefer Interfaces for Objects** - Use interfaces for object shapes:

```typescript
interface District {
  id: number;
  name: string;
  population: number;
}
```

**Use Const Assertions** - For literal types:

```typescript
const CITIES = ['Berlin', 'Munich', 'Hamburg', 'Cologne'] as const;
type City = typeof CITIES[number];
```

### React

**Use Functional Components** - Always use functional components with hooks:

```typescript
// Good
function DistrictCard({ district }: { district: District }) {
  const [expanded, setExpanded] = useState(false);
  return <div>...</div>;
}

// Avoid class components
class DistrictCard extends React.Component { ... }
```

**Destructure Props** - Destructure props in function parameters:

```typescript
// Good
function UserProfile({ name, email }: UserProfileProps) {
  return <div>{name}</div>;
}

// Avoid
function UserProfile(props: UserProfileProps) {
  return <div>{props.name}</div>;
}
```

**Use Custom Hooks** - Extract reusable logic into custom hooks:

```typescript
function useDistricts(city: string) {
  return trpc.districts.getAll.useQuery({ city });
}
```

### CSS/Tailwind

**Use Tailwind Utilities** - Prefer Tailwind utility classes over custom CSS:

```tsx
// Good
<div className="flex items-center gap-4 p-6 rounded-lg bg-card">

// Avoid custom CSS when Tailwind provides utilities
<div className="custom-card-style">
```

**Group Related Classes** - Group related Tailwind classes for readability:

```tsx
<div className="
  flex items-center justify-between
  p-6 rounded-lg
  bg-card border border-border
  hover:bg-card/80 transition-colors
">
```

**Use Semantic Color Tokens** - Use CSS variables for colors:

```tsx
// Good
<div className="bg-background text-foreground">

// Avoid hard-coded colors
<div className="bg-[#1a1a1a] text-[#ffffff]">
```

---

## Testing Guidelines

### Writing Tests

**Test File Location** - Place test files next to the code they test with `.test.ts` extension:

```
server/
  db.ts
  db.test.ts
  routers.ts
  routers.test.ts
```

**Test Structure** - Use descriptive test names and organize with describe blocks:

```typescript
describe('demographics API', () => {
  describe('getCitySummary', () => {
    it('should return city summary for valid city and year', async () => {
      const result = await caller.demographics.getCitySummary({
        city: 'Berlin',
        year: 2024
      });
      
      expect(result.current).toBeDefined();
      expect(result.current?.city).toBe('Berlin');
    });

    it('should return undefined for invalid city', async () => {
      const result = await caller.demographics.getCitySummary({
        city: 'InvalidCity',
        year: 2024
      });
      
      expect(result.current).toBeUndefined();
    });
  });
});
```

**Test Coverage** - Aim for high test coverage of critical paths:
- All API endpoints
- Database query functions
- Data transformation logic
- Error handling

**Mock External Dependencies** - Mock external services in tests:

```typescript
vi.mock('./map', () => ({
  makeRequest: vi.fn().mockResolvedValue({ data: mockData })
}));
```

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run tests with coverage
pnpm test:coverage
```

---

## Database Changes

### Schema Modifications

When modifying the database schema:

**1. Update Schema File**

Edit `drizzle/schema.ts` with your changes:

```typescript
export const newTable = mysqlTable("newTable", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
```

**2. Generate Migration**

```bash
pnpm db:push
```

**3. Update Seed Scripts**

If the schema change affects seed data, update the seed scripts in `scripts/`.

**4. Document Changes**

Update `docs/DATABASE.md` with the new schema information.

### Data Migrations

For data migrations that transform existing data:

**1. Create Migration Script**

```typescript
// scripts/migrate-data.ts
import { db } from '../server/db';

async function migrateData() {
  // Perform data transformation
  const records = await db.select().from(oldTable);
  
  for (const record of records) {
    await db.insert(newTable).values({
      // Transform data
    });
  }
}

migrateData().catch(console.error);
```

**2. Test on Development Database**

Always test migrations on a development database before applying to production.

**3. Document Migration**

Add migration notes to `docs/DATABASE.md` explaining what changed and why.

---

## Adding New Features

### Feature Development Checklist

When adding a new feature, follow this checklist:

- [ ] Create feature branch from main
- [ ] Design database schema changes (if needed)
- [ ] Implement backend API endpoints
- [ ] Write backend tests
- [ ] Implement frontend components
- [ ] Add frontend integration
- [ ] Write documentation
- [ ] Test manually in browser
- [ ] Create pull request
- [ ] Address code review feedback

### API Endpoint Development

**1. Define Input Schema**

```typescript
const inputSchema = z.object({
  city: z.string(),
  year: z.number().min(2020).max(2024)
});
```

**2. Create Procedure**

```typescript
export const appRouter = router({
  newEndpoint: publicProcedure
    .input(inputSchema)
    .query(async ({ input }) => {
      const { city, year } = input;
      // Implementation
      return data;
    }),
});
```

**3. Write Tests**

```typescript
it('should handle new endpoint', async () => {
  const result = await caller.newEndpoint({ city: 'Berlin', year: 2024 });
  expect(result).toBeDefined();
});
```

**4. Document API**

Add endpoint documentation to `docs/API.md`.

### Frontend Component Development

**1. Create Component File**

```typescript
// client/src/components/NewFeature.tsx
interface NewFeatureProps {
  data: DataType;
}

export function NewFeature({ data }: NewFeatureProps) {
  return <div>...</div>;
}
```

**2. Integrate with tRPC**

```typescript
function NewFeaturePage() {
  const { data, isLoading } = trpc.newEndpoint.useQuery({ 
    city: 'Berlin', 
    year: 2024 
  });

  if (isLoading) return <Skeleton />;
  
  return <NewFeature data={data} />;
}
```

**3. Add Route**

Update `client/src/App.tsx` to include the new route:

```typescript
<Route path="/new-feature" component={NewFeaturePage} />
```

---

## Documentation

### Documentation Standards

**Use Markdown** - All documentation should be in Markdown format with proper formatting and structure.

**Include Examples** - Provide code examples for API usage, configuration, and common tasks.

**Keep Updated** - Update documentation whenever you make changes that affect it.

**Use Clear Language** - Write in clear, concise language. Avoid jargon when possible.

### Documentation Files

- `README.md` - Project overview and quick start guide
- `docs/API.md` - Complete API reference
- `docs/DATABASE.md` - Database schema documentation
- `docs/DEPLOYMENT.md` - Deployment and production guide
- `CONTRIBUTING.md` - This file

---

## Getting Help

### Resources

**Documentation** - Start with the documentation in the `docs/` directory.

**Issues** - Search existing GitHub issues for similar problems or questions.

**Discussions** - Use GitHub Discussions for general questions and ideas.

### Asking Questions

When asking for help:

**Provide Context** - Describe what you're trying to accomplish and what you've already tried.

**Include Code** - Share relevant code snippets, error messages, and logs.

**Be Specific** - Vague questions get vague answers. Be as specific as possible.

---

## Recognition

Contributors will be recognized in the project README and release notes. Significant contributions may result in being added as a project maintainer.

---

Thank you for contributing to Berlin Real Estate Analytics! Your efforts help make this project better for everyone.

**Maintained by:** Manus AI
