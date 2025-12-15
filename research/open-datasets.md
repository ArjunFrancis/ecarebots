# Open-Source Healthcare Datasets for EcareBots

**Purpose:** Curated collection of publicly available, ethically-sourced datasets for training AI agents, evaluating models, and validating accessibility features.

**Last Updated:** December 15, 2025

---

## 📋 Dataset Categories & Catalog

### **1. Healthcare Conversational Data**

#### **Medical Question-Answering Datasets**

| Dataset | Source | Size | License | Use Case | Access |
|---------|--------|------|---------|----------|--------|
| **HealthQA** | HuggingFace | 15K Q&A pairs | CC-BY-4.0 | Medical FAQ training | [Link](https://huggingface.co/datasets/flavir/healthqa) |
| **MedQuAD** | NLMCC | 47.4K questions, 16.8M tokens | CC0 1.0 | Medical question classification | [Link](https://github.com/abachaa/MedQuAD) |
| **CORD-19** | Semantic Scholar | 1M+ papers | CC0 | COVID-19 medical literature | [Link](https://www.semanticscholar.org/cord19) |
| **PubMedQA** | Princeton NLP | 1M biomedical papers | CC0 | Biomedical QA | [Link](https://github.com/pubmedqa/pubmedqa) |
| **LiveQA** | TREC | 500K medical questions | Public | Clinical question answering | [Link](https://www.trec-cds.org/) |

#### **Medical Dialogue & Conversation**

| Dataset | Source | Size | License | Use Case | Access |
|---------|--------|------|---------|----------|--------|
| **MedDialog** | Tsinghua University | 0.2M+ conversations | CC-BY-NC-SA | Doctor-patient dialogues (Chinese) | [Link](https://github.com/UCSD-AI4H/Medical-Dialogue-System) |
| **DSTC7 Medical Track** | Microsoft | 50K+ dialogues | CC-BY-4.0 | Goal-oriented medical dialogues | [Link](https://github.com/dstc7-track5/dstc7-track5) |
| **HealthCareMagic** | HealthCareMagic | 100K+ conversations | Public | Patient-expert Q&A | [Link](https://www.kaggle.com/datasets/jpmiller/healthcare-dataset) |
| **iCliniq Dataset** | iCliniq | 200K consultations | Limited (request access) | Real clinical conversations | [Link](https://github.com/nuvolaeleven/ICliniqDataset) |

**⚠️ Note:** Medical dialogues have privacy implications. Ensure HIPAA compliance when using real clinical data. Use synthetic data for development/testing.

---

### **2. Multi-Modal Health Datasets**

#### **Voice & Speech Datasets**

| Dataset | Source | Size | Language(s) | License | Use Case | Access |
|---------|--------|------|-------------|---------|----------|--------|
| **Mozilla Common Voice** | Mozilla | 2,400+ hrs | 110+ languages | CC0 | ASR model fine-tuning, accent bias testing | [Link](https://commonvoice.mozilla.org/) |
| **LibriSpeech** | CMU | 1,000 hrs | English | CC-BY-4.0 | Baseline ASR training | [Link](https://www.openslr.org/12) |
| **Medical Speech** | CMU ARCTIC | 1.2 hrs | English | CC-BY-SA-4.0 | Medical terminology ASR | [Link](https://www.openslr.org/24/) |
| **Multilingual LibriSpeech** | Facebook | 9,000+ hrs | 6 languages | CC-BY-4.0 | Multi-accent ASR training | [Link](https://www.openslr.org/94/) |
| **Google AudioSet** | Google | 2M+ clips | CC-BY-4.0 | Environmental sound classification | [Link](https://research.google.com/audioset/) |

**Use for EcareBots:**
- Training Whisper fine-tuned models for medical terminology
- Testing voice commands in noisy environments (clinics, home)
- Validating multi-accent support (critical for accessibility)
- Testing speech recognition with speech disorders (dysarthria, Parkinson's)

#### **Gesture & Hand Recognition Datasets**

| Dataset | Source | Size | License | Use Case | Access |
|---------|--------|------|---------|----------|--------|
| **MediaPipe Hands Benchmark** | Google | 400K+ hand images | CC-BY-4.0 | Hand tracking validation | [Link](https://github.com/google/mediapipe/wiki/Datasets) |
| **Ego4D Hands** | Meta | 300K+ hand clips | CC-BY-NC-4.0 | Egocentric hand actions | [Link](https://ego4d-data.org/) |
| **ASL Recognition** | Kaggle | 87K videos | CC0 | Sign language gesture training | [Link](https://www.kaggle.com/datasets/grassknoted/asl-alphabet) |
| **Hand Gesture** | GitHub | 20K images | MIT | Simple gesture classification | [Link](https://github.com/MathGaron/hand_gesture_recognition) |
| **SL500 (Sign Language)** | University of Barcelona | 500 clips | Open | Sign language gestures | [Link](https://www.ub.edu/cvub/databases/sl500/) |

**Use for EcareBots:**
- Training MediaPipe for healthcare-specific gestures (thumbs up, head shake, stop, etc.)
- Validating hand tracking in different lighting conditions
- Testing accessibility for users with hand tremors

#### **Vision & Image Datasets**

| Dataset | Source | Size | License | Use Case | Access |
|---------|--------|------|---------|----------|--------|
| **Medical Image Datasets** | | | | | |
| MIMIC-CXR | MIT | 365K X-ray images | PhysioNet License | Chest X-ray analysis | [Link](https://mimic.mit.edu/) |
| ImageNet Medical | Stanford | 100K+ images | CC-BY-4.0 | Medical condition recognition | [Link](https://stanfordmlgroup.github.io/competitions/mura/) |
| **Pill Identification** | Kaggle | 5K+ pill images | CC0 | Medication identification | [Link](https://www.kaggle.com/datasets/nnayer/drugs-and-pills-images-recognition) |
| **Skin Lesion (ISIC)** | ISIC | 25K+ images | CC-BY-NC-SA-4.0 | Skin condition detection | [Link](https://www.isic-archive.com/) |
| **Blood Glucose** | GlucoTrack | 5K+ CGM readings | Limited | Vital sign monitoring | [Link](https://glucotrack.com/research) |

**Use for EcareBots:**
- Health monitoring (skin changes, vital sign visualization)
- Document scanning (insurance cards, prescriptions)
- Accessibility: vision-assisted features for partially sighted users

---

### **3. Insurance & Claims Data**

#### **Open Insurance Datasets**

| Dataset | Source | Size | License | Use Case | Access |
|---------|--------|------|---------|----------|--------|
| **CMS Medicare Data** | CMS.gov | 300M+ claims | Public | Claims patterns, provider networks | [Link](https://www.cms.gov/data) |
| **HCUP National Inpatient Sample** | AHRQ | 7M+ hospital stays | Restricted | Hospital utilization, costs | [Link](https://www.hcup-us.ahrq.gov/nisoverview.jsp) |
| **Medical Expenditure Panel Survey** | AHRQ | 35K households | Restricted | Healthcare spending patterns | [Link](https://meps.ahrq.gov/) |
| **OpenPayments (Sunshine Law)** | CMS | 5M+ payments | Public | Provider payments, transparency | [Link](https://openpaymentsdata.cms.gov/) |
| **Drug Prices** | FDA | 100K+ drugs | Public | Medication cost data | [Link](https://www.fda.gov/drugs/information-drugs-cder/approved-drug-products-active-ingredients) |

**Use for EcareBots:**
- Insurance verification logic (policy lookups)
- Cost estimation algorithms
- Provider network validation
- Medication pricing information

**⚠️ Important:** Medicare/Medicaid data requires HIPAA compliance and data use agreements.

---

### **4. Accessibility & Elderly Care Data**

#### **Accessibility Datasets**

| Dataset | Source | Size | License | Use Case | Access |
|---------|--------|------|---------|----------|--------|
| **Web Accessibility Initiative (WAI)** | W3C | 1000s of patterns | CC-BY-4.0 | Accessibility design patterns | [Link](https://www.w3.org/WAI/) |
| **a11y Project Data** | A11y Project | 10K+ resources | MIT | Accessibility best practices | [Link](https://www.a11yproject.com/) |
| **WCAG 2.1 Test Cases** | DAISY | 5K+ test cases | CC0 | Accessibility testing examples | [Link](https://www.daisy.org/activities/) |
| **Screen Reader Testing** | NVDA/JAWS | Open source | GPL/Commercial | Screen reader compatibility | [Link](https://www.nvaccess.org/) |

#### **Elderly User Interaction Datasets**

| Dataset | Source | Size | License | Use Case | Access |
|---------|--------|------|---------|----------|--------|
| **Senior Citizen Tech Use** | Pew Research | Survey data | CC-BY-NC-4.0 | Elderly user behavior patterns | [Link](https://www.pewresearch.org/internet/) |
| **Voice Disorder Speech** | CMU SphinxBase | 1000+ clips | Open | Speech recognition with aging voices | [Link](https://www.isip.piconepress.com/) |
| **Eye Gaze Tracking** | MPIIGaze | 200K images | CC-BY-4.0 | Eye tracking for accessibility | [Link](https://www.mpi-inf.mpg.de/departments/computer-vision-and-multimodal-computing/research/gaze-based-human-computer-interaction/appearance-based-gaze-estimation-in-the-wild/) |

---

### **5. Electronic Health Records (EHR) & Clinical Datasets**

#### **Synthetic & De-Identified EHR Data**

| Dataset | Source | Size | License | Use Case | Access |
|---------|--------|------|---------|----------|--------|
| **MIMIC-III** | MIT | 50K ICU patients | PhysioNet | Clinical data analysis | [Link](https://mimic.mit.edu/) |
| **MIMIC-IV** | MIT | 380K+ hospital admissions | PhysioNet | Modern clinical workflows | [Link](https://mimic.physionet.org/) |
| **eICU Collaborative Database** | Philips | 200K+ ICU records | PhysioNet | Intensive care data | [Link](https://eicu-crd.mit.edu/) |
| **Synthetic Medical Data** | Synthea | 10M+ synthetic patients | Apache 2.0 | **BEST FOR DEV** – Risk-free EHR testing | [Link](https://github.com/synthetichealth/synthea) |
| **HL7 FHIR Test Data** | HL7 | Bundles & resources | CC0 | FHIR API testing | [Link](https://hl7.org/fhir/downloads.html) |

**⚠️ CRITICAL:** MIMIC, eICU require PhysioNet access agreement. Use **Synthea** for development/testing (no privacy concerns).

---

### **6. Healthcare AI Benchmarks & Leaderboards**

| Dataset | Source | Purpose | Benchmark | Access |
|---------|--------|---------|-----------|--------|
| **GLUE** | NIST | General language understanding | 9 tasks | [Link](https://gluebenchmark.com/) |
| **BioGLUE** | Princeton | Biomedical language understanding | 5 tasks | [Link](https://github.com/namisan/mr-bert) |
| **MedNLI** | Stanford | Medical NLI (entailment) | 1,400 sentence pairs | [Link](https://github.com/jgc128/medical_nli) |
| **SQuAD 2.0** | Stanford | Reading comprehension | 150K Q&A | [Link](https://rajpurkar.github.io/SQuAD-explorer/) |
| **BioASQ** | NCBI | Biomedical semantic indexing | 1M+ documents | [Link](http://www.bioasq.org/) |

---

## 🚀 How to Use These Datasets

### **For AI Agent Training**

```python
# Example: Load healthcare conversation data
from datasets import load_dataset

# Medical Q&A for intent classification
medical_qa = load_dataset("healthqa")
print(f"Loaded {len(medical_qa['train'])} medical Q&A pairs")

# Multi-intent dialogue training
dialogues = load_dataset("dstc7-track5", "medical")

# Fine-tune intent recognizer
from transformers import AutoTokenizer, AutoModelForSequenceClassification
model = AutoModelForSequenceClassification.from_pretrained("bert-base-medical")
model.train()  # Fine-tune on medical Q&A
```

### **For Voice Command Testing**

```python
# Multi-accent ASR evaluation
from datasets import load_dataset
import librosa

# Load Common Voice for accent testing
common_voice = load_dataset("mozilla-foundation/common_voice", "zh-CN")  # Chinese
for sample in common_voice['test'].take(5):
    audio = librosa.load(sample['audio']['path'])
    # Test Whisper performance on non-English accent
```

### **For Gesture Recognition Validation**

```python
# Test MediaPipe against healthcare-specific gestures
import mediapipe as mp
import cv2

mp_hands = mp.solutions.hands
hands = mp_hands.Hands()

# Load sign language dataset
asl_dataset = load_dataset("grassknoted/asl-alphabet")
for video in asl_dataset['train'].take(100):
    # Validate gesture recognition accuracy
    landmarks = hands.process(video)
```

### **For Accessibility Testing**

```python
# WCAG 2.1 AAA compliance testing
from axe_selenium_python import Axe

# Run accessibility audit
Axe().inject()
Axe().run()
results = Axe().results()

# Check color contrast against elderly users
# Use high-contrast themes from WAI guidelines
```

---

## 🔒 Privacy & Ethics Guidelines

### **Data Use Agreement Checklist**

- [ ] Dataset license allows healthcare/medical use
- [ ] Dataset is de-identified (HIPAA Safe Harbor or expert determination)
- [ ] No PII/PHI in dataset (names, SSNs, medical record numbers)
- [ ] Ethics approval obtained (if original research)
- [ ] Data use agreement signed (for restricted access datasets)

### **Synthetic Data Best Practices**

**Use Synthea for all development/testing:**

✅ Advantages:
- 100% synthetic (no privacy risk)
- Realistic FHIR resources (HL7 compliant)
- Configurable patient populations
- No data use agreement needed
- Perfect for API testing

```bash
# Generate 100 synthetic patients
git clone https://github.com/synthetichealth/synthea.git
cd synthea
./run_synthea -p 100 -s 12345

# Output: FHIR bundles in /output/fhir/
```

---

## 📊 Dataset Selection Guide

### **By Use Case**

| Goal | Recommended Dataset | Size | Setup Time |
|------|-------------------|------|------------|
| **Intent Classification** | MedQuAD | 47K questions | 1 hr |
| **Conversational AI** | DSTC7 Medical | 50K dialogues | 2 hrs |
| **Voice Command Recognition** | Mozilla Common Voice | 2,400 hrs audio | 1 day (download) |
| **Gesture Recognition** | ASL Recognition | 87K videos | 4 hrs |
| **API Testing** | Synthea | Generated | 30 min |
| **EHR Integration Testing** | FHIR Test Data | 1000s of resources | 1 hr |
| **Medical NLP** | CORD-19 + BioGLUE | 1M+ papers | 1-2 days |

### **By Data Type**

| Data Type | Primary Dataset | Alternatives | License |
|-----------|----------------|--------------|---------|
| **Text Conversations** | MedDialog | DSTC7, HealthCareMagic | CC-BY-NC-SA |
| **Voice/Speech** | Mozilla Common Voice | LibriSpeech, Multilingual LibriSpeech | CC0, CC-BY-4.0 |
| **Gestures** | ASL Recognition | MediaPipe Hands Benchmark | CC0 |
| **Medical Images** | MIMIC-CXR | ImageNet Medical, ISIC | PhysioNet, CC-BY-NC-SA |
| **Claims Data** | CMS Medicare Data | OpenPayments | Public |
| **EHR Records** | Synthea (dev), MIMIC (research) | eICU, MIMIC-IV | Apache 2.0, PhysioNet |

---

## 🔗 Integration with EcareBots

### **1. Intent Classification Model**
- Train on: **MedQuAD** (47K medical questions)
- Validate on: **DSTC7 Medical** (goal-oriented dialogues)
- Deploy to: Intent recognition in Orchestrator Agent

### **2. Voice Command Recognition**
- Train on: **Mozilla Common Voice** (2,400+ hrs)
- Validate on: **Multi-accent evaluation** (Common Voice sub-sets)
- Test on: **Elderly users with speech disorders** (medical speech datasets)
- Deploy to: Voice input pipeline

### **3. Gesture Recognition**
- Train on: **ASL Recognition** (87K videos)
- Add custom: **Healthcare gestures** (thumbs up, stop, okay, etc.)
- Deploy to: Gesture input pipeline

### **4. Health Monitoring**
- Use: **ISIC** for skin condition detection
- Use: **Medical Image datasets** for document scanning
- Deploy to: Vision processing pipeline

### **5. API Testing & Integration**
- Use: **Synthea** to generate 1,000 synthetic patients
- Use: **FHIR Test Data** for HL7 compliance testing
- Deploy to: Backend API validation

### **6. Accessibility Validation**
- Use: **WAI Guidelines** for design patterns
- Use: **WCAG Test Cases** for validation
- Test with: **Screen readers** on all UIs
- Deploy to: QA/accessibility testing

---

## 📚 Additional Resources

### **Dataset Discovery Platforms**

| Platform | Purpose | Access |
|----------|---------|--------|
| **HuggingFace Datasets** | 1000s of NLP/ML datasets | [Link](https://huggingface.co/datasets) |
| **Kaggle Datasets** | 10,000s of public datasets | [Link](https://www.kaggle.com/datasets) |
| **PhysioNet** | Medical research databases | [Link](https://physionet.org/) |
| **NCBI GEO** | Genomics data | [Link](https://www.ncbi.nlm.nih.gov/geo/) |
| **Open Data Foundation** | Open healthcare data | [Link](https://www.opendatafoundation.org/) |

### **Dataset Documentation**

Every dataset used in EcareBots should document:

```markdown
## Dataset: [Name]

- **Source:** [URL]
- **Size:** [Number of samples/GB]
- **License:** [License type]
- **Access:** [Public/Restricted/PhysioNet]
- **Use Case:** [EcareBots feature]
- **Processing:** [Steps to prepare data]
- **Validation:** [Quality checks]
- **Ethics:** [Privacy considerations]
```

---

## 🔄 Maintenance & Updates

**Last Updated:** December 15, 2025

**Next Review:** Quarterly (end of March, June, September, December)

**Update Checklist:**
- [ ] Verify dataset links still valid
- [ ] Check for new healthcare datasets
- [ ] Update access instructions (APIs change)
- [ ] Add emerging datasets (especially multi-modal)
- [ ] Verify licenses still allow healthcare use

---

## ✅ Quick Start: Setting Up Your First Dataset

```bash
# 1. Clone EcareBots repo
git clone https://github.com/ArjunFrancis/ecarebots.git
cd ecarebots

# 2. Create datasets directory
mkdir -p datasets/conversational
mkdir -p datasets/voice
mkdir -p datasets/gesture
mkdir -p datasets/synthetic

# 3. Download MedQuAD (conversational baseline)
cd datasets/conversational
git clone https://github.com/abachaa/MedQuAD.git
cd MedQuAD && python process_medquad.py

# 4. Download Synthea (synthetic EHR data)
cd ../../synthetic
git clone https://github.com/synthetichealth/synthea.git
cd synthea && ./run_synthea -p 100

# 5. Load and validate
python -c "
from datasets import load_dataset
medquad = load_dataset('healthqa')
print(f'✅ Loaded {len(medquad[\"train\"])} medical Q&A pairs')
"

# 6. Start training!
# See docs/IMPLEMENTATION_HANDOFF.md for next steps
```

---

## 📞 Questions?

- 📧 **Email:** [arjunfrancis21@gmail.com](mailto:arjunfrancis21@gmail.com)
- 💬 **GitHub Discussions:** [EcareBots Discussions](https://github.com/ArjunFrancis/ecarebots/discussions)
- 🐦 **Twitter/X:** [@ArjunFrancis](https://twitter.com/ArjunFrancis)

---

**Made with ❤️ for Accessible Healthcare AI**
