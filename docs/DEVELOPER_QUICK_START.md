# EcareBots Developer Quick Start

**Time to Read:** 5 minutes  
**Goal:** Get up to speed on the EcareBots project in minimum time

---

## 🚀 What is EcareBots?

**Healthcare coordination platform** for elderly, disabled, and mobility-challenged users.

**Three Magic Words:**
1. 🌐 **Voice-First** – "Schedule my appointment" (no typing)
2. 🧈 **Accessible** – Large text, high contrast, WCAG AAA compliance
3. 🤖 **AI-Powered** – Smart agents handle scheduling, insurance, reminders

**Target Users:** 65+, visually impaired, mobility-impaired, cognitively challenged

---

## 📊 Your First 10 Minutes

### **1. Read the Mission (2 min)**
Open [README.md](../README.md) and read sections:
- 🎯 Mission
- ✨ What Makes EcareBots Different
- 🔨️ Core Features

### **2. Understand the Architecture (3 min)**
Open [architecture/system-architecture.md](../architecture/system-architecture.md) and examine:
- The ASCII architecture diagram
- User Interfaces layer → AI Agents → Integrations → Database

### **3. Know What You're Building (3 min)**
Open [specifications/feature-specifications.md](../specifications/feature-specifications.md) and skim:
- Feature 1: Medication Management
- Feature 2: Doctor Appointment Booking
- Feature 3: Insurance Verification

### **4. Know Your Constraints (2 min)**
Open [research/security-and-privacy.md](../research/security-and-privacy.md):
- HIPAA compliance (encrypt everything, audit logs)
- Authentication (OAuth 2.0)
- Data privacy (no hardcoded secrets)

---

## 📄 Key Documents by Role

### **Full-Stack Developers**
1. [architecture/system-architecture.md](../architecture/system-architecture.md) – System design
2. [architecture/database-schema.md](../architecture/database-schema.md) – Database design
3. [architecture/api-specification.md](../architecture/api-specification.md) – API contracts
4. [specifications/feature-specifications.md](../specifications/feature-specifications.md) – Feature requirements
5. **Then:** [docs/IMPLEMENTATION_HANDOFF.md](./IMPLEMENTATION_HANDOFF.md) – How to build it

### **Frontend Developers**
1. [specifications/uiux-design-principles.md](../specifications/uiux-design-principles.md) – Design system
2. [architecture/multimodal-pipeline.md](../architecture/multimodal-pipeline.md) – Voice/gesture/vision
3. [specifications/user-flows.md](../specifications/user-flows.md) – User journeys
4. [specifications/feature-specifications.md](../specifications/feature-specifications.md) – Feature specs

### **Backend Developers**
1. [architecture/database-schema.md](../architecture/database-schema.md) – Database design
2. [architecture/api-specification.md](../architecture/api-specification.md) – API design
3. [architecture/ai-agent-design.md](../architecture/ai-agent-design.md) – AI agent architecture
4. [research/integration-landscape.md](../research/integration-landscape.md) – External APIs
5. [research/security-and-privacy.md](../research/security-and-privacy.md) – Security requirements

### **AI/ML Engineers**
1. [architecture/ai-agent-design.md](../architecture/ai-agent-design.md) – Agent architecture
2. [architecture/multimodal-pipeline.md](../architecture/multimodal-pipeline.md) – Voice/gesture/vision AI
3. [research/ai-agent-frameworks.md](../research/ai-agent-frameworks.md) – Framework options
4. [research/multimodal-frameworks.md](../research/multimodal-frameworks.md) – Multimodal models
5. [datasets/open-datasets.md](../datasets/open-datasets.md) – Training data

### **Security/DevOps Engineers**
1. [research/security-and-privacy.md](../research/security-and-privacy.md) – Full security spec
2. [research/risk-and-failure-modes.md](../research/risk-and-failure-modes.md) – Risk analysis
3. [architecture/tech-stack-justification.md](../architecture/tech-stack-justification.md) – Tech security aspects
4. **Then:** [docs/IMPLEMENTATION_HANDOFF.md](./IMPLEMENTATION_HANDOFF.md) – Deployment section

### **Accessibility/QA Engineers**
1. [specifications/uiux-design-principles.md](../specifications/uiux-design-principles.md) – Accessibility standards
2. [research/accessibility-patterns.md](../research/accessibility-patterns.md) – Accessibility deep dive
3. [specifications/feature-specifications.md](../specifications/feature-specifications.md) – Acceptance criteria

---

