class PCMPlayerProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.bufferSize = 4096;
    this.buffer = new Float32Array(this.bufferSize);
    this.writeIndex = 0;
    this.readIndex = 0;
    this.samplesInBuffer = 0;
    
    this.port.onmessage = (event) => {
      if (event.data.command === "endOfAudio") {
        // Clear the buffer when audio ends
        this.buffer.fill(0);
        this.writeIndex = 0;
        this.readIndex = 0;
        this.samplesInBuffer = 0;
        return;
      }
      
      const pcmData = new Int16Array(event.data);
      const floatData = new Float32Array(pcmData.length);
      
      // Convert PCM16 to Float32
      for (let i = 0; i < pcmData.length; i++) {
        floatData[i] = pcmData[i] / 32768.0;
      }
      
      // Add to circular buffer
      for (let i = 0; i < floatData.length; i++) {
        if (this.samplesInBuffer < this.bufferSize) {
          this.buffer[this.writeIndex] = floatData[i];
          this.writeIndex = (this.writeIndex + 1) % this.bufferSize;
          this.samplesInBuffer++;
        }
      }
    };
  }
  
  process(inputs, outputs, parameters) {
    const output = outputs[0];
    const outputChannel = output[0];
    
    for (let i = 0; i < outputChannel.length; i++) {
      if (this.samplesInBuffer > 0) {
        outputChannel[i] = this.buffer[this.readIndex];
        this.readIndex = (this.readIndex + 1) % this.bufferSize;
        this.samplesInBuffer--;
      } else {
        outputChannel[i] = 0;
      }
    }
    
    return true;
  }
}

registerProcessor('pcm-player-processor', PCMPlayerProcessor);
