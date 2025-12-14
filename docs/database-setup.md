# Database Setup Guide

## **Executive Summary**

EcareBots uses **PostgreSQL** as the primary database. This guide covers:
- Local development setup
- Docker containerization
- Database migrations
- Sample data loading
- Production deployment checklist

---

## **Part 1: Local Development Setup**

### **1.1 Prerequisites**

**On macOS:**
```bash
brew install postgresql@15
brew services start postgresql@15
```

**On Ubuntu/Debian:**
```bash
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

**On Windows:**
1. Download PostgreSQL installer: https://www.postgresql.org/download/windows/
2. Run installer and set password for `postgres` user
3. Select pgAdmin as additional component

### **1.2 Verify Installation**

```bash
psql --version
# Output: psql (PostgreSQL) 15.x

psql postgres
# Should connect to default database
```

---

## **Part 2: Create Development Database**

### **2.1 Create Database and User**

```bash
# Connect as postgres user
sudo -u postgres psql

# In psql:
CREATE DATABASE ecarebots_dev;
CREATE USER ecarebots WITH PASSWORD 'dev_password_123';
ALTER ROLE ecarebots WITH CREATEDB;

# Grant privileges
GRANT CONNECT ON DATABASE ecarebots_dev TO ecarebots;
GRANT USAGE ON SCHEMA public TO ecarebots;
GRANT CREATE ON SCHEMA public TO ecarebots;

# Verify
\du  # List users
\l   # List databases

# Exit psql
\q
```

### **2.2 Setup Environment Variables**

```bash
# .env.local (never commit this!)
DATABASE_URL=postgresql://ecarebots:dev_password_123@localhost:5432/ecarebots_dev
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ecarebots_dev
DB_USER=ecarebots
DB_PASSWORD=dev_password_123
```

### **2.3 Test Connection**

```bash
# Using psql
psql postgresql://ecarebots:dev_password_123@localhost:5432/ecarebots_dev

# Or using Node.js
npm install pg
node -e "
const { Client } = require('pg');
const client = new Client({
  connectionString: process.env.DATABASE_URL
});
client.connect()
  .then(() => console.log('✅ Connected to database'))
  .catch(err => console.error('❌ Connection failed:', err))
  .finally(() => client.end());
"
```

---

## **Part 3: Database Schema Setup**

### **3.1 Initialize Schema with Migrations**

**Install migration tool:**
```bash
npm install --save-dev db-migrate db-migrate-pg
```

**Create migrations directory:**
```bash
mkdir migrations
```

### **3.2 Create Migration Files**

**Migration 001: Create users table**

```bash
db-migrate create create-users-table
```

**migrations/001-create-users-table.js:**
```javascript
exports.up = function(db, callback) {
  db.createTable('users', {
    id: {
      type: 'uuid',
      primaryKey: true,
      defaultValue: new String('gen_random_uuid()')
    },
    email: {
      type: 'string',
      length: 255,
      notNull: true,
      unique: true
    },
    password_hash: {
      type: 'string',
      length: 255,
      notNull: true
    },
    first_name: { type: 'string', length: 100 },
    last_name: { type: 'string', length: 100 },
    date_of_birth: { type: 'date' },
    phone: { type: 'string', length: 20 },
    accessibility_mode: {
      type: 'string',
      enum: ['voice_only', 'gesture', 'standard'],
      defaultValue: 'standard'
    },
    created_at: {
      type: 'timestamp',
      defaultValue: new String('CURRENT_TIMESTAMP')
    },
    updated_at: {
      type: 'timestamp',
      defaultValue: new String('CURRENT_TIMESTAMP')
    }
  }, callback);
};

exports.down = function(db, callback) {
  db.dropTable('users', callback);
};
```

**Migration 002: Create schedules table**

```javascript
exports.up = function(db, callback) {
  db.createTable('health_schedules', {
    id: {
      type: 'uuid',
      primaryKey: true,
      defaultValue: new String('gen_random_uuid()')
    },
    user_id: {
      type: 'uuid',
      notNull: true,
      foreignKey: {
        name: 'fk_schedules_user',
        table: 'users',
        rules: { onDelete: 'CASCADE' }
      }
    },
    title: { type: 'string', length: 255, notNull: true },
    type: {
      type: 'string',
      enum: ['medication', 'appointment', 'vital', 'test'],
      notNull: true
    },
    frequency: {
      type: 'string',
      enum: ['once', 'daily', 'weekly', 'monthly'],
      notNull: true
    },
    time: { type: 'time' },
    reminder_enabled: { type: 'boolean', defaultValue: true },
    reminder_method: {
      type: 'string',
      enum: ['voice', 'sms', 'email'],
      defaultValue: 'voice'
    },
    created_at: { type: 'timestamp', defaultValue: new String('CURRENT_TIMESTAMP') },
    updated_at: { type: 'timestamp', defaultValue: new String('CURRENT_TIMESTAMP') }
  }, callback);
};

