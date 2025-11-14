# EcareBots — No Keyboards Hackathon

This repository contains the EcareBots MVP — a no-keyboard interface using voice and gesture inputs for care-focused interactions.

Live domain: https://ecarebots.com

Quick start

1. Install dependencies

   npm install

2. Run locally

   npm run dev

Features (MVP)

- Voice input using Web Speech API (start/stop listening)
- Simple gesture detection via camera motion (wave detection)
- Browser TTS (SpeechSynthesis) as fallback for ElevenLabs

Deployment

- This project is built for deployment on Vercel. Serverless API routes can be added under /api if you want to proxy ElevenLabs TTS.

Notes

- For higher-quality TTS, add an ElevenLabs serverless function and set ELEVENLABS_API_KEY in Vercel environment variables.
- Gesture detection is using a simple motion heuristic for fast demoability; replace with MediaPipe/TFJS for production-grade detection.


---

Good luck at the hackathon! If you want, I can now push this branch to main via PR, set up Vercel deployment, and trigger the first build.