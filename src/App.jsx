import React, { useRef, useState, useEffect } from 'react'

export default function App() {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const [listening, setListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [status, setStatus] = useState('Idle')
  const recognitionRef = useRef(null)
  const [gestureDetected, setGestureDetected] = useState(false)

  useEffect(() => {
    // Initialize camera
    async function setupCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        if (videoRef.current) videoRef.current.srcObject = stream
      } catch (e) {
        console.error('Camera/mic access error', e)
        setStatus('Camera / Microphone access required')
      }
    }
    setupCamera()

    // Initialize simple speech recognition (Web Speech API)
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (SpeechRecognition) {
      const recog = new SpeechRecognition()
      recog.continuous = true
      recog.interimResults = true
      recog.lang = 'en-US'
      recog.onresult = (event) => {
        let interim = ''
        let final = ''
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const res = event.results[i]
          if (res.isFinal) final += res[0].transcript
          else interim += res[0].transcript
        }
        setTranscript((prev) => (final ? prev + ' ' + final : prev))
        setStatus(interim ? 'Listening (interim)...' : 'Listening')
      }
      recog.onerror = (e) => {
        console.warn('Speech recognition error', e)
        setStatus('Speech recognition error')
      }
      recognitionRef.current = recog
    } else {
      setStatus('SpeechRecognition not supported in this browser')
    }

    // gesture loop
    let rafId
    let prevData = null
    const threshold = 150000 // motion threshold

    function processFrame() {
      const video = videoRef.current
      const canvas = canvasRef.current
      if (video && canvas) {
        const ctx = canvas.getContext('2d')
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
        const frame = ctx.getImageData(0, 0, canvas.width, canvas.height)
        if (prevData) {
          let motion = 0
          for (let i = 0; i < frame.data.length; i += 4) {
            const r = frame.data[i]
            const g = frame.data[i + 1]
            const b = frame.data[i + 2]
            const brightness = (r + g + b) / 3
            const prevBrightness = (prevData.data[i] + prevData.data[i + 1] + prevData.data[i + 2]) / 3
            motion += Math.abs(brightness - prevBrightness)
          }
          if (motion > threshold) {
            setGestureDetected(true)
            setStatus('Wave gesture detected')
            // debounce
            setTimeout(() => setGestureDetected(false), 1500)
          }
        }
        prevData = frame
      }
      rafId = requestAnimationFrame(processFrame)
    }
    rafId = requestAnimationFrame(processFrame)

    return () => {
      if (rafId) cancelAnimationFrame(rafId)
      // stop streams
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks()
        tracks.forEach((t) => t.stop())
      }
      if (recognitionRef.current) recognitionRef.current.stop()
    }
  }, [])

  function toggleListening() {
    if (!recognitionRef.current) return
    if (!listening) {
      recognitionRef.current.start()
      setListening(true)
      setStatus('Starting speech recognition...')
    } else {
      recognitionRef.current.stop()
      setListening(false)
      setStatus('Idle')
    }
  }

  function speakText(text) {
    if (!window.speechSynthesis) {
      alert('Speech Synthesis not supported in this browser')
      return
    }
    const utter = new SpeechSynthesisUtterance(text)
    utter.lang = 'en-US'
    window.speechSynthesis.speak(utter)
  }

  function handleSendCommand(cmd) {
    setStatus('Processing command: ' + cmd)
    // quick demo mapping
    const c = cmd.toLowerCase()
    if (c.includes('help') || c.includes('emergency') || gestureDetected) {
      speakText('Alert sent. Help is on the way.')
      setStatus('Alert sent')
    } else if (c.includes('time')) {
      speakText('The current time is ' + new Date().toLocaleTimeString())
      setStatus('Told the time')
    } else {
      speakText('I heard: ' + cmd)
      setStatus('Echoed input')
    }
  }

  return (
    <div className="app">
      <header>
        <h1>EcareBots — No Keyboards</h1>
        <p className="muted">Voice + Gesture demo (MVP)</p>
      </header>

      <main>
        <section className="video-panel">
          <video ref={videoRef} autoPlay playsInline muted className="video" />
          <canvas ref={canvasRef} className="overlay" />
          <div className="indicator">{gestureDetected ? '👋 Gesture' : '—'}</div>
        </section>

        <section className="controls">
          <div className="status">Status: {status}</div>

          <div className="speech">
            <button onClick={toggleListening}>{listening ? 'Stop Listening' : 'Start Listening'}</button>
            <button onClick={() => handleSendCommand(transcript)}>Run Command</button>
            <div className="transcript"><strong>Transcript:</strong> {transcript}</div>
          </div>

          <div className="quick-actions">
            <button onClick={() => handleSendCommand('What is the time?')}>What is the time?</button>
            <button onClick={() => handleSendCommand('I need help')}>Send Help</button>
          </div>
        </section>
      </main>

      <footer>
        <small>Deployed to Vercel — domain: ecarebots.com</small>
      </footer>
    </div>
  )
}
