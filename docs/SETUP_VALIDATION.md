# EcareBots Developer Setup Validation Guide

**Version:** 1.0.0  
**Date:** December 16, 2025  
**Purpose:** Verify developer environment is properly configured for EcareBots implementation

---

## Quick Start Validation (2 minutes)

### One-Line Environment Check

```bash
npm run validate:env
# OR
python scripts/validate_environment.py
# OR
bash scripts/validate_setup.sh
```

**Expected Output:**
```
✅ Git repository: OK
✅ Node.js version: v18.16.0 (or higher)
✅ PostgreSQL: Installed and running
✅ Python: 3.9+ installed
✅ Docker: Installed
✅ .env file: Configured
✅ ALL CHECKS PASSED - Ready to develop!
```

---

## Manual Setup Validation Checklist

### 1. Prerequisites Installation

#### ✅ **Node.js & npm**

**Check:**
```bash
node --version
npm --version
```

**Expected:**
- Node.js: v18.0.0 or higher
- npm: 8.0.0 or higher

**If missing:**
```bash
# macOS
brew install node

# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash - && sudo apt-get install -y nodejs

# Windows
# Download from https://nodejs.org/
```

#### ✅ **Python 3.9+**

**Check:**
```bash
python3 --version
```

**Expected:** Python 3.9, 3.10, 3.11, or 3.12

**If missing:**
```bash
# macOS
brew install python3

# Ubuntu/Debian
sudo apt-get install python3.9 python3.9-venv

# Windows
# Download from https://www.python.org/downloads/
```

#### ✅ **PostgreSQL 14+**

**Check:**
```bash
psql --version
psql -U postgres -h localhost -c "SELECT version();"
```

**Expected:** PostgreSQL 14, 15, or 16

**If missing:**
```bash
# macOS
brew install postgresql@16
brew services start postgresql@16

# Ubuntu/Debian
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql

# Windows
# Download from https://www.postgresql.org/download/windows/
```

#### ✅ **Docker (Optional but Recommended)**

**Check:**
```bash
docker --version
docker run hello-world
```

**Expected:** Docker 20.10+ installed and running

**If missing:**
```bash
# macOS
brew install docker

# Windows/macOS
# Download Docker Desktop: https://www.docker.com/products/docker-desktop

# Linux
sudo apt-get install docker.io
```

#### ✅ **Git**

**Check:**
```bash
git --version
git config --list | grep user
```

**Expected:** Git 2.30+, user.name and user.email configured

**If missing:**
```bash
# Install Git
brew install git  # macOS
sudo apt-get install git  # Ubuntu

# Configure Git
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

---

### 2. Repository Setup

#### ✅ **Clone Repository**

```bash
git clone https://github.com/ArjunFrancis/ecarebots.git
cd ecarebots
git branch -a  # Verify branches
git log --oneline -5  # Verify commits
```

**Check:**
- [ ] Repository cloned successfully
- [ ] Remote origin set to ecarebots repo
- [ ] Branch list shows `main` branch
- [ ] Recent commits visible

#### ✅ **Verify Directory Structure**

```bash
ls -la
find . -maxdepth 2 -type d | head -20
```

**Expected Structure:**
```
ecarebots/
├── research/        ✅
├── architecture/    ✅
├── specifications/ ✅
├── docs/            ✅
├── datasets/        ✅
├── README.md        ✅
└── LICENSE          ✅
```

**Check:**
- [ ] All 5 main directories present
- [ ] README.md exists
- [ ] LICENSE file present
- [ ] .gitignore configured

---

### 3. Environment Configuration

#### ✅ **Create .env File**

```bash
cp .env.example .env  # If template exists
# OR
cat > .env << 'EOF'
# Application
NODE_ENV=development
PORT=3000

# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/ecarebots_dev
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ecarebots_dev
DB_USER=postgres
DB_PASSWORD=password

# API Keys (Get from service providers)
OPENAI_API_KEY=sk-...
ELEVENLABS_API_KEY=...
GOOGLE_CLOUD_API_KEY=...

# Security
JWT_SECRET=your-super-secret-key-change-in-production
ENCRYPTION_KEY=...

