# EcareBots Feature Specifications

**Version:** 1.1.0  
**Last Updated:** December 12, 2025  
**Status:** Implementation-Ready

---

## Executive Summary

This document defines the functional specifications, acceptance criteria, and implementation notes for the **six core features** of EcareBots. Each feature is designed per **accessibility-first principles** and explicitly supports **voice, gesture, and vision-based multi-modal input** to enable hands-free operation for elderly, disabled, and mobility-challenged users.

### Core Features Documented
1. **Medication & Health Schedule Management** – Smart reminders, adherence tracking
2. **Doctor Appointment Booking** – Voice-first scheduling with provider search
3. **Insurance Verification & Policy Optimization** – Real-time eligibility checks
4. **Document Management & Expiry Tracking** – OCR-powered document lifecycle management
5. **Clinic Front-Desk Automation** – Streamlined check-in, paperwork automation
6. **Multi-Modal Input** – Voice, gesture, vision, text fallback

**Implementation Approach:** MVP (Months 1-3) focuses on features 1-3 + 6. Features 4-5 added in post-MVP.

---

## 1. Medication & Health Schedule Management

### 1.1 Functional Requirements

**Add & Manage Medications:**
- Users can add medications with: drug name, dosage, frequency, timing, route (oral, injection, inhaler), instructions, refill date, pharmacy contact
- Edit/delete medications from dashboard
- Support for recurring schedules (daily, weekly, custom patterns)
- Link medications to health conditions

**Medication Reminders:**
- Multi-channel notifications: push, voice (TTS), SMS, email
- Configurable reminder time (exact time, 15min before, flexible)
- Snooze (5/15/30 min, custom), skip (one-time, recurring), or mark taken
- Reminder logs capture: timestamp, action (taken/skipped), notes

**Vital Signs Tracking:**
- Record daily vitals: blood pressure (systolic/diastolic), heart rate, temperature, glucose, weight, SpO2
- Manual entry or manual import from wearables (future)
- Visualization: dashboard chart (last 30 days), trend analysis

**Caregiver Support:**
- Dependent user profiles with role-based access
- Caregivers receive adherence alerts (missed doses, concerning trends)
- Caregiver can add/edit medications on behalf of dependent

### 1.2 Acceptance Criteria

**Functional:**
- [ ] User can add medication with all fields in <2 minutes via voice
- [ ] Medication reminder sent at scheduled time with 98% reliability
- [ ] Reminder receipt logged; snooze/skip/take actions update adherence record
- [ ] Vital signs display in dashboard with 7-day, 30-day, custom date range views
- [ ] Caregiver sees dependent's adherence dashboard with last 90 days of data
- [ ] User can re-record medication reminder time via voice at any time

**Performance:**
- [ ] Dashboard load time <2 seconds (even with 200+ historical reminders)
- [ ] Reminder delivery <5 seconds from scheduled time
- [ ] Voice input processed and confirmed <3 seconds

**Accessibility:**
- [ ] 100% of workflow operable via voice-only (no touch/keyboard required)
- [ ] All screens WCAG 2.1 AAA compliant (Lighthouse audit)
- [ ] Large text option (18pt minimum) available system-wide
- [ ] High-contrast mode (white text on dark, or inverted)
- [ ] Screen reader announces medication names, dosages, times in plain language

**Security & Privacy:**
- [ ] Medication details encrypted at rest (AES-256) and in transit (TLS 1.3)
- [ ] Push notifications do NOT disclose drug names without user setting
- [ ] Adherence data associated with user ID only, never exposed in logs
- [ ] Reminder logs retained for 1 year, then automatically deleted

### 1.3 Edge Cases & Error Handling

