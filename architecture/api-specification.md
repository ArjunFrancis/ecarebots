# EcareBots API Specification

**Version:** 1.0.0  
**Last Updated:** November 30, 2025  
**Author:** EcareBots Research & Architecture Team  
**OpenAPI Version:** 3.0.3

---

## Executive Summary

This document provides a comprehensive RESTful API specification for EcareBots, designed following OpenAPI 3.0 standards[web:205][web:206]. The API enables multi-modal healthcare coordination including appointment scheduling, medication management, insurance verification, document handling, and AI agent interactions. The design prioritizes accessibility, HIPAA compliance, and real-time capabilities through WebSocket integration[web:154][web:157][web:192].

**Core Design Principles**:
- **RESTful Architecture**: Resource-oriented URIs with standard HTTP methods
- **Versioning**: URI path versioning (`/api/v1/`) for clarity and client compatibility[web:208][web:210]
- **Authentication**: JWT-based with refresh tokens and role-based access control[web:132][web:151][web:209]
- **Rate Limiting**: Tiered limits by endpoint sensitivity and user role[web:209][web:211]
- **Real-time**: WebSocket endpoints for live updates (appointments, reminders)[web:154][web:157]
- **FHIR-Compatible**: Subset of endpoints follow HL7 FHIR R4 patterns

**Key Statistics**:
- **Total Endpoints**: 85+ across 12 resource categories
- **Authentication Methods**: JWT (primary), OAuth2 (future), API Keys (integration)
- **Rate Limits**: 100-1000 req/min depending on endpoint tier
- **Response Time Targets**: <100ms (p95) for GET, <300ms (p95) for POST/PUT

---

## Table of Contents

