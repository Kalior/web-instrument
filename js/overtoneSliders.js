import React from "react";
import Rcslider from "rc-slider-colored";

export default class OverToneSlidersContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newOvertoneGainArray: props.overtoneGainArray,
      name: props.name
    };
  }
  componentWillReceiveProps(nextProps) {
    if (this.state.name !== nextProps.name) {
      this.setState({
        newOvertoneGainArray: nextProps.overtoneGainArray,
        name: nextProps.name
      })
    }
  }
  onOvertoneAmountChange = value => {
    this.setState({ amountOfOvertones: value });
    this.props.onOvertoneAmountChange(value);
  };
  onGainChange = (overtoneIndex, gain) => {
    this.props.onOvertoneArrayChange(this.state.newOvertoneGainArray);
  };
  onGainUpdate = (overtoneIndex, gain) => {
    var newOvertoneGainArray = this.props.overtoneGainArray;
    newOvertoneGainArray[overtoneIndex] = gain;
    this.setState({ newOvertoneGainArray: newOvertoneGainArray });
  };
  render() {
    var overtoneSliders = [];
    for (var i = 0; i < this.props.overtonesAmount; i++) {
      overtoneSliders.push(
        <Rcslider
          id={"gain-control-" + i}
          className={"overtone-slider"}
          min={0}
          max={100}
          value={this.props.overtoneGainArray[i]}
          key={i}
          onChange={this.onGainUpdate.bind(this, i)}
          onAfterChange={this.onGainChange.bind(this, i)}
          marks={{ 0: "", 100: "" }}
        />
      );
    }
    return (
      <div className="OvertToneSlidersContainer container">
        <h4>Overtones</h4>
        <b>Amount</b>
        <OverTonesAmountSlider
          overtonesAmount={this.props.overtonesAmount}
          onOvertoneChange={this.onOvertoneAmountChange}
          name={this.props.name}
        />
        <b>Controls</b>
        {overtoneSliders}
      </div>
    );
  }
}

class OverTonesAmountSlider extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newOvertonesAmount: props.overtonesAmount,
      name: props.name
    }
  }
  componentWillReceiveProps(nextProps) {
    if (this.state.name !== nextProps.name) {
      this.setState({
        newOvertonesAmount: nextProps.overtonesAmount,
        name: nextProps.name
      })
    }
  }
  onAmountChange = value => {
    this.props.onOvertoneChange(value);
  };
  onAmountUpdate = value => {
    this.setState({ newOvertonesAmount: value })
  };
  render() {
    return (
      <Rcslider
        className="OverTonesAmountSlider"
        id="number-overtones-slider"
        min={0}
        max={25}
        value={this.state.newOvertonesAmount}
        onChange={this.onAmountUpdate}
        onAfterChange={this.onAmountChange}
        marks={{ 0: "0 tones", 25: "25 tones" }}
      />
    );
  }
}