# Feature Flags
ENABLE_VOICE_INPUT=true
ENABLE_GESTURE_CONTROL=true
ENABLE_INSURANCE_API=false  # Enable after API setup
EOF
```

**Check:**
- [ ] .env file created
- [ ] All required variables present
- [ ] Database URL matches local setup
- [ ] No secrets committed to git

#### ✅ **Install Node Dependencies**

```bash
# Check if package.json exists
ls -la package.json

# Install dependencies
npm install

# Verify installation
npm list | head -20
node_modules/.bin/node --version
```

**Expected packages:**
- `react` or `next.js` (frontend)
- `express` (backend API)
- `sequelize` or `prisma` (ORM)
- `dotenv` (environment variables)
- `jest` (testing)

**Check:**
- [ ] node_modules directory created
- [ ] package-lock.json generated
- [ ] All dependencies installed (no `npm ERR!`)
- [ ] No security vulnerabilities: `npm audit`

#### ✅ **Install Python Dependencies (Optional)**

```bash
# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # macOS/Linux
# OR
venv\Scripts\activate  # Windows

# Install requirements
pip install --upgrade pip
pip install -r requirements.txt  # If file exists

# Verify
pip list | grep -i jupyter
python -c "import whisper; print(whisper.__version__)"
```

**Expected packages:**
- `openai` (API client)
- `whisper` (speech-to-text)
- `postgres-driver` (database)
- `flask` or `fastapi` (optional backend)

---

### 4. Database Setup

#### ✅ **Create PostgreSQL Database**

```bash
# Connect to PostgreSQL
psql -U postgres -h localhost

# Inside psql shell:
CREATE DATABASE ecarebots_dev;
CREATE USER ecarebots_user WITH PASSWORD 'secure_password';
ALTER ROLE ecarebots_user SET client_encoding TO 'utf8';
ALTER ROLE ecarebots_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE ecarebots_user SET default_transaction_deferrable TO on;
GRANT ALL PRIVILEGES ON DATABASE ecarebots_dev TO ecarebots_user;
\q  # Exit psql
```

**Check:**
- [ ] Database `ecarebots_dev` created
- [ ] User `ecarebots_user` created
- [ ] Permissions granted
- [ ] .env DATABASE_URL updated

#### ✅ **Run Database Migrations (If Applicable)**

```bash
# Prisma
npm run migrate:dev
# OR
# Sequelize
npm run db:migrate
# OR
# Alembic (Python)
alembic upgrade head
```

**Expected:**
```
✅ Migrations completed successfully
✅ Tables created: users, medications, appointments, insurance_policies, ...
✅ Indexes created
✅ Foreign keys established
```

#### ✅ **Seed Test Data (Optional)**

```bash
# Seed sample data
npm run db:seed

# Verify data
psql -U ecarebots_user -d ecarebots_dev -c "SELECT COUNT(*) FROM users;"
```

**Check:**
- [ ] Sample users inserted (should see >0)
- [ ] Sample medications available
- [ ] Sample appointments present
- [ ] Insurance policies loaded

#### ✅ **Verify Database Connection**

```bash
# From Node/JavaScript
node -e "const db = require('./db'); db.query('SELECT NOW()').then(console.log).catch(console.error);"

# From Python
python3 -c "import psycopg2; conn = psycopg2.connect('dbname=ecarebots_dev user=ecarebots_user password=password host=localhost'); print('Connected:', conn.get_dsn_parameters()); conn.close()"

# Direct psql
psql ecarebots_dev -U ecarebots_user -h localhost -c "SELECT version();"
```

**Expected:**
```
✅ PostgreSQL 15 (or your version)
✅ Connection successful
```

---

### 5. Backend Server Setup

#### ✅ **Start Backend Development Server**

```bash
# Express.js
npm run dev
# OR
# Uvicorn (Python/FastAPI)
uvicorn main:app --reload --port 3001
# OR
# Django
python manage.py runserver 3001
```

**Expected Output:**
```
✅ Server running on http://localhost:3001
✅ Database connected
✅ Ready to receive requests
```

#### ✅ **Test API Endpoints**

```bash
# In another terminal, test API
curl -X GET http://localhost:3001/api/health
# OR
echo 'POST http://localhost:3001/api/medications' | http
```

**Expected Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-12-16T01:43:00Z",
  "version": "1.0.0"
}
```

