# 🦾 EcareBots — No Keyboards Hackathon 🎉

**🌐 Live Demo:** [https://ecarebots.com](https://ecarebots.com)  
**🏁 Submission:** [No Keyboards Allowed Hackathon](https://nokeyboardsallowed.dev/)

---

## ❓ What is EcareBots?

**EcareBots** is a hands-free, multi-modal care platform for users who struggle with keyboards, mice, or touchscreens.  
Interact using **voice** 🗣️ and **gestures** ✋ for vital actions: **alerts, reminders, queries** — perfect for elderly, disabled, or anyone in assisted-living or tough accessibility scenarios.

---

## 🌟 Why EcareBots?

🏥 **Traditional input = friction.** For those with mobility, vision, or motor challenges, ordinary computers lead to dependence and frustration.  
EcareBots restores **independence** and control, so users perform daily tasks simply by speaking or moving — and thrive with new freedom.

---

## ⚙️ How Does EcareBots Work?

### 🗂 Code Structure

ecarebots/
├── README.md # 📘 Project documentation
├── package.json # ⚙️ Dependencies & scripts
├── index.html # 🏠 App shell
├── vite.config.js # 🚀 Build setup
└── src/
    ├── App.jsx # 🎨 Main UI & logic
    ├── main.jsx # 🏁 Entry point
    └── styles.css # 🎀 Styles

text

### 🏗️ High-Level Architecture

+-------------------------+
| 👀 Frontend (Browser) |
+-------------------------+
| Mic 🎤 / Webcam 📹
v
+------------------------------+
| 🧠 Speech-to-Text (Web API)|
| 👋 Gesture Detection |
+------------------------------+
| Input events ("Help" / Reminder / Query)
v
+----------------------------------+
| 🗺️ Rules Engine: |
| 🚨 Emergency alert |
| ⏰ Read reminder |
| ❓ Info query |
+----------------------------------+
| Output
v
+-----------------------------+
| 🗣️ Text-to-Speech (TTS) |
| 🔄 Fallback: ElevenLabs API|
+-----------------------------+

text

### 🎨 Wireframe UI

+-----------------------------+

🦾 EcareBots: Accessible App
[🎤 Mic] Speak your request
[📹 Gesture] Wave for help
[🕑 Reminders]
"Take medicine @ 5pm"
"Appointment: Tomorrow"
+-----------------------------+
[Status: Listening...]
[Output: 'Alert sent!']
+-----------------------------+
text

### ✨ Core Features (MVP)
- 🗣️ **Voice input:** Real-time STT via Web Speech API.
- 👋 **Gesture input:** Wave/motion detection (upgrade path: MediaPipe/TFJS handpose).
- 🗣️ **Spoken output:** TTS (browser or ElevenLabs).
- 🗺️ **Rules engine:** Maps voice/gesture triggers to useful actions (alert, time, confirmation).

---

## 🦸‍♂️ Primary Use Cases
- 🚨 **Emergency alerts:** Say/gesture "help" to notify caregivers.
- 🕑 **Reminders:** Spoken med or appointment prompts.
- ❓ **Information queries:** "What's the time?", "Schedule?".
- 🏠 **Accessibility-first UI:** Fits assisted-living, home care, or mobility aids.

---

## 🚀 Quick Start

1️⃣ Install dependencies
npm install

2️⃣ Run locally
npm run dev

3️⃣ Open site in browser, allow mic/cam access
text

**Production deploy:**  
- Vercel: Build command `npm run build`, Output: `dist/`  
- 🌐 No API keys in source! Use env vars for CI/CD secrets.

---

## 🏗️ Advanced Architecture & Extensibility

- **Browser-first:** All streams, STT, gestures run locally for demo/MVP.
- **Serverless backend:** Proxy for ElevenLabs TTS/STT for security/high-accuracy.
- **Motion heuristic:** Quick demo, replaceable w/ MediaPipe Hands/TFJS for full handpose.
- **Pluggable models:** Upgrade to Whisper, ElevenLabs STT/TTS as needed.

---

## 🗓️ Roadmap

**Short-term (1–4 weeks):**  
- 🤚 MediaPipe/TFJS gestures
- 🗣️ Whisper/ElevenLabs STT proxy
- ✅ E2E tests, deeper ARIA/accessibility
- 🔒 Secure ElevenLabs TTS integration

**Medium-term (1–3 months):**  
- 👨‍👩‍👧 Multi-user/caregiver dashboard
- ⚙️ Configurable rules engine
- 📱 Mobile, PWA, offline mode

**Long-term (3–9 months):**  
- 📞 Medical alert / SMS / telephony
- 🏠 Sensor integrations (ambient, motion)
- 🔏 Privacy/audit enhancements

---

## 🏆 Hackathon Context

Built for _No Keyboards Allowed Hackathon_ ([info](https://nokeyboardsallowed.dev/)).  
Focus:  
- 👓 Accessibility for care
- 💡 Demo meaningful hands-free interactions
- 🔌 Easy extensibility for AI/ML upgrades

---

## 🤝 Contributing

- 🤔 Open issues for ideas/bugs/features
- 🚀 PRs to `main` w/ clear description, tests

---

## 📜 License

MIT — see [LICENSE](https://github.com/ArjunFrancis/ecarebots/blob/main/LICENSE)

---

## 🙏 Acknowledgments

- Made with Vite, React, browser Web APIs
- Demo-ready: Web Speech API + webcam
- Inspired by hackathon mentors, accessibility advocates

---

## 💬 Contact & Support

- Issues/support: [GitHub Issues](https://github.com/ArjunFrancis/ecarebots/issues)
- Deployment: [Live demo](https://ecarebots.com)

---