1. [Authentication & Authorization](#1-authentication--authorization)
2. [User Management](#2-user-management)
3. [Health Schedule (Medications & Appointments)](#3-health-schedule)
4. [Insurance & Billing](#4-insurance--billing)
5. [Document Management](#5-document-management)
6. [Healthcare Provider Directory](#6-healthcare-provider-directory)
7. [AI Agent Interactions](#7-ai-agent-interactions)
8. [Front-Desk Automation](#8-front-desk-automation)
9. [Real-Time WebSocket](#9-real-time-websocket)
10. [Error Handling & Status Codes](#10-error-handling)
11. [Rate Limiting & Throttling](#11-rate-limiting)
12. [Security Considerations](#12-security-considerations)

---

## 1. Authentication & Authorization

### 1.1 Overview

EcareBots uses **JWT (JSON Web Token)** for stateless authentication with role-based access control (RBAC)[web:132][web:151]. All API requests (except public endpoints) require a valid JWT in the `Authorization` header.

**Token Structure**:
```json
{
  "sub": "user-uuid",
  "role": "patient",
  "iat": 1701360000,
  "exp": 1701363600,
  "iss": "ecarebots.com",
  "aud": "ecarebots-api"
}
```

### 1.2 Endpoints

#### POST /api/v1/auth/register

**Description**: Register a new user account.

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "full_name": "John Doe",
  "date_of_birth": "1950-05-15",
  "role": "patient",
  "phone_number": "+1-555-0123",
  "accessibility_preferences": {
    "voice_speed": 1.0,
    "high_contrast": true,
    "gesture_enabled": false
  }
}
```

**Response** (201 Created):
```json
{
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "full_name": "John Doe",
    "role": "patient"
  },
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expires_in": 3600
}
```

**Error Responses**:
- `400 Bad Request`: Invalid email format or weak password
- `409 Conflict`: Email already registered

---

#### POST /api/v1/auth/login

**Description**: Authenticate user and receive JWT tokens.

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "device_id": "mobile-ios-12345" // Optional, for device tracking
}
```

**Response** (200 OK):
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expires_in": 3600,
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "full_name": "John Doe",
    "role": "patient"
  }
}
```

**Error Responses**:
- `401 Unauthorized`: Invalid credentials
- `429 Too Many Requests`: Exceeded login attempts (rate limit: 5 attempts/15min)

---

#### POST /api/v1/auth/refresh

**Description**: Refresh access token using refresh token.

**Request Body**:
```json
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response** (200 OK):
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expires_in": 3600
}
```

---

#### POST /api/v1/auth/logout

**Description**: Invalidate refresh token (access token expires naturally).

**Headers**: `Authorization: Bearer {access_token}`

**Request Body**:
```json
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response** (200 OK):
```json
{
  "message": "Successfully logged out"
}
```

---

## 2. User Management

### 2.1 Core User Endpoints

#### GET /api/v1/users/me

**Description**: Retrieve authenticated user's profile.

**Headers**: `Authorization: Bearer {access_token}`

**Response** (200 OK):
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "user@example.com",
  "full_name": "John Doe",
  "date_of_birth": "1950-05-15",
  "role": "patient",
  "phone_number": "+1-555-0123",
  "profile_photo_url": "https://storage.ecarebots.com/...",
  "accessibility_preferences": {
    "voice_speed": 1.0,
    "high_contrast": true,
    "font_size": "large"
  },
  "emergency_contact": {
    "name": "Jane Doe",
    "phone": "+1-555-0124",
    "relationship": "spouse"
  },
  "created_at": "2024-01-15T10:30:00Z",
  "last_login_at": "2025-11-30T08:15:00Z"
}
```

---

#### PATCH /api/v1/users/me

**Description**: Update user profile.

**Headers**: `Authorization: Bearer {access_token}`

**Request Body** (partial update supported):
```json
{
  "phone_number": "+1-555-9999",
  "accessibility_preferences": {
    "voice_speed": 1.2,
    "high_contrast": true,
    "gesture_enabled": true
  }
}
```

**Response** (200 OK): Returns updated user object.

---

#### GET /api/v1/users/me/health-conditions

**Description**: Retrieve user's health conditions.

**Headers**: `Authorization: Bearer {access_token}`

**Response** (200 OK):
```json
{
  "conditions": [
    {
      "id": "condition-uuid-1",
      "condition_name": "Hypertension",
      "icd10_code": "I10",
      "severity": "moderate",
      "diagnosed_date": "2020-03-15",
      "is_chronic": true,
      "managing_provider": {
        "id": "provider-uuid",
        "name": "Dr. Sarah Johnson",
        "specialty": "Cardiology"
      }
    }
  ],
  "count": 1
}
```

---

## 3. Health Schedule

### 3.1 Medications

#### GET /api/v1/medications

**Description**: Retrieve all active medications for authenticated user.

**Headers**: `Authorization: Bearer {access_token}`

**Query Parameters**:
- `is_active` (boolean, optional): Filter by active status (default: true)
- `page` (integer, default: 1)
- `per_page` (integer, default: 20, max: 100)

**Response** (200 OK):
```json
{
  "medications": [
    {
      "id": "med-uuid-1",
      "medication_name": "Aspirin",
      "generic_name": "Acetylsalicylic Acid",
      "dosage": "81mg",
      "frequency": "Once daily",
      "times_per_day": 1,
      "specific_times": ["08:00:00"],
      "start_date": "2024-01-01",
      "end_date": null,
      "instructions": "Take with food",
      "prescribing_provider": {
        "id": "provider-uuid",
        "name": "Dr. Smith",
        "npi_number": "1234567890"
      },
      "refills_remaining": 3,
      "is_active": true
    }
  ],
  "pagination": {
    "current_page": 1,
    "per_page": 20,
    "total_items": 5,
    "total_pages": 1
  }
}
```

---

#### POST /api/v1/medications

**Description**: Add new medication to user's schedule.

**Headers**: `Authorization: Bearer {access_token}`

**Request Body**:
```json
{
  "medication_name": "Lisinopril",
  "dosage": "10mg",
  "frequency": "Once daily",
  "times_per_day": 1,
  "specific_times": ["08:00:00"],
  "start_date": "2025-12-01",
  "instructions": "Take in the morning",
  "prescribing_provider_id": "provider-uuid",
  "refills_remaining": 5
}
```

**Response** (201 Created): Returns created medication object.

---

#### GET /api/v1/medications/reminders/upcoming

**Description**: Get upcoming medication reminders for next 24 hours.

**Headers**: `Authorization: Bearer {access_token}`

**Response** (200 OK):
```json
{
  "reminders": [
    {
      "id": "reminder-uuid-1",
      "medication": {
        "id": "med-uuid-1",
        "medication_name": "Aspirin",
        "dosage": "81mg"
      },
      "scheduled_time": "2025-11-30T20:00:00Z",
      "status": "pending",
      "reminder_type": "push"
    }
  ],
  "count": 3
}
```

---

#### PATCH /api/v1/medications/reminders/:id/acknowledge

**Description**: Mark reminder as acknowledged/taken.

**Headers**: `Authorization: Bearer {access_token}`

**Request Body**:
```json
{
  "status": "taken",
  "taken_at": "2025-11-30T20:05:00Z",
  "was_on_time": true
}
```

**Response** (200 OK): Returns updated reminder object.

---

### 3.2 Appointments

#### GET /api/v1/appointments

**Description**: Retrieve user's appointments.

**Headers**: `Authorization: Bearer {access_token}`

**Query Parameters**:
- `status` (string, optional): `scheduled`, `confirmed`, `completed`, `cancelled`
- `from_date` (date, optional): ISO 8601 format
- `to_date` (date, optional): ISO 8601 format
- `page` (integer)
- `per_page` (integer)

**Response** (200 OK):
```json
{
  "appointments": [
    {
      "id": "appt-uuid-1",
      "appointment_date": "2025-12-05",
      "appointment_time": "10:00:00",
      "duration_minutes": 30,
      "status": "scheduled",
      "appointment_type": "consultation",
      "visit_reason": "Annual checkup",
      "provider": {
        "id": "provider-uuid",
        "name": "Dr. Sarah Johnson",
        "specialty": "Family Medicine",
        "npi_number": "1234567890"
      },
      "clinic": {
        "id": "clinic-uuid",
        "name": "HealthCare Clinic",
        "address": "123 Main St, City, State 12345",
        "phone": "+1-555-0100"
      },
      "created_at": "2025-11-20T14:30:00Z"
    }
  ],
  "pagination": {...}
}
```

---

#### POST /api/v1/appointments

**Description**: Schedule new appointment.

**Headers**: `Authorization: Bearer {access_token}`

**Request Body**:
```json
{
  "provider_id": "provider-uuid",
  "clinic_id": "clinic-uuid",
  "appointment_date": "2025-12-10",
  "appointment_time": "14:00:00",
  "appointment_type": "follow_up",
  "visit_reason": "Blood pressure check",
  "chief_complaint": "Monitoring hypertension"
}
```

**Response** (201 Created): Returns created appointment with confirmation details.

**Error Responses**:
- `409 Conflict`: Time slot already booked
- `400 Bad Request`: Provider unavailable at requested time

---

#### GET /api/v1/providers/:providerId/availability

**Description**: Check provider's available time slots.

**Headers**: `Authorization: Bearer {access_token}`

**Query Parameters**:
- `date` (required): ISO date format (YYYY-MM-DD)
- `clinic_id` (optional): Filter by clinic

**Response** (200 OK):
```json
{
  "provider_id": "provider-uuid",
  "date": "2025-12-10",
  "available_slots": [
    {
      "start_time": "09:00:00",
      "end_time": "09:30:00",
      "available": true
    },
    {
      "start_time": "09:30:00",
      "end_time": "10:00:00",
      "available": false,
      "reason": "booked"
    }
  ],
  "clinic": {...}
}
```

---

### 3.3 Vital Signs

#### POST /api/v1/vital-signs

**Description**: Log vital signs measurement.

**Headers**: `Authorization: Bearer {access_token}`

**Request Body**:
```json
{
  "measurement_date": "2025-11-30T08:15:00Z",
  "systolic_bp": 120,
  "diastolic_bp": 80,
  "heart_rate": 72,
  "temperature": 98.6,
  "oxygen_saturation": 98,
  "measurement_method": "home_monitor",
  "notes": "Morning reading"
}
```

**Response** (201 Created): Returns created vital signs record.

---

#### GET /api/v1/vital-signs

**Description**: Retrieve vital signs history.

**Headers**: `Authorization: Bearer {access_token}`

**Query Parameters**:
- `from_date` (optional)
- `to_date` (optional)
- `measurement_type` (optional): `blood_pressure`, `heart_rate`, `temperature`
- `limit` (integer, default: 50)

**Response** (200 OK): Returns array of vital signs measurements with pagination.

---

## 4. Insurance & Billing

### 4.1 Insurance Policies

#### GET /api/v1/insurance/policies

**Description**: Retrieve user's insurance policies.

**Headers**: `Authorization: Bearer {access_token}`

**Response** (200 OK):
```json
{
  "policies": [
    {
      "id": "policy-uuid-1",
      "provider": {
        "id": "insurer-uuid",
        "provider_name": "Blue Cross Blue Shield",
        "provider_type": "private"
      },
      "policy_number": "BCBS123456789",
      "group_number": "GRP12345",
      "plan_name": "PPO Plus",
      "plan_type": "PPO",
      "coverage_type": "medical",
      "effective_date": "2025-01-01",
      "expiration_date": "2025-12-31",
      "is_primary": true,
      "deductible_amount": 1500.00,
      "deductible_met": 450.00,
      "out_of_pocket_max": 5000.00,
      "out_of_pocket_met": 450.00,
      "copay_primary_care": 25.00,
      "copay_specialist": 50.00,
      "verification_status": "verified",
      "last_verified_at": "2025-11-25T10:00:00Z"
    }
  ]
}
```

---

#### POST /api/v1/insurance/policies/:id/verify

**Description**: Request real-time insurance eligibility verification.

**Headers**: `Authorization: Bearer {access_token}`

**Response** (200 OK):
```json
{
  "policy_id": "policy-uuid-1",
  "verification_status": "verified",
  "verified_at": "2025-11-30T09:00:00Z",
  "coverage_active": true,
  "benefits": {
    "deductible_remaining": 1050.00,
    "out_of_pocket_remaining": 4550.00,
    "primary_care_copay": 25.00
  },
  "messages": [
    "Policy active and in good standing"
  ]
}
```

**Error Responses**:
- `503 Service Unavailable`: Insurance provider API unavailable
- `404 Not Found`: Policy not found in provider system

---

## 5. Document Management

### 5.1 Document Operations

#### GET /api/v1/documents

**Description**: Retrieve user's medical documents.

**Headers**: `Authorization: Bearer {access_token}`

**Query Parameters**:
- `document_type` (optional): Filter by type (e.g., `prescription`, `lab_report`)
- `search` (optional): Full-text search in OCR text
- `expiring_soon` (boolean): Documents expiring in next 30 days
- `page`, `per_page`

**Response** (200 OK):
```json
{
  "documents": [
    {
      "id": "doc-uuid-1",
      "document_name": "Blood Test Results - Nov 2025",
      "document_type": {
        "id": "type-uuid",
        "type_name": "Lab Report",
        "type_category": "medical_record"
      },
      "file_url": "https://storage.ecarebots.com/docs/...",
      "file_type": "pdf",
      "file_size_bytes": 245678,
      "document_date": "2025-11-15",
      "expiry_date": null,
      "issuing_provider": {
        "id": "provider-uuid",
        "name": "Dr. Smith"
      },
      "ocr_confidence": 0.95,
      "created_at": "2025-11-16T10:00:00Z"
    }
  ],
  "pagination": {...}
}
```

---

#### POST /api/v1/documents

**Description**: Upload new document.

**Headers**: 
- `Authorization: Bearer {access_token}`
- `Content-Type: multipart/form-data`

**Form Data**:
- `file` (required): Document file (PDF, JPG, PNG)
- `document_name` (required): Display name
- `document_type_id` (required): UUID of document type
- `document_date` (optional): ISO date
- `expiry_date` (optional): ISO date
- `issuing_provider_id` (optional): UUID

**Response** (201 Created):
```json
{
  "id": "doc-uuid-new",
  "document_name": "Prescription - Lisinopril",
  "file_url": "https://storage.ecarebots.com/docs/...",
  "upload_status": "processing",
  "message": "Document uploaded successfully. OCR processing in progress."
}
```

---

#### GET /api/v1/documents/:id/download

**Description**: Download document file.

**Headers**: `Authorization: Bearer {access_token}`

**Response** (200 OK): Binary file stream with appropriate `Content-Type` header.

---

## 6. Healthcare Provider Directory

### 6.1 Provider Search

#### GET /api/v1/providers

**Description**: Search for healthcare providers.

**Query Parameters**:
- `specialty` (optional): Filter by specialty
- `location` (optional): City or ZIP code
- `name` (optional): Provider name search
- `accepts_new_patients` (boolean, optional)
- `page`, `per_page`

**Response** (200 OK):
```json
{
  "providers": [
    {
      "id": "provider-uuid-1",
      "name": "Dr. Sarah Johnson",
      "credentials": "MD",
      "specialty": "Cardiology",
      "npi_number": "1234567890",
      "primary_clinic": {
        "id": "clinic-uuid",
        "name": "Heart Health Center",
        "address": "456 Medical Dr, City, ST 12345",
        "distance_miles": 2.3
      },
      "accepts_new_patients": true,
      "rating": 4.8,
      "review_count": 127
    }
  ],
  "pagination": {...}
}
```

---

## 7. AI Agent Interactions

### 7.1 Conversation Management

#### POST /api/v1/agent/conversations

**Description**: Start new AI agent conversation.

**Headers**: `Authorization: Bearer {access_token}`

**Request Body**:
```json
{
  "conversation_type": "appointment_booking",
  "channel": "voice",
  "initial_message": "I need to schedule a doctor's appointment"
}
```

**Response** (201 Created):
```json
{
  "conversation_id": "conv-uuid-1",
  "session_id": "session-abc123",
  "status": "active",
  "agent_response": {
    "message": "I'd be happy to help you schedule an appointment. What type of appointment do you need - primary care, specialist, or urgent care?",
    "suggested_actions": [
      {"label": "Primary Care", "value": "primary_care"},
      {"label": "Specialist", "value": "specialist"}
    ]
  }
}
```

---

#### POST /api/v1/agent/conversations/:id/messages

**Description**: Send message to AI agent in ongoing conversation.

**Headers**: `Authorization: Bearer {access_token}`

**Request Body**:
```json
{
  "content": "I need a primary care appointment next week",
  "content_type": "text"
}
```

**Response** (200 OK):
```json
{
  "message_id": "msg-uuid-1",
  "agent_response": {
    "message": "Great! I found several available slots next week. Would you prefer morning or afternoon appointments?",
    "intent_detected": "appointment_scheduling",
    "entities_extracted": {
      "appointment_type": "primary_care",
      "timeframe": "next_week"
    },
    "confidence_score": 0.92,
    "tool_calls": [
      {
        "tool_name": "get_provider_availability",
        "status": "success"
      }
    ]
  }
}
```

---

## 8. Front-Desk Automation

### 8.1 Check-In Operations

#### POST /api/v1/front-desk/check-in

**Description**: Initiate appointment check-in.

**Headers**: `Authorization: Bearer {access_token}`

**Request Body**:
```json
{
  "appointment_id": "appt-uuid-1",
  "check_in_method": "mobile",
  "location": {
    "latitude": 37.7749,
    "longitude": -122.4194
  }
}
```

**Response** (200 OK):
```json
{
  "check_in_id": "checkin-uuid-1",
  "status": "checked_in",
  "appointment": {...},
  "next_steps": [
    "Insurance verification required",
    "Please complete consent forms"
  ],
  "forms_required": [
    {"form_id": "consent-form-1", "form_name": "Consent for Treatment"}
  ],
  "estimated_wait_time_minutes": 15
}
```

---

## 9. Real-Time WebSocket

### 9.1 Connection & Events

**WebSocket URL**: `wss://api.ecarebots.com/ws`

**Authentication**: Send JWT token in connection params or first message.

**Connection Example**:
```javascript
const ws = new WebSocket('wss://api.ecarebots.com/ws?token=JWT_TOKEN');

ws.onopen = () => {
  console.log('Connected to EcareBots WebSocket');
};

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log('Received:', data);
};
```

**Event Types**:

1. **medication_reminder**:
```json
{
  "event_type": "medication_reminder",
  "data": {
    "reminder_id": "reminder-uuid",
    "medication_name": "Aspirin",
    "dosage": "81mg",
    "scheduled_time": "2025-11-30T20:00:00Z"
  }
}
```

2. **appointment_update**:
```json
{
  "event_type": "appointment_update",
  "data": {
    "appointment_id": "appt-uuid",
    "status": "confirmed",
    "message": "Your appointment has been confirmed"
  }
}
```

3. **agent_message**:
```json
{
  "event_type": "agent_message",
  "data": {
    "conversation_id": "conv-uuid",
    "message": "I've successfully scheduled your appointment",
    "timestamp": "2025-11-30T12:00:00Z"
  }
}
```

---

## 10. Error Handling & Status Codes

### 10.1 Standard HTTP Status Codes

| Code | Meaning | Usage |
|------|---------|-------|
| 200 | OK | Successful GET, PATCH, DELETE |
| 201 | Created | Successful POST creating new resource |
| 204 | No Content | Successful DELETE with no response body |
| 400 | Bad Request | Invalid request format or parameters |
| 401 | Unauthorized | Missing or invalid authentication token |
| 403 | Forbidden | Authenticated but insufficient permissions |
| 404 | Not Found | Resource does not exist |
| 409 | Conflict | Resource conflict (e.g., duplicate, booking conflict) |
| 422 | Unprocessable Entity | Validation errors |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Unexpected server error |
| 503 | Service Unavailable | Temporary service disruption |

### 10.2 Error Response Format

All error responses follow consistent structure:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      },
      {
        "field": "password",
        "message": "Password must be at least 8 characters"
      }
    ],
    "request_id": "req-abc123",
    "timestamp": "2025-11-30T12:00:00Z"
  }
}
```

**Error Codes**:
- `AUTHENTICATION_FAILED`: Invalid credentials
- `TOKEN_EXPIRED`: JWT token expired
- `VALIDATION_ERROR`: Request validation failed
- `RESOURCE_NOT_FOUND`: Requested resource doesn't exist
- `CONFLICT`: Resource conflict (e.g., duplicate email)
- `RATE_LIMIT_EXCEEDED`: Too many requests
- `INTERNAL_ERROR`: Unexpected server error

---

## 11. Rate Limiting

### 11.1 Rate Limit Tiers

Rate limits vary by endpoint sensitivity and user role[web:209][web:211]:

| Tier | Endpoints | Rate Limit | Window |
|------|-----------|------------|--------|
| **Public** | `/health`, `/auth/register` | 100 req/min | Per IP |
| **Auth** | `/auth/login`, `/auth/refresh` | 10 req/15min | Per IP |
| **Standard** | Most GET endpoints | 1000 req/hour | Per user |
| **Write** | POST/PATCH/DELETE | 100 req/hour | Per user |
| **Search** | Provider/document search | 60 req/min | Per user |
| **Upload** | Document upload | 10 req/hour | Per user |

### 11.2 Rate Limit Headers

All responses include rate limit information:

```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 987
X-RateLimit-Reset: 1701367200
```

### 11.3 Rate Limit Exceeded Response

**Status**: 429 Too Many Requests

```json
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Rate limit exceeded. Please retry after 300 seconds.",
    "retry_after": 300,
    "limit": 1000,
    "window": "1 hour"
  }
}
```

---

## 12. Security Considerations

### 12.1 HTTPS Only

All API endpoints require HTTPS. HTTP requests are automatically redirected to HTTPS.

### 12.2 CORS Configuration

**Allowed Origins**:
- `https://ecarebots.com`
- `https://app.ecarebots.com`
- `https://*.ecarebots.com` (subdomains)

