# EcareBots UI/UX Design Principles

**Version:** 2.0.0  
**Last Updated:** December 16, 2025  
**Status:** Complete & Expandable

---

## Executive Summary

This document consolidates best practices and actionable UI/UX guidelines for the EcareBots platform, ensuring highly accessible, intuitive, and elder-friendly digital healthcare. All guidance is aligned with **WCAG 2.1 AAA standards** and research-backed recommendations for elderly, disabled, and low-literacy users.

**Key Principle:** Design for the most constrained user first (voice-only, no touch, visually impaired, cognitively challenged). If it works for them, it works for everyone.

---

## 1. Accessibility-First Design (WCAG 2.1 AAA)

### 1.1 Text & Contrast

**Font Sizing:**
- **Body Text:** ≥18pt (1.5em/24px) minimum
- **Headings:** 
  - H1: 36pt minimum
  - H2: 28pt minimum
  - H3: 24pt minimum
  - H4: 20pt minimum
- **Controls & Buttons:** 16pt minimum
- **Captions/Labels:** 14pt minimum (can be smaller if user has ability to zoom)
- **User-Adjustable:** Support 18pt, 20pt, 24pt, 28pt, 32pt+ custom sizes

**Line Height & Spacing:**
- Body text line height: 1.5 (36px minimum for 24px text)
- Paragraph spacing: 1.5× line height
- Letter spacing: 0.02em–0.05em (optional, available in settings)

**Contrast Ratios:**
- **Normal Text:** Minimum 7:1 (WCAG AAA)
- **Large Text (18pt+):** Minimum 4.5:1 (WCAG AA is sufficient)
- **Focus Indicators:** 3:1 against adjacent colors
- **Graphics & Icons:** 3:1 minimum
- **All states:** Normal, hover, focus, disabled, active states must maintain 7:1

**Testing:**
- Use WebAIM Contrast Checker or Contrast Ratio tool
- Automated test: Lighthouse, axe-core (every PR)
- Manual test: WAVE browser extension

### 1.2 Touch Targets & Spacing

**Touch Target Size:**
- **All Interactive Elements:** Minimum 48×48px (WCAG AAA)
- **Mobile/Touch:** 56×56px preferred
- **Buttons, Links, Form Controls:** Padded to 48px minimum
- **Clickable Text:** Minimum 44×44px touch area (including padding)

**Spacing Between Elements:**
- **Horizontal Spacing:** Minimum 8px between adjacent buttons
- **Vertical Spacing:** Minimum 12px between input fields
- **Avoid Clustering:** Never place >2 critical buttons adjacent without spacing

**Visual Indicators:**
- All interactive elements: icon + text (redundant labels)
- Hover state: background color change + border highlight
- Focus state: 3px border + background color + glow effect
- Active state: darker/pressed appearance + haptic feedback (mobile)

### 1.3 Navigation & Information Architecture

**Top-Level Navigation:**
- Maximum 3 primary actions per screen
- Secondary actions in overflow menu (three-dot icon with label "More")
- Breadcrumb navigation for sub-flows (voice: "You are in: Medication → Add Medication")
- Always show current location (visual header + voice announcement)

**Back Button & Undo:**
- Every screen except Home has visible back button (top-left, 48px)
- Voice: "Back" command always available
- Undo for all destructive actions (medication delete, appointment cancel)
- Confirm dialogs for destructive actions: "Delete medication Lisinopril? Yes / No"

**Progressive Disclosure:**
- Hide advanced options by default
- "More Options" expandable section with clear label
- Voice: "Show advanced settings" to reveal additional controls
- Only show what's needed for current task

**Error-Proof Onboarding:**
- Step-by-step wizards with progress indicator ("Step 2 of 5")
- Voice: "You are on step 2 of 5: Add Insurance Information"
- Skip button for optional steps
- Confirmation before final submission

### 1.4 Screen Reader & Keyboard Support

**ARIA Labels & Roles:**
- All form inputs: `<label for="input-id">` explicit association
- All icons: `aria-label` or `title` with plain language description
- Dynamic content: `role="alert"` for important messages, `aria-live="polite"` for status updates
- List items: `<ul role="list">` with `<li>` for proper nesting
- Tables: `<table>` with `<thead>`, `<th>`, proper scoping
- Examples:
  ```html
  <!-- Good: Explicit label -->
  <label for="med-name">Medication Name</label>
  <input id="med-name" type="text" />
  
  <!-- Good: Icon with aria-label -->
  <button aria-label="Delete medication"><Icon>X</Icon></button>
  
  <!-- Good: Status update -->
  <div aria-live="polite" aria-atomic="true">
    Appointment booked for Tuesday 3pm
  </div>
  ```

