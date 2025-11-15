import React, { useRef, useState, useEffect } from 'react'

export default function App() {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const [listening, setListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [status, setStatus] = useState('Idle')
  const recognitionRef = useRef(null)
  const [gestureDetected, setGestureDetected] = useState(false)
  const [brightness, setBrightness] = useState(0)
  const [alerts, setAlerts] = useState([])
  const [reminders, setReminders] = useState([
    { id: 1, text: 'Take medication', time: '8:00 AM', enabled: true },
    { id: 2, text: 'Doctor appointment', time: '2:00 PM', enabled: true }
  ])

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
        setStatus(interim ? `Listening (interim): ${interim}` : 'Listening')
        
        // Auto-execute commands when they are recognized
        if (final && (final.toLowerCase().includes('help') || 
            final.toLowerCase().includes('emergency'))) {
          handleSendCommand(final)
        }
      }
      recog.onerror = (e) => {
        console.warn('Speech recognition error', e)
        setStatus('Speech recognition error')
      }
      recognitionRef.current = recog
    } else {
      setStatus('SpeechRecognition not supported in this browser')
    }

    // gesture and brightness detection loop
    let rafId
    let prevData = null
    const motionThreshold = 150000 // motion threshold

    function processFrame() {
      const video = videoRef.current
      const canvas = canvasRef.current
      if (video && canvas) {
        const ctx = canvas.getContext('2d')
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
        const frame = ctx.getImageData(0, 0, canvas.width, canvas.height)
        
        // Calculate average brightness
        let totalBrightness = 0
        for (let i = 0; i < frame.data.length; i += 4) {
          const r = frame.data[i]
          const g = frame.data[i + 1]
          const b = frame.data[i + 2]
          totalBrightness += (r + g + b) / 3
        }
        const avgBrightness = totalBrightness / (frame.data.length / 4)
        setBrightness(Math.round(avgBrightness))
        
        // Check for motion/gestures
        if (prevData) {
          let motion = 0
          for (let i = 0; i < frame.data.length; i += 16) { // Sample every 4 pixels for performance
            const r = frame.data[i]
            const g = frame.data[i + 1]
            const b = frame.data[i + 2]
            const brightness = (r + g + b) / 3
            const prevBrightness = (prevData.data[i] + prevData.data[i + 1] + prevData.data[i + 2]) / 3
            motion += Math.abs(brightness - prevBrightness)
          }
          if (motion > motionThreshold) {
            setGestureDetected(true)
            setStatus('Wave gesture detected')
            handleGestureDetected()
            // debounce
            setTimeout(() => setGestureDetected(false), 1500)
          }
        }
        prevData = frame
      }
      rafId = requestAnimationFrame(processFrame)
    }
    rafId = requestAnimationFrame(processFrame)

    // Auto-start listening
    if (SpeechRecognition && recognitionRef.current) {
      setTimeout(() => {
        recognitionRef.current.start()
        setListening(true)
        setStatus('Starting speech recognition...')
        
        // Welcome message
        speakText('Welcome to EcareBots. I am listening for your commands. You can ask for help, check the time, or create reminders.')
      }, 2000)
    }

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

  function handleGestureDetected() {
    // Gestures trigger help alert
    addAlert('Emergency alert triggered by gesture')
    speakText('I detected an emergency gesture. Help is on the way.')
  }
  
  function addAlert(message) {
    const newAlert = {
      id: Date.now(),
      message,
      time: new Date().toLocaleTimeString()
    }
    setAlerts(prev => [newAlert, ...prev].slice(0, 5))
  }

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
    const c = cmd.toLowerCase()
    
    // Process commands
    if (c.includes('help') || c.includes('emergency')) {
      addAlert('Emergency alert triggered by voice: ' + cmd)
      speakText('Alert sent. Help is on the way.')
      setStatus('Emergency alert sent')
    } else if (c.includes('time')) {
      speakText('The current time is ' + new Date().toLocaleTimeString())
      setStatus('Time request processed')
    } else if (c.includes('remind') || c.includes('reminder')) {
      const reminder = {
        id: Date.now(),
        text: cmd,
        time: new Date().toLocaleTimeString(),
        enabled: true
      }
      setReminders(prev => [reminder, ...prev])
      speakText('I\'ve added a reminder: ' + cmd)
      setStatus('Reminder added')
    } else if (c.includes('list') && c.includes('reminder')) {
      const reminderList = reminders.map(r => r.text).join(', ')
      speakText('Your reminders are: ' + reminderList)
      setStatus('Listed reminders')
    } else if (c.includes('brightness') || c.includes('light')) {
      speakText(`The current brightness level is ${brightness > 150 ? 'bright' : brightness > 75 ? 'moderate' : 'dim'}`)
      setStatus('Light level reported')
    } else {
      speakText('I heard: ' + cmd)
      setStatus('Command processed: ' + cmd)
    }
    
    // Clear transcript after processing
    setTranscript('')
  }

  return (
    <div className="app">
      <header>
        <h1>🦾 EcareBots — No Keyboards Allowed</h1>
        <p className="muted">Voice + Gesture + Light Input Demo</p>
      </header>

      <main>
        <section className="video-panel">
          <video ref={videoRef} autoPlay playsInline muted className="video" />
          <canvas ref={canvasRef} className="overlay" />
          <div className="indicators">
            <div className={`indicator ${gestureDetected ? 'active' : ''}`}>
              👋 {gestureDetected ? 'Gesture Detected!' : 'Gesture Input'}
            </div>
            <div className={`indicator ${brightness > 150 ? 'bright' : brightness > 75 ? 'moderate' : 'dim'}`}>
              💡 Light Level: {brightness > 150 ? 'Bright' : brightness > 75 ? 'Moderate' : 'Dim'}
            </div>
          </div>
        </section>

        <section className="controls-panel">
          <div className="status-bar">
            <div className={`status ${listening ? 'listening' : ''}`}>
              🎤 {status}
            </div>
            <button 
              className={`listen-toggle ${listening ? 'active' : ''}`} 
              onClick={toggleListening}
            >
              {listening ? '⏹️ Stop Listening' : '▶️ Start Listening'}
            </button>
          </div>

          <div className="transcript-box">
            <h3>Voice Input</h3>
            <div className="transcript">{transcript || '(Say something...)'}</div>
            <button 
              className="command-button"
              disabled={!transcript}
              onClick={() => handleSendCommand(transcript)}
            >
              Execute Command
            </button>
          </div>
          
          <div className="panels">
            <div className="alerts-panel">
              <h3>📢 Recent Alerts</h3>
              {alerts.length === 0 ? (
                <div className="empty-state">No recent alerts</div>
              ) : (
                <ul>
                  {alerts.map(alert => (
                    <li key={alert.id}>
                      <span className="alert-time">{alert.time}</span>
                      <span className="alert-message">{alert.message}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            
            <div className="reminders-panel">
              <h3>⏰ Reminders</h3>
              {reminders.length === 0 ? (
                <div className="empty-state">No reminders set</div>
              ) : (
                <ul>
                  {reminders.map(reminder => (
                    <li key={reminder.id}>
                      <span className="reminder-time">{reminder.time}</span>
                      <span className="reminder-text">{reminder.text}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="quick-actions">
            <h3>Quick Commands</h3>
            <div className="action-buttons">
              <button onClick={() => handleSendCommand('What is the time?')}>⏱️ What time is it?</button>
              <button onClick={() => handleSendCommand('I need help')}>🚨 Send Emergency Alert</button>
              <button onClick={() => handleSendCommand('Add a reminder to take medication at 3pm')}>
                🔔 Add Medication Reminder
              </button>
              <button onClick={() => handleSendCommand('What is the brightness level?')}>
                💡 Check Light Level
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <div className="footer-content">
          <p>
            <strong>EcareBots</strong> — No-keyboard interface using voice, gestures, and light levels.
            <br />
            <small>Built for <a href="https://nokeyboardsallowed.dev" target="_blank" rel="noopener noreferrer">No Keyboards Allowed Hackathon</a></small>
          </p>
          <p>
            <small>Domain: <a href="https://ecarebots.com">ecarebots.com</a> | <a href="https://github.com/ArjunFrancis/ecarebots">GitHub</a></small>
          </p>
        </div>
      </footer>
    </div>
  )
}