| Edge Case | Behavior | Implementation Notes |
|-----------|----------|---------------------|
| User forgets to take medication | 1) Reminder repeats after 5min; 2) Repeat up to 3x; 3) Alert sent to caregiver | Use exponential backoff for repeat reminders |
| User adds medication with typo | 1) System suggests corrections (e.g., "Lisinopril" for "Lisinopril"); 2) User confirms; 3) Or allow custom entry | Integrate with RxCUI (SNOMED) for auto-complete |
| Voice input misunderstood | 1) System repeats back what it heard; 2) User confirms or re-speaks; 3) Max 3 attempts before fallback to manual entry | Confidence threshold: >0.8 auto-accept, 0.5-0.8 confirm, <0.5 retry |
| Network unavailable | 1) Reminders stored locally and sent when online; 2) Adherence data synced when reconnected | Use service worker for offline support |
| User has >20 daily reminders | 1) Batch reminders by time window (e.g., 8 AM group: take 3 pills); 2) Simplify interface to "Time to take medications" | Consider medication grouping in UX |

### 1.4 Implementation Notes

**Frontend:**
- React component: `<MedicationForm />` with voice input integration
- React component: `<ReminderDashboard />` showing today's reminders, adherence summary
- TTS library: ElevenLabs or Azure Speech (configurable voice, speed, pitch)
- Local storage: Sync adherence data to backend every 30 min (or immediately on critical change)

**Backend:**
- Database: `medications` table (user_id, drug_name, dosage, frequency, next_dose_time, created_at, updated_at)
- Database: `adherence_logs` table (user_id, medication_id, timestamp, action_taken, notes)
- Scheduled job: Cron task to generate reminders 15 min before scheduled time
- Webhook: Send reminder via push/SMS/email from notification service

**Testing:**
- Unit tests: Medication CRUD, reminder scheduling, adherence calculation
- Integration tests: Voice input → reminder creation → notification sent
- E2E tests: User adds med → reminder fires → user marks taken → adherence updated

---

## 2. Doctor Appointment Booking

### 2.1 Functional Requirements

**Search & Book:**
- Search providers by specialty (cardiology, dermatology, primary care, etc.), location (ZIP, city), or language
- Filter results: accepts insurance, takes new patients, available in next 30 days
- Display provider info: name, credentials, hospital affiliation, patient reviews (5-star), distance, wait time estimates
- One-tap booking or voice: "Book appointment with cardiologist near me for next Tuesday 3pm"
- Real-time availability checking (integrated with EHR or manual scheduling API)

**Confirmation & Reminders:**
- Appointment confirmed with calendar invite (email, SMS, voice call)
- Pre-visit reminders: 1 week before (voice), 1 day before (push), 1 hour before (voice)
- Pre-visit instructions: bring ID, insurance card, medical records; drive time directions
- Virtual visit link sent 30 min before for telehealth appointments

**Rescheduling & Cancellation:**
- User can reschedule via voice: "Move my Wednesday appointment to Friday morning"
- Cancellation reason (optional): system learns which time slots users prefer
- Cancellation notifications sent to provider (if manual scheduling) or auto-confirmed (if EHR integrated)

### 2.2 Acceptance Criteria

**Functional:**
- [ ] Search returns results in <3 seconds for 50-mile radius
- [ ] Booking confirmed and calendar invite sent within <5 seconds
- [ ] Provider availability updates in real-time (test with mock EHR API)
- [ ] User receives reminders at exact scheduled times (1 week, 1 day, 1 hour)
- [ ] Rescheduling or cancellation processed within <30 seconds
- [ ] Appointment history visible for past 2 years (or configurable)

**Accessibility:**
- [ ] Search/filter operable via voice: "Show me cardiologists near zip 94301 who see new patients"
- [ ] Appointment confirmation readable by screen reader (all fields announced clearly)
- [ ] Touch targets ≥44x44px for all buttons
- [ ] No timing constraints (user can take as long as needed to book)

**Security & Privacy:**
- [ ] Appointment details encrypted in transit and at rest
- [ ] User's address/location never shared with provider unless explicitly consented
- [ ] Telehealth links expire 1 hour after appointment start time
- [ ] Calendar invites use generic subject "Medical Appointment" (not provider name, if privacy desired)

### 2.3 Edge Cases

