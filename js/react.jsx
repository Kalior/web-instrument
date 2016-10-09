import React from 'react';
import {render} from 'react-dom';
import EnvelopeContainer from './envelope.js'
import PianoRollContainer from './pianoRoll.js'
import OverToneSlidersContainer from './overtoneSliders.js'
import LowFrequencyModulationContainer from './lowFrequencyModulation.jsx'


var context;
var timer;
var numberOfBeats = 16;
var numberOfTones = 12;

var toneFreqs = [493.88, 466.16, 440.00, 415.30, 391.995, 369.99, 349.23, 329.628, 311.13, 293.66, 277.18, 261.63];

var globalNotesGrid = [];
var globalOvertonesArray = [];
var globalAttack, globalDecay, globalSustain, globalRelease, globalOvertonesAmount, globalLFOFrequency, globalLFOAmplitude;

class WebInstrument extends React.Component {
  constructor(props) {
    super(props);
    var initialOvertoneGainArray = [];
    for (var i = 0; i <= 25; i++) {
      initialOvertoneGainArray[i] = 0;
    }
    initialOvertoneGainArray[0] = 70;

    var initialNotesGrid = [];
    for (var i = 0; i <= 16; i++) {
      initialNotesGrid[i] = [];
      for (var j = 0; j <= 12; j++) {
        initialNotesGrid[i][j] = false;
      }
    }
    this.state = {notesGrid: initialNotesGrid, overtonesAmount: 10, overtonesArray: initialOvertoneGainArray,
        attack: 10, decay: 20, sustain: 50, release: 30, detuneValue: 0, lfoFrequency: 5, lfoAmplitude: 2};
    this.handePianoRollChange = this.handePianoRollChange.bind(this);
    this.handleAttackChange = this.handleAttackChange.bind(this);
    this.handleDecayChange = this.handleDecayChange.bind(this);
    this.handleSustainChange = this.handleSustainChange.bind(this);
    this.handleReleaseChange = this.handleReleaseChange.bind(this);
    this.handleOvertoneAmountChange = this.handleOvertoneAmountChange.bind(this);
    this.handleOvertoneArrayChange = this.handleOvertoneArrayChange.bind(this);
    this.handleLFOFrequencyChange = this.handleLFOFrequencyChange.bind(this);
    this.handleLFOAmplitudeChange = this.handleLFOAmplitudeChange.bind(this);
  }
  componentDidMount() {
    globalNotesGrid = this.state.notesGrid;
    globalAttack = this.state.attack;
    globalDecay = this.state.decay;
    globalSustain = this.state.sustain;
    globalRelease = this.state.release;
    globalOvertonesAmount = this.state.overtonesAmount;
    globalOvertonesArray = this.state.overtonesArray;
    globalLFOFrequency = this.state.lfoFrequency;
    globalLFOAmplitude = this.state.lfoAmplitude;
  }
  handleAttackChange(newAttack) {
    this.setState({attack: newAttack});
    globalAttack = this.state.attack;
  }
  handleDecayChange(newDecay) {
    this.setState({decay: newDecay});
    globalDecay = this.state.decay;
  }
  handleSustainChange(newSustain) {
    this.setState({sustain: newSustain});
    globalSustain = this.state.sustain;
  }
  handleReleaseChange(newRelease) {
    this.setState({release: newRelease});
    globalRelease = this.state.release;
  }
  handePianoRollChange(newNotesGrid) {
    this.setState({notesGrid: newNotesGrid});
    globalNotesGrid = this.state.notesGrid;
  }
  handleOvertoneAmountChange(newOvertonesAmount) {
    this.setState({overtonesAmount: newOvertonesAmount});
    globalOvertonesAmount = newOvertonesAmount;
  }
  handleOvertoneArrayChange(newOvertonesArray) {
    this.setState({overtonesArray: newOvertonesArray});
    globalOvertonesArray = newOvertonesArray;
  }
  handleLFOFrequencyChange(newFrequency) {
    this.setState({lfoFrequency: newFrequency});
    globalLFOFrequency = newFrequency;
  }
  handleLFOAmplitudeChange(newAmplitude) {
    this.setState({lfoAmplitude: newAmplitude});
    globalLFOAmplitude = newAmplitude;
  }
  render() {
    return (
      <div className="WebInstrument row" id="content">
          <PianoRollContainer onPianoRollChange={this.handePianoRollChange} initialNotesGrid={this.state.notesGrid}/>
          <OverToneSlidersContainer onOvertoneAmountChange={this.handleOvertoneAmountChange} onOvertoneArrayChange={this.handleOvertoneArrayChange}
            initalOvertonesAmount={this.state.overtonesAmount} initialOvertoneGainArray={this.state.overtonesArray}/>
          <EnvelopeContainer onAttackChange={this.handleAttackChange} onDecayChange={this.handleDecayChange}
            onReleaseChange={this.handleReleaseChange} onSustainChange={this.handleSustainChange}/>
          <LowFrequencyModulationContainer onFrequencyChange={this.handleLFOFrequencyChange} onAmplitudeChange={this.handleLFOAmplitudeChange} />
      </div>
    );
  }
}

