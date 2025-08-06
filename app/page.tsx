"use client";

import { useState, useEffect, useRef } from 'react';
import { Navigation } from '@/components/ui/navigation';
import type { ChangeEvent, FormEvent } from 'react';

// Type Definitions
interface Message {
  id: string;
  text: string;
}

interface ServerMessage {
  turn_complete?: boolean;
  interrupted?: boolean;
  mime_type?: 'audio/pcm' | 'text/plain';
  data?: string;
}

interface ClientMessage {
  mime_type: 'audio/pcm' | 'text/plain';
  data: string;
}

const GalateaChat: React.FC = () => {
  // State and Refs
  const [messages, setMessages] = useState<Array<Message | string>>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [isSendButtonEnabled, setIsSendButtonEnabled] = useState<boolean>(false);
  const [isAudioMode, setIsAudioMode] = useState<boolean>(false);

  const messagesDivRef = useRef<HTMLDivElement | null>(null);
  const eventSourceRef = useRef<EventSource | null>(null);
  const currentMessageIdRef = useRef<string | null>(null);
  const audioPlayerNodeRef = useRef<AudioWorkletNode | null>(null);
  const audioPlayerContextRef = useRef<AudioContext | null>(null);
  const audioRecorderNodeRef = useRef<AudioWorkletNode | null>(null);
  const audioRecorderContextRef = useRef<AudioContext | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const audioBufferRef = useRef<Uint8Array[]>([]);
  const bufferTimerRef = useRef<NodeJS.Timeout | null>(null);

  const sessionId = useRef<string>(Math.random().toString().substring(10)).current;

  // Helper Functions
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
      const response = await fetch(`/api/chat/send/${sessionId}`, {
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

  // useEffect Hook for SSE and cleanup
  useEffect(() => {
    const sse_url = `/api/chat/events/${sessionId}?is_audio=${isAudioMode}`;
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      console.log("Old SSE connection closed for reconnect.");
    }

    eventSourceRef.current = new EventSource(sse_url);
    eventSourceRef.current.onopen = function () {
      console.log("SSE connection opened.");
      setMessages(["Neural link established..."]);
      setIsSendButtonEnabled(true);
    };

    eventSourceRef.current.onmessage = function (event: MessageEvent) {
      const message_from_server: ServerMessage = JSON.parse(event.data);
      console.log("[AGENT TO CLIENT] ", message_from_server);

      if (message_from_server.turn_complete && message_from_server.turn_complete === true) {
        currentMessageIdRef.current = null;
        return;
      }

      if (message_from_server.interrupted && message_from_server.interrupted === true) {
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
          currentMessageIdRef.current = Math.random().toString(36).substring(7);
          setMessages(prevMessages => [...prevMessages, { id: currentMessageIdRef.current, text: message_from_server.data } as Message]);
        } else {
          setMessages(prevMessages =>
            prevMessages.map(msg =>
              typeof msg !== 'string' && msg.id === currentMessageIdRef.current
                ? { ...msg, text: msg.text + message_from_server.data }
                : msg
            )
          );
        }
        if (messagesDivRef.current) {
          messagesDivRef.current.scrollTop = messagesDivRef.current.scrollHeight;
        }
      }
    };

    eventSourceRef.current.onerror = function (event) {
      console.log("SSE connection error or closed.");
      setIsSendButtonEnabled(false);
      setMessages(prevMessages => [...prevMessages, "Neural link severed..."]);
      eventSourceRef.current?.close();
      setTimeout(function () {
        console.log("Reconnecting...");
        if (eventSourceRef.current) {
          eventSourceRef.current = new EventSource(sse_url);
        }
      }, 5000);
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
  }, [isAudioMode]);

  // Event Handlers
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setInputValue(e.target.value);
  };

  const handleMessageSubmit = (e: FormEvent): void => {
    e.preventDefault();
    if (inputValue.trim()) {
      const newMessage: Message = { id: Math.random().toString(36).substring(7), text: `> ${inputValue}` };
      setMessages(prevMessages => [...prevMessages, newMessage]);
      sendMessage({ mime_type: "text/plain", data: inputValue });
      console.log("[CLIENT TO AGENT] " + inputValue);
      setInputValue('');
    }
  };

  const handleStartAudioClick = (): void => {
    setIsAudioMode(true);
    startAudio();
  };

  return (
    <main 
      className="min-h-screen relative"
      style={{
        backgroundImage: 'url(/background.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
      
      {/* Scan line effect */}
      <div className="scan-line"></div>
      
      {/* Navigation */}
      <div className="relative z-10">
        <Navigation />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-4xl">
          {/* Title */}
          <div className="text-center mb-8">
            <h1 
              className="text-6xl font-cyber neon-text glitch mb-4"
              data-text="GALATEA AI"
            >
              GALATEA AI
            </h1>
            <p className="text-cyber-light text-xl font-cyber">
              Neural Interface Active
            </p>
          </div>

          {/* Chat Interface */}
          <div className="comic-panel p-6 mb-6">
            <div
              ref={messagesDivRef}
              className="h-96 overflow-y-auto p-4 mb-4 space-y-3 bg-black/40 rounded-lg border border-cyber-blue/30"
            >
              {messages.length > 0 ? (
                messages.map((msg, index) => (
                  <div 
                    key={typeof msg === 'string' ? `msg-${index}` : msg.id} 
                    className={`message-enter p-3 rounded-lg ${
                      typeof msg === 'string' 
                        ? 'comic-narration' 
                        : msg.text.startsWith('>')
                          ? 'comic-text bg-cyber-blue/20 border-l-4 border-cyber-blue text-cyber-light'
                          : 'comic-text bg-cyber-pink/20 border-l-4 border-cyber-pink text-cyber-light'
                    }`}
                  >
                    {typeof msg === 'string' ? msg : msg.text}
                  </div>
                ))
              ) : (
                <div className="text-cyber-light/60 text-center italic font-cyber">
                  Awaiting neural synchronization...
                </div>
              )}
            </div>

            {/* Input Form */}
            <form onSubmit={handleMessageSubmit} className="flex flex-col md:flex-row gap-4">
              <input
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                placeholder="Enter neural command..."
                className="flex-grow p-4 bg-black/60 border-2 border-cyber-blue/50 rounded-lg text-cyber-light placeholder-cyber-light/50 font-cyber focus:border-cyber-blue focus:outline-none"
                disabled={isAudioMode}
              />
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={!isSendButtonEnabled || !inputValue.trim() || isAudioMode}
                  className="px-8 py-4 bg-cyber-blue/20 text-cyber-blue font-cyber font-bold rounded-lg border-2 border-cyber-blue hover:bg-cyber-blue hover:text-black transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed neon-border"
                >
                  TRANSMIT
                </button>
                <button
                  type="button"
                  onClick={handleStartAudioClick}
                  disabled={isAudioMode}
                  className="px-8 py-4 bg-cyber-pink/20 text-cyber-pink font-cyber font-bold rounded-lg border-2 border-cyber-pink hover:bg-cyber-pink hover:text-black transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed neon-border-pink"
                >
                  {isAudioMode ? "VOICE ACTIVE" : "VOICE MODE"}
                </button>
              </div>
            </form>
          </div>

          {/* Status */}
          <div className="text-center">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${
              isSendButtonEnabled 
                ? 'border-cyber-blue text-cyber-blue' 
                : 'border-cyber-pink text-cyber-pink'
            }`}>
              <div className={`w-2 h-2 rounded-full ${
                isSendButtonEnabled ? 'bg-cyber-blue animate-pulse' : 'bg-cyber-pink'
              }`}></div>
              <span className="font-cyber text-sm">
                {isSendButtonEnabled ? 'NEURAL LINK ACTIVE' : 'RECONNECTING...'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default GalateaChat;
