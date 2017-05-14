import React from 'react'
import {render} from 'react-dom'
import EnvelopeContainer from './envelope.js'
import PianoRollContainer from './pianoRoll.js'
import OverToneSlidersContainer from './overtoneSliders.js'
import LowFrequencyModulationContainer from './lowFrequencyModulation.jsx'

var toneFrequencies = [
  123.47, 130.81, 138.59, 146.83, 155.56, 164.81, 174.61, 185, 196, 207.65, 220, 233.08, 246.94,
  261.63, 277.18, 293.66, 311.13, 329.63, 349.23, 369.99, 392, 415.3, 440, 466.16, 493.88, 523.25
]

class WebInstrument extends React.Component {
  constructor (props) {
    super(props)
    var initialOvertoneGainArray = []
    for (var i = 0; i <= 25; i++) {
      initialOvertoneGainArray[i] = 0
    }
    initialOvertoneGainArray[0] = 70

    var initialNotesGrid = []
    for (var i = 0; i < 16; i++) {
      initialNotesGrid[i] = []
      for (var j = 0; j <= toneFrequencies.length; j++) {
        initialNotesGrid[i][j] = false
      }
    }

    let initialFrequencyArray = []
    for (let i = 0; i <= toneFrequencies.length; i++) {
      initialFrequencyArray[i] = false
    }

    // Standard C scale
    initialFrequencyArray[13] = initialFrequencyArray[15] = initialFrequencyArray[17] =
      initialFrequencyArray[18] = initialFrequencyArray[20] = initialFrequencyArray[22] =
      initialFrequencyArray[24] = initialFrequencyArray[25] = true

    this.handePianoRollChange = this.handePianoRollChange.bind(this)
    this.handleAttackChange = this.handleAttackChange.bind(this)
    this.handleDecayChange = this.handleDecayChange.bind(this)
    this.handleSustainChange = this.handleSustainChange.bind(this)
    this.handleReleaseChange = this.handleReleaseChange.bind(this)
    this.handleOvertoneAmountChange = this.handleOvertoneAmountChange.bind(this)
    this.handleOvertoneArrayChange = this.handleOvertoneArrayChange.bind(this)
    this.handleLFMFrequencyChange = this.handleLFMFrequencyChange.bind(this)
    this.handleLFMAmplitudeChange = this.handleLFMAmplitudeChange.bind(this)
    this.playSound = this.playSound.bind(this)
    this.toneLength = this.toneLength.bind(this)
    this.createSource = this.createSource.bind(this)
    this.createEnvelope = this.createEnvelope.bind(this)
    this.createLFM = this.createLFM.bind(this)
    this.startPlaying = this.startPlaying.bind(this)
    this.stopPlaying = this.stopPlaying.bind(this)
    this.readyContext = this.readyContext.bind(this)
    this.createLimiter = this.createLimiter.bind(this)
    this.playMelodyBeat = this.playMelodyBeat.bind(this)
    this.onPlayWorkerMessage = this.onPlayWorkerMessage.bind(this)
    this.handleFrequencyArrayChange = this.handleFrequencyArrayChange.bind(this)

    var initialPlayWorker = new Worker("js/playWorker.js")
    initialPlayWorker.onmessage = this.onPlayWorkerMessage

    this.state = {
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
      context: null,
      playWorker: initialPlayWorker,
      playing: false,
      numberOfBeats: 16,
      currentBeat: 0,
      limiter: null,
      frequencyArray: initialFrequencyArray
    }
  }
  componentDidMount () {
    this.readyContext()
    $('#play-sound').click(this.startPlaying)
    $('#stop-sound').click(this.stopPlaying)
  }
  onPlayWorkerMessage (e) {
    var tempo = 120.0
    var secondsPerBeat = 60.0 / tempo
    this.setState({currentBeat: e.data})
    this.playMelodyBeat(secondsPerBeat, this.state.limiter)
  }
  startPlaying () {
    var tempo = 120.0
    var secondsPerBeat = 60.0 / tempo
    if (!this.state.playing) {
      this.setState({
        playing: true,
        currentBeat: 0,
        limiter: this.createLimiter()
      })
      this.state.playWorker.postMessage([true, secondsPerBeat, this.state.numberOfBeats])
    }
  }
  stopPlaying () {
    if (this.state.playing) {
      this.state.playWorker.postMessage([false])
      this.setState({playing: false})
    }
  }
  readyContext () {
    try {
      window.AudioContext = window.AudioContext
      this.setState({context: new AudioContext()})
    }
    catch (e) {
      alert(e)
    }
  }
  handleAttackChange (newAttack) {
    this.setState({attack: newAttack})
  }
  handleDecayChange (newDecay) {
    this.setState({decay: newDecay})
  }
  handleSustainChange (newSustain) {
    this.setState({sustain: newSustain})
  }
  handleReleaseChange (newRelease) {
    this.setState({release: newRelease})
  }
  handePianoRollChange (newNotesGrid) {
    this.setState({notesGrid: newNotesGrid})
  }
  handleOvertoneAmountChange (newOvertonesAmount) {
    this.setState({overtonesAmount: newOvertonesAmount})
  }
  handleOvertoneArrayChange (newOvertonesArray) {
    this.setState({overtonesArray: newOvertonesArray})
  }
  handleLFMFrequencyChange (newFrequency) {
    this.setState({lfmFrequency: newFrequency})
  }
  handleLFMAmplitudeChange (newAmplitude) {
    this.setState({lfmAmplitude: newAmplitude})
  }
  handleFrequencyArrayChange (newFrequencyArray) {
    this.setState({frequencyArray: newFrequencyArray})
  }

