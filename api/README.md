# EcareBots API

This directory contains serverless API functions to be deployed on Vercel.

## TTS (Text-to-Speech) API

File: `tts.js`

This endpoint provides text-to-speech functionality via the ElevenLabs API.

### Configuration

Requires the `ELEVENLABS_API_KEY` environment variable to be set in your Vercel project.

### Usage

**Endpoint:** `/api/tts`

**Method:** `POST`

**Request Body:**

```json
{
  "text": "Text to convert to speech",
  "voice_id": "EXAVITQu4vr4xnSDxMaL" // Optional, defaults to this voice
}
```

**Response:**

- Content-Type: `audio/mpeg`
- Binary audio data stream

### Example Usage from Frontend

```javascript
async function getTextToSpeech(text) {
  try {
    const response = await fetch('/api/tts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to convert text to speech');
    }
    
    // Create audio element and play
    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
    audio.play();
    
    return audioUrl; // Return URL for cleanup later
  } catch (error) {
    console.error('Error in TTS:', error);
    return null;
  }
}
```

## Adding More API Routes

To add more serverless functions:

1. Create a new file in this directory (e.g., `stt.js` for speech-to-text)
2. Follow the same serverless function pattern:

```javascript
export default async function handler(req, res) {
  // Your code here
}
```

3. Add necessary environment variables in your Vercel project settings
4. Document the new API in this README.md file