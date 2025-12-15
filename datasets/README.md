# EcareBots Datasets Directory

**Purpose:** Centralized repository for training data, validation datasets, and synthetic test data used throughout the EcareBots project.

**Version:** 2.0  
**Last Updated:** December 15, 2025

---

## 📁 Directory Structure

```
datasets/
├── README.md (this file)
│
├── conversational/              # Medical dialogue & intent classification
│   ├── medquad/                 # Medical Q&A (47K questions)
│   ├── dstc7_medical/           # Goal-oriented dialogues (50K)
│   ├── healthcaremagic/         # Patient-expert conversations
│   └── README.md                # Conversational data guide
│
├── voice/                       # Speech & audio data
│   ├── common_voice/            # Multi-accent speech (2,400+ hrs)
│   ├── librispeech/             # Baseline ASR training
│   ├── medical_speech/          # Medical terminology ASR
│   └── README.md                # Voice data guide
│
├── gesture/                     # Hand & gesture recognition
│   ├── asl_recognition/         # Sign language (87K videos)
│   ├── mediapipe_hands/         # Hand tracking benchmark
│   ├── custom_gestures/         # Healthcare-specific gestures
│   └── README.md                # Gesture data guide
│
├── medical_images/              # Vision & health monitoring
│   ├── mimic_cxr/               # Chest X-rays (365K images)
│   ├── isic_skin_lesions/       # Dermatology (25K images)
│   ├── pill_identification/     # Medication identification
│   ├── documents/               # Insurance cards, prescriptions (synthetic)
│   └── README.md                # Medical image data guide
│
├── synthetic_ehr/               # Synthetic electronic health records
│   ├── synthea/                 # Generated patients (FHIR format)
│   ├── fhir_test_data/          # HL7 FHIR compliance test bundles
│   ├── sample_patients/         # De-identified example records
│   └── README.md                # Synthetic EHR data guide
│
├── claims_insurance/            # Insurance & claims data
│   ├── medicare_sample/         # CMS Medicare data samples
│   ├── coverage_policies/       # Insurance policy templates
│   ├── provider_networks/       # Provider directory samples
│   └── README.md                # Claims data guide
│
├── accessibility/               # Accessibility & elderly user data
│   ├── wcag_test_cases/         # WCAG 2.1 AAA test examples
│   ├── screen_reader_data/      # Screen reader compatibility tests
│   ├── elderly_voice_patterns/  # Speech data from elderly users
│   └── README.md                # Accessibility data guide
│
└── processing_scripts/          # ETL & data preparation
    ├── download_datasets.py     # Automated dataset download
    ├── prepare_conversational.py # Process dialogue data
    ├── prepare_voice.py         # Audio preprocessing
    ├── prepare_gestures.py      # Video frame extraction
    ├── generate_synthea.sh      # Synthetic patient generation
    └── validate_datasets.py     # Quality checks
```

---

## 🎯 Dataset Purpose & Training Phases

### **Phase 1: Development & Testing**
- ✅ Use **Synthea** (synthetic EHR) – No privacy concerns
- ✅ Use **Kaggle/HuggingFace samples** – Small datasets for quick iteration
- ✅ Use **FHIR Test Data** – API validation
- ❌ DO NOT use real patient data in development

### **Phase 2: Model Training**
- ✅ Use **Mozilla Common Voice** – Voice command training
- ✅ Use **MedQuAD** – Intent classification
- ✅ Use **ASL Recognition** – Gesture recognition baseline
- ✅ Use **DSTC7 Medical** – Conversational AI training

### **Phase 3: Research & Validation**
- ✅ Use **MIMIC-III/IV** (with PhysioNet access) – EHR research
- ✅ Use **MIMIC-CXR** – Medical image research
- ✅ Use **CORD-19** – Medical literature analysis
- ⚠️ Requires ethics approval and data use agreements

### **Phase 4: Production & Compliance**
- ✅ Use **CMS Medicare Data** – Production integrations
- ✅ Use **Real patient data** – Must be HIPAA-compliant, de-identified
- ✅ Use **OpenPayments** – Transparency/compliance
- 🔒 Strict access controls and audit logging

---

## 📊 Data Format Specifications

### **Conversational Data Format**

```json
{
  "id": "medquad_001",
  "source": "MedQuAD",
  "question": "What are the symptoms of type 2 diabetes?",
  "answer": "Symptoms may include...",
  "metadata": {
    "category": "endocrinology",
    "difficulty": "beginner",
    "language": "en",
    "date_added": "2025-12-15"
  },
  "tokens": 127,
  "license": "CC0 1.0"
}
```

### **Voice Data Format**

