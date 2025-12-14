# API Quick Reference

**Quick lookup table for all EcareBots API endpoints. For detailed specs, see [API Specification](./api-specification.md).**

---

## **Authentication**

### **Get JWT Token**
```bash
POST /api/auth/login

Request:
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'

Response:
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 900 // seconds
}
```

### **Refresh Token**
```bash
POST /api/auth/refresh

Request:
curl -X POST http://localhost:3000/api/auth/refresh \
  -H "Authorization: Bearer YOUR_REFRESH_TOKEN"

Response:
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": 900
}
```

**All subsequent requests require:** `Authorization: Bearer YOUR_ACCESS_TOKEN`

---

## **Users**

| Method | Endpoint | Purpose | Auth |
|--------|----------|---------|------|
| GET | `/api/users/profile` | Get current user profile | ✅ |
| PUT | `/api/users/profile` | Update user profile | ✅ |
| POST | `/api/users/register` | Register new user | ❌ |
| DELETE | `/api/users/{userId}` | Delete user account | ✅ |

### **Get User Profile**
```bash
curl -X GET http://localhost:3000/api/users/profile \
  -H "Authorization: Bearer YOUR_TOKEN"

Response:
{
  "id": "user-123",
  "email": "john@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "dateOfBirth": "1980-01-15",
  "phone": "+1-555-0123",
  "createdAt": "2025-01-01T12:00:00Z"
}
```

### **Update User Profile**
```bash
curl -X PUT http://localhost:3000/api/users/profile \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jane",
    "phone": "+1-555-9999"
  }'

Response:
{
  "id": "user-123",
  "email": "john@example.com",
  "firstName": "Jane",
  "lastName": "Doe",
  "updatedAt": "2025-01-15T12:00:00Z"
}
```

---

## **Health Schedules**

| Method | Endpoint | Purpose | Auth |
|--------|----------|---------|------|
| GET | `/api/schedules` | List all schedules | ✅ |
| POST | `/api/schedules` | Create new schedule | ✅ |
| GET | `/api/schedules/{scheduleId}` | Get schedule details | ✅ |
| PUT | `/api/schedules/{scheduleId}` | Update schedule | ✅ |
| DELETE | `/api/schedules/{scheduleId}` | Delete schedule | ✅ |

### **Create Health Schedule**
```bash
curl -X POST http://localhost:3000/api/schedules \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Blood Pressure Check",
    "type": "vital",
    "frequency": "daily",
    "time": "09:00",
    "reminder": true,
    "notes": "Morning measurement"
  }'

Response:
{
  "id": "schedule-456",
  "title": "Blood Pressure Check",
  "type": "vital",
  "frequency": "daily",
  "time": "09:00",
  "reminder": true,
  "createdAt": "2025-01-15T12:00:00Z"
}
```

### **Get All Schedules**
```bash
curl -X GET "http://localhost:3000/api/schedules?type=medication" \
  -H "Authorization: Bearer YOUR_TOKEN"

Response:
{
  "total": 5,
  "schedules": [
    {
      "id": "schedule-789",
      "title": "Metformin 500mg",
      "type": "medication",
      "frequency": "twice-daily",
      "nextDue": "2025-01-15T14:00:00Z"
    }
  ]
}
```

---

## **Appointments**

| Method | Endpoint | Purpose | Auth |
|--------|----------|---------|------|
| GET | `/api/appointments` | List appointments | ✅ |
| POST | `/api/appointments` | Book appointment | ✅ |
| GET | `/api/appointments/{appointmentId}` | Get appointment details | ✅ |
| PUT | `/api/appointments/{appointmentId}` | Reschedule appointment | ✅ |
| DELETE | `/api/appointments/{appointmentId}` | Cancel appointment | ✅ |

### **Book Appointment**
```bash
curl -X POST http://localhost:3000/api/appointments \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "providerName": "Dr. Smith",
    "providerSpecialty": "Cardiology",
    "appointmentDate": "2025-02-15",
    "appointmentTime": "14:00",
    "location": "Heart Center",
    "reason": "Annual checkup"
  }'

Response:
{
  "id": "appt-123",
  "providerName": "Dr. Smith",
  "appointmentDate": "2025-02-15",
  "appointmentTime": "14:00",
  "status": "confirmed",
  "reminderSet": true,
  "confirmationCode": "CC-123456"
}
```