| Edge Case | Behavior | Notes |
|-----------|----------|-------|
| No availability at requested time | 1) System suggests nearest alternatives (±2 hour window); 2) Waitlist option; 3) Telehealth fallback | Offer 3 alternative times |
| User books with wrong provider | 1) Confirmation screen shows provider name and photo; 2) "Is this correct?" voice prompt; 3) User can change or cancel | Add visual + voice confirmation |
| EHR API unavailable | 1) Fall back to manual scheduling (staff approves); 2) Send SMS when appointment confirmed by provider | Graceful degradation |
| User misses appointment | 1) No-show recorded in system; 2) Caregiver notified; 3) Optional feedback: "Why did you miss this?"; 4) No penalties, but trend alerts sent | Track no-show rate per user |

### 2.4 Implementation Notes

**Frontend:**
- React component: `<ProviderSearch />` with voice input for filters
- React component: `<AppointmentConfirmation />` with TTS confirmation
- React component: `<AppointmentDashboard />` showing upcoming/past appointments
- Voice confirmation: "You are booking with Dr. Smith, Cardiologist, on Tuesday December 17 at 3:00 PM. Is this correct?"

**Backend:**
- Integration: 1up Health FHIR API (for Epic, Cerner) or Redox API for availability
- Database: `appointments` table (user_id, provider_id, appointment_time, specialty, status, created_at)
- Scheduled job: Send reminders at 1 week, 1 day, 1 hour before appointment
- Webhook: Receive cancellation notifications from EHR

**Testing:**
- Mock EHR API responses for various provider scenarios
- Unit tests: Search filtering, appointment creation, reminders
- E2E tests: User searches → selects provider → books → receives confirmation → reminder fires

---

## 3. Insurance Verification & Policy Optimization

### 3.1 Functional Requirements

**Insurance Card Management:**
- Upload insurance card via camera (front and back photos)
- Automatic OCR extraction: member ID, group number, plan name, effective dates, copay amounts
- Manual entry fallback (type or voice dictate: "Member ID 123, Group 456")
- Multiple insurance cards supported (primary, secondary, dental, vision)
- Verification status indicator: Active, Expired, Expiring Soon (30 days)

**Real-Time Eligibility Verification:**
- Query insurance API (Availity, Change Healthcare) to verify coverage
- Display: Patient responsibility, deductible met, copay amounts, out-of-pocket max
- Integration: Auto-fill at clinic check-in (with user consent)
- Alerts: Coverage ending in 30 days, renewal date approaching

**Policy Optimization:**
- Compare multiple plans (Medicare Advantage vs Original, employer plans vs ACA)
- Calculate annual out-of-pocket cost based on user's medication/procedure history
- Recommend best plan with voice explanation: "Switching to Plan B would save you $800/year"
- Policy switch assistance: Step-by-step enrollment guidance

### 3.2 Acceptance Criteria

**Functional:**
- [ ] OCR extracts member ID, group, copay with 98%+ accuracy (test on 100 card images)
- [ ] Eligibility verification returns result in <10 seconds
- [ ] Plan comparison shows 3-5 alternatives with cost estimates
- [ ] Expiration alerts sent 30 days before renewal date
- [ ] Manual entry via voice completed in <2 minutes

**Accessibility:**
- [ ] Card photo capture or voice entry fully supported
- [ ] Verification results displayed in plain language (6th-grade reading level)
- [ ] Plan comparison table sortable via voice: "Sort by monthly premium lowest first"
- [ ] All data entry confirmed back to user before submission

**Security & Privacy:**
- [ ] Insurance data encrypted at rest and in transit
- [ ] Verification API calls use HIPAA-compliant endpoints
- [ ] User consent required before sharing insurance data with providers
- [ ] Insurance card images stored securely, accessible only to authorized users
- [ ] Audit log tracks all insurance data access

### 3.3 Edge Cases

| Edge Case | Behavior | Notes |
|-----------|----------|-------|
| Insurance not found in database | 1) System shows manual entry option; 2) Stores as "Unknown Plan"; 3) Flag for support team review | Graceful fallback |
| Member ID unclear in photo | 1) System prompts user to re-take photo; 2) Or dictate via voice | Max 2 photo attempts before voice fallback |
| Multiple insurance plans active | 1) User designates primary, secondary; 2) System queries both and shows combined coverage | Track coverage coordination |
| Insurance API down | 1) Show cached verification from last check; 2) Display cache date and note "May be outdated" | 24-hour cache TTL |