**Check:**
- [ ] GET /api/health returns 200 OK
- [ ] Database connection logged
- [ ] No error messages
- [ ] API responding on port 3001

---

### 6. Frontend Setup

#### ✅ **Install Frontend Dependencies**

```bash
cd frontend/  # If separate directory
npm install

# Verify React/Next.js
npm list react react-dom next
```

**Expected:** React 18+, Next.js 13+ (if using Next)

#### ✅ **Start Frontend Development Server**

```bash
npm run dev
# Expect:
# ✅ Frontend running on http://localhost:3000
# ✅ Hot reload enabled
```

**Check:**
- [ ] Frontend starts on http://localhost:3000
- [ ] Page loads without errors
- [ ] Hot reload working (edit file, see changes instantly)
- [ ] No console errors

#### ✅ **Test Frontend Build**

```bash
npm run build
npm run start
# Expect:
# ✅ Build successful
# ✅ Production build running
```

---

### 7. Testing Environment

#### ✅ **Run Unit Tests**

```bash
# Run all tests
npm run test

# Run with coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

**Expected:**
```
PASS  src/__tests__/medications.test.js
PASS  src/__tests__/appointments.test.js
PASS  src/__tests__/insurance.test.js

  Test Suites: 3 passed, 3 total
  Tests: 45 passed, 45 total
  Snapshots: 0 total
  Time: 5.234 s
```

**Check:**
- [ ] All tests pass
- [ ] Code coverage >80%
- [ ] No failing tests
- [ ] No console warnings

#### ✅ **Run Linting**

```bash
# ESLint
npm run lint
npm run lint:fix  # Auto-fix issues

# Prettier (code formatting)
npm run format

# Type checking (TypeScript)
npm run type-check
```

**Expected:**
```
✅ No linting errors
✅ All files formatted correctly
✅ TypeScript types verified
```

---

### 8. Docker Setup (Optional)

#### ✅ **Build Docker Image**

```bash
# Build backend image
docker build -t ecarebots-backend:latest -f Dockerfile.backend .

# Build frontend image
docker build -t ecarebots-frontend:latest -f Dockerfile.frontend .

# Verify images
docker images | grep ecarebots
```

**Expected:**
```
ecarebots-backend    latest    abc123def456   5 seconds ago   450MB
ecarebots-frontend   latest    xyz789uvw123   10 seconds ago  120MB
```

#### ✅ **Run with Docker Compose**

```bash
# Start all services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f api

# Stop services
docker-compose down
```

**Expected:**
```
NAME                 STATUS     PORTS
ecarebots-db         Up         5432/tcp
ecarebots-api        Up         0.0.0.0:3001->3001/tcp
ecarebots-frontend   Up         0.0.0.0:3000->3000/tcp
```

---

## Troubleshooting Guide

### Issue: "Database connection refused"

**Cause:** PostgreSQL not running

**Solution:**
```bash
# Check PostgreSQL status
sudo systemctl status postgresql  # Linux
brew services list | grep postgres  # macOS

# Start PostgreSQL
sudo systemctl start postgresql  # Linux
brew services start postgresql@16  # macOS

# Verify connection
psql -U postgres -h localhost -c "SELECT 1;"
```

### Issue: "Cannot find module 'react'"

**Cause:** node_modules not installed or corrupted

**Solution:**
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Or use npm ci (recommended for CI/CD)
npm ci
```

### Issue: "Port 3000 already in use"

**Cause:** Another process using port

**Solution:**
```bash
# Find process using port 3000
lsof -i :3000  # macOS/Linux
netstat -ano | findstr :3000  # Windows

# Kill the process
kill -9 <PID>  # macOS/Linux
taskkill /PID <PID> /F  # Windows

# Or use different port
PORT=3001 npm run dev
```

### Issue: "OpenAI API key not found"

**Cause:** .env not configured

**Solution:**
```bash
# Get API key from https://platform.openai.com/api-keys
echo "OPENAI_API_KEY=sk-your-key-here" >> .env

# Verify
npm run test:api
```

### Issue: "Webpack build fails"

**Cause:** Syntax errors or missing dependencies

**Solution:**
```bash
# Clear cache
rm -rf .next node_modules/.cache

# Rebuild
npm run build

# Check for errors
npm run lint

# Review error message for specific file
# Fix syntax error and rebuild
```

