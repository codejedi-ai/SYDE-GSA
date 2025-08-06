class PCMPlayerProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.bufferSize = 4096;
    this.buffer = new Float32Array(this.bufferSize);
    this.writeIndex = 0;
    this.readIndex = 0;
    this.availableData = 0;
    
    this.port.onmessage = (event) => {
      if (event.data.command === 'append') {
        this.appendData(event.data.data);
      }
    };
  }
  
  appendData(data) {
    const float32Data = new Float32Array(data);
    
    for (let i = 0; i < float32Data.length; i++) {
      this.buffer[this.writeIndex] = float32Data[i];
      this.writeIndex = (this.writeIndex + 1) % this.bufferSize;
      
      if (this.availableData < this.bufferSize) {
        this.availableData++;
      } else {
        this.readIndex = (this.readIndex + 1) % this.bufferSize;
      }
    }
  }
  
  process(inputs, outputs, parameters) {
    const output = outputs[0];
    const outputChannel = output[0];
    
    for (let i = 0; i < outputChannel.length; i++) {
      if (this.availableData > 0) {
        outputChannel[i] = this.buffer[this.readIndex];
        this.readIndex = (this.readIndex + 1) % this.bufferSize;
        this.availableData--;
      } else {
        outputChannel[i] = 0;
      }
    }
    
    return true;
  }
}

registerProcessor('pcm-player-processor', PCMPlayerProcessor);