### **Get Upcoming Appointments**
```bash
curl -X GET "http://localhost:3000/api/appointments?status=upcoming" \
  -H "Authorization: Bearer YOUR_TOKEN"

Response:
{
  "total": 3,
  "appointments": [
    {
      "id": "appt-123",
      "providerName": "Dr. Smith",
      "specialty": "Cardiology",
      "appointmentDate": "2025-02-15",
      "appointmentTime": "14:00",
      "status": "confirmed",
      "daysUntil": 31
    }
  ]
}
```

---

## **Insurance**

| Method | Endpoint | Purpose | Auth |
|--------|----------|---------|------|
| POST | `/api/insurance/eligibility` | Check insurance eligibility | ✅ |
| GET | `/api/insurance/plans` | Get insurance plans | ✅ |
| POST | `/api/insurance/card/scan` | Scan insurance card (OCR) | ✅ |

### **Check Insurance Eligibility**
```bash
curl -X POST http://localhost:3000/api/insurance/eligibility \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "memberId": "ABC123456",
    "groupNumber": "XYZ789",
    "firstName": "John",
    "lastName": "Doe",
    "dateOfBirth": "1980-01-15"
  }'

Response:
{
  "isEligible": true,
  "effectiveDate": "2024-01-01",
  "terminationDate": "2025-12-31",
  "copay": "$25.00",
  "deductible": "$1,500.00",
  "outOfPocketMax": "$5,000.00",
  "inNetworkProvider": true
}
```

### **Scan Insurance Card (OCR)**
```bash
curl -X POST http://localhost:3000/api/insurance/card/scan \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "image=@insurance_card.jpg"

Response:
{
  "memberId": "ABC123456",
  "groupNumber": "XYZ789",
  "planName": "Blue Cross Blue Shield",
  "effectiveDate": "2024-01-01",
  "rxBin": "004336",
  "rxPcn": "BCBS",
  "confidence": 0.95
}
```

---

## **Medications**

| Method | Endpoint | Purpose | Auth |
|--------|----------|---------|------|
| GET | `/api/medications` | List medications | ✅ |
| POST | `/api/medications` | Add medication | ✅ |
| GET | `/api/medications/{medicationId}` | Get medication details | ✅ |
| PUT | `/api/medications/{medicationId}` | Update medication | ✅ |
| DELETE | `/api/medications/{medicationId}` | Remove medication | ✅ |
| POST | `/api/medications/{medicationId}/refill` | Request refill | ✅ |

### **Add Medication**
```bash
curl -X POST http://localhost:3000/api/medications \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Metformin",
    "dosage": "500mg",
    "frequency": "twice-daily",
    "prescriber": "Dr. Johnson",
    "prescriptionDate": "2025-01-01",
    "expiryDate": "2026-01-01",
    "refillsRemaining": 11
  }'

Response:
{
  "id": "med-789",
  "name": "Metformin",
  "dosage": "500mg",
  "frequency": "twice-daily",
  "nextDose": "2025-01-15T14:00:00Z",
  "adherenceRate": 0,
  "createdAt": "2025-01-15T12:00:00Z"
}
```

### **Request Medication Refill**
```bash
curl -X POST http://localhost:3000/api/medications/med-789/refill \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "quantity": 90,
    "pharmacy": "CVS Downtown"
  }'

Response:
{
  "id": "refill-123",
  "medicationId": "med-789",
  "status": "submitted",
  "quantity": 90,
  "pharmacy": "CVS Downtown",
  "estimatedPickupDate": "2025-01-17",
  "trackingNumber": "RX-2025-001234"
}
```

---

## **Documents**

| Method | Endpoint | Purpose | Auth |
|--------|----------|---------|------|
| GET | `/api/documents` | List documents | ✅ |
| POST | `/api/documents` | Upload document | ✅ |
| GET | `/api/documents/{docId}` | Get document | ✅ |
| DELETE | `/api/documents/{docId}` | Delete document | ✅ |
| GET | `/api/documents/{docId}/expiry-status` | Check expiry status | ✅ |

### **Upload Document**
```bash
curl -X POST http://localhost:3000/api/documents \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@insurance_card.pdf" \
  -F "documentType=insurance_card" \
  -F "expiryDate=2026-12-31"

Response:
{
  "id": "doc-456",
  "documentType": "insurance_card",
  "uploadedAt": "2025-01-15T12:00:00Z",
  "expiryDate": "2026-12-31",
  "daysUntilExpiry": 350,
  "status": "valid"
}
```

