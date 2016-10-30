import React from 'react';
import Rcslider from 'rc-slider-colored';

export default class LowFrequencyModulationContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {frequency: 5, amplitude: 2};
    this.onFrequencyChange = this.onFrequencyChange.bind(this);
    this.onAmplitudeChange = this.onAmplitudeChange.bind(this);
  }
  onFrequencyChange(value) {
    this.setState({frequency: value});
    this.props.onFrequencyChange(value);
  }
  onAmplitudeChange(value) {
    this.setState({amplitude: value});
    this.props.onAmplitudeChange(value);
  }
  render() {
    return(
      <div className="container column small-12 medium-6">
        <h4>Low frequency modulation</h4>
        <b>Frequency of modulation</b>
        <Rcslider min={0} max={20} defaultValue={this.state.frequency} step={0.1} marks={{0: '0 hz', 20: '20 hz'}}
          onAfterChange={this.onFrequencyChange}/>
        <b>Amplitude of modulation</b>
        <Rcslider min={0} max={40} defaultValue={this.state.amplitude} step={0.1} marks={{0: '0', 40: '40'}}
          onAfterChange={this.onAmplitudeChange}/>
      </div>
    );
  }
}
