# Deployment Guide

**Berlin Real Estate Analytics - Production Deployment**

This comprehensive guide covers deploying the Berlin Real Estate Analytics platform to production environments, including configuration, optimization, and monitoring best practices.

---

## Pre-Deployment Checklist

Before deploying to production, ensure the following requirements are met:

**Environment Preparation** - Verify that your production server meets the minimum requirements of Node.js 18.0 or higher, MySQL 8.0 or compatible TiDB instance, and at least 2GB RAM with 20GB storage space.

**Database Setup** - Create a production database with proper user permissions. The database user should have SELECT, INSERT, UPDATE, and DELETE privileges on all application tables.

**SSL Certificates** - Obtain SSL certificates for your domain to enable HTTPS. Free certificates are available through Let's Encrypt or your hosting provider.

**Environment Variables** - Prepare all required environment variables with production values. Never use development credentials in production.

**Backup Strategy** - Implement automated database backups with a retention policy of at least 30 days.

---

## Environment Configuration

### Required Environment Variables

Create a `.env` file in the project root with the following production configuration:

```env
# Node Environment
NODE_ENV=production

# Database Configuration
DATABASE_URL=mysql://prod_user:secure_password@db.example.com:3306/berlin_analytics?ssl=true

# Authentication & Security
JWT_SECRET=generate-a-secure-random-string-min-32-chars
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://auth.manus.im

# Application Configuration
VITE_APP_ID=your-production-app-id
VITE_APP_TITLE=Berlin Real Estate Analytics
VITE_APP_LOGO=/logo.svg

# Mapbox Configuration
VITE_MAPBOX_ACCESS_TOKEN=pk.your-production-mapbox-token

# Manus Platform Services
BUILT_IN_FORGE_API_URL=https://forge.manus.im
BUILT_IN_FORGE_API_KEY=your-production-forge-api-key
VITE_FRONTEND_FORGE_API_KEY=your-production-frontend-key
VITE_FRONTEND_FORGE_API_URL=https://forge.manus.im

# Analytics (Optional)
VITE_ANALYTICS_ENDPOINT=https://analytics.example.com
VITE_ANALYTICS_WEBSITE_ID=your-website-id

# Owner Information
OWNER_OPEN_ID=production-owner-id
OWNER_NAME=Production Owner
```

### Security Best Practices

**JWT Secret Generation** - Generate a cryptographically secure random string for JWT_SECRET using a tool like `openssl rand -base64 32`. Never reuse development secrets in production.

**Database Credentials** - Use strong passwords with a mix of uppercase, lowercase, numbers, and special characters. Rotate database passwords quarterly.

**API Keys** - Store all API keys in environment variables. Never commit them to version control. Use separate API keys for development and production.

**SSL/TLS** - Always use HTTPS in production. Configure your web server to redirect HTTP traffic to HTTPS automatically.

---

## Building for Production

### Build Process

Execute the production build command to create optimized bundles:

```bash
pnpm build
```

This command performs the following operations:

**Frontend Compilation** - Vite compiles the React application with production optimizations including code splitting, tree shaking, and minification. The output is generated in `client/dist/` directory.

**Asset Optimization** - Images and static assets are optimized and fingerprinted with content hashes for cache busting. CSS is extracted and minified.

**TypeScript Compilation** - Server-side TypeScript code is compiled to JavaScript with source maps for debugging.

**Bundle Analysis** - Review the build output to identify large dependencies. Consider code splitting or lazy loading for bundles exceeding 500KB.

### Build Optimization

**Code Splitting** - The build automatically splits code by routes. Each page component is loaded on demand, reducing initial bundle size.

**Tree Shaking** - Unused code is eliminated during the build process. Ensure imports use named exports rather than default exports for better tree shaking.

**Compression** - Enable gzip or brotli compression on your web server to reduce transfer sizes. Most modern servers support this natively.

---

## Deployment Methods

### Option 1: Manus Platform (Recommended)

The Manus platform provides built-in hosting with zero configuration. This is the simplest deployment method with automatic SSL, custom domains, and integrated analytics.

**Step 1: Create Checkpoint**

```bash
# Ensure all changes are committed
pnpm test  # Verify all tests pass
```

Use the Manus interface to create a checkpoint. This snapshots the current project state.

**Step 2: Publish**

Click the "Publish" button in the Manus dashboard. The platform automatically:
- Builds the application
- Deploys to production servers
- Configures SSL certificates
- Sets up CDN distribution

**Step 3: Configure Domain**

Navigate to Settings → Domains in the Manus dashboard to:
- Modify the auto-generated subdomain (xxx.manus.space)
- Purchase a new domain directly within Manus
- Bind an existing custom domain with DNS configuration