exports.down = function(db, callback) {
  db.dropTable('health_schedules', callback);
};
```

### **3.3 Run Migrations**

```bash
# Run all pending migrations
db-migrate up

# Check migration status
db-migrate status

# Rollback last migration
db-migrate down
```

---

## **Part 4: Docker Setup (Optional but Recommended)**

### **4.1 Dockerfile for PostgreSQL**

```dockerfile
# Dockerfile.db
FROM postgres:15-alpine

ENV POSTGRES_DB=ecarebots_dev \
    POSTGRES_USER=ecarebots \
    POSTGRES_PASSWORD=dev_password_123

# Copy initialization scripts
COPY ./db/init.sql /docker-entrypoint-initdb.d/

EXPOSE 5432
```

### **4.2 Docker Compose**

```yaml
# docker-compose.yml
version: '3.8'

services:
  db:
    build:
      context: .
      dockerfile: Dockerfile.db
    environment:
      POSTGRES_DB: ecarebots_dev
      POSTGRES_USER: ecarebots
      POSTGRES_PASSWORD: dev_password_123
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ecarebots"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:

networks:
  default:
    name: ecarebots-network
```

### **4.3 Start Docker Services**

```bash
# Start services in background
docker-compose up -d

# View logs
docker-compose logs -f db

# Connect to database
docker-compose exec db psql -U ecarebots -d ecarebots_dev

# Stop services
docker-compose down
```

---

## **Part 5: Sample Data Loading**

### **5.1 Create Sample Data Script**

```sql
-- db/sample_data.sql

-- Insert sample user
INSERT INTO users (
  email, password_hash, first_name, last_name,
  date_of_birth, phone, accessibility_mode
) VALUES (
  'john@example.com',
  '$2b$10$...',  -- Hashed password for 'password123'
  'John',
  'Doe',
  '1960-01-15',
  '+1-555-0123',
  'voice_only'
) RETURNING id;

-- Insert sample schedules (after getting user ID)
INSERT INTO health_schedules (
  user_id, title, type, frequency, time, reminder_enabled, reminder_method
) VALUES
  (
    'USER_ID_HERE',
    'Metformin 500mg',
    'medication',
    'daily',
    '09:00',
    true,
    'voice'
  ),
  (
    'USER_ID_HERE',
    'Blood Pressure Check',
    'vital',
    'daily',
    '18:00',
    true,
    'voice'
  );
```

### **5.2 Load Sample Data**

```bash
# Using psql
psql postgresql://ecarebots:dev_password_123@localhost:5432/ecarebots_dev < db/sample_data.sql

# Or using Node.js
const fs = require('fs');
const { Client } = require('pg');

const client = new Client();
client.connect();

const sql = fs.readFileSync('./db/sample_data.sql', 'utf8');
client.query(sql, (err, res) => {
  if (err) console.error(err);
  else console.log('Sample data loaded');
  client.end();
});
```

---

## **Part 6: Backup and Restore**

### **6.1 Create Backup**

```bash
# Full database backup
pg_dump postgresql://ecarebots:dev_password_123@localhost:5432/ecarebots_dev \
  > backups/ecarebots_dev_$(date +%Y%m%d_%H%M%S).sql

# Compressed backup
pg_dump postgresql://ecarebots:dev_password_123@localhost:5432/ecarebots_dev \
  | gzip > backups/ecarebots_dev_$(date +%Y%m%d_%H%M%S).sql.gz

# Custom format (recommended for large databases)
pg_dump -Fc postgresql://ecarebots:dev_password_123@localhost:5432/ecarebots_dev \
  > backups/ecarebots_dev_$(date +%Y%m%d_%H%M%S).dump
