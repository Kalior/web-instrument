import React from "react";
import { render } from "react-dom";
import WebInstrument from "./WebInstrument.jsx";

const NUMBER_OF_BEATS = 16;
const toneFrequencies = [
  123.47,
  130.81,
  138.59,
  146.83,
  155.56,
  164.81,
  174.61,
  185,
  196,
  207.65,
  220,
  233.08,
  246.94,
  261.63,
  277.18,
  293.66,
  311.13,
  329.63,
  349.23,
  369.99,
  392,
  415.3,
  440,
  466.16,
  493.88,
  523.25
];

export default class MainView extends React.Component {
  constructor(props) {
    super(props);

    let initialPlayWorker = new Worker("js/playWorker.js");
    initialPlayWorker.onmessage = this.onPlayWorkerMessage;

    this.state = {
      context: null,
      limiter: null,
      playing: false,
      playWorker: initialPlayWorker,
      currentBeat: 0,
      selectedInstrumentIndex: 0,
      playing: false,
      numberOfBeats: 16,
      instruments : [this.createInstrument("Instrument")]
    };
  }

  createInstrument = (name) => {
    const numerOfNotes = 26
    const initialOvertoneGainArray = [];
    for (let i = 0; i <= 25; i++) {
      initialOvertoneGainArray[i] = 0;
    }
    initialOvertoneGainArray[0] = 70;

    const initialNotesGrid = [];
    for (let i = 0; i < 16; i++) {
      initialNotesGrid[i] = [];
      for (let j = 0; j <= numerOfNotes; j++) {
        initialNotesGrid[i][j] = false;
      }
    }

    let initialFrequencyArray = [];
    for (let i = 0; i <= numerOfNotes; i++) {
      initialFrequencyArray[i] = false;
    }

    // Standard C scale
    initialFrequencyArray[13] = initialFrequencyArray[15] = initialFrequencyArray[17] = initialFrequencyArray[18] = initialFrequencyArray[20] = initialFrequencyArray[22] = initialFrequencyArray[24] = initialFrequencyArray[25] = true;
    let initialInstrument = {
      notesGrid: initialNotesGrid,
      overtonesAmount: 10,
      overtonesArray: initialOvertoneGainArray,
      attack: 10,
      decay: 20,
      sustain: 50,
      release: 30,
      detuneValue: 0,
      lfmFrequency: 5,
      lfmAmplitude: 2,
      frequencyArray: initialFrequencyArray,
      name: name
    };
    return initialInstrument;
  }

  changeActiveInstrument = (index) => {
    this.setState({selectedInstrumentIndex: index})
  }

