"use client";

import { useState, useEffect, useRef } from 'react';
import { Navigation } from '@/components/ui/navigation';
import type { FormEvent } from 'react';
import { Mic, MicOff } from 'lucide-react';

// --- Type Definitions for a strictly typed component ---
// Define the shape of a single message to be displayed in the UI
interface Message {
  id: string;
  text: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

// Define the possible messages received from the server
interface ServerMessage {
  turn_complete?: boolean;
  interrupted?: boolean;
  mime_type?: 'audio/pcm' | 'text/plain';
  data?: string;
}

// The message sent to the server from the client
interface ClientMessage {
  mime_type: 'audio/pcm' | 'text/plain';
  data: string;
}

const VathsalaChat: React.FC = () => {
  // --- State and Refs ---
  const [messages, setMessages] = useState<Array<Message | string>>([]);
  const [isSendButtonEnabled, setIsSendButtonEnabled] = useState<boolean>(false);
  const [isAudioMode, setIsAudioMode] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);

  // Using useRef with explicit types for DOM elements and other mutable values
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);
  const currentMessageIdRef = useRef<string | null>(null);
  const audioPlayerNodeRef = useRef<AudioWorkletNode | null>(null);
  const audioPlayerContextRef = useRef<AudioContext | null>(null);
  const audioRecorderNodeRef = useRef<AudioWorkletNode | null>(null);
  const audioRecorderContextRef = useRef<AudioContext | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const audioBufferRef = useRef<Uint8Array[]>([]);
  const bufferTimerRef = useRef<NodeJS.Timeout | null>(null);

  // A stable, unique session ID for the component's lifetime
  const sessionId = useRef<string>(Math.random().toString().substring(10)).current;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // --- Helper Functions with explicit types ---
  const convertFloat32ToPCM = (inputData: Float32Array): ArrayBuffer => {
    const pcm16 = new Int16Array(inputData.length);
    for (let i = 0; i < inputData.length; i++) {
      pcm16[i] = inputData[i] * 0x7fff;
    }
    return pcm16.buffer;
  };

  const startAudioPlayerWorklet = async (): Promise<[AudioWorkletNode, AudioContext]> => {
    const audioContext = new AudioContext({ sampleRate: 24000 });
    await audioContext.audioWorklet.addModule('/pcm-player-processor.js');
    const audioPlayerNode = new AudioWorkletNode(audioContext, 'pcm-player-processor');
    audioPlayerNode.connect(audioContext.destination);
    return [audioPlayerNode, audioContext];
  };

  const startAudioRecorderWorklet = async (audioRecorderHandler: (pcmData: ArrayBuffer) => void): Promise<[AudioWorkletNode, AudioContext, MediaStream]> => {
    const audioRecorderContext = new AudioContext({ sampleRate: 16000 });
    console.log("AudioContext sample rate:", audioRecorderContext.sampleRate);
    await audioRecorderContext.audioWorklet.addModule('/pcm-recorder-processor.js');
    const stream = await navigator.mediaDevices.getUserMedia({ audio: { channelCount: 1 } });
    const source = audioRecorderContext.createMediaStreamSource(stream);
    const audioRecorderNode = new AudioWorkletNode(audioRecorderContext, "pcm-recorder-processor");
    source.connect(audioRecorderNode);
    audioRecorderNode.port.onmessage = (event: MessageEvent<Float32Array>) => {
      audioRecorderHandler(event.data);
    };
    return [audioRecorderNode, audioRecorderContext, stream];
  };

  const stopMicrophone = (): void => {
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach((track) => track.stop());
      micStreamRef.current = null;
      console.log("stopMicrophone(): Microphone stopped.");
    }
  };

  const base64ToArray = (base64: string): ArrayBuffer => {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  };

  const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  };

  const sendMessage = async (message: ClientMessage): Promise<void> => {
    try {
      const send_url = `/api/chat/send/${sessionId}`;
      const response = await fetch(send_url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(message)
      });
      if (!response.ok) {
        console.error('Failed to send message:', response.statusText);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const sendBufferedAudio = (): void => {
    if (audioBufferRef.current.length === 0 || !isRecording) {
      return;
    }
    const totalLength = audioBufferRef.current.reduce((sum, chunk) => sum + chunk.length, 0);
    const combinedBuffer = new Uint8Array(totalLength);
    let offset = 0;
    for (const chunk of audioBufferRef.current) {
      combinedBuffer.set(chunk, offset);
      offset += chunk.length;
    }
    sendMessage({
      mime_type: "audio/pcm",
      data: arrayBufferToBase64(combinedBuffer.buffer),
    });
    console.log("[CLIENT TO AGENT] sent %s bytes", combinedBuffer.byteLength);
    audioBufferRef.current = [];
  };

  const audioRecorderHandler = (pcmData: Float32Array): void => {
    if (!isRecording) return;
    const pcm16Data = convertFloat32ToPCM(pcmData);
    audioBufferRef.current.push(new Uint8Array(pcm16Data));
  };

  const startAudio = (): void => {
    setIsAudioMode(true);
    setIsRecording(true);
    startAudioPlayerWorklet().then(([node, ctx]) => {
      audioPlayerNodeRef.current = node;
      audioPlayerContextRef.current = ctx;
    });
    startAudioRecorderWorklet(audioRecorderHandler).then(
      ([node, ctx, stream]) => {
        audioRecorderNodeRef.current = node;
        audioRecorderContextRef.current = ctx;
        micStreamRef.current = stream;
      }
    );
  };

  const stopAudio = (): void => {
    setIsAudioMode(false);
    setIsRecording(false);
    stopMicrophone();
    if (bufferTimerRef.current) {
      clearInterval(bufferTimerRef.current);
      bufferTimerRef.current = null;
    }
    if (audioPlayerContextRef.current && audioPlayerContextRef.current.state !== 'closed') {
      audioPlayerContextRef.current.close();
      audioPlayerContextRef.current = null;
    }
    if (audioRecorderContextRef.current && audioRecorderContextRef.current.state !== 'closed') {
      audioRecorderContextRef.current.close();
      audioRecorderContextRef.current = null;
    }
  };

  // --- useEffect Hook for SSE and cleanup ---
  useEffect(() => {
    if (!isAudioMode) {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        setIsSendButtonEnabled(false);
      }
      return;
    }

    const sse_url = `/api/chat/events/${sessionId}?is_audio=${isAudioMode}`;
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }
    eventSourceRef.current = new EventSource(sse_url);

    eventSourceRef.current.onopen = function () {
      console.log("SSE connection opened.");
      setMessages(prev => ["Connection opened"]);
      setIsSendButtonEnabled(true);
    };

    eventSourceRef.current.onmessage = function (event: MessageEvent) {
      const message_from_server: ServerMessage = JSON.parse(event.data);
      console.log("[AGENT TO CLIENT] ", message_from_server);

      if (message_from_server.turn_complete) {
        currentMessageIdRef.current = null;
        return;
      }

      if (message_from_server.interrupted) {
        if (audioPlayerNodeRef.current) {
          audioPlayerNodeRef.current.port.postMessage({ command: "endOfAudio" });
        }
        return;
      }

      if (message_from_server.mime_type === "audio/pcm" && audioPlayerNodeRef.current && message_from_server.data) {
        audioPlayerNodeRef.current.port.postMessage(base64ToArray(message_from_server.data));
      }

      if (message_from_server.mime_type === "text/plain" && message_from_server.data) {
        if (currentMessageIdRef.current == null) {
          const newId = Math.random().toString(36).substring(7);
          currentMessageIdRef.current = newId;
          const newMessage: Message = { 
            id: newId, 
            text: message_from_server.data,
            role: 'assistant',
            timestamp: new Date()
          };
          setMessages(prevMessages => [...prevMessages, newMessage]);
        } else {
          setMessages(prevMessages =>
            prevMessages.map(msg =>
              typeof msg !== 'string' && msg.id === currentMessageIdRef.current
                ? { ...msg, text: msg.text + message_from_server.data }
                : msg
            )
          );
        }
      }
    };

    eventSourceRef.current.onerror = function (event) {
      console.log("SSE connection error or closed.");
      setIsSendButtonEnabled(false);
      setMessages(prevMessages => [...prevMessages, "Connection closed"]);
      eventSourceRef.current?.close();
    };

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, [isAudioMode, sessionId]);

  useEffect(() => {
    if (isRecording) {
      bufferTimerRef.current = setInterval(sendBufferedAudio, 200);
    } else {
      if (bufferTimerRef.current) {
        clearInterval(bufferTimerRef.current);
        bufferTimerRef.current = null;
      }
    }
    return () => {
      if (bufferTimerRef.current) {
        clearInterval(bufferTimerRef.current);
      }
    };
  }, [isRecording]);

  const handleVoiceToggle = () => {
    if (isAudioMode) {
      stopAudio();
    } else {
      startAudio();
    }
  };

  return (
    <div className="min-h-screen bg-cyber-dark relative overflow-hidden">
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/background.png)' }}
      />
      <div className="fixed inset-0 bg-black/70" />
      <div className="scan-line" />
      <Navigation />
      <div className="relative z-10 flex flex-col h-screen pt-16">
        <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full px-4">
          <div className="flex-1 mb-4 bg-black/40 border-cyber-blue neon-border backdrop-blur-sm rounded-lg overflow-hidden flex flex-col">
            <div className="flex-1 p-6 overflow-y-auto space-y-4 pr-2">
              {messages.length === 0 && (
                <div className="text-center text-cyber-light font-mono py-8 h-full flex flex-col justify-center items-center">
                  <p className="text-lg mb-2">Welcome to the Neural Interface</p>
                  <p className="text-sm opacity-70">Press "CONNECT VOICE" to communicate with Vathsala</p>
                </div>
              )}
              {messages.map((msg, index) => (
                typeof msg === 'string' ? (
                  <div key={`sys-${index}`} className="text-center text-cyber-light/50 text-xs font-mono italic">
                    {msg}
                  </div>
                ) : (
                  <div
                    key={msg.id}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} message-enter`}
                  >
                    <div
                      className={`max-w-[80%] p-4 rounded-lg font-mono ${
                        msg.role === 'user'
                          ? 'bg-cyber-blue/20 border border-cyber-blue text-cyber-light neon-border'
                          : 'bg-cyber-pink/20 border border-cyber-pink text-white neon-border-pink'
                      }`}
                    >
                      <div className="text-sm mb-1 opacity-70">
                        {msg.role === 'user' ? 'USER' : 'VATHSALA'}
                      </div>
                      <div className="whitespace-pre-wrap">{msg.text}</div>
                      <div className="text-xs mt-2 opacity-50">
                        {msg.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                )
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>
          <div className="pb-6 flex justify-center items-center">
            <button
              type="button"
              onClick={handleVoiceToggle}
              disabled={!isAudioMode && !isSendButtonEnabled && messages.length > 0}
              className={`px-8 py-4 font-cyber font-bold rounded-lg transition-all duration-300 flex items-center gap-3 text-lg
                ${isAudioMode 
                  ? 'bg-red-500/20 border-2 border-red-500 text-red-400 neon-border-red hover:bg-red-500/30' 
                  : 'bg-cyber-blue/20 border-2 border-cyber-blue text-cyber-blue neon-border hover:bg-cyber-blue/30'
                }
                disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isAudioMode ? <MicOff /> : <Mic />}
              {isAudioMode ? 'DISCONNECT' : 'CONNECT VOICE'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VathsalaChat;
