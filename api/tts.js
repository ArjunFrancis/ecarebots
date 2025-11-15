// Serverless API route for ElevenLabs TTS integration
// Deploy as a serverless function on Vercel
// Required environment variable: ELEVENLABS_API_KEY

export default async function handler(req, res) {
  try {
    // Only allow POST requests
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }
    
    // Get the text to convert to speech
    const { text, voice_id = 'EXAVITQu4vr4xnSDxMaL' } = req.body;
    
    if (!text) {
      return res.status(400).json({ error: 'Text is required' });
    }
    
    // Get the API key from environment variables
    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'ELEVENLABS_API_KEY environment variable is not set' });
    }
    
    // Call the ElevenLabs API
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voice_id}`,
      {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': apiKey,
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5,
          },
        }),
      }
    );
    
    if (!response.ok) {
      const error = await response.json();
      console.error('ElevenLabs API error:', error);
      return res.status(response.status).json({ error: 'Error calling ElevenLabs API', details: error });
    }
    
    // Get the audio as a buffer
    const audioBuffer = await response.arrayBuffer();
    
    // Set appropriate headers for audio file
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Length', audioBuffer.byteLength);
    
    // Send the audio buffer
    res.status(200).send(Buffer.from(audioBuffer));
  } catch (error) {
    console.error('TTS API error:', error);
    res.status(500).json({ error: 'Failed to convert text to speech', message: error.message });
  }
}