**Allowed Methods**: GET, POST, PATCH, PUT, DELETE, OPTIONS

**Allowed Headers**: Authorization, Content-Type, X-Request-ID

### 12.3 Input Validation

All inputs validated using:
- Email: RFC 5322 standard
- Phone: E.164 format
- Dates: ISO 8601 (YYYY-MM-DD)
- UUIDs: RFC 4122 format

### 12.4 SQL Injection Prevention

All database queries use parameterized statements via Supabase RLS policies.

### 12.5 HIPAA Compliance

- **Encryption**: TLS 1.3 in transit, AES-256 at rest
- **Audit Logging**: All data access logged with user ID, timestamp, IP
- **Access Control**: Row-Level Security enforces minimum necessary access
- **Data Retention**: 7-year retention for medical records per HIPAA

---

## 13. OpenAPI 3.0 Specification (Excerpt)

```yaml
openapi: 3.0.3
info:
  title: EcareBots API
  description: AI-powered healthcare coordination platform API
  version: 1.0.0
  contact:
    name: EcareBots Support
    email: api@ecarebots.com
    url: https://ecarebots.com/support
  license:
    name: MIT
    url: https://opensource.org/licenses/MIT

servers:
  - url: https://api.ecarebots.com/api/v1
    description: Production server
  - url: https://staging-api.ecarebots.com/api/v1
    description: Staging server

security:
  - BearerAuth: []

components:
  securitySchemes:
    BearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT

  schemas:
    User:
      type: object
      properties:
        id:
          type: string
          format: uuid
        email:
          type: string
          format: email
        full_name:
          type: string
        role:
          type: string
          enum: [patient, caregiver, healthcare_provider, admin]
        created_at:
          type: string
          format: date-time

    Medication:
      type: object
      required:
        - medication_name
        - dosage
        - frequency
        - start_date
      properties:
        id:
          type: string
          format: uuid
        medication_name:
          type: string
        dosage:
          type: string
        frequency:
          type: string
        start_date:
          type: string
          format: date
        is_active:
          type: boolean

    Error:
      type: object
      properties:
        error:
          type: object
          properties:
            code:
              type: string
            message:
              type: string
            details:
              type: array
              items:
                type: object
            request_id:
              type: string

paths:
  /auth/login:
    post:
      summary: User login
      tags:
        - Authentication
      security: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - email
                - password
              properties:
                email:
                  type: string
                  format: email
                password:
                  type: string
                  format: password
      responses:
        '200':
          description: Successful login
          content:
            application/json:
              schema:
                type: object
                properties:
                  access_token:
                    type: string
                  refresh_token:
                    type: string
                  expires_in:
                    type: integer
        '401':
          description: Invalid credentials
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'

  /medications:
    get:
      summary: List medications
      tags:
        - Medications
      parameters:
        - name: is_active
          in: query
          schema:
            type: boolean
        - name: page
          in: query
          schema:
            type: integer
            default: 1
      responses:
        '200':
          description: Successful response
          content:
            application/json:
              schema:
                type: object
                properties:
                  medications:
                    type: array
                    items:
                      $ref: '#/components/schemas/Medication'
                  pagination:
                    type: object
```