**Keyboard Navigation:**
- All interactive elements: tab-accessible in logical flow order
- Form fields → primary buttons → secondary actions
- Tab order matches visual left-to-right, top-to-bottom reading order
- Never trap focus in modal/dialog; always provide escape key
- Skip links: "Skip to main content" for web version

**Focus Indicators:**
- Visible focus ring: minimum 2px, high-contrast color (not subtle)
- Focus ring color: contrasts 3:1 against background
- No outline removal without replacement
- Focus visible on keyboard navigation (use `:focus-visible` not just `:focus`)
- Example:
  ```css
  button:focus-visible {
    outline: 3px solid #0066cc;
    outline-offset: 2px;
  }
  ```

**Screen Reader Testing:**
- NVDA (Windows): Free, standard for accessibility testing
- JAWS (Windows): Most common in real-world use, test if budget allows
- VoiceOver (macOS/iOS): Built-in, test on Apple devices
- TalkBack (Android): Built-in, test on Android devices
- Test flows:
  - Add medication (complete flow voice-only)
  - Book appointment (search → book → confirm)
  - Check insurance (upload card → verify → review)

### 1.5 Color-Blind & Low-Vision Support

**Color Palette (WCAG AAA Compliant):**

| Use Case | Color | Hex | Notes |
|----------|-------|-----|-------|
| **Primary Action** | Teal | #208090 | High contrast, works for protanopia & deuteranopia |
| **Success** | Green | #2d7d4d | Paired with checkmark ✓ |
| **Warning** | Orange | #c85a1e | Paired with ⚠️ symbol |
| **Error** | Red | #d92222 | Paired with ✕ symbol |
| **Neutral/Disabled** | Gray | #7a7a7a | No meaning reliance, text only |
| **Text (Light)** | Dark Gray | #1a1a1a | 7:1 contrast on light backgrounds |
| **Text (Dark Mode)** | Light Gray | #e8e8e8 | 7:1 contrast on dark backgrounds |
| **Background (Light)** | Off-White | #fafafa | Reduces eye strain |
| **Background (Dark)** | Dark Gray | #212121 | OLED-friendly, reduces eye strain |

**Color-Blind Safe Design:**
- Never use color alone to convey information
- Pair all color cues with:
  - **Icon:** Success ✓, Error ✕, Warning ⚠️
  - **Text:** "Success: Medication added"
  - **Shape:** Checkmark, X, exclamation circle, dash
- Test palette: Use Coolors or Color Brewer to verify color-blind safety
- Automated testing: WebAIM Color Contrast Checker