### Issue: "npm ERR! code EACCES"

**Cause:** Permission issues

**Solution:**
```bash
# Fix npm permissions (macOS/Linux)
sudo chown -R $(whoami) ~/.npm
sudo chown -R $(whoami) /usr/local/lib/node_modules

# Clear npm cache
npm cache clean --force

# Reinstall
npm install
```

---

## Health Check Commands

### Daily Verification

```bash
#!/bin/bash
# Run daily health checks

echo "=== EcareBots Dev Environment Health Check ==="
echo ""

echo "1. Git Status"
git status
echo ""

echo "2. Node.js Version"
node --version
echo ""

echo "3. npm Dependencies"
npm outdated || echo "All packages up to date"
echo ""

echo "4. Database Connection"
psql ecarebots_dev -U ecarebots_user -c "SELECT COUNT(*) as user_count FROM users;" || echo "Database check failed"
echo ""

echo "5. Backend Server"
if curl -s http://localhost:3001/api/health > /dev/null; then
  echo "Backend running on http://localhost:3001"
else
  echo "Backend not responding - start with: npm run dev"
fi
echo ""

echo "6. Frontend Server"
if curl -s http://localhost:3000 > /dev/null; then
  echo "Frontend running on http://localhost:3000"
else
  echo "Frontend not responding - start with: npm run dev"
fi
echo ""

echo "=== Health Check Complete ==="
```

### Save as: `scripts/health-check.sh`

```bash
chmod +x scripts/health-check.sh
bash scripts/health-check.sh
```

---

## First Time Setup (Complete Walkthrough)

### Step 1: Prerequisites (10 min)
```bash
node --version  # Should be v18+
python3 --version  # Should be 3.9+
psql --version  # Should be PostgreSQL 14+
```

### Step 2: Clone Repository (2 min)
```bash
git clone https://github.com/ArjunFrancis/ecarebots.git
cd ecarebots
```

### Step 3: Install Dependencies (5 min)
```bash
npm install
pip install -r requirements.txt  # Optional
```

### Step 4: Configure Environment (3 min)
```bash
cp .env.example .env
# Edit .env with your settings
```

### Step 5: Setup Database (5 min)
```bash
# Create database
createdb ecarebots_dev

# Run migrations
npm run migrate:dev

# Seed data
npm run db:seed
```

### Step 6: Start Development Servers (2 min)
```bash
# Terminal 1: Backend
npm run dev

# Terminal 2: Frontend
cd frontend && npm run dev
```

### Step 7: Verify Setup (2 min)
```bash
# Browser 1: Backend API
curl http://localhost:3001/api/health

# Browser 2: Frontend
open http://localhost:3000
```

**Total Time: ~30 minutes**

---

## Next Steps After Setup

1. ✅ Read [DEVELOPER_QUICK_START.md](./DEVELOPER_QUICK_START.md) (5 min)
2. ✅ Review role-specific docs:
   - AI Engineer: [ai-agent-design.md](../architecture/ai-agent-design.md)
   - Backend: [database-schema.md](../architecture/database-schema.md)
   - Frontend: [uiux-design-principles.md](../specifications/uiux-design-principles.md)
3. ✅ Run tests: `npm run test`
4. ✅ Make first commit to feature branch
5. ✅ Reference [IMPLEMENTATION_HANDOFF.md](./IMPLEMENTATION_HANDOFF.md) for tasks

---

## Support & Troubleshooting

**Getting Help:**
- 📄 Check [LINK_VALIDATION.md](./LINK_VALIDATION.md) for doc references
- 💛 GitHub Issues: [Report a bug](https://github.com/ArjunFrancis/ecarebots/issues)
- 💬 GitHub Discussions: [Ask a question](https://github.com/ArjunFrancis/ecarebots/discussions)
- 📧 Email: [arjunfrancis21@gmail.com](mailto:arjunfrancis21@gmail.com)

**Common Issues:**
- [Database connection refused](#issue-database-connection-refused)
- [Cannot find module 'react'](#issue-cannot-find-module-react)
- [Port already in use](#issue-port-3000-already-in-use)
- [API key not found](#issue-openai-api-key-not-found)

---

*Setup Guide v1.0 - Created December 16, 2025*  
*Status: ✅ READY FOR USE*