  render () {
    return (
      <div className='WebInstrument row' id='content'>
        <OverToneSlidersContainer onOvertoneAmountChange={this.handleOvertoneAmountChange}
          onOvertoneArrayChange={this.handleOvertoneArrayChange}
          initalOvertonesAmount={this.state.overtonesAmount}
          initialOvertoneGainArray={this.state.overtonesArray} />
        <PianoRollContainer onPianoRollChange={this.handePianoRollChange} initialNotesGrid={this.state.notesGrid}
          currentBeat={this.state.currentBeat} frequencyArray={this.state.frequencyArray}
          onFrequencyArrayChange={this.handleFrequencyArrayChange} />
        <EnvelopeContainer onAttackChange={this.handleAttackChange} onDecayChange={this.handleDecayChange}
          onReleaseChange={this.handleReleaseChange} onSustainChange={this.handleSustainChange} />
        <LowFrequencyModulationContainer onFrequencyChange={this.handleLFMFrequencyChange}
          onAmplitudeChange={this.handleLFMAmplitudeChange} />
      </div>
    )
  }
  playMelodyBeat (secondsPerBeat, limiter) {
    for (var i = 0; i < this.state.frequencyArray.length - 1; i++) {
      if (this.state.currentBeat > 0) {
        if (this.state.frequencyArray[i] &&
          this.state.notesGrid[this.state.currentBeat][i] &&
          !this.state.notesGrid[this.state.currentBeat - 1][i]) {
          this.playSound(
            toneFrequencies[i],
            this.state.context.currentTime,
            0.25 * secondsPerBeat * this.toneLength(i, this.state.currentBeat),
            limiter
          )
        }
      } else if (this.state.frequencyArray[i] &&
        this.state.notesGrid[this.state.currentBeat][i]) {
        this.playSound(
          toneFrequencies[i],
          this.state.context.currentTime,
          0.25 * secondsPerBeat * this.toneLength(i, this.state.currentBeat),
          limiter
        )
      }
    }
  }
  playSound (freq, startTime, length, limiter) {
    var gainSum = 0
    for (let i = 0; i <= this.state.overtonesAmount; i++) {
      gainSum += this.state.overtonesArray[i] / 100
    }

    var lfm = this.createLFM()
    var envelope = this.createEnvelope(1, startTime, length)

    for (let i = 0; i < this.state.overtonesAmount; i++) {
      var source = this.createSource(this.state.overtonesArray[i] / (100 * gainSum * 2), freq * (i + 1), startTime, length)
      lfm.connect(source.oscillator.frequency)
      source.gain.connect(envelope)
      envelope.connect(limiter)
    }
  }
  toneLength (note, beat) {
    let length = 0
    let currentBeat = beat
    let playing = true
    while (playing && currentBeat < this.state.notesGrid.length) {
      if (this.state.notesGrid[currentBeat][note]) {
        length++
        currentBeat++
      } else {
        playing = false
      }
    }
    return length
  }
  createSource (gain, freq, startTime, length) {
    var oscillator = this.state.context.createOscillator()
    var gainNode = this.state.context.createGain()

    gainNode.gain.value = gain

    oscillator.frequency.value = freq

    oscillator.start(startTime)
    oscillator.stop(startTime + length + 0.1)
    oscillator.connect(gainNode)

    return ({
      oscillator: oscillator,
      gain: gainNode
    })
  }
  createEnvelope (gain, startTime, length) {
    var attack = this.state.attack / 100
    var decay = this.state.decay / 100
    var release = this.state.release / 100
    var sustainTime = length - attack - decay - release
    var sustainGain = this.state.sustain / 100
    // Setting the Envelope
    var gainNode = this.state.context.createGain()
    gainNode.gain.setValueAtTime(0.0, startTime)

    if (length > attack) {
      // Attack
      gainNode.gain.linearRampToValueAtTime(gain, startTime + attack)
      // Decay
      gainNode.gain.setTargetAtTime(gain * sustainGain, startTime + attack, decay * 0.2)
      // Release
      var timeBeforeRelease = startTime + attack + decay + Math.max(0, sustainTime)

      gainNode.gain.setTargetAtTime(0.0, timeBeforeRelease, release * 0.2)
    } else {
      // If the attack is longer than the length of the note, we only have
      // time for a part of the attack.
      // Attack
      gainNode.gain.linearRampToValueAtTime(gain * length / attack, startTime + length)
    }

    // Make sure the note does not clip
    gainNode.gain.linearRampToValueAtTime(0.0, startTime + length + 0.1)

    return gainNode
  }
  // A modulator have a oscillator and a gain
  createLFM () {
    var detuneOscillator = this.state.context.createOscillator()
    var detuneGain = this.state.context.createGain()
    detuneOscillator.frequency.value = this.state.lfmFrequency
    detuneGain.gain.value = this.state.lfmAmplitude
    detuneOscillator.connect(detuneGain)
    detuneOscillator.start(0)
    return detuneGain
  }
  createLimiter () {
    var limiter = this.state.context.createDynamicsCompressor()

    limiter.threshold.value = 0.0 // this is the pitfall, leave some headroom
    limiter.knee.value = 0.0 // brute force
    limiter.ratio.value = 20.0 // max compression
    limiter.attack.value = 0.005 // 5ms attack
    limiter.release.value = 0.050 // 50ms release

    limiter.connect(this.state.context.destination)

    return limiter
  }
  componentWillUnmount () {
    this.state.playWorker.terminate()
  }
}

render(
  <WebInstrument />,
  document.getElementById('react-web-instrument')
)