**Low-Vision Support:**
- Minimum 7:1 contrast ratio everywhere
- Zoom to 200% and test: text reflow, no content cut off, readable
- High-contrast mode: Offer system-wide high-contrast toggle
  - White (#ffffff) text on dark background (#000000)
  - Larger stroke widths for icons (3px minimum)
- Dark mode: Reduce eye strain for users sensitive to bright screens
  - Dark background (#212121) + light text (#e8e8e8)
  - No harsh blacks, use charcoal (#1a1a1a) to reduce flicker

---

## 2. Component Library Specifications

### 2.1 Button Component

**Variants:**
- **Primary Button** (CTA, high-emphasis action)
  - Background: #208090 (teal)
  - Text: White
  - Padding: 12px 24px (minimum 48×48px including focus ring)
  - Border radius: 8px
  - Font weight: 600
  - State: Hover (+10% brightness), Active (pressed effect), Disabled (opacity 0.5 + no cursor)

- **Secondary Button** (alternative action, low-emphasis)
  - Background: Transparent
  - Border: 2px solid #208090
  - Text: #208090
  - Padding: 10px 22px (maintains 48px total with border)
  - Same radius, weight, states as primary

- **Danger Button** (destructive action: delete, cancel appointment)
  - Background: #d92222 (red)
  - Text: White
  - Same padding, radius, weight as primary
  - Requires confirmation dialog before action

**Accessibility:**
- All buttons: `<button>` element (not `<div>`)
- Text label: Clear, direct verb ("Add Medication", "Book Now", "Delete")
- Icon + text: Both visible (redundant)
- Disabled state: Visual + semantic (`disabled` attribute)
- Focus visible: 3px outline, min 2px offset

**Code Example:**
```jsx
<button 
  className="btn btn-primary" 
  onClick={handleSubmit}
  aria-label="Add medication to your schedule"
>
  <Icon name="plus" /> Add Medication
</button>
```

### 2.2 Form Input Component

**Text Input Specifications:**
- **Size:** Width 100%, height 44px minimum (touch-friendly)
- **Font:** 16px or larger (prevents auto-zoom on iOS)
- **Label:** Visible above input, or inside with placeholder + label visible on focus
- **Padding:** 12px horizontal, 10px vertical
- **Border:** 2px solid #d0d0d0 (default), #208090 (focus), #d92222 (error)
- **Border radius:** 6px
- **Placeholder:** Light gray, 14pt, hidden on focus

**States:**
- **Default:** Gray border, dark text
- **Focus:** Teal border (2px) + blue outline (3px) + background color change to #f9f9f9
- **Filled:** Dark text, gray border
- **Error:** Red border + error message below (16pt, red text, aria-live)
- **Disabled:** Gray background, light text, no cursor
- **Loading:** Spinner inside input (if async validation)

**Error Handling:**
```jsx
<div className="form-group">
  <label htmlFor="dosage">Dosage (mg)</label>
  <input
    id="dosage"
    type="number"
    aria-label="Enter medication dosage in milligrams"
    aria-required="true"
    required
    onChange={handleChange}
    aria-invalid={errors.dosage ? "true" : "false"}
    aria-describedby={errors.dosage ? "dosage-error" : undefined}
  />
  {errors.dosage && (
    <span id="dosage-error" role="alert" className="error-text">
      Dosage must be a number between 1-500 mg
    </span>
  )}
</div>
```

### 2.3 Voice Input Component

**Voice Button (Microphone Icon):**
- **Size:** 56×56px (touch-friendly)
- **Location:** Bottom-right of form, or next to text input
- **Icon:** Clear microphone symbol
- **States:**
  - Idle: Gray (#7a7a7a) + label "Tap to speak"
  - Recording: Animated pulsing red (#d92222) + label "Listening..."
  - Processing: Spinner + label "Processing your speech..."
  - Confirmed: Green (#2d7d4d) + transcribed text in input + label "Speech recognized"
  - Error: Red border + label "Didn't catch that. Try again."

**Voice Confirmation (Read-Back):**
- After speech recognized: System repeats back what it heard (TTS)
- Visual text display in real-time as user speaks (live captioning)
- User confirms: "Yes, continue" or "No, try again"
- Fallback: If confidence <0.8, ask user to confirm or rephrase

**Code Example:**
```jsx
const VoiceInput = ({ onTranscript, onError }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  
  const startListening = async () => {
    setIsListening(true);
    const text = await speechToText(); // OpenAI Whisper or Web Speech API
    setTranscript(text);
    await textToSpeech(`You said: ${text}. Is that correct?`); // ElevenLabs
    setIsListening(false);
  };
  
  return (
    <div className="voice-input">
      <button 
        onClick={startListening}
        disabled={isListening}
        aria-label="Tap to speak your medication name"
        className={isListening ? 'recording' : 'idle'}
      >
        <Icon name="microphone" />
        {isListening ? 'Listening...' : 'Tap to speak'}
      </button>
      {transcript && <p>You said: {transcript}</p>}
    </div>
  );
};
```

### 2.4 Gesture Input Component

**Gesture Recognition Indicators:**
- **Camera Feed:** Large, clear display of user's hand in frame
- **Gesture Overlay:** Real-time hand pose visualization (skeleton overlay)
- **Gesture Name:** Display current gesture recognized ("Thumbs Up", "Open Palm", "OK Sign")
- **Confirmation State:** Visual feedback when gesture recognized (highlight, color change, haptic)

**Gesture Mappings (Healthcare Context):**

| Gesture | Action | Use Case |
|---------|--------|----------|
| **Thumbs Up** ✓ | Confirm, Yes, Take medication | Confirm appointment booking |
| **Thumbs Down** ✗ | Reject, No, Cancel | Decline appointment reminder |
| **Open Palm** ✋ | Stop, Cancel, Back | Stop current flow, go back |
| **Pointing Finger** ☝️ | Select, Next | Choose from list (gesture-based selection) |
| **Closed Fist** ✊ | Menu, Options | Open menu/settings |
| **Peace Sign** ✌️ | Help, Assistance | Request help/support |
| **OK Sign** 👌 | Confirmed, Understood | Acknowledge message |

**Accessibility Notes:**
- Voice alternative always available ("Say 'yes' to confirm")
- Gesture sensitivity adjustable (large/normal/small gesture detection)
- Confidence threshold shown ("Gesture recognized: 92% confidence")
- Fallback to voice or touch if gesture repeatedly fails

### 2.5 Alert & Notification Component

**Alert Types:**

**Success Alert:**
- Background: Light green (#d4f4dd)
- Border-left: 4px solid #2d7d4d (success green)
- Icon: ✓ (green)
- Text: 16pt, dark gray
- Dismiss: Auto-fade after 5 seconds OR manual close (X button)
- Example: "Appointment booked for Tuesday 3pm"

**Error Alert:**
- Background: Light red (#fce8e8)
- Border-left: 4px solid #d92222 (error red)
- Icon: ✕ (red)
- Text: 16pt, dark gray (clear, plain language)
- Persist: Stay until user dismisses or fixes error
- Example: "Insurance card image unclear. Please retake photo or enter manually."

**Warning Alert:**
- Background: Light orange (#fde8d4)
- Border-left: 4px solid #c85a1e (warning orange)
- Icon: ⚠️ (orange)
- Text: 16pt, dark gray
- Action Button: Primary action to resolve ("Renew Insurance", "Schedule Physical")
- Example: "Your insurance card expires in 30 days"

**Info Alert:**
- Background: Light blue (#d4ecf7)
- Border-left: 4px solid #0066cc (info blue)
- Icon: ℹ️ (blue)
- Text: 16pt, dark gray
- Example: "Pro tip: Say 'schedule appointment' to book a visit"

**Accessibility:**
```jsx
<div 
  role="alert" 
  aria-live="polite" 
  aria-atomic="true"
  className="alert alert-success"
>
  <span className="icon">✓</span>
  <span className="text">Medication reminder set for 8:00 AM</span>
  <button aria-label="Close alert" className="close">×</button>
</div>
```

### 2.6 Modal / Dialog Component

**Confirmation Dialog (Destructive Actions):**
- Title: "Confirm Deletion" (16pt, bold)
- Body: "Are you sure you want to delete this medication?" (14pt)
- Details: List what will be deleted (visual + screen reader)
- Buttons: "Cancel" (secondary) | "Delete" (danger, red)
- Escape key: Close dialog, action NOT executed
- Focus trap: Tab cycles through buttons/close only
- Voice: Dialog announced immediately, user can say "Yes, delete" or "Cancel"

**Accessibility:**
```jsx
<div role="dialog" aria-modal="true" aria-labelledby="dialog-title">
  <h2 id="dialog-title">Confirm Deletion</h2>
  <p>Are you sure? This action cannot be undone.</p>
  <button onClick={onCancel}>Cancel</button>
  <button onClick={onConfirm} className="btn-danger">Delete Medication</button>
</div>
```

---

## 3. Elderly & Cognitively Accessible UX Patterns

### 3.1 Simplification Strategy

**One Task Per Screen:**
- Each screen: One primary action ("Add Medication", "Book Appointment")
- Hide secondary features in "More" expandable
- Progress indicator: "Step 2 of 5" with voice announcement
- No auto-playing video, no distracting animations

**Plain Language:**
- Grade 6 reading level (10-12 years old): avg 13 syllables/sentence
- No jargon: Use "insurance card" not "policy document"
- Active voice: "Click the green button" not "The green button should be clicked"
- Short sentences: <15 words per sentence
- Bullet points: Break up long paragraphs
- Examples:
  - ✅ "Add your morning medication"
  - ❌ "Incorporate pharmaceutical substances into your daily therapeutic regimen"

**Visual Hierarchy:**
- H1 headings: 36pt, bold, teal color
- H2 headings: 28pt, bold, dark gray
- Body text: 18pt, dark gray, line height 1.5
- Important info: Highlight in teal box or callout
- Spacing: Generous vertical space between sections (24px minimum)

### 3.2 Error Handling & Recovery

**Error Message Best Practices:**
- **Plain Language:** No error codes (❌ "ERR_INVALID_INPUT"), use human text (✅ "Please enter a valid dosage")
- **Specific:** Tell user what went wrong AND how to fix it
  - ❌ "Invalid input"
  - ✅ "Dosage must be a number between 1-500 mg"
- **Prominent:** Large, red, with icon ✕
- **Proximity:** Below the input field that caused error
- **Recovery:** Offer clear next step ("Try again" button or voice: "Re-enter your dosage")

**Undo & Reversal:**
- All destructive actions have undo (for 5 minutes)
- Voice: "Undo that action"
- Visual: "Undo" button appears after deletion
- Example: "Medication deleted. Undo?" [Undo] [Dismiss]

### 3.3 Guidance & Support

**Interactive Onboarding:**
- First-time setup: Step-by-step wizard (max 5 steps)
- Voice narration: System reads each step aloud
- Video/GIF: Show example (optional, not required)
- Skip option: Allow advanced users to skip
- Progress: Show "Step X of Y" with visual progress bar

**Embedded Help:**
- Hover tooltips: "Why do I need to provide insurance?"
- Help button: "?" icon (16pt, accessible) showing pop-up explanation
- Voice: "Help. Tell me about this field."
- Links to relevant docs (research/security-and-privacy.md for privacy Q's)

**On-Demand Support:**
- "Contact Support" button visible on every screen
- Live chat with human agent (business hours)
- Video tutorials: 2-3 min clips per feature
- FAQ section: Common questions with audio narration

### 3.4 Trust & Emotional Comfort

**Reassuring Microcopy:**
- Empty state: "No medications added yet. Let's add your first one." (not "No items")
- Loading: "Checking appointment availability..." (not just spinner)
- Success: "Great! Your appointment is confirmed for Tuesday 3pm." (celebratory tone)
- Privacy: "Your information is encrypted and never shared." (reassurance)

**Sensitive Data Entry:**
- Always explain why data is needed: "We need your insurance card to verify coverage"
- Show privacy badge: 🔒 Encrypted or 🔐 Secure
- Allow anonymization: "Show insurance details" toggle (default OFF for privacy)
- Confirmation: Before submitting, show what will be sent

**Visual Trust Markers:**
- Security badges: SSL lock, HIPAA compliant badge
- Privacy notice: "Your privacy is our priority" with link to security-and-privacy.md
- Credentials: "Integrated with Epic EHR" (shows integration with trusted systems)
- Testimonials: Real user quotes (if available): "I feel more in control of my health"

---

## 4. Multi-Modal, Hands-Free Interaction

### 4.1 Voice-First Workflow

**Complete Voice Flow Example (Medication Add):**
1. User says: "Add a medication"
2. System responds: "What is the name of your medication?"
3. User says: "Lisinopril"
4. System repeats: "I heard: Lisinopril. Is that correct?"
5. User says: "Yes" (or "No, try again")
6. System: "What is the dosage in milligrams?"
7. User: "10"
8. System repeats: "10 milligrams. Correct?"
9. User: "Yes"
10. System: "What time should you take it? Morning, afternoon, or evening?"
11. User: "Morning"
12. System: "You've added Lisinopril 10mg in the morning. Confirmation? Yes or No?"
13. User: "Yes"
14. System (with TTS): "Success! Your medication reminder is set for 8:00 AM daily."

**Voice Confirmation Rules:**
- Every critical input: Repeat back for confirmation
- Confidence threshold: >0.8 = auto-accept, 0.5-0.8 = ask confirm, <0.5 = retry
- Max 3 retries before fallback to manual text entry
- Always provide "I didn't catch that. Try again?" option

### 4.2 Gesture Control

**Gesture-Based Navigation:**
- Home screen: Thumbs up = continue, Thumbs down = exit, Open palm = menu
- Appointment list: Pointing finger = select, Peace sign = help, OK sign = confirm
- Medication reminder: Thumbs up = took medication, Thumbs down = skip, Open palm = cancel

**Gesture Detection Settings:**
- Sensitivity: Small, Normal, Large gestures
- Confidence threshold: 85%, 90%, 95%
- Hand detection: Left, Right, or Both
- Feedback: Visual (highlight), Audio (beep), Haptic (vibration)

**Accessibility Notes:**
- Always have voice alternative
- Gesture detection should work in different lighting conditions
- Practice mode: User can practice gestures before using in app
- Fall back to touch or voice if gesture fails >2x

### 4.3 Vision-Based Monitoring

**Document OCR:**
- Insurance card: Extract member ID, group, copay (98%+ accuracy)
- Prescription: Extract drug name, dosage, refill count
- Medical records: Extract dates, conditions, provider names
- Fallback: User can manually type or voice-dictate if OCR fails

**Health Monitoring:**
- Pill identification: User shows pill to camera, system identifies medication
- Skin monitoring: User shows skin area, system tracks changes over time (for dermatology follow-ups)
- Vital signs: Pulse detection from finger on camera (future feature)

**Privacy for Vision:**
- Notify user: "Camera is on. Only your [pill/card] is being analyzed"
- Option to crop: User selects what area to analyze
- No face detection: System explicitly ignores face/identity
- No storage: Images deleted immediately after analysis (unless user requests save for records)

### 4.4 Customization & Personalization

**Voice Settings:**
- Gender: Male, Female, Neutral (voice provider selection)
- Speed: Slow (0.8x), Normal (1x), Fast (1.2x)
- Pitch: Adjustable slider
- Accent: Multiple language/accent options
- Language: English, Spanish, Mandarin, Hindi, others (future)

**Gesture Settings:**
- Sensitivity: Large gestures (elderly, limited mobility) → Normal → Small (precise)
- Hand: Left, Right, Both hands
- Confidence threshold: 85% (quick), 90% (balanced), 95% (strict)
- Feedback type: Visual only, Audio only, Haptic only, or Combination

**Display Settings:**
- Text size: 18pt, 20pt, 24pt, 28pt, 32pt, custom
- Colors: Normal, High contrast (white on black), Dark mode, Sepia (warm)
- Animations: On, Off (WCAG prefers-reduced-motion)
- Audio: Mute all, Voice only, Alerts only

**Input Mode Defaults:**
- Primary: Voice, Gesture, Text (user selects preference)
- Secondary: Auto-activate if primary fails
- Examples:
  - Elderly user: Voice (primary) → Gesture (secondary) → Text (fallback)
  - Deaf user: Gesture (primary) → Visual (secondary)
  - Blind user: Voice (primary) → Gesture (secondary)

---

## 5. Healthcare-Specific UX

### 5.1 Sensitive Information Handling

**PHI (Protected Health Information) Masking:**
- Display in app: Full details (user's own data)
- Shared/exported: Mask SSN/medical record numbers (show last 4 digits only)
- Screenshots/printing: Mask PHI by default (user can override)
- Notifications: Never include drug names in push notifications (user configurable)

**Data Minimization:**
- Only collect what's necessary
- Medication reminders: Don't ask for side effects (unnecessary)
- Appointment: Don't ask for full medical history (only relevant info)
- Insurance: Don't ask for copay details not needed for verification

**Consent Management:**
- First use of each feature: Clear consent prompt
- Fine-grained controls: User can consent to analytics but not location sharing
- Revocation: Easy "Turn off" toggle for each permission
- Audit: User can see "Who accessed my data and when"

### 5.2 Caregiver & Proxy Access

**Caregiver Mode Toggle:**
- Login screen: "Are you logging in as yourself or a caregiver?"
- Caregiver dashboard: Dependent's medication/appointment/insurance data
- Actions: Can add/edit medications, book appointments, verify insurance (with user consent)
- Restrictions: Cannot delete user account, cannot change security settings without user approval
- Audit: All caregiver actions logged (user can see what caregiver did)

**Co-Sent Notifications:**
- User chooses which notifications go to caregiver
- Examples: "Send me medication reminders AND alert my daughter if I miss a dose"
- Caregiver can set their own alert threshold (e.g., "Alert me if 2+ doses missed")
- Caregiver can act: Acknowledge missed dose, reschedule appointment (delegated actions)

### 5.3 Emergency Flows

**Panic Button:**
- Large red button on home screen: "Emergency"
- Voice: "Emergency" keyword
- Gesture: Closed fist held for 3 seconds
- Action: Immediately call emergency contact or local emergency services
- Data sharing: Auto-share critical info (medications, allergies, emergency contact) with EMS/hospital
- Consent: Pre-registered, user can customize what's shared

**Medical Alert Summary:**
- Generated automatically from user data:
  - "ALLERGIES: Penicillin, Shellfish"
  - "CURRENT MEDS: Lisinopril 10mg, Metformin 500mg"
  - "CONDITIONS: Type 2 diabetes, hypertension"
  - "EMERGENCY CONTACT: [Daughter Name, Phone]"
- Print-ready (wallet card size)
- Shareable with healthcare providers

**Non-Emergency Escalation:**
- "Need help?" button → Options: "Call support", "Schedule doctor", "Chat with AI"
- Support queue: Live chat with healthcare coordinator (business hours)
- After hours: "Your issue will be escalated. You'll be called back within 2 hours."
- AI assistant: Answer common questions 24/7

---

## 6. Inclusive Visual Language

### 6.1 Imagery & Icons

**Human Illustrations:**
- Diverse ages (young, middle-aged, elderly 60+, 80+)
- Diverse abilities: Wheelchair users, blind users (cane/guide dog), hearing aid users
- Diverse ethnicities: Asian, Black, Hispanic, South Asian, MENA, Indigenous, etc.
- Diverse body types: Representation of varied body shapes and sizes
- Diverse family structures: Nuclear, single parents, multigenerational, same-sex couples

**Icon Design Specifications:**
- Style: Outline (not filled) for clarity and scalability
- Stroke width: 2px (readable at 16px size)
- Color count: 2 colors max (primary + accent)
- Padding: 2px inside bounding box
- Size: 24×24px base unit (scales to 16×16, 32×32, 48×48)
- Testing: Readable at all sizes, color-blind safe

**Icon Examples (Healthcare Context):**
- Medication: Pill bottle outline
- Appointment: Calendar with checkmark
- Insurance: ID card outline
- Document: Page with folded corner
- Checkmark (success): Outlined checkmark
- X (cancel): Outlined X
- Settings: Gear outline
- Help: Question mark circle

**Emoji Usage:**
- Sparingly: Use to reinforce meaning, not replace text
- Clear alternatives: Never emoji-only UI
- Examples: ✓ (success) with text "Success", 🔒 (security) with text "Encrypted"
- Accessibility: All emoji have alt text in code

### 6.2 Motion & Animation

**Animation Principles:**
- Minimal: Only animate to draw attention or show state change
- Purposeful: Every animation should have a function (show loading, confirm action)
- Quick: Transitions <300ms (perceptible but not slow)
- Smooth: Use ease-out for state changes (easing function: cubic-bezier(0.16, 1, 0.3, 1))

**Animation Examples:**
- Button click: 100ms color fade + 50ms scale (1 → 1.05 → 1)
- Success: 200ms checkmark draw animation + 100ms fade-in of success message
- Loading: Spinner (1.5 second rotation) with status text
- Slide transitions: 300ms slide-in from right (new screen) or left (back)

**Respecting Prefers-Reduced-Motion:**
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

**Testing:**
- OS-level setting: Windows > Ease of Access > Display > "Show animations"
- Browser dev tools: Check "Prefers reduced motion" in accessibility inspector
- Real devices: Test with OS accessibility setting enabled

---

## 7. Testing & QA for Accessibility

### 7.1 Automated Testing

**Lighthouse Audit:**
- Run on every PR (part of CI/CD)
- Accessibility score target: ≥95
- Checks: Color contrast, ARIA labels, button sizes, form labels
- Report: Generated automatically, reviewed before merge

**axe-core:**
- Browser extension or CI integration
- Catches common violations: missing labels, low contrast, missing alt text
- False positives: Review and mark as "Review" (requires manual check)
- Integration: Part of every PR check

**WAVE (Web Accessibility Evaluation Tool):**
- Browser extension for manual testing
- Visualizes errors, warnings, features
- Reports: Generates detailed HTML report
- Use alongside automated tools for complete coverage

### 7.2 Manual Testing

**Screen Reader Testing:**
- Tools: NVDA (Windows), VoiceOver (macOS/iOS), TalkBack (Android)
- Test each major flow:
  1. Add medication (voice input, form navigation, confirmation)
  2. Book appointment (search, select, confirm)
  3. Check insurance (upload, verify, review)
  4. Receive reminder (audio alert, action confirmation)
- Check: All text readable, forms properly labeled, interactive elements announced

**Keyboard Navigation Testing:**
- Use ONLY keyboard (no mouse)
- Tab order: Logical left-to-right, top-to-bottom
- All buttons/links accessible: Try tabbing to every interactive element
- Focus visible: Must see clear focus indicator
- Escape key: Closes modals without taking action
- Form submission: Enter key submits (not required but nice-to-have)

**Color Contrast Verification:**
- Tool: WebAIM Contrast Checker
- Test every text/background combination
- Report: Generate screenshot of results for each screen
- Target: 7:1 for normal text, 4.5:1 for large text

**Zoom & Responsive Testing:**
- Zoom to 200% (WCAG requirement)
- Test: No content cut off, text reflows, buttons still clickable
- Responsive: Test on mobile (375px), tablet (768px), desktop (1024px)
- Landscape/portrait: Test both orientations

**Voice & Gesture Testing:**
- Voice: Test with different accents, background noise levels, speech patterns
- Gesture: Test with different hand sizes, lighting conditions, distances from camera
- Fallback: Test failure modes (no internet, low battery, camera unavailable)

### 7.3 User Testing

**Recruitment:**
- Elderly users: 65+, 75+, 85+ age groups
- Disabled users: Visually impaired, hearing impaired, mobility impaired, cognitive disabilities
- Diverse: Different ethnicities, education levels, tech experience
- Incentivize: Gift cards or cash compensation ($50-100 per session)

**Testing Protocol:**
- Duration: 1-2 hours per session
- Moderation: One facilitator, observe but don't help unless stuck
- Tasks:
  1. Add a medication (voice input)
  2. Book an appointment (search & select)
  3. Verify insurance (upload card or enter manually)
  4. Receive and respond to reminder
- Collect: Task completion time, errors, comments, satisfaction rating

**Continuous Feedback:**
- In-app "Report Issue" button (every screen)
- Email: User can email accessibility feedback to team
- Surveys: Monthly in-app survey ("How easy was this task?")
- Analytics: Track which features users struggle with (time-on-task, error rates)

### 7.4 Compliance Audit

**WCAG 2.1 AAA Audit (External):**
- Quarterly: Hire external accessibility auditor
- Scope: Full platform audit
- Report: Detailed findings, recommendations, remediation timeline
- Action: Fix critical issues before next release

**HIPAA Compliance Review:**
- Annually: Review encryption, access controls, audit logging
- Penetration testing: Hire security firm to test vulnerabilities
- Data handling: Verify no PHI in logs, notifications, analytics
- Documentation: Maintain BAAs with all vendors

---

## 8. Implementation Checklist

### Before Launch
- [ ] Lighthouse score ≥95 (accessibility)
- [ ] Contrast ratio 7:1 for all text (verified with WebAIM)
- [ ] All buttons/inputs ≥48×48px
- [ ] Screen reader testing: NVDA + VoiceOver (all major flows)
- [ ] Keyboard navigation: Tab through entire app
- [ ] Zoom to 200%: No content cut off
- [ ] Voice flow: Record all major task completions
- [ ] Gesture flow: Test with 5+ users
- [ ] User testing: 10+ elderly users, 5+ disabled users
- [ ] Accessibility audit: External consultant review
- [ ] HIPAA compliance: Data handling review, BAAs signed
- [ ] Documentation: Updated all design docs with specs

### Per Release
- [ ] Automated tests: axe-core, Lighthouse (no new violations)
- [ ] Manual spot checks: Screen reader, keyboard, color contrast
- [ ] User feedback: Review "Report Issue" submissions
- [ ] Analytics: Check time-on-task for each feature (increasing = worse UX)
- [ ] Accessibility regression: Test changes don't break existing flows

---

## References

1. [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
2. [WebAIM Color Contrast Checker](https://webaim.org/resources/contrastchecker/)
3. [Microsoft Inclusive Design Manual](https://inclusive.microsoft.design/)
4. [Interaction Design Foundation: Voice User Interfaces](https://www.interaction-design.org/literature/topics/voice-user-interface)
5. [MediaPipe Hands Documentation](https://google.github.io/mediapipe/solutions/hands.html)
6. [ElevenLabs TTS API](https://elevenlabs.io/)
7. [OpenAI Whisper Speech-to-Text](https://openai.com/research/whisper/)
8. [HIPAA for Healthcare Apps](https://www.hhs.gov/hipaa/)
9. [Designing for Elderly Users: Research & Guidelines](https://www.nngroup.com/articles/elderly-users/)
10. [Accessibility Testing Tools](https://www.w3.org/WAI/test-evaluate/)

---

*Version 2.0 - Comprehensive component library, accessibility specifications, and testing procedures added. Ready for developer implementation.*
