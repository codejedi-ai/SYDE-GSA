"use client";

import { useState, useEffect, useRef } from 'react';
import { Navigation } from '@/components/ui/navigation';
import type { ChangeEvent, FormEvent } from 'react';

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
  const [inputValue, setInputValue] = useState<string>('');
  const [isSendButtonEnabled, setIsSendButtonEnabled] = useState<boolean>(false);
  const [isAudioMode, setIsAudioMode] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);

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
      const pcmData = convertFloat32ToPCM(event.data);
      audioRecorderHandler(pcmData);
    };
    return [audioRecorderNode, audioRecorderContext, stream];
  };

  const stopMicrophone = (micStream: MediaStream): void => {
    micStream.getTracks().forEach((track) => track.stop());
    console.log("stopMicrophone(): Microphone stopped.");
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
      // Use the local API route to send messages
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
    if (audioBufferRef.current.length === 0) {
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

  const audioRecorderHandler = (pcmData: ArrayBuffer): void => {
    audioBufferRef.current.push(new Uint8Array(pcmData));
    if (!bufferTimerRef.current) {
      bufferTimerRef.current = setInterval(sendBufferedAudio, 200);
    }
  };

  const startAudio = (): void => {
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

  // --- useEffect Hook for SSE and cleanup ---
  useEffect(() => {
    // Use the local API route for the event stream
    const sse_url = `/api/chat/events/${sessionId}?is_audio=${isAudioMode}`;
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      console.log("Old SSE connection closed for reconnect.");
    }
    eventSourceRef.current = new EventSource(sse_url);

    eventSourceRef.current.onopen = function () {
      console.log("SSE connection opened.");
      setMessages(prev => [...prev, "Connection opened"]);
      setIsSendButtonEnabled(true); // This will now be called, enabling the button
    };

    eventSourceRef.current.onmessage = function (event: MessageEvent) {
      const message_from_server: ServerMessage = JSON.parse(event.data);
      console.log("[AGENT TO CLIENT] ", message_from_server);

      if (message_from_server.turn_complete) {
        currentMessageIdRef.current = null;
        setIsLoading(false);
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
      console.log("Component unmounting or isAudioMode changed. Cleaning up SSE.");
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
      if (bufferTimerRef.current) {
        clearInterval(bufferTimerRef.current);
      }
      if (micStreamRef.current) {
        stopMicrophone(micStreamRef.current);
      }
    };
  }, [isAudioMode, sessionId]);

  // --- Event Handlers with explicit types ---
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setInputValue(e.target.value);
  };

  const handleMessageSubmit = (e: FormEvent): void => {
    e.preventDefault();
    if (inputValue.trim() && isSendButtonEnabled) {
      const newMessage: Message = { 
        id: Math.random().toString(36).substring(7), 
        text: inputValue,
        role: 'user',
        timestamp: new Date()
      };
      setMessages(prevMessages => [...prevMessages, newMessage]);
      sendMessage({ mime_type: "text/plain", data: inputValue });
      console.log("[CLIENT TO AGENT] " + inputValue);
      setInputValue('');
      setIsLoading(true);
    }
  };

  const handleStartAudioClick = (): void => {
    setIsAudioMode(true);
    startAudio();
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
                <div className="text-center text-cyber-light font-mono py-8">
                  <p className="text-lg mb-2">Welcome to the Neural Interface</p>
                  <p className="text-sm opacity-70">Begin transmission to communicate with Vathsala</p>
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
              {isLoading && (
                <div className="flex justify-start message-enter">
                  <div className="bg-cyber-pink/20 border border-cyber-pink text-white neon-border-pink p-4 rounded-lg font-mono">
                    <div className="text-sm mb-1 opacity-70">VATHSALA</div>
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
          </div>
          <div className="pb-6">
            <form onSubmit={handleMessageSubmit} className="flex flex-col md:flex-row gap-4">
              <label htmlFor="message" className="sr-only">Message:</label>
              <input
                type="text"
                id="message"
                name="message"
                value={inputValue}
                onChange={handleInputChange}
                placeholder="Enter neural transmission..."
                className="flex-grow p-4 bg-black/60 border-2 border-cyber-blue/50 rounded-lg text-cyber-light font-mono placeholder-cyber-light/50 focus:outline-none focus:border-cyber-blue focus:shadow-lg focus:shadow-cyber-blue/20 transition-all duration-300"
              />
              <div className="flex gap-4">
                <button
                  type="submit"
                  id="sendButton"
                  disabled={!isSendButtonEnabled || !inputValue.trim() || isAudioMode}
                  className="px-8 py-4 bg-cyber-blue/20 border-2 border-cyber-blue text-cyber-blue font-cyber font-bold rounded-lg neon-border hover:bg-cyber-blue/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-cyber-blue/20"
                >
                  TRANSMIT
                </button>
                <button
                  type="button"
                  id="startAudioButton"
                  onClick={handleStartAudioClick}
                  disabled={isAudioMode}
                  className="px-8 py-4 bg-cyber-pink/20 border-2 border-cyber-pink text-cyber-pink font-cyber font-bold rounded-lg neon-border-pink hover:bg-cyber-pink/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-cyber-pink/20"
                >
                  {isAudioMode ? "VOICE ACTIVE" : "VOICE MODE"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VathsalaChat;
