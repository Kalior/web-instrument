function createOscilator (freq, gain, startTime, length) {
  oscillator = context.createOscillator();
  oscillator.frequency.value = freq;

  gainNode = context.createGain();
  oscillator.connect(gainNode)
  gainNode.gain.value = gain;
  gainNode.connect(context.destination);
  oscillator.start(startTime);
  oscillator.stop(startTime + length);
}
