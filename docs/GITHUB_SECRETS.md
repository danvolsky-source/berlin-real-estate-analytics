# GitHub Secrets Configuration

To enable GitHub Actions CI/CD workflow to run tests successfully, you need to configure the following secrets in your repository.

## How to Add Secrets

1. Go to your repository on GitHub
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add each secret below with its corresponding value

---

## Required Secrets

### Database Configuration

**`DATABASE_URL`**
- **Description**: MySQL/TiDB connection string for test database
- **Format**: `mysql://username:password@host:port/database`
- **Example**: `mysql://user:pass@db.example.com:3306/berlin_analytics`
- **Note**: Use a separate test database, not your production database

---

### Authentication Secrets

**`JWT_SECRET`**
- **Description**: Secret key for signing JWT tokens
- **Format**: Random string (minimum 32 characters)
- **Example**: `your-super-secret-jwt-key-min-32-chars`
- **Generate**: `openssl rand -base64 32`

**`VITE_APP_ID`**
- **Description**: Manus OAuth application ID
- **Format**: String
- **Example**: `your-app-id`

**`OAUTH_SERVER_URL`**
- **Description**: Manus OAuth backend base URL
- **Format**: URL
- **Example**: `https://api.manus.im`

**`VITE_OAUTH_PORTAL_URL`**
- **Description**: Manus login portal URL (frontend)
- **Format**: URL
- **Example**: `https://oauth.manus.im`

---

### Manus Built-in APIs

**`BUILT_IN_FORGE_API_URL`**
- **Description**: Manus built-in APIs base URL (server-side)
- **Format**: URL
- **Example**: `https://forge.manus.im`

**`BUILT_IN_FORGE_API_KEY`**
- **Description**: Bearer token for server-side Manus APIs
- **Format**: String token
- **Example**: `your-server-api-key`

**`VITE_FRONTEND_FORGE_API_KEY`**
- **Description**: Bearer token for frontend Manus APIs
- **Format**: String token
- **Example**: `your-frontend-api-key`

**`VITE_FRONTEND_FORGE_API_URL`**
- **Description**: Manus built-in APIs URL for frontend
- **Format**: URL
- **Example**: `https://forge.manus.im`

---

### Third-Party Services

**`VITE_MAPBOX_ACCESS_TOKEN`**
- **Description**: Mapbox access token for interactive maps
- **Format**: Token string starting with `pk.`
- **Example**: `pk.eyJ1IjoieW91cnVzZXJuYW1lIiwiYSI6ImNsZjR3...`
- **Get token**: https://account.mapbox.com/access-tokens/

---

## Verification

After adding all secrets, the CI workflow should run successfully on the next push or pull request. You can verify by:

1. Going to **Actions** tab in your repository
2. Checking the latest workflow run
3. Ensuring all jobs (test, lint) pass with green checkmarks

---

## Security Notes

- **Never commit secrets** to the repository or share them publicly
- **Use separate credentials** for CI/CD (test database, API keys with limited permissions)
- **Rotate secrets regularly** for security best practices
- **Restrict secret access** to only necessary workflows and environments

---

## Troubleshooting

### Tests fail with "DATABASE_URL is not defined"
- Ensure `DATABASE_URL` secret is added correctly
- Check that the database is accessible from GitHub Actions runners (public IP or allow GitHub IPs)

### Mapbox map doesn't load in tests
- Verify `VITE_MAPBOX_ACCESS_TOKEN` is valid and not expired
- Check token permissions include all required scopes

### OAuth tests fail
- Confirm all OAuth-related secrets (`VITE_APP_ID`, `OAUTH_SERVER_URL`, `VITE_OAUTH_PORTAL_URL`) are set
- Ensure OAuth application is configured correctly in Manus dashboard

---

## Optional: Environment-Specific Secrets

For more advanced setups, you can create environment-specific secrets:

1. Go to **Settings** → **Environments**
2. Create environments: `development`, `staging`, `production`
3. Add environment-specific secrets to each

Then modify `.github/workflows/ci.yml` to use specific environments.
