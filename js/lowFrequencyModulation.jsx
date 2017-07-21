import React from "react";
import Rcslider from "rc-slider-colored";

export default class LowFrequencyModulationContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newFrequency: this.props.lfmFrequency,
      newAmplitude: this.props.lfmAmplitude,
      name: this.props.name
    }
  }
  componentWillReceiveProps(nextProps) {
    const { nane } = this.state;
    if (name !== nextProps.name) {
      this.setState({
        newFrequency: nextProps.lfmFrequency,
        newAmplitude: nextProps.lfmAmplitude,
        name: nextProps.name
      });
    }
  }
  onFrequencyChange = value => {
    this.props.onFrequencyChange(value);
  };
  onFrequencyUpdate = value => {
    this.setState({ newFrequency: value });
  }
  onAmplitudeChange = value => {
    this.props.onAmplitudeChange(value);
  };
  onAmplitudeUpdate = value => {
    this.setState({ newAmplitude: value });
  }
  render() {
    return (
      <div className="container">
        <h4>Low frequency modulation</h4>
        <b>Frequency of modulation</b>
        <Rcslider
          min={0}
          max={20}
          value={this.state.newFrequency}
          step={0.1}
          marks={{ 0: "0 hz", 20: "20 hz" }}
          onChange={this.onFrequencyUpdate}
          onAfterChange={this.onFrequencyChange}
        />
        <b>Amplitude of modulation</b>
        <Rcslider
          min={0}
          max={40}
          value={this.state.newAmplitude}
          step={0.1}
          marks={{ 0: "0", 40: "40" }}
          onChange={this.onAmplitudeChange}
          onAfterChange={this.onAmplitudeChange}
        />
      </div>
    );
  }
}