render(
  <WebInstrument/>,
  document.getElementById('react-web-instrument')
);

// Maintain public array with notes?
$(document).ready(function () {
  try {
    window.AudioContext = window.AudioContext;
    context = new AudioContext();
  }
  catch(e) {
    alert(e);
  }
});

$("#play-sound").click(function () {
  // Setting tempo to 120 BPM just for now
  var tempo = 120.0;
  var secondsPerBeat = 60.0 / tempo;
  if (!timer) {
    playMelody(secondsPerBeat);
    timer = setInterval(function() { playMelody(secondsPerBeat) }, 0.25 * secondsPerBeat * numberOfBeats * 1000);
  }
});

$("#stop-sound").click(function () {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
});

function playMelody (secondsPerBeat) {
  for (var i = 0; i < numberOfTones; i++) {
    for (var j = 0; j < numberOfBeats; j++) {
      if (j > 0) {
        if (globalNotesGrid[i][j] && !globalNotesGrid[i][j-1]) {
          playSound(toneFreqs[i], context.currentTime + 0.25 * j * secondsPerBeat, 0.25 * secondsPerBeat * toneLength(i, j));
        }
      }
      else if (globalNotesGrid[i][j]) {
        playSound(toneFreqs[i], context.currentTime + 0.25 * j * secondsPerBeat, 0.25 * secondsPerBeat * toneLength(i, j));
      }
    }
  }
}

function playSound (freq, startTime, length) {
  var envelopeAttack = length * globalAttack / 100;
  var envelopeDecay = length * globalDecay / 100;
  var envelopeRelease = length * globalRelease / 100;
  var envelopeSustainTime = length - envelopeAttack - envelopeDecay - envelopeRelease;
  var envelopeSustainGain = globalSustain / 100;

  var gainSum = 0;
  for (var i = 0; i <= globalOvertonesAmount; i++) {
    gainSum += globalOvertonesArray[i] / 100;
  }

  var lfo = createLFO();

  for (var i = 0; i < globalOvertonesAmount; i++) {
    createOscilator(lfo, freq * (i+1), globalOvertonesArray[i] / (100 * gainSum), startTime,
      length, envelopeAttack, envelopeDecay, envelopeSustainTime, envelopeRelease, envelopeSustainGain);
  }
}

function toneLength (row, column) {
  if (globalNotesGrid[row][column]) {
    return 1 + toneLength(row, column+1);
  } else {
    return 0;
  }
}

function createOscilator(lfo, freq, gain, startTime, length, attack, decay, sustain, release, envelopeSustainGain) {
  // Gain should be limited so the channel does not distort. Setting to one tenth of the value for now.
  gain = gain / 10;

  var oscillator = context.createOscillator();
  oscillator.frequency.value = freq;
  var envelope = createEnvelope(gain, startTime, attack, decay, sustain, release, envelopeSustainGain);

  lfo.connect(oscillator.frequency);
  oscillator.connect(envelope);
  envelope.connect(context.destination);
  oscillator.start(startTime);
  oscillator.stop(startTime + length);
}


function createEnvelope(gain, startTime, attack, decay, sustain, release, envelopeSustainGain) {
  // Setting the Envelope
  var gainNode = context.createGain();
  gainNode.gain.setValueAtTime(0.0, startTime);
  // Attack
  gainNode.gain.linearRampToValueAtTime(+gain.toFixed(2), startTime + attack);
  // Decay
  gainNode.gain.setTargetAtTime(gain * envelopeSustainGain, startTime + attack, decay * 0.2);
  // Release
  var timeBeforeRelease = startTime + attack + decay;
  if (sustain > 0) {
    timeBeforeRelease += sustain;
  }
  gainNode.gain.setTargetAtTime(0.0, timeBeforeRelease, release * 0.2);

  return gainNode;
}

// A modulator have a oscillator and a gain
function createLFO() {
  var detuneOscillator = context.createOscillator();
  var detuneGain = context.createGain();
  detuneOscillator.frequency.value = globalLFOFrequency;
  detuneGain.gain.value = globalLFOAmplitude;
  detuneOscillator.connect(detuneGain);
  detuneOscillator.start(0);
  return detuneGain;
}
