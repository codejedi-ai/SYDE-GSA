'use client'

import { useState, useRef, useEffect } from 'react'
import { Mic, MicOff, Send, Volume2, VolumeX } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export default function GalateaChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [sessionId] = useState(() => Math.random().toString(36).substring(7))
  const [isConnected, setIsConnected] = useState(false)
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const workletNodeRef = useRef<AudioWorkletNode | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Initialize audio context and worklets
  useEffect(() => {
    const initAudio = async () => {
      try {
        audioContextRef.current = new AudioContext()
        await audioContextRef.current.audioWorklet.addModule('/pcm-player-processor.js')
        await audioContextRef.current.audioWorklet.addModule('/pcm-recorder-processor.js')
      } catch (error) {
        console.error('Failed to initialize audio:', error)
      }
    }
    initAudio()
  }, [])

  // Connect to event stream
  useEffect(() => {
    const eventSource = new EventSource(`/api/chat/events/${sessionId}`)
    
    eventSource.onopen = () => {
      setIsConnected(true)
    }
    
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data)
      
      if (data.type === 'text') {
        setMessages(prev => {
          const existingMessage = prev.find(m => m.id === data.id)
          if (existingMessage) {
            return prev.map(m => 
              m.id === data.id 
                ? { ...m, content: m.content + data.content }
                : m
            )
          } else {
            return [...prev, {
              id: data.id,
              role: 'assistant',
              content: data.content,
              timestamp: new Date()
            }]
          }
        })
      } else if (data.type === 'audio' && audioContextRef.current) {
        playAudio(data.audio)
      }
    }
    
    eventSource.onerror = () => {
      setIsConnected(false)
    }
    
    return () => {
      eventSource.close()
    }
  }, [sessionId])

  const playAudio = async (audioData: string) => {
    if (!audioContextRef.current) return
    
    try {
      setIsPlaying(true)
      const audioBuffer = Uint8Array.from(atob(audioData), c => c.charCodeAt(0))
      
      const workletNode = new AudioWorkletNode(audioContextRef.current, 'pcm-player-processor')
      workletNode.connect(audioContextRef.current.destination)
      
      workletNode.port.postMessage({ audioData: audioBuffer })
      
      workletNode.port.onmessage = (event) => {
        if (event.data.type === 'ended') {
          setIsPlaying(false)
          workletNode.disconnect()
        }
      }
    } catch (error) {
      console.error('Audio playback error:', error)
      setIsPlaying(false)
    }
  }

  const sendMessage = async (content: string, audioData?: Uint8Array) => {
    if (!content.trim() && !audioData) return

    const userMessage: Message = {
      id: Math.random().toString(36).substring(7),
      role: 'user',
      content: content || '[Audio Message]',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')

    try {
      const payload: any = {
        message: content,
        sessionId
      }

      if (audioData) {
        payload.audio = btoa(String.fromCharCode(...audioData))
      }

      await fetch(`/api/chat/send/${sessionId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      })
    } catch (error) {
      console.error('Send message error:', error)
    }
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext()
      }
      
      const source = audioContextRef.current.createMediaStreamSource(stream)
      workletNodeRef.current = new AudioWorkletNode(audioContextRef.current, 'pcm-recorder-processor')
      
      source.connect(workletNodeRef.current)
      
      const audioChunks: Uint8Array[] = []
      
      workletNodeRef.current.port.onmessage = (event) => {
        if (event.data.audioData) {
          audioChunks.push(new Uint8Array(event.data.audioData))
        }
      }
      
      setIsRecording(true)
      
      // Stop recording after 10 seconds or when user clicks stop
      const stopRecording = () => {
        if (workletNodeRef.current) {
          workletNodeRef.current.disconnect()
          source.disconnect()
        }
        
        stream.getTracks().forEach(track => track.stop())
        setIsRecording(false)
        
        // Combine audio chunks
        const totalLength = audioChunks.reduce((acc, chunk) => acc + chunk.length, 0)
        const combinedAudio = new Uint8Array(totalLength)
        let offset = 0
        
        audioChunks.forEach(chunk => {
          combinedAudio.set(chunk, offset)
          offset += chunk.length
        })
        
        if (combinedAudio.length > 0) {
          sendMessage('', combinedAudio)
        }
      }
      
      // Auto-stop after 10 seconds
      setTimeout(stopRecording, 10000)
      
      // Store stop function for manual stop
      mediaRecorderRef.current = { stop: stopRecording } as any
      
    } catch (error) {
      console.error('Recording error:', error)
      setIsRecording(false)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop()
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(input)
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/background.png')",
          filter: 'brightness(0.3) contrast(1.2)'
        }}
      />
      
      {/* Animated scan line */}
      <div className="scan-line"></div>
      
      {/* Main Content */}
      <div className="relative z-10 flex flex-col h-screen">
        {/* Header */}
        <div className="p-6 border-b border-cyber-blue/30 bg-black/50 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-cyber neon-text glitch-animation mb-2">
                GALATEA
              </h1>
              <p className="text-cyber-light font-cyber text-sm">
                NEURAL INTERFACE v2.1.7 • {isConnected ? 'ONLINE' : 'OFFLINE'}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'} animate-pulse`}></div>
              <span className="text-xs font-cyber text-cyber-light">
                {isConnected ? 'CONNECTED' : 'DISCONNECTED'}
              </span>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-12">
              <div className="text-cyber-blue text-6xl mb-4 animate-pulse">◉</div>
              <p className="text-cyber-light font-cyber text-lg">
                NEURAL LINK ESTABLISHED
              </p>
              <p className="text-cyber-light/60 font-cyber text-sm mt-2">
                Begin transmission...
              </p>
            </div>
          )}
          
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg font-cyber text-sm comic-panel ${
                  message.role === 'user'
                    ? 'bg-cyber-blue/20 text-cyber-blue border border-cyber-blue/30'
                    : 'bg-cyber-pink/20 text-cyber-pink border border-cyber-pink/30'
                }`}
              >
                <div className="whitespace-pre-wrap">{message.content}</div>
                <div className="text-xs opacity-60 mt-1">
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-6 border-t border-cyber-blue/30 bg-black/50 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter neural transmission..."
                className="bg-black/50 border-cyber-blue/30 text-cyber-light placeholder-cyber-light/50 font-cyber pr-12"
                disabled={isRecording}
              />
              {isPlaying && (
                <Volume2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-cyber-pink animate-pulse" size={20} />
              )}
            </div>
            
            <Button
              type="button"
              onClick={isRecording ? stopRecording : startRecording}
              className={`${
                isRecording 
                  ? 'bg-red-500/20 border-red-500 text-red-400 hover:bg-red-500/30' 
                  : 'bg-cyber-pink/20 border-cyber-pink text-cyber-pink hover:bg-cyber-pink/30'
              } border font-cyber transition-all duration-300`}
              disabled={isPlaying}
            >
              {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
            </Button>
            
            <Button
              type="submit"
              disabled={!input.trim() || isRecording || isPlaying}
              className="bg-cyber-blue/20 border-cyber-blue text-cyber-blue hover:bg-cyber-blue/30 border font-cyber transition-all duration-300"
            >
              <Send size={20} />
            </Button>
          </form>
          
          <div className="flex justify-center mt-4 space-x-6 text-xs font-cyber text-cyber-light/60">
            <span>VOICE: {isRecording ? 'RECORDING' : 'READY'}</span>
            <span>AUDIO: {isPlaying ? 'PLAYING' : 'READY'}</span>
            <span>SESSION: {sessionId.toUpperCase()}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
