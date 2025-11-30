# Open Datasets - EcareBots Healthcare Platform

**Version:** 1.0  
**Last Updated:** November 30, 2025  
**Status:** Research Phase  
**Owner:** EcareBots Project Team

---

## **Executive Summary**

This document catalogs open-source datasets relevant to EcareBots development, covering healthcare conversational AI, multi-modal accessibility, voice/gesture recognition, medical knowledge, and elderly care. All datasets listed are publicly available, ethically sourced, and have appropriate licenses for research and/or commercial use. These datasets will support model training, evaluation, and validation across EcareBots' core features: voice-first interaction, gesture control, healthcare information processing, and accessibility-optimized interfaces.

**Key Findings:**
- **Healthcare NLP:** MIMIC-III Clinical Notes, PubMedQA, and MedQA provide medical question-answering data
- **Voice Recognition:** Mozilla Common Voice, LibriSpeech, and VoxCeleb offer diverse accent and speaker data
- **Gesture Recognition:** Google MediaPipe datasets, NTU RGB+D, and EgoGesture for hand tracking
- **Accessibility:** No large-scale elderly-specific datasets found; will require synthetic data generation or user studies
- **Insurance/Claims:** Limited public data due to privacy; CMS synthetic data and CCLF files available

**Recommendations:**
- Use **Mozilla Common Voice** for accent-diverse voice training (critical for elderly users)
- Fine-tune on **MedDialog** for healthcare conversational AI
- Leverage **MediaPipe Hands** dataset for gesture recognition baseline
- Generate **synthetic elderly user data** (simulate tremors, slower speech, visual impairments)
- Comply with **HIPAA de-identification rules** if using any clinical data

---

## **1. Healthcare Conversational Data**

### **1.1 MedDialog**

**Description:** English and Chinese medical conversation dataset between patients and doctors