### 3.4 Implementation Notes

**Frontend:**
- React component: `<InsuranceCardCapture />` with mobile camera integration
- React component: `<EligibilityVerification />` displaying plain-language results
- React component: `<PlanComparison />` with voice-sortable table
- OCR library: Tesseract.js or cloud vision API (Google Vision, Azure)

**Backend:**
- API integration: Availity EDI 270/271 (eligibility verification)
- API integration: Change Healthcare API (plan comparison)
- Database: `insurance_policies` table (user_id, member_id, group_number, plan_name, copay, deductible, status)
- Scheduled job: Check expiration dates daily, alert users 30 days before renewal

**Testing:**
- Unit tests: OCR accuracy, eligibility parsing
- Integration tests: Insurance API mocking, cache behavior
- E2E tests: User uploads card → OCR → verification → plan comparison

---

## 4. Document Management & Expiry Tracking

### 4.1 Functional Requirements

**Document Upload & Classification:**
- Upload documents via camera (prescription, lab result, insurance card, medical record) or file picker
- Automatic OCR and classification (ML model identifies document type)
- Extract metadata: expiry date, issuer, key details
- Manual classification fallback if ML uncertain

**Expiry Tracking:**
- Calendar view of document validity periods
- Alerts: 30 days before expiry (voice call), 7 days (push), 1 day (SMS)
- Automatic reminders for recurring documents (annual physical due date, prescription refills)

**Document Sharing & Access:**
- Share with providers (doctors, pharmacies) with granular consent
- Revoke access at any time
- Access logs show who viewed what document and when

### 4.2 Acceptance Criteria

**Functional:**
- [ ] OCR extracts expiry date with 95%+ accuracy
- [ ] Document type classification accurate for 90%+ of images
- [ ] Expiry alerts sent at scheduled times (30/7/1 day before)
- [ ] User can share document with provider in <30 seconds
- [ ] Access log queryable by date, provider, document type

**Accessibility:**
- [ ] Document upload fully operable via voice
- [ ] Expiry calendar readable by screen reader
- [ ] Sharing confirmation spoken back to user before finalizing

**Security & Privacy:**
- [ ] Documents encrypted with user-specific key
- [ ] Provider access time-limited (1 document view, or 24 hours, configurable)
- [ ] Audit log immutable and retained for 3 years

### 4.3 Edge Cases

| Edge Case | Behavior | Notes |
|-----------|----------|-------|
| Document has no expiry date | 1) Mark as "No expiry"; 2) User can manually set renewal date | Allow user-defined recurring dates |
| Low OCR confidence | 1) Prompt user to verify extracted date; 2) Allow manual correction | Confidence threshold: >0.85 auto-accept |
| User uploads duplicate | 1) System detects duplicate (by date, issuer, content hash); 2) Asks to confirm or skip | Prevent duplicate storage |

---

## 5. Clinic Front-Desk Automation

### 5.1 Functional Requirements

**Voice-First Check-In:**
- Registered user says: "I'm here for my 3pm appointment with Dr. Smith"
- System verifies: appointment found, insurance active, pre-visit checklist complete
- Display confirmation on clinic staff tablet: patient name, appointment time, co-pay amount
- Staff taps confirm, patient directed to waiting room

**Pre-Fill Registration:**
- If new patient or records outdated, system auto-fills from user profile:
  - Demographics: name, DOB, address, phone
  - Insurance: member ID, group, copay
  - Medical history: allergies, current medications, emergency contact
- User/staff review and correct if needed

**Accessibility Mode:**
- Clinic staff can switch waiting room kiosk to "Accessibility Mode"
- Large text, high contrast, voice-guided check-in
- Staff assist if needed (e.g., reading aloud, filling forms)

### 5.2 Acceptance Criteria

**Functional:**
- [ ] Voice-only check-in completed in <1 minute for returning patients
- [ ] Registration form pre-filled with 95%+ accuracy
- [ ] Insurance verification completed at check-in
- [ ] Staff dashboard shows check-in status in real-time
- [ ] Zero required typing for patients with complete profiles

