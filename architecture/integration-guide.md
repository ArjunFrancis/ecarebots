# Integration Guide: EHR, Insurance & Pharmacy APIs

## **Executive Summary**

EcareBots integrates with three critical healthcare ecosystems:
1. **Electronic Health Records (EHR)** – Epic, Cerner, Athena for patient data access
2. **Insurance Verification** – Availity, Change Healthcare for real-time eligibility checks
3. **Pharmacy** – Surescripts for prescription management

This guide provides step-by-step integration patterns, code examples, and best practices for connecting to these APIs in the EcareBots backend.

---

## **Architecture Overview**

```
┌─────────────────────────────────────────────────────────────┐
│                      EcareBots Backend                       │
│                     (Node.js + Express)                      │
└──────────────────────────┬──────────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼
   ┌─────────┐       ┌──────────┐       ┌──────────┐
   │   EHR   │       │ Insurance │       │ Pharmacy │
   │ Service │       │ Service   │       │ Service  │
   └────┬────┘       └─────┬────┘       └─────┬────┘
        │                  │                  │
        ▼                  ▼                  ▼
  ┌──────────────┐   ┌──────────────┐   ┌──────────────┐
  │ Epic FHIR    │   │ Availity     │   │ Surescripts  │
  │ Cerner FHIR  │   │ Change HC    │   │ NCPDP        │
  │ 1up Health   │   │ API          │   │ API          │
  │ Redox        │   │              │   │              │
  └──────────────┘   └──────────────┘   └──────────────┘
```

---

## **Part 1: EHR Integration (Epic, Cerner, Athena)**

### **1.1 Overview**

**What you need:**
- **SMART-on-FHIR authentication** (OAuth 2.0)
- **FHIR R4 API endpoints** for Patient, Appointment, Medication resources
- **Backend Service Account** credentials for server-to-server communication

**Best approach for EcareBots:** Use **1up Health** or **Redox** as an intermediary:
- Handles authentication complexity
- Normalizes data across EHR vendors
- Provides unified FHIR endpoints
- Simplifies compliance (BAA included)

---

### **1.2 Setup: Using 1up Health (Recommended)**

#### **Step 1: Register with 1up Health**

1. Go to [1up Health](https://1up.health/)
2. Sign up for developer account
3. Create application → Get API credentials:
   ```
   Client ID: your-client-id
   Client Secret: your-client-secret
   ```
4. Set redirect URI: `https://yourdomain.com/auth/callback`

#### **Step 2: Install Dependencies**

```bash
npm install axios dotenv jsonwebtoken
```

#### **Step 3: Setup Environment Variables**

```bash
# .env
ONEUP_CLIENT_ID=your-client-id
ONEUP_CLIENT_SECRET=your-client-secret
ONEUP_API_URL=https://api.1up.health
ONEUP_REDIRECT_URI=https://yourdomain.com/auth/callback
```

#### **Step 4: Create EHR Service**

```javascript
// services/ehrService.js
const axios = require('axios');
const jwt = require('jsonwebtoken');

class EHRService {
  constructor() {
    this.baseURL = process.env.ONEUP_API_URL;
    this.clientId = process.env.ONEUP_CLIENT_ID;
    this.clientSecret = process.env.ONEUP_CLIENT_SECRET;
  }

  // Generate JWT for server-to-server auth
  generateJWT() {
    const payload = {
      iss: this.clientId,
      sub: this.clientId,
      aud: `${this.baseURL}/oauth/token`,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour
    };
    return jwt.sign(payload, this.clientSecret, { algorithm: 'HS256' });
  }

  // Get access token
  async getAccessToken() {
    const assertion = this.generateJWT();
    const response = await axios.post(`${this.baseURL}/oauth/token`, {
      grant_type: 'client_credentials',
      client_assertion_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      client_assertion: assertion,
    });
    return response.data.access_token;
  }

  // Get patient data
  async getPatient(patientId, accessToken) {
    const response = await axios.get(
      `${this.baseURL}/fhir/r4/Patient/${patientId}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/fhir+json',
        },
      }
    );
    return response.data;
  }

  // Get appointments
  async getAppointments(patientId, accessToken) {
    const response = await axios.get(
      `${this.baseURL}/fhir/r4/Appointment?patient=${patientId}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/fhir+json',
        },
      }
    );
    return response.data.entry || [];
  }

  // Get medications
  async getMedications(patientId, accessToken) {
    const response = await axios.get(
      `${this.baseURL}/fhir/r4/MedicationStatement?patient=${patientId}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/fhir+json',
        },
      }
    );
    return response.data.entry || [];
  }
}