  render() {
    const { context, playing, currentBeat, selectedInstrumentIndex, instruments } = this.state;
    const selectedInstrument = instruments[selectedInstrumentIndex];
    return (
      <div id="content">
        <WebInstrument
          onInstrumentChange={this.handleInstrumentChange.bind(this, selectedInstrumentIndex)}
          instrument={selectedInstrument}
          currentBeat={currentBeat}
        />
        <div className="instrument-picker">
          {instruments.map((instrument, index) => this.createTopInstrument(instrument, index))}
          <div
            className="new-instrument"
            onClick={this.addInstrument}
          >
            <i className="fa fa-plus-square fa-3x" aria-hidden="true" />
          </div>
        </div>
      </div>
    );
  }
  addInstrument = () => {
    let { instruments, context } = this.state;
    const name = "Instrument " + instruments.length
    const newInstrument = this.createInstrument(name, context);
    instruments.push(newInstrument);
    this.setState({instruments: instruments})
  }
  createTopInstrument = (instrument, index) => {
    const {selectedInstrumentIndex} = this.state;
    return (
      <div
        className={index === this.state.selectedInstrumentIndex ?
                                "top-instrument active-instrument" :
                                "top-instrument"}
        onClick={this.changeActiveInstrument.bind(this, index)}
        key={index}
      >
        {instrument.name}
      </div>
    );
  }
  handleInstrumentChange = (instrumentIndex, newInstrument) => {
    let newInstruments = this.state.instruments;
    newInstruments[instrumentIndex] = newInstrument;
    this.setState({instruments: newInstruments});
  }
  readyContext = () => {
    try {
      window.AudioContext = window.AudioContext;
      const context = new AudioContext();
      const limiter = this.createLimiter(context);
      this.setState({ limiter: limiter, context: context });
    } catch (e) {
      alert(e);
    }
  };
  componentDidMount() {
    this.readyContext();
    $("#play-sound").click(this.startPlaying);
    $("#stop-sound").click(this.stopPlaying);
  }
  startPlaying = () => {
    var tempo = 120.0;
    var secondsPerBeat = 60.0 / tempo;
    if (!this.state.playing) {
      this.setState({
        playing: true,
        currentBeat: 0
      });
      this.state.playWorker.postMessage([
        true,
        secondsPerBeat,
        NUMBER_OF_BEATS
      ]);
    }
  };
  stopPlaying = () => {
    if (this.state.playing) {
      this.state.playWorker.postMessage([false]);
      this.setState({ playing: false });
    }
  };
  onPlayWorkerMessage = e => {
    const currentBeat = e.data
    this.setState({ currentBeat: currentBeat });
    const tempo = 120.0;
    const secondsPerBeat = 60.0 / tempo;
    const { limiter, context, instruments } = this.state;
    // Play the current beat for all instruments.
    for (let i = 0; i < instruments.length; i++) {
      this.playMelodyBeat(secondsPerBeat, currentBeat, limiter, context, instruments[i]);
    }
  };
  componentWillUnmount() {
    this.state.playWorker.terminate();
  };
  playMelodyBeat(secondsPerBeat, currentBeat, limiter, context, instrument) {
    for (let i = 0; i < instrument.frequencyArray.length - 1; i++) {
      if (currentBeat > 0) {
        if (
          instrument.frequencyArray[i] &&
          instrument.notesGrid[currentBeat][i] &&
          !instrument.notesGrid[currentBeat - 1][i]
        ) {
          this.playSound(
            toneFrequencies[i],
            context.currentTime,
            0.25 * secondsPerBeat * this.toneLength(i, currentBeat, instrument.notesGrid),
            limiter,
            context,
            instrument
          );
        }
      } else if (
        instrument.frequencyArray[i] &&
        instrument.notesGrid[currentBeat][i]
      ) {
        this.playSound(
          toneFrequencies[i],
          context.currentTime,
          0.25 * secondsPerBeat * this.toneLength(i, currentBeat, instrument.notesGrid),
          limiter,
          context,
          instrument
        );
      }
    }
  }
  playSound = (freq, startTime, length, limiter, context, instrument) => {
    var gainSum = 0;
    for (let i = 0; i <= instrument.overtonesAmount; i++) {
      gainSum += instrument.overtonesArray[i] / 100;
    }
    const { lfmFrequency, lfmAmplitude } = instrument;
    const lfm = this.createLFM(lfmFrequency, lfmAmplitude, context);

    const { attack, decay, release, sustain } = instrument;
    const envelope = this.createEnvelope(1, startTime, length,
      attack, decay, release, sustain, context);

    for (let i = 0; i < instrument.overtonesAmount; i++) {
      const source = this.createSource(
        instrument.overtonesArray[i] / (100 * gainSum * 2),
        freq * (i + 1),
        startTime,
        length,
        context
      );
      lfm.connect(source.oscillator.frequency);
      source.gain.connect(envelope);
      envelope.connect(limiter);
    }
  };
  toneLength = (note, beat, notesGrid) => {
    let length = 0;
    let currentBeat = beat;
    let playing = true;
    while (playing && currentBeat < notesGrid.length) {
      if (notesGrid[currentBeat][note]) {
        length++;
        currentBeat++;
      } else {
        playing = false;
      }
    }
    return length;
  };
  createSource = (gain, freq, startTime, length, context) => {
    var oscillator = context.createOscillator();
    var gainNode = context.createGain();

    gainNode.gain.value = gain;

    oscillator.frequency.value = freq;

    oscillator.start(startTime);
    oscillator.stop(startTime + length + 0.1);
    oscillator.connect(gainNode);

    return {
      oscillator: oscillator,
      gain: gainNode
    };
  };
  createEnvelope = (gain, startTime, length, attack, decay, release, sustain, context) => {
    var attack = attack / 100;
    var decay = decay / 100;
    var release = release / 100;
    var sustainTime = length - attack - decay - release;
    var sustainGain = sustain / 100;
    // Setting the Envelope
    var gainNode = context.createGain();
    gainNode.gain.setValueAtTime(0.0, startTime);

    if (length > attack) {
      // Attack
      gainNode.gain.linearRampToValueAtTime(gain, startTime + attack);
      // Decay
      gainNode.gain.setTargetAtTime(
        gain * sustainGain,
        startTime + attack,
        decay * 0.2
      );
      // Release
      var timeBeforeRelease =
        startTime + attack + decay + Math.max(0, sustainTime);

      gainNode.gain.setTargetAtTime(0.0, timeBeforeRelease, release * 0.2);
    } else {
      // If the attack is longer than the length of the note, we only have
      // time for a part of the attack.
      // Attack
      gainNode.gain.linearRampToValueAtTime(
        gain * length / attack,
        startTime + length
      );
    }

    // Make sure the note does not clip
    gainNode.gain.linearRampToValueAtTime(0.0, startTime + length + 0.1);

    return gainNode;
  };
  // A modulator have a oscillator and a gain
  createLFM = (lfmFrequency, lfmAmplitude, context) => {
    var detuneOscillator = context.createOscillator();
    var detuneGain = context.createGain();
    detuneOscillator.frequency.value = lfmFrequency;
    detuneGain.gain.value = lfmAmplitude;
    detuneOscillator.connect(detuneGain);
    detuneOscillator.start(0);
    return detuneGain;
  };
  createLimiter = context => {
    var limiter = context.createDynamicsCompressor();

    limiter.threshold.value = 0.0; // this is the pitfall, leave some headroom
    limiter.knee.value = 0.0; // brute force
    limiter.ratio.value = 20.0; // max compression
    limiter.attack.value = 0.005; // 5ms attack
    limiter.release.value = 0.05; // 50ms release

    limiter.connect(context.destination);

    return limiter;
  };
}

render(<MainView />, document.getElementById("react-web-instrument"));
