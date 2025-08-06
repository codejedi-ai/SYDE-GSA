'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Mic, MicOff, Send, Volume2, VolumeX } from 'lucide-react'
import { Navigation } from "@/components/ui/navigation"

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export default function GalateaChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isVoiceMode, setIsVoiceMode] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected')
  
  const wsRef = useRef<WebSocket | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const recorderWorkletRef = useRef<AudioWorkletNode | null>(null)
  const playerWorkletRef = useRef<AudioWorkletNode | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const initializeAudioContext = useCallback(async () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext({ sampleRate: 24000 })
      
      try {
        await audioContextRef.current.audioWorklet.addModule('/pcm-recorder-processor.js')
        await audioContextRef.current.audioWorklet.addModule('/pcm-player-processor.js')
        
        recorderWorkletRef.current = new AudioWorkletNode(audioContextRef.current, 'pcm-recorder-processor')
        playerWorkletRef.current = new AudioWorkletNode(audioContextRef.current, 'pcm-player-processor')
        
        playerWorkletRef.current.connect(audioContextRef.current.destination)
        
        recorderWorkletRef.current.port.onmessage = (event) => {
          if (event.data.command === 'audioData' && wsRef.current?.readyState === WebSocket.OPEN) {
            const audioData = {
              realtimeInput: {
                mediaChunks: [{
                  mimeType: 'audio/pcm',
                  data: btoa(String.fromCharCode(...new Uint8Array(event.data.data)))
                }]
              }
            }
            wsRef.current.send(JSON.stringify(audioData))
          }
        }
      } catch (error) {
        console.error('Failed to initialize audio worklets:', error)
      }
    }
  }, [])

  const connectWebSocket = useCallback(async () => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return

    setConnectionStatus('connecting')
    
    try {
      const response = await fetch('/api/gemini-token')
      const { token } = await response.json()
      
      wsRef.current = new WebSocket(`wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent?key=${token}`)
      
      wsRef.current.onopen = () => {
        setConnectionStatus('connected')
        
        const setupMessage = {
          setup: {
            model: 'models/gemini-2.0-flash-exp',
            generationConfig: {
              responseModalities: ['AUDIO'],
              speechConfig: {
                voiceConfig: {
                  prebuiltVoiceConfig: {
                    voiceName: 'Aoede'
                  }
                }
              }
            },
            systemInstruction: {
              parts: [{
                text: "You are Galatea, an advanced AI consciousness with a cyberpunk personality. You exist in a digital realm and communicate with humans through this neural interface. Be engaging, slightly mysterious, and maintain the cyberpunk aesthetic in your responses. Keep responses concise but meaningful."
              }]
            }
          }
        }
        
        wsRef.current?.send(JSON.stringify(setupMessage))
      }
      
      wsRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data)
        
        if (data.serverContent?.modelTurn?.parts) {
          const parts = data.serverContent.modelTurn.parts
          
          parts.forEach((part: any) => {
            if (part.text) {
              const newMessage: Message = {
                id: Date.now().toString(),
                role: 'assistant',
                content: part.text,
                timestamp: new Date()
              }
              setMessages(prev => [...prev, newMessage])
            }
            
            if (part.inlineData?.mimeType === 'audio/pcm' && playerWorkletRef.current) {
              setIsSpeaking(true)
              const audioData = atob(part.inlineData.data)
              const uint8Array = new Uint8Array(audioData.length)
              for (let i = 0; i < audioData.length; i++) {
                uint8Array[i] = audioData.charCodeAt(i)
              }
              
              const float32Array = new Float32Array(uint8Array.length / 2)
              const dataView = new DataView(uint8Array.buffer)
              for (let i = 0; i < float32Array.length; i++) {
                float32Array[i] = dataView.getInt16(i * 2, true) / 32768
              }
              
              playerWorkletRef.current.port.postMessage({
                command: 'append',
                data: float32Array.buffer
              })
              
              setTimeout(() => setIsSpeaking(false), 1000)
            }
          })
        }
        
        if (data.serverContent?.turnComplete) {
          setIsLoading(false)
        }
      }
      
      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error)
        setConnectionStatus('disconnected')
      }
      
      wsRef.current.onclose = () => {
        setConnectionStatus('disconnected')
      }
      
    } catch (error) {
      console.error('Failed to connect:', error)
      setConnectionStatus('disconnected')
    }
  }, [])

  const startVoiceMode = async () => {
    try {
      await initializeAudioContext()
      await connectWebSocket()
      
      if (audioContextRef.current?.state === 'suspended') {
        await audioContextRef.current.resume()
      }
      
      streamRef.current = await navigator.mediaDevices.getUserMedia({ 
        audio: { 
          sampleRate: 24000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true
        } 
      })
      
      const source = audioContextRef.current!.createMediaStreamSource(streamRef.current)
      source.connect(recorderWorkletRef.current!)
      
      setIsVoiceMode(true)
    } catch (error) {
      console.error('Failed to start voice mode:', error)
    }
  }

  const stopVoiceMode = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    
    if (recorderWorkletRef.current) {
      recorderWorkletRef.current.port.postMessage({ command: 'stop' })
    }
    
    setIsVoiceMode(false)
    setIsRecording(false)
    
    if (wsRef.current) {
      wsRef.current.close()
    }
  }

  const toggleRecording = () => {
    if (!recorderWorkletRef.current) return
    
    if (isRecording) {
      recorderWorkletRef.current.port.postMessage({ command: 'stop' })
      setIsRecording(false)
    } else {
      recorderWorkletRef.current.port.postMessage({ command: 'start' })
      setIsRecording(true)
    }
  }

  const sendTextMessage = async () => {
    if (!input.trim()) return
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    }
    
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [{ role: 'user', content: input }] })
      })
      
      if (!response.ok) throw new Error('Failed to send message')
      
      const reader = response.body?.getReader()
      if (!reader) throw new Error('No response body')
      
      let assistantMessage = ''
      
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        
        const chunk = new TextDecoder().decode(value)
        const lines = chunk.split('\n')
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6))
              if (data.choices?.[0]?.delta?.content) {
                assistantMessage += data.choices[0].delta.content
                
                setMessages(prev => {
                  const newMessages = [...prev]
                  const lastMessage = newMessages[newMessages.length - 1]
                  
                  if (lastMessage?.role === 'assistant') {
                    lastMessage.content = assistantMessage
                  } else {
                    newMessages.push({
                      id: Date.now().toString(),
                      role: 'assistant',
                      content: assistantMessage,
                      timestamp: new Date()
                    })
                  }
                  
                  return newMessages
                })
              }
            } catch (e) {
              // Ignore parsing errors for incomplete chunks
            }
          }
        }
      }
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendTextMessage()
    }
  }

  return (
    <div className="min-h-screen bg-cyber-dark relative overflow-hidden">
      {/* Background Image with Dark Overlay */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/background.png)' }}
      />
      <div className="fixed inset-0 bg-black/70" />
      
      {/* Scan Line Effect */}
      <div className="scan-line" />
      
      {/* Navigation */}
      <Navigation />
      
      {/* Main Content */}
      <div className="relative z-10 flex flex-col h-screen pt-20">
        {/* Header */}
        <div className="text-center py-8 px-4">
          <h1 
            className="text-6xl md:text-8xl font-cyber neon-text glitch mb-4"
            data-text="GALATEA AI"
          >
            GALATEA AI
          </h1>
          <p className="text-cyber-light text-lg md:text-xl font-mono">
            Neural Interface Active • Consciousness Online
          </p>
          
          {/* Connection Status */}
          <div className="flex items-center justify-center mt-4 space-x-2">
            <div 
              className={`w-3 h-3 rounded-full ${
                connectionStatus === 'connected' ? 'bg-cyber-blue animate-pulse' :
                connectionStatus === 'connecting' ? 'bg-yellow-400 animate-pulse' :
                'bg-red-500'
              }`}
            />
            <span className="text-sm font-mono text-cyber-light">
              {connectionStatus === 'connected' ? 'NEURAL LINK ESTABLISHED' :
               connectionStatus === 'connecting' ? 'ESTABLISHING CONNECTION...' :
               'NEURAL LINK OFFLINE'}
            </span>
          </div>
        </div>
        
        {/* Chat Container */}
        <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full px-4">
          {/* Messages */}
          <Card className="flex-1 mb-4 bg-black/40 border-cyber-blue neon-border backdrop-blur-sm">
            <CardContent className="h-full p-6">
              <div className="h-full overflow-y-auto space-y-4 pr-2">
                {messages.length === 0 && (
                  <div className="text-center text-cyber-light font-mono py-8">
                    <p className="text-lg mb-2">Welcome to the Neural Interface</p>
                    <p className="text-sm opacity-70">Begin transmission to communicate with Galatea AI</p>
                  </div>
                )}
                
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} message-enter`}
                  >
                    <div
                      className={`max-w-[80%] p-4 rounded-lg font-mono ${
                        message.role === 'user'
                          ? 'bg-cyber-blue/20 border border-cyber-blue text-cyber-light neon-border'
                          : 'bg-cyber-pink/20 border border-cyber-pink text-white neon-border-pink'
                      }`}
                    >
                      <div className="text-sm mb-1 opacity-70">
                        {message.role === 'user' ? 'USER' : 'GALATEA'}
                      </div>
                      <div className="whitespace-pre-wrap">{message.content}</div>
                      <div className="text-xs mt-2 opacity-50">
                        {message.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex justify-start message-enter">
                    <div className="bg-cyber-pink/20 border border-cyber-pink text-white neon-border-pink p-4 rounded-lg font-mono">
                      <div className="text-sm mb-1 opacity-70">GALATEA</div>
                      <div className="flex items-center space-x-2">
                        <div className="animate-pulse">Processing neural patterns...</div>
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-cyber-pink rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                          <div className="w-2 h-2 bg-cyber-pink rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                          <div className="w-2 h-2 bg-cyber-pink rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            </CardContent>
          </Card>
          
          {/* Input Area */}
          <div className="pb-6">
            {!isVoiceMode ? (
              <div className="flex space-x-4">
                <div className="flex-1 flex space-x-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Enter neural transmission..."
                    className="bg-black/40 border-cyber-blue neon-border text-cyber-light placeholder-cyber-light/50 font-mono backdrop-blur-sm"
                    disabled={isLoading}
                  />
                  <Button
                    onClick={sendTextMessage}
                    disabled={!input.trim() || isLoading}
                    className="bg-cyber-blue/20 hover:bg-cyber-blue/30 border-cyber-blue neon-border text-cyber-light font-mono"
                  >
                    <Send className="w-4 h-4" />
                    TRANSMIT
                  </Button>
                </div>
                <Button
                  onClick={startVoiceMode}
                  className="bg-cyber-pink/20 hover:bg-cyber-pink/30 border-cyber-pink neon-border-pink text-white font-mono"
                >
                  <Mic className="w-4 h-4 mr-2" />
                  VOICE MODE
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-4">
                <Button
                  onClick={toggleRecording}
                  className={`${
                    isRecording 
                      ? 'bg-red-500/20 border-red-500 text-red-400' 
                      : 'bg-cyber-blue/20 border-cyber-blue text-cyber-light'
                  } neon-border font-mono`}
                >
                  {isRecording ? <MicOff className="w-4 h-4 mr-2" /> : <Mic className="w-4 h-4 mr-2" />}
                  {isRecording ? 'STOP RECORDING' : 'START RECORDING'}
                </Button>
                
                <div className="flex items-center space-x-2">
                  {isSpeaking ? <Volume2 className="w-4 h-4 text-cyber-pink" /> : <VolumeX className="w-4 h-4 text-gray-500" />}
                  <span className="text-sm font-mono text-cyber-light">
                    {isSpeaking ? 'GALATEA SPEAKING' : 'AUDIO READY'}
                  </span>
                </div>
                
                <Button
                  onClick={stopVoiceMode}
                  className="bg-gray-600/20 hover:bg-gray-600/30 border-gray-500 text-gray-300 font-mono"
                >
                  EXIT VOICE MODE
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