```

### **6.2 Restore from Backup**

```bash
# SQL format
psql postgresql://ecarebots:dev_password_123@localhost:5432/ecarebots_dev < backups/backup.sql

# Gzip compressed
gzcat backups/backup.sql.gz | psql postgresql://ecarebots:dev_password_123@localhost:5432/ecarebots_dev

# Custom format
pg_restore -d ecarebots_dev backups/backup.dump
```

---

## **Part 7: Monitoring and Maintenance**

### **7.1 Check Database Size**

```sql
-- Show database size
SELECT pg_database.datname,
  pg_size_pretty(pg_database_size(pg_database.datname)) AS size
FROM pg_database
WHERE datname = 'ecarebots_dev';
```

### **7.2 Show Table Sizes**

```sql
SELECT
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### **7.3 Vacuum and Analyze**

```sql
-- Clean up dead rows
VACUUM ANALYZE;

-- Or for specific table
VACUUM ANALYZE health_schedules;
```

### **7.4 Check Connection Count**

```sql
SELECT datname, count(*) FROM pg_stat_activity GROUP BY datname;
```

---

## **Part 8: Production Deployment**

### **8.1 Production Checklist**

- [ ] **Security**
  - [ ] Strong password for postgres superuser
  - [ ] Strong password for application user
  - [ ] Enable SSL/TLS for remote connections
  - [ ] Restrict network access (firewall rules)
  - [ ] Enable password authentication only (no trust)

- [ ] **Performance**
  - [ ] Tune postgresql.conf settings
  - [ ] Set appropriate shared_buffers (25% of RAM)
  - [ ] Set effective_cache_size (50-75% of RAM)
  - [ ] Create indexes on frequently queried columns
  - [ ] Run ANALYZE to gather statistics

- [ ] **Monitoring**
  - [ ] Enable PostgreSQL logging
  - [ ] Set up replication/backup
  - [ ] Monitor disk space
  - [ ] Monitor slow queries
  - [ ] Set up alerts

- [ ] **Backup**
  - [ ] Daily automated backups
  - [ ] Test restore procedures
  - [ ] Store backups in secure location
  - [ ] Implement point-in-time recovery (WAL archiving)

### **8.2 Production Connection String**

```bash
# Use environment variable, never hardcode
DATABASE_URL=postgresql://app_user:STRONG_PASSWORD@prod-db.example.com:5432/ecarebots_prod?sslmode=require
```

### **8.3 PostgreSQL Configuration for Production**

```ini
# postgresql.conf excerpt

# Connection settings
max_connections = 100
listening_addresses = 'localhost'
port = 5432
ssl = on
ssl_cert_file = '/etc/postgresql/server.crt'
ssl_key_file = '/etc/postgresql/server.key'

# Memory settings (adjust based on server RAM)
shared_buffers = 4GB
effective_cache_size = 12GB
work_mem = 10MB
maintenance_work_mem = 1GB

# Logging
log_statement = 'mod'
log_duration = on
log_min_duration_statement = 1000  # Log queries slower than 1 second
log_connections = on
log_disconnections = on

# WAL (for point-in-time recovery)
wal_level = replica
max_wal_senders = 3
wal_keep_size = 1GB
```

---

## **Troubleshooting**

| Issue | Cause | Solution |
|-------|-------|----------|
| **Connection refused** | PostgreSQL not running | `sudo systemctl start postgresql` |
| **Authentication failed** | Wrong password | Check `.env` file, verify credentials |
| **Role does not exist** | User not created | Run user creation steps again |
| **Cannot create database** | Permissions missing | Grant CREATEDB to user |
| **Disk full** | Database too large | Increase storage, delete old backups |
| **Slow queries** | Missing indexes | Create indexes, run ANALYZE |

---

## **Resources**

- [PostgreSQL Official Documentation](https://www.postgresql.org/docs/)
- [PostgreSQL Performance Tips](https://wiki.postgresql.org/wiki/Performance_Optimization)
- [pg_dump Guide](https://www.postgresql.org/docs/current/app-pgdump.html)
- [Database Normalization](https://en.wikipedia.org/wiki/Database_normalization)

---

<div align="center">

**Schema Design:** [Database Schema](../architecture/database-schema.md)  
**Deployment:** [Deployment Guide](./deployment-guide.md)  
**Questions?** [GitHub Issues](https://github.com/ArjunFrancis/ecarebots/issues)

</div>