module.exports = new EHRService();
```

#### **Step 5: Implement Routes**

```javascript
// routes/ehrRoutes.js
const express = require('express');
const router = express.Router();
const ehrService = require('../services/ehrService');
const authMiddleware = require('../middleware/auth');

// Get patient data
router.get('/patient/:patientId', authMiddleware, async (req, res) => {
  try {
    const accessToken = await ehrService.getAccessToken();
    const patientData = await ehrService.getPatient(
      req.params.patientId,
      accessToken
    );
    res.json(patientData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get patient appointments
router.get('/appointments/:patientId', authMiddleware, async (req, res) => {
  try {
    const accessToken = await ehrService.getAccessToken();
    const appointments = await ehrService.getAppointments(
      req.params.patientId,
      accessToken
    );
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get patient medications
router.get('/medications/:patientId', authMiddleware, async (req, res) => {
  try {
    const accessToken = await ehrService.getAccessToken();
    const medications = await ehrService.getMedications(
      req.params.patientId,
      accessToken
    );
    res.json(medications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
```

---

## **Part 2: Insurance Verification (Availity)**

### **2.1 Overview**

**What you get:**
- Real-time eligibility checks (EDI 270 responses)
- Coverage details (copay, deductible, out-of-pocket max)
- Plan information
- Provider network status

---

### **2.2 Setup: Availity API**

#### **Step 1: Register with Availity**

1. Go to [Availity Developer Portal](https://developer.availity.com/)
2. Sign up → Create app
3. Get credentials:
   ```
   API Key: your-api-key
   Client ID: your-client-id
   Client Secret: your-client-secret
   ```

#### **Step 2: Setup Environment Variables**

```bash
# .env
AVAILITY_API_URL=https://api.availity.com
AVAILITY_API_KEY=your-api-key
AVAILITY_CLIENT_ID=your-client-id
AVAILITY_CLIENT_SECRET=your-client-secret
```

#### **Step 3: Create Insurance Service**

```javascript
// services/insuranceService.js
const axios = require('axios');

class InsuranceService {
  constructor() {
    this.baseURL = process.env.AVAILITY_API_URL;
    this.apiKey = process.env.AVAILITY_API_KEY;
    this.clientId = process.env.AVAILITY_CLIENT_ID;
    this.clientSecret = process.env.AVAILITY_CLIENT_SECRET;
  }

  // Check insurance eligibility
  async checkEligibility(memberData) {
    const payload = {
      tradingPartnerServiceId: 'AVAILITY', // or specific payer ID
      memberId: memberData.memberId,
      groupNumber: memberData.groupNumber,
      firstName: memberData.firstName,
      lastName: memberData.lastName,
      dateOfBirth: memberData.dateOfBirth, // YYYY-MM-DD
      relationshipCode: memberData.relationshipCode || '01', // 01=Self
    };

    try {
      const response = await axios.post(
        `${this.baseURL}/eligibility/v1/eligibility`,
        payload,
        {
          headers: {
            'Api-Key': this.apiKey,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Eligibility check failed:', error.response?.data);
      throw error;
    }
  }

  // Parse eligibility response
  parseEligibilityResponse(response) {
    const eligibility = response.eligibility || {};
    return {
      isEligible: eligibility.eligibilityIndicator === '1',
      effectiveDate: eligibility.effectiveDate,
      terminationDate: eligibility.terminationDate,
      copay: eligibility.copay || 'N/A',
      deductible: eligibility.deductible || 'N/A',
      outOfPocketMax: eligibility.outOfPocketMaximum || 'N/A',
      inNetworkProvider: eligibility.inNetworkIndicator === '1',
    };
  }
}

module.exports = new InsuranceService();
```

#### **Step 4: Implement Routes**

```javascript
// routes/insuranceRoutes.js
const express = require('express');
const router = express.Router();
const insuranceService = require('../services/insuranceService');
const authMiddleware = require('../middleware/auth');

// Check eligibility
router.post('/eligibility', authMiddleware, async (req, res) => {
  try {
    const { memberId, groupNumber, firstName, lastName, dateOfBirth } =
      req.body;

    // Validate input
    if (!memberId || !firstName || !lastName || !dateOfBirth) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const response = await insuranceService.checkEligibility({
      memberId,
      groupNumber,
      firstName,
      lastName,
      dateOfBirth,
    });

    const parsed = insuranceService.parseEligibilityResponse(response);
    res.json(parsed);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
```

---

## **Part 3: Pharmacy Integration (Surescripts)**

### **3.1 Overview**

**What you can do:**
- Check prescription status
- Submit refill requests
- Get medication history
- Identify potential drug interactions

---

### **3.2 Setup: Surescripts NCPDP**

#### **Step 1: Register with Surescripts**

1. Visit [Surescripts Developer Portal](https://www.surescripts.com/)
2. Request API access
3. Get credentials:
   ```
   API Key: your-api-key
   Pharmacy ID: your-pharmacy-id
   ```

#### **Step 2: Setup Environment Variables**

```bash
# .env
SURESCRIPTS_API_URL=https://api.surescripts.net
SURESCRIPTS_API_KEY=your-api-key
SURESCRIPTS_PHARMACY_ID=your-pharmacy-id
```

#### **Step 3: Create Pharmacy Service**

```javascript
// services/pharmacyService.js
const axios = require('axios');

class PharmacyService {
  constructor() {
    this.baseURL = process.env.SURESCRIPTS_API_URL;
    this.apiKey = process.env.SURESCRIPTS_API_KEY;
    this.pharmacyId = process.env.SURESCRIPTS_PHARMACY_ID;
  }

  // Get prescription status
  async getPrescriptionStatus(rxNumber, dateOfBirth) {
    try {
      const response = await axios.get(
        `${this.baseURL}/v2/prescriptions/${rxNumber}`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
          params: {
            dateOfBirth: dateOfBirth, // YYYY-MM-DD
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Prescription lookup failed:', error.response?.data);
      throw error;
    }
  }

  // Request refill
  async requestRefill(rxNumber, patientData) {
    const payload = {
      prescriptionNumber: rxNumber,
      patientFirstName: patientData.firstName,
      patientLastName: patientData.lastName,
      patientDateOfBirth: patientData.dateOfBirth, // YYYY-MM-DD
      patientPhone: patientData.phone,
      pharmacyId: this.pharmacyId,
      refillQuantity: patientData.quantity || 1,
    };

    try {
      const response = await axios.post(
        `${this.baseURL}/v2/prescriptions/refill`,
        payload,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Refill request failed:', error.response?.data);
      throw error;
    }
  }
}

module.exports = new PharmacyService();
```

#### **Step 4: Implement Routes**

```javascript
// routes/pharmacyRoutes.js
const express = require('express');
const router = express.Router();
const pharmacyService = require('../services/pharmacyService');
const authMiddleware = require('../middleware/auth');

// Get prescription status
router.get('/prescription/:rxNumber', authMiddleware, async (req, res) => {
  try {
    const { dateOfBirth } = req.query;
    if (!dateOfBirth) {
      return res.status(400).json({ error: 'dateOfBirth required' });
    }

    const status = await pharmacyService.getPrescriptionStatus(
      req.params.rxNumber,
      dateOfBirth
    );
    res.json(status);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Request refill
router.post('/refill', authMiddleware, async (req, res) => {
  try {
    const { rxNumber, patientData } = req.body;
    if (!rxNumber || !patientData) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = await pharmacyService.requestRefill(rxNumber, patientData);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
```

---

## **Part 4: Error Handling & Retry Logic**

### **4.1 Generic Error Handler**

```javascript
// middleware/errorHandler.js
const errorHandler = (error, req, res, next) => {
  // API timeout
  if (error.code === 'ECONNABORTED') {
    return res.status(504).json({
      error: 'Integration service timeout',
      message: 'Please try again in a moment',
    });
  }

  // Authentication errors
  if (error.response?.status === 401) {
    return res.status(401).json({
      error: 'Authentication failed',
      message: 'Invalid credentials',
    });
  }

  // Rate limiting
  if (error.response?.status === 429) {
    return res.status(429).json({
      error: 'Rate limit exceeded',
      message: 'Please try again later',
      retryAfter: error.response.headers['retry-after'],
    });
  }

  // Generic error
  res.status(500).json({
    error: 'Integration error',
    message: error.message,
  });
};

module.exports = errorHandler;
```

### **4.2 Retry Utility**

```javascript
// utils/retry.js
const axios = require('axios');

const retryRequest = async (fn, maxRetries = 3, delay = 1000) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      // Don't retry on 4xx errors (except 429)
      if (error.response?.status >= 400 && error.response?.status < 500) {
        if (error.response?.status !== 429) {
          throw error;
        }
      }

      // Last attempt
      if (attempt === maxRetries) {
        throw error;
      }

      // Wait before retrying
      await new Promise((resolve) => setTimeout(resolve, delay * attempt));
    }
  }
};

module.exports = { retryRequest };
```

---

## **Part 5: Testing Integration Locally**

### **5.1 Using Postman**

**Request: Check Insurance Eligibility**
```
POST http://localhost:3000/api/insurance/eligibility

Body:
{
  "memberId": "123456",
  "groupNumber": "ABC123",
  "firstName": "John",
  "lastName": "Doe",
  "dateOfBirth": "1980-01-15"
}

Headers:
- Authorization: Bearer YOUR_JWT_TOKEN
- Content-Type: application/json
```

### **5.2 Using cURL**

```bash
curl -X POST http://localhost:3000/api/insurance/eligibility \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "memberId": "123456",
    "groupNumber": "ABC123",
    "firstName": "John",
    "lastName": "Doe",
    "dateOfBirth": "1980-01-15"
  }'
```

---

## **Part 6: Production Deployment Checklist**

- [ ] **Credentials Secure**
  - [ ] All API keys stored in `.env` (never committed)
  - [ ] Secrets rotation implemented
  - [ ] Use AWS Secrets Manager or similar for prod

- [ ] **BAA in Place**
  - [ ] Business Associate Agreement signed with all vendors
  - [ ] Data processing agreements reviewed
  - [ ] HIPAA compliance verified

- [ ] **Error Handling**
  - [ ] All API calls wrapped with try-catch
  - [ ] Graceful degradation when APIs unavailable
  - [ ] User-friendly error messages

- [ ] **Logging & Monitoring**
  - [ ] All API calls logged (without PHI)
  - [ ] Failed requests tracked
  - [ ] Alerts for repeated failures

- [ ] **Testing**
  - [ ] Unit tests for each service
  - [ ] Integration tests with sandbox environments
  - [ ] Load testing for peak usage

- [ ] **Security**
  - [ ] Rate limiting enabled
  - [ ] Request validation implemented
  - [ ] SQL injection prevention
  - [ ] XSS protection

---

## **Part 7: Key Resources**

### **EHR APIs**
- [1up Health Documentation](https://1up.health/api-docs)
- [Epic FHIR Documentation](https://fhir.epic.com/)
- [Cerner FHIR APIs](https://fhir.cerner.com/)
- [FHIR R4 Specification](https://hl7.org/fhir/r4/)

### **Insurance APIs**
- [Availity Developer Portal](https://developer.availity.com/)
- [Change Healthcare API](https://www.changehealthcare.com/)

### **Pharmacy APIs**
- [Surescripts Documentation](https://www.surescripts.com/developers/)
- [NCPDP Standards](https://www.ncpdp.org/)

### **General Healthcare**
- [HL7 FHIR Standard](https://hl7.org/fhir/)
- [HIPAA Compliance Guidance](https://www.hhs.gov/hipaa/)

---

## **Troubleshooting**

| Issue | Cause | Solution |
|-------|-------|----------|
| **401 Unauthorized** | Invalid credentials | Verify API key, regenerate token |
| **403 Forbidden** | Insufficient permissions | Check scope, request additional access |
| **404 Not Found** | Resource doesn't exist | Verify IDs (patient ID, prescription number) |
| **429 Too Many Requests** | Rate limit exceeded | Implement exponential backoff, cache results |
| **503 Service Unavailable** | API maintenance | Retry with exponential backoff |
| **Timeout Error** | Slow network/API | Increase timeout, implement retry logic |

---

<div align="center">

**Next:** [API Quick Reference](./api-quick-reference.md)

**Questions?** Open an issue: [GitHub Issues](https://github.com/ArjunFrancis/ecarebots/issues)

</div>