---

## 14. Conclusion & Next Steps

### 14.1 Implementation Roadmap

**Phase 1** (MVP - Core Endpoints):
- Authentication & User Management
- Medications & Medication Reminders
- Appointments & Provider Availability

**Phase 2** (Extended Features):
- Insurance Management & Verification
- Document Upload & OCR Processing
- Provider Search & Directory

**Phase 3** (AI & Real-time):
- AI Agent Conversations
- WebSocket Real-time Updates
- Front-Desk Automation

### 14.2 API Versioning Strategy

- **Current**: v1 (stable)
- **Deprecation Notice**: 6 months before sunset
- **Support Window**: 12 months after new version release
- **Breaking Changes**: Only in major versions (v1 → v2)

### 14.3 Monitoring & Analytics

**Key Metrics**:
- API response time (p50, p95, p99)
- Error rate by endpoint
- Authentication success rate
- Rate limit hit frequency
- WebSocket connection stability

---

## 15. References

[web:132] Empowering Robust Security Measures in Node.js-Based REST APIs by JWT Tokens  
[web:151] How to Secure Your Node.js API with JWT Authentication  
[web:154] Real-Time Appointment Scheduling Using MERN Stack and WebSockets  
[web:157] Real-time updates using WebSockets - Nutrient SDK  
[web:192] Capture of real-time data from electronic health records: scenarios and solutions  
[web:205] api-with-examples - OpenAPI Documentation  
[web:206] How to Use OpenAPI Specification for API Integration  
[web:208] Api Versioning Best Practices: Top Strategies for 2025  
[web:209] Secure API Gateway with Rate Limiting and JWT Authentication  
[web:210] API versioning best practices - Redocly  
[web:211] API Security Essentials: OAuth2, JWT, and Rate Limiting

---

**Document Status**: Complete  
**Review Status**: Pending Day 4 Integration Review  
**Next Document**: Tech Stack Justification (architecture/tech-stack-justification.md)