**Accessibility:**
- [ ] Entire check-in operable via voice or large buttons (no small text)
- [ ] Waiting time announcements: "You are number 5, estimated wait 15 minutes"

**Security & Privacy:**
- [ ] HIPAA consent shown before any data use
- [ ] Staff access logged (who logged in, what they accessed, when)
- [ ] Patient data cleared from clinic kiosk after check-in complete

### 5.3 Edge Cases

| Edge Case | Behavior | Notes |
|-----------|----------|-------|
| New patient, no profile | 1) Staff enters basic info; 2) System imports from insurance verification | Fallback to manual entry |
| Insurance verification fails | 1) Flag as "Insurance unverified"; 2) Alert staff to confirm coverage; 3) Patient still checked in | Don't block care |
| User has no appointment (walk-in) | 1) Staff manually creates appointment; 2) Ask reason for visit, estimate wait time | Accommodate walk-ins |

---

## 6. Multi-Modal Input Support

### 6.1 Functional Requirements

**Input Modalities:**
1. **Voice:** Speech-to-text (Whisper), intent recognition (NLU), text-to-speech (ElevenLabs)
2. **Gesture:** Hand tracking (MediaPipe), gesture-to-command mapping (thumbs up = confirm, open palm = stop)
3. **Vision:** Document OCR, pill identification, skin condition monitoring
4. **Text:** Keyboard/touch fallback for quiet environments or personal preference

**Feature Parity:**
- All core workflows (medication management, appointment booking, insurance verification) accessible via ANY single input mode
- System intelligently switches input if user is struggling (e.g., microphone too noisy → gesture mode)

**Accessibility Personalization:**
- Voice: speed (slow/normal/fast), gender, accent, language
- Gesture: sensitivity (large/normal/small gesture detection)
- Visual: text size (14-24pt+), contrast (normal/high/inverted), animations (on/off)
- Input mode: default (voice/gesture/text), fallback, custom combinations

### 6.2 Acceptance Criteria

**Functional:**
- [ ] >98% feature completeness parity across all three input modes
- [ ] User can complete all core tasks with SINGLE input mode (voice only, gesture only, or text only)
- [ ] System auto-detects input mode preference after first few interactions
- [ ] Personalization settings persisted across all devices and sessions

**Accessibility:**
- [ ] Users with visual, motor, or cognitive disabilities can use platform unassisted
- [ ] 100% WCAG 2.1 AAA compliance (automated scanner + manual audit)
- [ ] All settings have audio + visual + text explanations

**Performance:**
- [ ] Voice input latency <2 seconds (speech recorded → intent recognized)
- [ ] Gesture recognition latency <1 second
- [ ] Fallback input mode activated within <3 seconds if primary mode fails

### 6.3 Testing & Validation

- User testing with 20+ elderly participants (target accessibility)
- User testing with 10+ disabled/mobility-impaired participants
- Automated accessibility scanning (Lighthouse, axe, WAVE)
- Manual WCAG 2.1 AAA audit by accessibility specialist

---

## Summary: Implementation Prioritization

### **MVP (Months 1-3): Features 1, 2, 3, 6**
1. Medication & Health Schedule Management
2. Doctor Appointment Booking
3. Insurance Verification
4. Multi-Modal Input (voice + text fallback; gesture post-MVP)

### **Post-MVP (Months 4-6): Features 4, 5**
5. Document Management & Expiry Tracking
6. Clinic Front-Desk Automation

---

## References

1. WCAG 2.1 Level AAA Compliance: https://www.w3.org/WAI/WCAG21/quickref/
2. Healthcare App Design for Elderly Users: WebMD, Mayo Clinic user research
3. HIPAA Security & Privacy Rules: https://www.hhs.gov/hipaa/
4. SNOMED CT for Medication Reference: https://www.snomed.org/
5. FHIR R4 Specification: https://hl7.org/fhir/R4/

---

*This specification is implementation-ready and can be handed to a development team with confidence that all requirements, edge cases, and acceptance criteria are clearly defined.*