```
audio_file.wav
├── Sample rate: 16 kHz (critical for Whisper)
├── Duration: < 30 seconds (typical command)
├── Format: WAV, MP3, or FLAC
├── Metadata: speaker_id, age_group, accent, condition
└── Transcription: medical_command.txt (ground truth)

Example: "Schedule appointment with cardiology next Tuesday at 3 PM"
Age group: 75-80
Accent: British English
Condition: Normal speech
```

### **Gesture Data Format**

```
video_clip.mp4
├── FPS: 30 fps
├── Resolution: 1280x720 minimum
├── Duration: 2-10 seconds
├── Hand visibility: >= 50% of frame
├── Gesture label: thumbs_up, stop, okay, next, back
├── Pose keypoints: MediaPipe format (21 hand landmarks)
└── Metadata: video_metadata.json

MediaPipe output:
{
  "landmarks": [
    {"x": 0.5, "y": 0.3, "z": 0.0, "presence": 0.99},
    ...
  ],
  "handedness": "Right",
  "confidence": 0.95
}
```

### **EHR Data Format (FHIR)**

```json
{
  "resourceType": "Patient",
  "id": "synthetic-patient-001",
  "meta": {
    "source": "Synthea",
    "created": "2025-12-15"
  },
  "identifier": [
    {
      "system": "http://example.com/mrn",
      "value": "MRN123456"
    }
  ],
  "name": [{"given": ["Jane"], "family": "Synthetic"}],
  "gender": "female",
  "birthDate": "1950-03-15"
}
```

---

## 🚀 Quick Start: Using Datasets

### **1. Download All Datasets (Automated)**

```bash
cd datasets
python processing_scripts/download_datasets.py --all

# This will download:
# - MedQuAD (conversational)
# - Mozilla Common Voice (voice)
# - ASL Recognition (gesture)
# - FHIR test data

# Takes: ~1-2 hours (30 GB total)
```

### **2. Generate Synthetic EHR Data**

```bash
cd datasets/synthetic_ehr
./processing_scripts/generate_synthea.sh --patients 1000 --state CA

# Generates 1,000 synthetic patients in FHIR format
# Output: synthea/output/fhir/*.ndjson
```

### **3. Load Data for Training**

```python
from datasets import load_dataset
import os

# Load conversational data
medquad = load_dataset('healthqa')
print(f"Loaded {len(medquad['train'])} medical Q&A pairs")

# Load voice data
from pathlib import Path
voice_files = list(Path('datasets/voice/common_voice').glob('*.wav'))
print(f"Found {len(voice_files)} voice samples")

# Load synthetic EHR
import json
synthea_path = 'datasets/synthetic_ehr/synthea/output/fhir'
with open(f'{synthea_path}/patient.ndjson') as f:
    patients = [json.loads(line) for line in f]
print(f"Loaded {len(patients)} synthetic patients")
```

### **4. Validate Dataset Quality**

```bash
# Run quality checks
python datasets/processing_scripts/validate_datasets.py

# Checks:
# ✓ All files present and accessible
# ✓ File sizes match expected ranges
# ✓ Data formats correct (FHIR schema, audio specs, etc.)
# ✓ Licenses documented
```

---

## 🔒 Privacy & Security

### **Before Using Any Dataset**

✅ **MUST DO:**
- [ ] Verify license allows healthcare use
- [ ] Confirm data is de-identified
- [ ] Check for any PII (names, emails, phone numbers)
- [ ] Verify no medical record numbers or IDs
- [ ] Review ethics approval (if applicable)
- [ ] Sign data use agreement (for restricted datasets)
- [ ] Use encryption for data at rest

❌ **NEVER:**
- Download unencrypted PHI over public WiFi
- Store patient data locally without encryption
- Upload to public Cloud without VPC
- Share credentials in Slack/email
- Use real patient data in development
- Commit sensitive data to GitHub

---

## 📚 Quick Links

- **[Comprehensive Dataset Catalog](../research/open-datasets.md)** – All 50+ datasets with links and use cases
- **[Healthcare Standards](../research/healthcare-standards.md)** – FHIR, HL7, HIPAA
- **[Security & Privacy](../research/security-and-privacy.md)** – HIPAA compliance, encryption
- **[Accessibility Patterns](../research/accessibility-patterns.md)** – WCAG 2.1 AAA
- **[Implementation Guide](../docs/IMPLEMENTATION_HANDOFF.md)** – Phase-by-phase roadmap

---

## ❓ Questions?

- 📧 **Email:** [arjunfrancis21@gmail.com](mailto:arjunfrancis21@gmail.com)
- 💬 **GitHub Issues:** [EcareBots Issues](https://github.com/ArjunFrancis/ecarebots/issues)
- 🐦 **Twitter/X:** [@ArjunFrancis](https://twitter.com/ArjunFrancis)

---

**Made with ❤️ for Accessible Healthcare AI**