### **List Documents with Expiry Status**
```bash
curl -X GET http://localhost:3000/api/documents \
  -H "Authorization: Bearer YOUR_TOKEN"

Response:
{
  "total": 5,
  "documents": [
    {
      "id": "doc-456",
      "documentType": "insurance_card",
      "expiryDate": "2026-12-31",
      "status": "valid",
      "daysUntilExpiry": 350
    },
    {
      "id": "doc-789",
      "documentType": "prescription",
      "expiryDate": "2025-02-01",
      "status": "expiring_soon",
      "daysUntilExpiry": 17
    }
  ]
}
```

---

## **Voice Commands (Agent)**

| Method | Endpoint | Purpose | Auth |
|--------|----------|---------|------|
| POST | `/api/voice/process` | Process voice command | ✅ |
| GET | `/api/voice/capabilities` | List voice commands | ✅ |

### **Process Voice Command**
```bash
curl -X POST http://localhost:3000/api/voice/process \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Schedule an appointment with Dr. Smith next Tuesday at 2pm",
    "inputMode": "voice"
  }'

Response:
{
  "intent": "schedule_appointment",
  "confidence": 0.95,
  "extractedData": {
    "providerName": "Dr. Smith",
    "appointmentDate": "2025-01-21",
    "appointmentTime": "14:00"
  },
  "action": "created",
  "actionId": "appt-123",
  "confirmation": "I've scheduled your appointment with Dr. Smith for Tuesday, January 21st at 2:00 PM."
}
```

---

## **Health Monitoring (Vision)**

| Method | Endpoint | Purpose | Auth |
|--------|----------|---------|------|
| POST | `/api/health/vitals` | Log vital signs | ✅ |
| GET | `/api/health/vitals` | Get vital history | ✅ |
| POST | `/api/health/vitals/analyze` | AI analysis of vitals | ✅ |

### **Log Vital Signs**
```bash
curl -X POST http://localhost:3000/api/health/vitals \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "bloodPressure": "120/80",
    "heartRate": 72,
    "temperature": 98.6,
    "weight": 180.5,
    "glucose": 95,
    "notes": "Feeling good"
  }'

Response:
{
  "id": "vital-123",
  "timestamp": "2025-01-15T14:30:00Z",
  "bloodPressure": "120/80",
  "heartRate": 72,
  "status": "normal",
  "alerts": []
}
```

### **Get Vital History**
```bash
curl -X GET "http://localhost:3000/api/health/vitals?days=30" \
  -H "Authorization: Bearer YOUR_TOKEN"

Response:
{
  "total": 30,
  "vitals": [
    {
      "id": "vital-123",
      "timestamp": "2025-01-15T14:30:00Z",
      "bloodPressure": "120/80",
      "heartRate": 72,
      "status": "normal"
    }
  ],
  "trends": {
    "bloodPressure": "stable",
    "heartRate": "stable"
  }
}
```

---

## **Common Response Codes**

| Code | Meaning | Action |
|------|---------|--------|
| **200** | OK | Success! Use returned data. |
| **201** | Created | Resource created successfully. |
| **400** | Bad Request | Check request parameters. |
| **401** | Unauthorized | Get new token via `/api/auth/login`. |
| **403** | Forbidden | Insufficient permissions. |
| **404** | Not Found | Resource doesn't exist. |
| **429** | Too Many Requests | Wait before retrying. |
| **500** | Server Error | Contact support. |
| **503** | Service Unavailable | Retry in a few moments. |

---

## **Error Response Format**

All errors follow this format:

```json
{
  "error": "field_validation_error",
  "message": "Invalid email format",
  "details": {
    "field": "email",
    "value": "invalid-email",
    "constraint": "email_format"
  },
  "timestamp": "2025-01-15T12:00:00Z"
}
```

---

## **Rate Limiting**

- **Limit:** 1000 requests per hour
- **Header:** `X-RateLimit-Remaining: 999`
- **Reset:** `X-RateLimit-Reset: 1642252800`

```bash
# Check remaining requests
curl -I http://localhost:3000/api/users/profile \
  -H "Authorization: Bearer YOUR_TOKEN" \
  | grep X-RateLimit

X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1642252800
```

---

## **Pagination**

For endpoints returning lists:

```bash
curl -X GET "http://localhost:3000/api/appointments?page=1&limit=20&sort=-createdAt" \
  -H "Authorization: Bearer YOUR_TOKEN"

Response:
{
  "total": 42,
  "page": 1,
  "limit": 20,
  "pages": 3,
  "data": [ ... ]
}
```

---

<div align="center">

**Full Documentation:** [API Specification](./api-specification.md)  
**Integration Patterns:** [Integration Guide](./integration-guide.md)  
**Questions?** [GitHub Issues](https://github.com/ArjunFrancis/ecarebots/issues)

</div>
