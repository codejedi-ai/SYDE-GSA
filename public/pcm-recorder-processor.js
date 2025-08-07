class PCMRecorderProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
  }

  process(inputs, outputs, parameters) {
    // We only care about the first input, and the first channel of that input.
    if (inputs.length > 0 && inputs[0].length > 0) {
      const inputChannel = inputs[0][0];
      // A Float32Array of the audio data.
      // We can send this directly to the main thread.
      // It's a copy, so we don't need to worry about it being changed
      // after we send it.
      this.port.postMessage(new Float32Array(inputChannel));
    }
    return true; // Keep processor alive
  }
}

registerProcessor('pcm-recorder-processor', PCMRecorderProcessor);
