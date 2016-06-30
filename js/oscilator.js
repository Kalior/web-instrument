function createOscilator (freq, gain, startTime, length, attack, decay, sustain, release, envelopeSustainGain) {
  // Gain should be limited so the channel does not distort. Setting to one tenth of the value for now.
  gain = gain / 10;

  var oscillator = context.createOscillator();
  oscillator.frequency.value = freq;

  // Setting the Envelope
  var gainNode = context.createGain();
  gainNode.gain.setValueAtTime(0.0, 0);
  // Attack
  gainNode.gain.linearRampToValueAtTime(gain, startTime + attack);
  // Decay
  gainNode.gain.setTargetAtTime(gain * envelopeSustainGain, startTime + attack, decay * 0.2);
  // Release
  var timeBeforeRelease = startTime + attack + decay;
  if (release > 0) {
    timeBeforeRelease += sustain;
  }
  gainNode.gain.setTargetAtTime(0.0, timeBeforeRelease, release * 0.2);

  gainNode.connect(context.destination);
  oscillator.connect(gainNode)
  oscillator.start(startTime);
  oscillator.stop(startTime + length);
}