**Advantages:**
- Zero server management
- Automatic SSL certificates
- Built-in CDN and edge caching
- Integrated database hosting
- One-click rollback to previous versions

---

### Option 2: Traditional VPS Deployment

Deploy to a virtual private server (VPS) for full control over the infrastructure.

**Server Requirements:**
- Ubuntu 22.04 LTS or similar Linux distribution
- 2GB RAM minimum (4GB recommended)
- 20GB SSD storage
- Public IP address with open ports 80 and 443

**Step 1: Server Setup**

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install pnpm
npm install -g pnpm

# Install Nginx
sudo apt install -y nginx

# Install MySQL (if not using external database)
sudo apt install -y mysql-server
```

**Step 2: Application Deployment**

```bash
# Clone repository
git clone <your-repo-url> /var/www/berlin-analytics
cd /var/www/berlin-analytics

# Install dependencies
pnpm install --prod

# Build application
pnpm build

# Set up environment variables
cp .env.example .env
nano .env  # Edit with production values
```

**Step 3: Process Manager**

Use PM2 to keep the application running:

```bash
# Install PM2
npm install -g pm2

# Start application
pm2 start npm --name "berlin-analytics" -- start

# Configure PM2 to start on boot
pm2 startup
pm2 save
```

**Step 4: Nginx Configuration**

Create an Nginx configuration file at `/etc/nginx/sites-available/berlin-analytics`:

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com www.your-domain.com;

    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Static Files
    location / {
        root /var/www/berlin-analytics/client/dist;
        try_files $uri $uri/ /index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    # API Proxy
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Gzip Compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/json;
}
```

Enable the site and restart Nginx:

```bash
sudo ln -s /etc/nginx/sites-available/berlin-analytics /etc/nginx/sites-enabled/
sudo nginx -t  # Test configuration
sudo systemctl restart nginx
```

**Step 5: SSL Certificate**

Install Let's Encrypt certificate:

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

---

### Option 3: Docker Deployment

Deploy using Docker containers for consistent environments across development and production.

**Dockerfile:**

```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build application
RUN pnpm build

# Production image
FROM node:18-alpine

WORKDIR /app

# Copy built application
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./

# Expose port
EXPOSE 3000

# Start application
CMD ["npm", "start"]
```

**docker-compose.yml:**

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
      - JWT_SECRET=${JWT_SECRET}
    depends_on:
      - db
    restart: unless-stopped

  db:
    image: mysql:8.0
    environment:
      - MYSQL_ROOT_PASSWORD=${DB_ROOT_PASSWORD}
      - MYSQL_DATABASE=berlin_analytics
      - MYSQL_USER=${DB_USER}
      - MYSQL_PASSWORD=${DB_PASSWORD}
    volumes:
      - db_data:/var/lib/mysql
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - app
    restart: unless-stopped

volumes:
  db_data:
```

**Deploy with Docker Compose:**

```bash
# Build and start containers
docker-compose up -d

# View logs
docker-compose logs -f

# Stop containers
docker-compose down
```

---

## Database Migration

### Production Database Setup

**Step 1: Create Database**

```sql
CREATE DATABASE berlin_analytics CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'prod_user'@'%' IDENTIFIED BY 'secure_password';
GRANT SELECT, INSERT, UPDATE, DELETE ON berlin_analytics.* TO 'prod_user'@'%';
FLUSH PRIVILEGES;
```

**Step 2: Run Migrations**

```bash
# Push schema to production database
pnpm db:push

# Verify tables were created
mysql -u prod_user -p berlin_analytics -e "SHOW TABLES;"
```

**Step 3: Seed Initial Data**

```bash
# Run production seed script
pnpm exec tsx scripts/seed-fast.ts
```

### Database Backup

Implement automated daily backups:

```bash
#!/bin/bash
# backup-db.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/var/backups/mysql"
DB_NAME="berlin_analytics"

# Create backup directory
mkdir -p $BACKUP_DIR

# Dump database
mysqldump -u prod_user -p$DB_PASSWORD $DB_NAME | gzip > $BACKUP_DIR/backup_$DATE.sql.gz

# Delete backups older than 30 days
find $BACKUP_DIR -name "backup_*.sql.gz" -mtime +30 -delete
```

Schedule with cron:

```bash
# Edit crontab
crontab -e

