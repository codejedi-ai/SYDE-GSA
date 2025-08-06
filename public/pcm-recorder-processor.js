class PCMRecorderProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.isRecording = false;
    
    this.port.onmessage = (event) => {
      if (event.data.command === 'start') {
        this.isRecording = true;
      } else if (event.data.command === 'stop') {
        this.isRecording = false;
      }
    };
  }
  
  process(inputs, outputs, parameters) {
    const input = inputs[0];
    
    if (this.isRecording && input.length > 0) {
      const inputChannel = input[0];
      
      // Convert to 16-bit PCM
      const pcmData = new Int16Array(inputChannel.length);
      for (let i = 0; i < inputChannel.length; i++) {
        const sample = Math.max(-1, Math.min(1, inputChannel[i]));
        pcmData[i] = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;
      }
      
      this.port.postMessage({
        command: 'audioData',
        data: pcmData.buffer
      });
    }
    
    return true;
  }
}

registerProcessor('pcm-recorder-processor', PCMRecorderProcessor);
