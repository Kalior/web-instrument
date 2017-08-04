import React from "react";
import EnvelopeContainer from "./envelope.js";
import PianoRollContainer from "./pianoRoll.js";
import OverToneSlidersContainer from "./overtoneSliders.js";
import LowFrequencyModulationContainer from "./lowFrequencyModulation.jsx";
import NameContainer from "./NameContainer.jsx"

export default class WebInstrument extends React.Component {
  constructor(props) {
    super(props);

    this.state = { instrument: props.instrument};
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ instrument: nextProps.instrument });
  }
  handleAttackChange = newAttack => {
    const instrument = this.state.instrument;
    instrument.attack = newAttack;
    this.setState({ instrument: instrument });
    this.props.onInstrumentChange(instrument);
  };
  handleDecayChange = newDecay => {
    const instrument = this.state.instrument;
    instrument.decay = newDecay;
    this.setState({ instrument: instrument });
    this.props.onInstrumentChange(instrument);
  };
  handleSustainChange = newSustain => {
    const instrument = this.state.instrument;
    instrument.sustain = newSustain;
    this.setState({ instrument: instrument });
    this.props.onInstrumentChange(instrument);
  };
  handleReleaseChange = newRelease => {
    const instrument = this.state.instrument;
    instrument.release = newRelease;
    this.setState({ instrument: instrument });
    this.props.onInstrumentChange(instrument);
  };
  handePianoRollChange = newNotesGrid => {
    const instrument = this.state.instrument;
    instrument.notesGrid = newNotesGrid;
    this.setState({ instrument: instrument });
    this.props.onInstrumentChange(instrument);
  };
  handleOvertoneAmountChange = newOvertonesAmount => {
    const instrument = this.state.instrument;
    instrument.overtonesAmount = newOvertonesAmount;
    this.setState({ instrument: instrument });
    this.props.onInstrumentChange(instrument);
  };
  handleOvertoneArrayChange = newOvertonesArray => {
    const instrument = this.state.instrument;
    instrument.overtonesArray = newOvertonesArray;
    this.setState({ instrument: instrument });
    this.props.onInstrumentChange(instrument);
  };
  handleLFMFrequencyChange = newLFMFrequency => {
    const instrument = this.state.instrument;
    instrument.lfmFrequency = newLFMFrequency;
    this.setState({ instrument: instrument });
    this.props.onInstrumentChange(instrument);
  };
  handleLFMAmplitudeChange = newLFMAmplitude => {
    const instrument = this.state.instrument;
    instrument.lfmAmplitude = newLFMAmplitude;
    this.setState({ instrument: instrument });
    this.props.onInstrumentChange(instrument);
  };
  handleFrequencyArrayChange = newFrequencyArray => {
    const instrument = this.state.instrument;
    instrument.frequencyArray = newFrequencyArray;
    this.setState({ instrument: instrument });
    this.props.onInstrumentChange(instrument);
  };
  handleNameChange = newName => {
    const instrument = this.state.instrument
    instrument.name = newName;
    this.setState({ name: newName });
    this.props.onInstrumentChange(instrument);
  }
  render() {
    const {
      name,
      overtonesAmount,
      overtonesArray,
      notesGrid,
      frequencyArray,
      lfmFrequency,
      lfmAmplitude,
      attack,
      release,
      sustain,
      decay
    } = this.state.instrument;
    const { currentBeat } = this.props;
    return (
      <div className="instrument-inner-container">
        <NameContainer
          name={name}
          onNameChange={this.handleNameChange}
        />
        <div className="web-instrument">
          <OverToneSlidersContainer
            onOvertoneAmountChange={this.handleOvertoneAmountChange}
            onOvertoneArrayChange={this.handleOvertoneArrayChange}
            overtonesAmount={overtonesAmount}
            overtoneGainArray={overtonesArray}
            name={name}
          />
          <PianoRollContainer
            onPianoRollChange={this.handePianoRollChange}
            notesGrid={notesGrid}
            currentBeat={currentBeat}
            frequencyArray={frequencyArray}
            onFrequencyArrayChange={this.handleFrequencyArrayChange}
            name={name}
          />
          <EnvelopeContainer
            attack={attack}
            release={release}
            sustain={sustain}
            decay={decay}
            onAttackChange={this.handleAttackChange}
            onDecayChange={this.handleDecayChange}
            onReleaseChange={this.handleReleaseChange}
            onSustainChange={this.handleSustainChange}
            name={name}
          />
          <LowFrequencyModulationContainer
            lfmFrequency={lfmFrequency}
            lfmAmplitude={lfmAmplitude}
            onFrequencyChange={this.handleLFMFrequencyChange}
            onAmplitudeChange={this.handleLFMAmplitudeChange}
            name={name}
          />
        </div>
      </div>
    );
  }
}