## 📋 One-Page Tech Stack

```
┌─────────────────────────────────────────────────┐
│             FRONTEND (React + Next.js)          │
│  - TypeScript, Tailwind CSS, React Router      │
│  - Voice: OpenAI Whisper (speech-to-text)      │
│  - Voice: ElevenLabs (text-to-speech)          │
│  - Gesture: MediaPipe Hands (hand tracking)    │
│  - State: Zustand or Redux                     │
├─────────────────────────────────────────────────┤
│         BACKEND (Node.js + Express)            │
│  - TypeScript, Supabase (PostgreSQL + Auth)    │
│  - AI Agents: LangChain + GPT-4/Claude        │
│  - Scheduled Jobs: Bull queue (Redis)          │
│  - Notifications: Twilio (SMS), Firebase       │
├─────────────────────────────────────────────────┤
│          DATABASE (PostgreSQL)                 │
│  - Users, Medications, Appointments,           │
│  - Insurance, Adherence Logs, Audit Trail      │
├─────────────────────────────────────────────────┤
│         EXTERNAL INTEGRATIONS                  │
│  - EHR: 1up Health (Epic/Cerner FHIR)         │
│  - Insurance: Availity (eligibility)           │
│  - Pharmacy: Surescripts (refills) [post-MVP]  │
├─────────────────────────────────────────────────┤
│          DEPLOYMENT (Vercel + Railway)         │
│  - Frontend: Vercel (auto-deploy from main)    │
│  - Backend: Railway (Docker + auto-scaling)    │
│  - Monitoring: Sentry, Datadog, LogRocket      │
└─────────────────────────────────────────────────┘
```

Detailed justification: [tech-stack-justification.md](../architecture/tech-stack-justification.md)

---

## 🔌 Database Schema (Simplified)

```sql
-- Users
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR UNIQUE NOT NULL,
  name VARCHAR NOT NULL,
  phone VARCHAR,
  dob DATE,
  accessibility_settings JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Medications
CREATE TABLE medications (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users,
  name VARCHAR NOT NULL,
  dosage VARCHAR,
  frequency VARCHAR,
  next_dose_time TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Appointments
CREATE TABLE appointments (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users,
  provider_name VARCHAR,
  specialty VARCHAR,
  appointment_time TIMESTAMP NOT NULL,
  status VARCHAR (SCHEDULED | CANCELLED | COMPLETED),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Insurance
CREATE TABLE insurance (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users,
  member_id VARCHAR,
  group_number VARCHAR,
  plan_name VARCHAR,
  copay DECIMAL,
  status VARCHAR (ACTIVE | EXPIRED),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Adherence Logs
CREATE TABLE adherence_logs (
  id UUID PRIMARY KEY,
  medication_id UUID REFERENCES medications,
  action VARCHAR (TAKEN | SKIPPED),
  timestamp TIMESTAMP DEFAULT NOW()
);

-- Audit Trail
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users,
  action VARCHAR,
  resource VARCHAR,
  timestamp TIMESTAMP DEFAULT NOW()
);
```

Full schema: [database-schema.md](../architecture/database-schema.md)

---

## 💾 API Endpoints (Summary)

```
-- AUTHENTICATION
POST   /auth/register              Create new user account
POST   /auth/login                 Login and get JWT
POST   /auth/refresh               Refresh access token
POST   /auth/logout                Logout (invalidate token)

-- MEDICATIONS
GET    /medications                List user's medications
POST   /medications                Add new medication
PUT    /medications/:id            Edit medication
DELETE /medications/:id            Delete medication
POST   /adherence                  Log medication taken/skipped
GET    /adherence?startDate=X      Get adherence history

-- APPOINTMENTS
GET    /appointments               List user's appointments
POST   /appointments               Create appointment
GET    /appointments/search        Search providers by specialty, location
PUT    /appointments/:id           Reschedule appointment
DELETE /appointments/:id           Cancel appointment

-- INSURANCE
GET    /insurance                  List user's insurance policies
POST   /insurance                  Add insurance card (OCR or manual)
PUT    /insurance/:id              Update insurance details
POST   /insurance/:id/verify       Query Availity for eligibility

-- NOTIFICATIONS
GET    /notifications              List pending notifications
POST   /notifications/:id/send     Manually trigger notification
```

Full API spec: [api-specification.md](../architecture/api-specification.md)

---

## 🤖 AI Agents Overview

**Five specialized agents** coordinated by an Orchestrator:

1. **Scheduler Agent** – Books and manages appointments
   - Input: "Schedule cardiology appointment next Tuesday at 3pm"
   - Process: Provider search → slot availability → booking
   - Output: Appointment confirmed + reminder set

2. **Medication Agent** – Manages medications and reminders
   - Input: "Add insulin 10 units before breakfast"
   - Process: Drug lookup → reminder scheduling
   - Output: Medication tracked, reminder set

3. **Insurance Agent** – Verifies coverage and optimizes plans
   - Input: "Check my insurance coverage"
   - Process: API call to Availity → parse response
   - Output: Coverage summary displayed

4. **Document Agent** – Tracks expiring documents (post-MVP)
5. **Front-Desk Agent** – Clinic automation (post-MVP)

**Orchestrator Agent** – Routes user intents to appropriate agent
- Input: "Schedule an appointment and remind me about my insulin"
- Process: Intent recognition → route to Scheduler + Medication agents
- Output: Both tasks executed

Detail: [ai-agent-design.md](../architecture/ai-agent-design.md)

---

## 🔓 Security Checklist

Before writing any code:

- [ ] All PHI (medications, appointments, insurance) encrypted at rest and in transit
- [ ] All API calls require JWT authentication
- [ ] All user inputs validated and sanitized (no SQL injection, XSS)
- [ ] All external API calls use HTTPS with certificate validation
- [ ] Database queries use parameterized statements (no string concatenation)
- [ ] No secrets (API keys, database passwords) hardcoded; use .env file
- [ ] Audit logs track who accessed what data and when
- [ ] Rate limiting to prevent brute force attacks
- [ ] CORS properly configured (only allow ecarebots.com domain)
- [ ] Password hashing with bcrypt (not plain text)
- [ ] Session tokens expire after 15 minutes of inactivity

Detail: [security-and-privacy.md](../research/security-and-privacy.md)

---

## ♾️ Accessibility Checklist

Every feature must support:

- [ ] **Voice-only operation** (no keyboard/touch required)
- [ ] **Large text** (minimum 18pt, configurable up to 24pt+)
- [ ] **High contrast** (WCAG AA minimum, AAA preferred)
- [ ] **Screen reader support** (all text announced clearly)
- [ ] **Touch targets** (minimum 44x44 pixels for buttons)
- [ ] **No time limits** (user can take as long as needed)
- [ ] **Keyboard navigation** (Tab key to move through all fields)
- [ ] **ARIA labels** (all buttons and form fields properly labeled)
- [ ] **Error messages in plain language** (6th-grade reading level)

Target: **WCAG 2.1 AAA compliance** on all pages

Detail: [uiux-design-principles.md](../specifications/uiux-design-principles.md)

---

## 🔍 Common Questions

**Q: Why voice-first?**  
A: Elderly and mobility-impaired users struggle with screens, keyboards, and touchscreens. Voice is accessible and natural.

**Q: Why WCAG AAA (not just AA)?**  
A: Target users include visually and cognitively impaired. AAA ensures they can use the app independently.

**Q: What about privacy?**  
A: HIPAA compliance is non-negotiable. All health data encrypted, access logged, BAAs signed with vendors.

**Q: Will voice recognition work for elderly users?**  
A: Yes, with multi-accent training (Mozilla Common Voice dataset). We'll test with diverse user groups.

**Q: When do we integrate with Epic/Cerner?**  
A: MVP uses 1up Health (FHIR wrapper). Direct integration in post-MVP if needed.

**Q: Can users opt out of AI?**  
A: Yes. Manual entry fallback always available. AI augments, never forces.

---

## 📬 Next Steps

1. **Read** your role-specific docs (see "Key Documents by Role" above)
2. **Set up** local environment (Node.js, PostgreSQL, .env file)
3. **Review** [IMPLEMENTATION_HANDOFF.md](./IMPLEMENTATION_HANDOFF.md) for Phase 1 tasks
4. **Ask questions** in GitHub Issues (tag with `question`, `clarification`)
5. **Start building** – Good luck! 🚀

---

## 📖 Quick Links

- **Project repo:** https://github.com/ArjunFrancis/ecarebots
- **Project website:** https://ecarebots.com
- **Contact:** arjunfrancis21@gmail.com
- **Issues:** https://github.com/ArjunFrancis/ecarebots/issues
- **Discussions:** https://github.com/ArjunFrancis/ecarebots/discussions

---

**Welcome to the team! You're building the future of accessible healthcare. 🌟**

*Last updated: December 12, 2025*