# Add daily backup at 2 AM
0 2 * * * /path/to/backup-db.sh
```

---

## Performance Optimization

### Application-Level Optimization

**Enable Production Mode** - Ensure NODE_ENV is set to "production" to enable React optimizations and disable development warnings.

**Database Connection Pooling** - Configure MySQL connection pool with appropriate limits:

```typescript
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: 10,
  queueLimit: 0
});
```

**Query Optimization** - Use database indexes effectively. Monitor slow query logs and add indexes for frequently filtered columns.

**Caching Strategy** - Implement Redis for caching frequently accessed data:

```typescript
// Cache city summaries for 1 hour
const cachedSummary = await redis.get(`city:${city}:${year}`);
if (cachedSummary) return JSON.parse(cachedSummary);

const summary = await db.query(/* ... */);
await redis.setex(`city:${city}:${year}`, 3600, JSON.stringify(summary));
```

### Server-Level Optimization

**Nginx Caching** - Configure Nginx to cache API responses:

```nginx
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=api_cache:10m max_size=1g inactive=60m;

location /api {
    proxy_cache api_cache;
    proxy_cache_valid 200 10m;
    proxy_cache_key "$scheme$request_method$host$request_uri";
    add_header X-Cache-Status $upstream_cache_status;
    # ... other proxy settings
}
```

**CDN Integration** - Use a CDN like Cloudflare or AWS CloudFront to cache static assets globally and reduce server load.

**Load Balancing** - For high-traffic deployments, use multiple application servers behind a load balancer:

```nginx
upstream backend {
    server 127.0.0.1:3000;
    server 127.0.0.1:3001;
    server 127.0.0.1:3002;
}

server {
    location /api {
        proxy_pass http://backend;
    }
}
```

---

## Monitoring and Logging

### Application Monitoring

**Health Checks** - Implement health check endpoints:

```typescript
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});
```

**Error Tracking** - Integrate error tracking service like Sentry:

```typescript
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV
});
```

**Performance Monitoring** - Track API response times and database query performance. Set up alerts for responses exceeding 1 second.

### Log Management

**Structured Logging** - Use a logging library like Winston or Pino:

```typescript
import pino from 'pino';

const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    target: 'pino-pretty',
    options: { colorize: true }
  }
});

logger.info({ userId, action }, 'User action completed');
```

**Log Rotation** - Configure log rotation to prevent disk space issues:

```bash
# /etc/logrotate.d/berlin-analytics
/var/log/berlin-analytics/*.log {
    daily
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 www-data www-data
    sharedscripts
}
```

---

## Security Hardening

### Application Security

**Rate Limiting** - Implement rate limiting to prevent abuse:

```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api', limiter);
```

**CORS Configuration** - Configure CORS to allow only trusted origins:

```typescript
app.use(cors({
  origin: ['https://your-domain.com'],
  credentials: true
}));
```

**Input Validation** - Validate all user inputs using Zod schemas before processing.

### Server Security

**Firewall Configuration** - Use UFW to restrict access:

```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

**Automatic Security Updates** - Enable unattended upgrades:

```bash
sudo apt install unattended-upgrades
sudo dpkg-reconfigure --priority=low unattended-upgrades
```

**SSH Hardening** - Disable password authentication and use SSH keys only:

```bash
# Edit /etc/ssh/sshd_config
PasswordAuthentication no
PermitRootLogin no
```

---

## Rollback Procedures

### Application Rollback

**Manus Platform** - Use the built-in rollback feature to restore a previous checkpoint instantly through the dashboard.

**Traditional Deployment** - Keep previous versions and symlink to active version:

```bash
# Directory structure
/var/www/berlin-analytics/
  releases/
    20241225_120000/
    20241224_150000/  # Previous version
  current -> releases/20241225_120000/

# Rollback
cd /var/www/berlin-analytics
rm current
ln -s releases/20241224_150000 current
pm2 restart berlin-analytics
```

### Database Rollback

**Restore from Backup:**

```bash
# Stop application
pm2 stop berlin-analytics

# Restore database
gunzip < /var/backups/mysql/backup_20241224_020000.sql.gz | mysql -u prod_user -p berlin_analytics

# Restart application
pm2 start berlin-analytics
```

---

## Troubleshooting

### Common Issues

**Database Connection Errors** - Verify DATABASE_URL is correct and the database server is accessible. Check firewall rules and MySQL user permissions.

**Build Failures** - Ensure all dependencies are installed with `pnpm install`. Check Node.js version matches requirements (18.0+).

**Port Already in Use** - Another process is using port 3000. Find and kill the process: `lsof -ti:3000 | xargs kill -9`

**SSL Certificate Errors** - Verify certificate files exist and have correct permissions. Renew Let's Encrypt certificates with `certbot renew`.

---

**Last Updated:** December 2024

**Maintained by:** Manus AI
