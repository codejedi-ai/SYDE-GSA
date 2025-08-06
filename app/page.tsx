"use client";

import { useState, useEffect, useRef } from 'react';
import { Navigation } from '@/components/ui/navigation';
import type { ChangeEvent, FormEvent, MutableRefObject } from 'react';

// --- Type Definitions for a strictly typed component ---
// Define the shape of a single message to be displayed in the UI
interface Message {
  id: string;
  text: string;
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

const ADKStreamingTest: React.FC = () => {
  // --- Audio Worklet Code as strings ---
  const pcmPlayerProcessorCode = `
    class PCMPlayerProcessor extends AudioWorkletProcessor {
      constructor() {
        super();
        this.bufferSize = 24000 * 180;
        this.buffer = new Float32Array(this.bufferSize);
        this.writeIndex = 0;
        this.readIndex = 0;
        this.port.onmessage = (event) => {
          if (event.data.command === 'endOfAudio') {
            this.readIndex = this.writeIndex;
            console.log("endOfAudio received, clearing the buffer.");
            return;
          }
          const int16Samples = new Int16Array(event.data);
          this._enqueue(int16Samples);
        };
      }
      _enqueue(int16Samples) {
        for (let i = 0; i < int16Samples.length; i++) {
          const floatVal = int16Samples[i] / 32768;
          this.buffer[this.writeIndex] = floatVal;
          this.writeIndex = (this.writeIndex + 1) % this.bufferSize;
          if (this.writeIndex === this.readIndex) {
            this.readIndex = (this.readIndex + 1) % this.bufferSize;
          }
        }
      }
      process(inputs, outputs, parameters) {
        const output = outputs[0];
        const framesPerBlock = output[0].length;
        for (let frame = 0; frame < framesPerBlock; frame++) {
          output[0][frame] = this.buffer[this.readIndex];
          if (output.length > 1) {
            output[1][frame] = this.buffer[this.readIndex];
          }
          if (this.readIndex != this.writeIndex) {
            this.readIndex = (this.readIndex + 1) % this.bufferSize;
          }
        }
        return true;
      }
    }
    registerProcessor('pcm-player-processor', PCMPlayerProcessor);
  `;

  const pcmRecorderProcessorCode = `
    class PCMProcessor extends AudioWorkletProcessor {
      constructor() {
        super();
      }
      process(inputs, outputs, parameters) {
        if (inputs.length > 0 && inputs[0].length > 0) {
          const inputChannel = inputs[0][0];
          const inputCopy = new Float32Array(inputChannel);
          this.port.postMessage(inputCopy);
        }
        return true;
      }
    }
    registerProcessor("pcm-recorder-processor", PCMProcessor);
  `;

  // --- State and Refs ---
  const [messages, setMessages] = useState<Array<Message | string>>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [isAudioMode, setIsAudioMode] = useState<boolean>(false);

  // Using useRef with explicit types for DOM elements and other mutable values
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

  // A stable, unique session ID for the component's lifetime
  const sessionId = useRef<string>(Math.random().toString().substring(10)).current;

  // Hardcoded host and port as requested
  const GOOGLE_ADK_CHAT_AGENT_HOST: string = process.env.NEXT_PUBLIC_GOOGLE_ADK_CHAT_AGENT_HOST || "http://localhost:8000";

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
    const blob = new Blob([pcmPlayerProcessorCode], { type: 'application/javascript' });
    const workletURL = URL.createObjectURL(blob);
    await audioContext.audioWorklet.addModule(workletURL);
    const audioPlayerNode = new AudioWorkletNode(audioContext, 'pcm-player-processor');
    audioPlayerNode.connect(audioContext.destination);
    return [audioPlayerNode, audioContext];
  };

  const startAudioRecorderWorklet = async (audioRecorderHandler: (pcmData: ArrayBuffer) => void): Promise<[AudioWorkletNode, AudioContext, MediaStream]> => {
    const audioRecorderContext = new AudioContext({ sampleRate: 16000 });
    console.log("AudioContext sample rate:", audioRecorderContext.sampleRate);
    const blob = new Blob([pcmRecorderProcessorCode], { type: 'application/javascript' });
    const workletURL = URL.createObjectURL(blob);
    await audioRecorderContext.audioWorklet.addModule(workletURL);
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
      const send_url = `${GOOGLE_ADK_CHAT_AGENT_HOST}/send/${sessionId}`;
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
    const sse_url = `${GOOGLE_ADK_CHAT_AGENT_HOST}/events/${sessionId}?is_audio=${isAudioMode}`;
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      console.log("Old SSE connection closed for reconnect.");
    }
    eventSourceRef.current = new EventSource(sse_url);

    eventSourceRef.current.onopen = function () {
      console.log("SSE connection opened.");
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

  // --- Event Handlers with explicit types ---
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
    <main className="min-h-screen bg-cyber-dark relative overflow-hidden">
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

      {/* Main Content - Full Screen Chat */}
      <div className="relative z-10 flex flex-col h-screen pt-16">
        {/* Messages Container - Takes most of the screen */}
        <div className="flex-1 p-4">
          <div
            ref={messagesDivRef}
            className="h-full overflow-y-auto border-2 border-cyber-blue/30 rounded-lg p-6 bg-black/40 backdrop-blur-sm space-y-3"
          >
            {messages.length > 0 ? (
              messages.map((msg, index) => (
                <div 
                  key={typeof msg === 'string' ? `msg-${index}` : msg.id} 
                  className="message-enter comic-text bg-cyber-blue/10 border border-cyber-blue/30 p-3 rounded-lg shadow-lg break-words text-cyber-light font-mono"
                >
                  {typeof msg === 'string' ? msg : msg.text}
                </div>
              ))
            ) : (
              <div className="text-cyber-light/60 text-center italic font-cyber">
                Neural link establishing... Messages will appear here
              </div>
            )}
          </div>
        </div>

        {/* Input Form - Fixed at bottom */}
        <div className="p-4 bg-black/20 backdrop-blur-sm border-t border-cyber-blue/30">
          <form onSubmit={handleMessageSubmit} className="flex flex-col md:flex-row gap-4 max-w-6xl mx-auto">
            <label htmlFor="message" className="sr-only">Message:</label>
            <input
              type="text"
              id="message"
              name="message"
              value={inputValue}
              onChange={handleInputChange}
              placeholder="Enter neural transmission..."
              className="flex-grow p-4 bg-black/60 border-2 border-cyber-blue/50 rounded-lg text-cyber-light font-cyber placeholder-cyber-light/50 focus:outline-none focus:border-cyber-blue focus:shadow-lg focus:shadow-cyber-blue/20 transition-all duration-300"
            />
            <div className="flex gap-4">
              <button
                type="submit"
                id="sendButton"
                disabled={!inputValue.trim() || isAudioMode}
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
    </main>
  );
};

export default ADKStreamingTest;