**Source:** [https://github.com/UCSD-AI4H/Medical-Dialogue-System](https://github.com/UCSD-AI4H/Medical-Dialogue-System)

**Statistics:**
- **Size:** 3.66 million conversations (English), 1.1 million (Chinese)
- **Format:** JSON (patient utterance, doctor response)
- **Topics:** General medicine, symptoms, diagnoses, treatments

**License:** Apache 2.0 (commercial use permitted)

**Use Cases for EcareBots:**
- Train conversational AI for medical question-answering
- Fine-tune LLM for healthcare domain (tone, terminology)
- Evaluate intent classification (appointment request, medication inquiry, symptom description)

**Example:**
```json
{
  "patient": "I've been having chest pain for 2 days.",
  "doctor": "Can you describe the pain? Is it sharp, dull, or pressure-like? Does it radiate to your arm or jaw?"
}
```

**Citation:**
```
@article{chen2020meddiag,
  title={MedDialog: Large-scale Medical Dialogue Datasets},
  author={Chen, Shu and others},
  journal={EMNLP},
  year={2020}
}
```

---

### **1.2 HealthCareMagic-100k**

**Description:** Real patient-doctor conversations from HealthCareMagic.com

**Source:** [https://huggingface.co/datasets/lavita/ChatDoctor-HealthCareMagic-100k](https://huggingface.co/datasets/lavita/ChatDoctor-HealthCareMagic-100k)

**Statistics:**
- **Size:** 100,000 conversations
- **Format:** JSON (patient question, doctor answer)
- **Quality:** High (verified doctors, detailed responses)

**License:** CC BY-NC-SA 4.0 (non-commercial research only)

**Use Cases:**
- Evaluation benchmark (test if AI responses match doctor quality)
- Few-shot learning examples (show LLM how doctors respond)

**Limitation:** Non-commercial license (cannot use for production EcareBots without permission)

---

### **1.3 PubMedQA**

**Description:** Medical question-answering dataset based on PubMed abstracts

**Source:** [https://pubmedqa.github.io/](https://pubmedqa.github.io/)

**Statistics:**
- **Size:** 1,000 expert-annotated, 61,000 auto-generated Q&A pairs
- **Format:** JSON (question, context from PubMed abstract, yes/no/maybe answer)
- **Topics:** All medical specialties

**License:** MIT (commercial use permitted)

**Use Cases:**
- Train retrieval-augmented generation (RAG) system (retrieve PubMed articles to answer questions)
- Fact-checking layer (verify LLM responses against medical literature)

**Example:**
```json
{
  "question": "Does aspirin prevent heart attacks?",
  "context": "Abstract from PMID 12345678: Aspirin reduces cardiovascular events by 25% in high-risk patients...",
  "answer": "yes"
}
```

**Citation:**
```
@inproceedings{jin2019pubmedqa,
  title={PubMedQA: A Dataset for Biomedical Research Question Answering},
  author={Jin, Qiao and others},
  booktitle={EMNLP},
  year={2019}
}
```

---

### **1.4 MedQA (USMLE)**

**Description:** Medical exam questions from US Medical Licensing Examination (USMLE)

**Source:** [https://github.com/jind11/MedQA](https://github.com/jind11/MedQA)

**Statistics:**
- **Size:** 61,000+ multiple-choice questions
- **Format:** JSON (question, 4-5 options, correct answer)
- **Difficulty:** Medical student to resident level

**License:** MIT (commercial use permitted)

**Use Cases:**
- Benchmark medical knowledge ("Can our AI pass USMLE?")
- Avoid - too advanced for patient-facing app (USMLE is for doctors, not patients)

**Example:**
```json
{
  "question": "A 55-year-old man with chest pain and shortness of breath. ECG shows ST elevation in leads V1-V4. Most likely diagnosis?",
  "options": ["A) Pericarditis", "B) Anterior MI", "C) Pulmonary embolism", "D) Aortic dissection"],
  "answer": "B"
}
```

**Warning:** Too clinical for EcareBots (patients don't need USMLE-level knowledge). Use for internal testing only.

---

### **1.5 MIMIC-III Clinical Notes**

**Description:** De-identified clinical notes from ICU patients

**Source:** [https://physionet.org/content/mimiciii/](https://physionet.org/content/mimiciii/)

**Statistics:**
- **Size:** 2 million+ clinical notes (discharge summaries, nursing notes, radiology reports)
- **Patients:** 58,000 ICU admissions
- **Format:** Text files (unstructured clinical notes)

**License:** PhysioNet Credentialed Health Data License (requires training, data use agreement)

**Use Cases:**
- Named entity recognition (extract medication names, dosages, conditions)
- Medical terminology normalization ("MI" = "myocardial infarction" = "heart attack")
- NOT for conversational AI (notes are doctor-to-doctor, not patient-facing)

**Access Requirements:**
- Complete CITI "Data or Specimens Only Research" course
- Sign data use agreement (DUA)
- Approval process: 1-2 weeks

**Citation:**
```
@article{johnson2016mimic,
  title={MIMIC-III, a freely accessible critical care database},
  author={Johnson, Alistair EW and others},
  journal={Scientific Data},
  year={2016}
}
```

---

## **2. Voice Command Datasets**

### **2.1 Mozilla Common Voice**

**Description:** Crowd-sourced voice dataset in 100+ languages with diverse accents

**Source:** [https://commonvoice.mozilla.org/](https://commonvoice.mozilla.org/)

**Statistics:**
- **Size:** 30,000+ hours of speech (English), 100+ languages total
- **Speakers:** 400,000+ contributors
- **Demographics:** Age, gender, accent labeled
- **Format:** MP3 audio + text transcripts (TSV)

**License:** CC0 (public domain, no restrictions)

**Use Cases for EcareBots:**
- **Critical:** Train accent-robust speech-to-text (Indian English, Hispanic English, etc.)
- Fine-tune Whisper or build custom ASR model
- Evaluate ASR accuracy across demographics (elderly, non-native speakers)

**Elderly-Specific Data:**
- Filter by age: 60+ years (limited but available)
- Slower speech, vocal tremors common in elderly recordings

**Example Usage:**
```python
from datasets import load_dataset

# Load English subset
common_voice = load_dataset("mozilla-foundation/common_voice_13_0", "en", split="train")

# Filter elderly speakers (60+)
elderly_subset = common_voice.filter(lambda x: x["age"] == "sixties" or x["age"] == "seventies")

print(f"Elderly speakers: {len(elderly_subset)} samples")
```

**Citation:**
```
@inproceedings{ardila2020common,
  title={Common Voice: A Massively-Multilingual Speech Corpus},
  author={Ardila, Rosana and others},
  booktitle={LREC},
  year={2020}
}
```

---

### **2.2 LibriSpeech**

**Description:** Audiobook recordings (clean, high-quality English speech)

**Source:** [https://www.openslr.org/12/](https://www.openslr.org/12/)

**Statistics:**
- **Size:** 1,000 hours
- **Speakers:** 2,000+ (mostly professional audiobook narrators)
- **Format:** FLAC audio + text transcripts

**License:** CC BY 4.0 (commercial use permitted)

**Use Cases:**
- Pre-train ASR models (clean speech baseline)
- Benchmark (standard ASR evaluation dataset)

**Limitation:** No elderly speakers, no accents (mostly standard American English). Use for baseline, not primary training.

---

### **2.3 VoxCeleb**

**Description:** Celebrity speech dataset for speaker recognition

**Source:** [https://www.robots.ox.ac.uk/~vgg/data/voxceleb/](https://www.robots.ox.ac.uk/~vgg/data/voxceleb/)

**Statistics:**
- **Size:** 2,000+ hours
- **Speakers:** 7,000+ celebrities
- **Format:** YouTube clips (diverse accents, background noise)

**License:** Research use only (not for commercial without permission)

**Use Cases:**
- Voice biometrics (verify user identity by voice)
- Speaker diarization (identify who is speaking)

**Limitation:** Non-commercial license. Use for research/prototyping only.

---

### **2.4 Speech Commands Dataset (Google)**

**Description:** Short voice commands ("yes", "no", "stop", "go", numbers 0-9)

**Source:** [https://www.tensorflow.org/datasets/catalog/speech_commands](https://www.tensorflow.org/datasets/catalog/speech_commands)

**Statistics:**
- **Size:** 105,000 utterances
- **Commands:** 35 keywords
- **Format:** WAV audio (1 second clips)

**License:** CC BY 4.0 (commercial use permitted)

**Use Cases:**
- Wake word detection ("Hey EcareBots")
- Simple command recognition ("Yes", "No", "Help")

**Example Commands:**
- yes, no, up, down, left, right, on, off, stop, go
- zero, one, two, three, four, five, six, seven, eight, nine

---

## **3. Gesture Recognition Datasets**

### **3.1 MediaPipe Hands Dataset (Google)**

**Description:** Hand landmark annotations for 21 key points per hand

**Source:** [https://google.github.io/mediapipe/solutions/hands.html](https://google.github.io/mediapipe/solutions/hands.html)

**Statistics:**
- **Pre-trained model available** (no raw dataset publicly released)
- **Landmarks:** 21 points (wrist, thumb, index, middle, ring, pinky joints)
- **Real-time:** 30 FPS on mobile devices

**License:** Apache 2.0 (commercial use permitted)

**Use Cases for EcareBots:**
- Hand tracking baseline (use MediaPipe as off-the-shelf solution)
- Gesture recognition ("thumbs up", "wave", "point")

**Custom Gesture Training:**
- Collect EcareBots-specific gestures ("schedule appointment" = swipe right)
- Use MediaPipe hand landmarks as input features
- Train simple classifier (Random Forest, SVM) on custom gestures

---

### **3.2 NTU RGB+D**

**Description:** Large-scale action recognition dataset (including hand gestures)

**Source:** [https://rose1.ntu.edu.sg/dataset/actionRecognition/](https://rose1.ntu.edu.sg/dataset/actionRecognition/)

**Statistics:**
- **Size:** 56,000 videos
- **Actions:** 60 action classes (hand gestures, body movements)
- **Format:** RGB video + depth (Kinect sensor)

**License:** Research use only (requires agreement)

**Use Cases:**
- Gesture recognition models ("waving", "pointing", "clapping")
- Body pose estimation (detect if user standing, sitting, lying down)

**Limitation:** Non-commercial license. Use for research only.

---

### **3.3 EgoGesture**

**Description:** First-person (egocentric) hand gesture dataset

**Source:** [http://www.nlpr.ia.ac.cn/iva/yfzhang/datasets/egogesture.html](http://www.nlpr.ia.ac.cn/iva/yfzhang/datasets/egogesture.html)

**Statistics:**
- **Size:** 24,000+ gesture samples
- **Gestures:** 83 classes (swiping, pinching, waving, pointing)
- **Format:** RGB + depth video

**License:** Research use (contact authors for commercial use)

**Use Cases:**
- First-person gesture recognition (webcam perspective)
- Relevant if EcareBots uses device camera (not external camera)

---

## **4. Medical Knowledge Bases**

### **4.1 UMLS (Unified Medical Language System)**

**Description:** Comprehensive medical terminology database

**Source:** [https://www.nlm.nih.gov/research/umls/](https://www.nlm.nih.gov/research/umls/)

**Statistics:**
- **Size:** 4 million+ concepts
- **Coverage:** Diseases, symptoms, medications, procedures, anatomy
- **Languages:** 25+ languages

**License:** Free for research, requires license agreement

**Use Cases:**
- Medical term normalization ("heart attack" = "myocardial infarction" = "MI")
- Symptom-to-condition mapping
- Drug name standardization

**Access:**
- Register at [https://uts.nlm.nih.gov/uts/](https://uts.nlm.nih.gov/uts/)
- Approval: instant for research, 1-2 weeks for commercial

---

### **4.2 RxNorm**

**Description:** Standardized medication names

**Source:** [https://www.nlm.nih.gov/research/umls/rxnorm/](https://www.nlm.nih.gov/research/umls/rxnorm/)

**Statistics:**
- **Size:** 100,000+ drug concepts
- **Coverage:** Brand names, generic names, dosage forms

**License:** Public domain (no restrictions)

**Use Cases for EcareBots:**
- Medication name resolution ("Advil" = "ibuprofen")
- Dosage validation ("500mg Metformin" is valid)
- Drug interaction checking (with OpenFDA API)

**Example:**
```python
import requests

# Resolve brand name to generic
response = requests.get("https://rxnav.nlm.nih.gov/REST/rxcui.json?name=Advil")
rxcui = response.json()["idGroup"]["rxnormId"][0]  # "5640" (ibuprofen)

# Get all related names
response = requests.get(f"https://rxnav.nlm.nih.gov/REST/rxcui/{rxcui}/allrelated.json")
names = response.json()["allRelatedGroup"]["conceptGroup"]
print(names)  # ["Advil", "Motrin", "ibuprofen", ...]
```

---

### **4.3 ICD-10 Codes**

**Description:** International Classification of Diseases (diagnosis codes)

**Source:** [https://www.cdc.gov/nchs/icd/icd-10-cm.htm](https://www.cdc.gov/nchs/icd/icd-10-cm.htm)

**Statistics:**
- **Size:** 70,000+ diagnosis codes
- **Format:** Code + description (e.g., "E11.9 = Type 2 diabetes without complications")

**License:** Public domain

**Use Cases:**
- Condition name standardization
- EHR integration (diagnoses stored as ICD-10 codes)
- Insurance claims (ICD-10 required)

---

## **5. Accessibility & Elderly Care Data**

### **5.1 SilverAI Voice Dataset (Simulated)**

**Status:** ⚠️ **Does not exist** (as of Nov 2025)

**Gap Identified:** No large-scale elderly-specific voice dataset publicly available

**Solution:** Generate synthetic data or conduct user studies

**Characteristics to Simulate:**
- **Slower speech:** 20-30% slower than average adult
- **Vocal tremors:** Shaky voice, pitch variations
- **Lower volume:** Quieter speech (hearing loss compensation)
- **Pauses:** Longer pauses between words (cognitive processing)
- **Mispronunciations:** More frequent errors

**Data Augmentation Techniques:**
```python
import librosa
import numpy as np

def simulate_elderly_speech(audio, sr=16000):
    # Slow down speech by 30%
    audio_slow = librosa.effects.time_stretch(audio, rate=0.7)
    
    # Add vocal tremor (5 Hz amplitude modulation)
    tremor = np.sin(2 * np.pi * 5 * np.arange(len(audio_slow)) / sr) * 0.1
    audio_tremor = audio_slow * (1 + tremor)
    
    # Reduce volume by 20%
    audio_quiet = audio_tremor * 0.8
    
    return audio_quiet
```

---

### **5.2 Accessibility Evaluation Datasets**

**WCAG 2.1 Test Cases:**
- Manual testing guidelines (not a dataset)
- [https://www.w3.org/WAI/WCAG21/quickref/](https://www.w3.org/WAI/WCAG21/quickref/)

**Screen Reader Compatibility:**
- Test with NVDA (Windows), JAWS (Windows), VoiceOver (Mac/iOS)
- No public dataset; requires manual testing

---

## **6. Insurance & Claims Data**

### **6.1 CMS Synthetic Data**

**Description:** Fake but realistic Medicare claims data

**Source:** [https://www.cms.gov/Research-Statistics-Data-and-Systems/Downloadable-Public-Use-Files/SynPUFs](https://www.cms.gov/Research-Statistics-Data-and-Systems/Downloadable-Public-Use-Files/SynPUFs)

**Statistics:**
- **Size:** 2 million synthetic beneficiaries
- **Data:** Claims (diagnoses, procedures, costs), demographics
- **Format:** CSV

**License:** Public domain

**Use Cases:**
- Test insurance verification logic
- Estimate out-of-pocket costs
- Simulate claims processing

**Limitation:** Synthetic data (not real patients, patterns may differ from reality)

---

### **6.2 CCLF (Claim and Claim Line Feed)**

**Description:** Real Medicare claims data (de-identified)

**Source:** [https://www.cms.gov/Research-Statistics-Data-and-Systems/Files-for-Order/Data-Disclosures-Data-Agreements/CCLF](https://www.cms.gov/Research-Statistics-Data-and-Systems/Files-for-Order/Data-Disclosures-Data-Agreements/CCLF)

**Statistics:**
- **Size:** 60+ million Medicare beneficiaries
- **Data:** All Medicare claims (2015-present)

**License:** Requires Data Use Agreement (DUA), HIPAA compliance

**Access Requirements:**
- Submit research proposal to CMS
- Approval process: 6-12 months
- Annual fees: $10,000-50,000

**Use Cases:**
- Healthcare cost analysis
- Claims pattern analysis
- NOT for MVP (too expensive, too slow)

---

## **7. Multi-Modal Integration Datasets**

### **7.1 ALIGN (Google)**

**Description:** Image-text pairs for vision-language models

**Source:** [https://github.com/google-research/google-research/tree/master/align](https://github.com/google-research/google-research/tree/master/align)

**Statistics:**
- **Size:** 1.8 billion image-text pairs
- **Format:** Image URLs + alt text

**License:** Research use (images from web, copyright varies)

**Use Cases:**
- Vision + language understanding ("Show me my blood pressure reading" while looking at glucose monitor)
- NOT directly applicable (no healthcare images), but useful for pre-training

---

### **7.2 MSR-VTT (Video + Text)**

**Description:** Video captioning dataset

**Source:** [https://www.microsoft.com/en-us/research/publication/msr-vtt-a-large-video-description-dataset-for-bridging-video-and-language/](https://www.microsoft.com/en-us/research/publication/msr-vtt-a-large-video-description-dataset-for-bridging-video-and-language/)

**Statistics:**
- **Size:** 10,000 videos, 200,000 descriptions
- **Format:** Video + natural language captions

**License:** Research use

**Use Cases:**
- Video understanding (if EcareBots adds video input)
- Gesture recognition + voice (multi-modal)

---

## **8. Synthetic Data Generation**

### **8.1 Why Synthetic Data?**

**Gaps in Public Datasets:**
- Elderly-specific voice data (limited)
- Healthcare appointment conversations (no public data)
- Insurance card images (privacy-protected)
- Multi-modal interactions (voice + gesture simultaneously)

**Synthetic Data Advantages:**
- Privacy-preserving (no real patient data)
- Controllable (generate specific scenarios)
- Scalable (unlimited data)

### **8.2 Synthetic Data Tools**

**Voice Synthesis:**
- **ElevenLabs:** Generate realistic elderly voices (adjust pitch, speed, tremor)
- **Coqui TTS:** Open-source text-to-speech
- **Azure Speech Studio:** Custom neural voices

**Text Generation:**
- **GPT-4 / Claude:** Generate realistic patient-doctor conversations
- Prompt: "Generate 100 conversations where elderly patients ask about medication schedules"

**Image Synthesis:**
- **Midjourney / DALL-E:** Generate insurance card images (for OCR training)
- **Stable Diffusion:** Generate elderly user personas (for UI testing)

**Example: Generate Elderly Voice Data**
```python
from elevenlabs import generate, Voice

# Generate elderly male voice saying "Schedule appointment for tomorrow"
audio = generate(
    text="Schedule appointment for tomorrow",
    voice=Voice(
        voice_id="elderly_male_001",
        settings={
            "stability": 0.6,
            "similarity_boost": 0.7,
            "pitch": -2,  # Lower pitch (elderly men)
            "speed": 0.85  # Slower speech
        }
    )
)

with open("elderly_command.mp3", "wb") as f:
    f.write(audio)
```

---

## **9. Dataset Usage Guidelines**

### **9.1 License Compliance Checklist**

Before using any dataset:

- [ ] **Read license carefully** (MIT, Apache, CC BY, CC BY-NC-SA, etc.)
- [ ] **Verify commercial use permitted** (some datasets are research-only)
- [ ] **Check attribution requirements** (must cite dataset in publications/docs?)
- [ ] **Understand restrictions** (no redistribution? no derivatives?)
- [ ] **Obtain permission if needed** (contact dataset authors for commercial use)

### **9.2 Data Quality Checks**

Before training models:

- [ ] **Inspect samples** (manually review 100-1000 examples)
- [ ] **Check for biases** (demographic representation, label imbalance)
- [ ] **Verify accuracy** (labels correct? transcripts match audio?)
- [ ] **Test edge cases** (noisy audio, accented speech, ambiguous gestures)
- [ ] **Measure metrics** (WER for ASR, accuracy for gesture recognition)

### **9.3 Privacy & Ethics**

- [ ] **De-identified data only** (no real patient names, SSNs, addresses)
- [ ] **HIPAA compliance** (if using clinical data, follow Safe Harbor or Expert Determination)
- [ ] **Informed consent** (if collecting new data, users must consent)
- [ ] **Data minimization** (collect only what's needed)
- [ ] **Secure storage** (encrypt datasets at rest, access controls)

---

## **10. Integration Plan**

### **10.1 MVP Datasets (Months 1-3)**

**Priority 1:**
1. **Mozilla Common Voice** (English, 60+ age filter) → ASR training
2. **MedDialog** → Healthcare conversational AI fine-tuning
3. **RxNorm** → Medication name standardization
4. **MediaPipe Hands** (pre-trained model) → Gesture recognition baseline

**Deliverables:**
- ASR model with >90% accuracy on elderly speech
- Healthcare chatbot with medication inquiry support
- Gesture recognition for 5 basic commands ("yes", "no", "help", "back", "home")

### **10.2 Post-MVP Datasets (Months 4-6)**

**Priority 2:**
1. **PubMedQA** → Medical fact-checking layer
2. **UMLS** → Medical term normalization
3. **CMS Synthetic Data** → Insurance verification testing
4. **VoxCeleb** → Voice biometrics (user verification)

**Deliverables:**
- RAG system citing PubMed articles
- Insurance verification with 95%+ accuracy
- Voice-based authentication

### **10.3 Scale Phase (Months 7-12)**

**Priority 3:**
1. **MIMIC-III** (if approved) → Advanced medical NLP
2. **Custom elderly user studies** (collect 1,000+ hours real elderly speech)
3. **Synthetic gesture dataset** (generate 10,000+ custom gestures)

**Deliverables:**
- Production-ready ASR (>95% accuracy all demographics)
- Custom gesture recognition (20+ healthcare-specific gestures)
- Medical entity extraction (medications, dosages, conditions)

---

## **11. Key Takeaways**

**For AI/ML Engineers:**
1. **Start with Mozilla Common Voice** (best accent diversity, free, commercial-friendly)
2. **Fine-tune on MedDialog** (healthcare-specific conversations)
3. **Generate synthetic elderly data** (no large-scale public dataset exists)
4. **Use MediaPipe as baseline** (don't reinvent hand tracking)

**For Product Managers:**
1. **Elderly voice data is scarce** (expect 6-12 months to collect sufficient data)
2. **Most healthcare datasets are research-only** (budget for licensing or synthetic data)
3. **Privacy is paramount** (never use real patient data without de-identification)

**For Executives:**
1. **Data is the moat** (quality datasets = competitive advantage)
2. **Budget for data collection** ($50-200K for user studies, synthetic data generation)
3. **Compliance is non-negotiable** (HIPAA, IRB approval for user studies)

---

## **12. References & Further Reading**

### **Dataset Catalogs**
- [Papers with Code Datasets](https://paperswithcode.com/datasets)
- [Hugging Face Datasets](https://huggingface.co/datasets)
- [Google Dataset Search](https://datasetsearch.research.google.com/)
- [PhysioNet Clinical Datasets](https://physionet.org/)

### **Healthcare NLP Resources**
- [BioNLP Shared Tasks](https://aclanthology.org/venues/bionlp/)
- [CLEF eHealth](https://clefehealth.imag.fr/)
- [TREC Medical Track](https://trec-med.github.io/)

### **Accessibility Resources**
- [W3C Accessibility Guidelines (WCAG)](https://www.w3.org/WAI/WCAG21/quickref/)
- [Mozilla Accessibility Resources](https://developer.mozilla.org/en-US/docs/Web/Accessibility)

---

## **Next Steps**

1. **Download Mozilla Common Voice** (English, 60+ age subset)
2. **Register for UMLS license** (medication/condition normalization)
3. **Access MedDialog dataset** (healthcare conversations)
4. **Test MediaPipe Hands** (gesture recognition baseline)
5. **Plan user study** (collect real elderly voice data for post-MVP)

**Document Status:** Research complete, datasets cataloged and prioritized.

---

*This document is a living document and will be updated as new datasets become available and project needs evolve.*