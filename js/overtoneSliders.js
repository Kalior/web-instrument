import React from 'react';
import Rcslider from 'rc-slider';

export default class OverToneSlidersContainer extends React.Component {
  constructor(props) {
    super(props);
    var initialOvertoneGainArray = [];
    for (var i = 0; i <= 25; i++) {
      initialOvertoneGainArray[i] = 0;
    }
    initialOvertoneGainArray[0] = 70;
    this.state = {amountOfOvertones: 10, overtoneGainArray: initialOvertoneGainArray};
    this.onOvertoneAmountChange = this.onOvertoneAmountChange.bind(this);
    this.onGainChange = this.onGainChange.bind(this);
  }
  onOvertoneAmountChange(value) {
    this.setState({amountOfOvertones: value});
    this.props.onOvertoneAmountChange(value);
  }
  onGainChange(overtoneIndex, gain) {
    var newOvertoneGainArray = this.state.overtoneGainArray;
    newOvertoneGainArray[overtoneIndex] = gain;
    this.setState({overtoneGainArray: newOvertoneGainArray});
    this.props.onOvertoneArrayChange(newOvertoneGainArray);
  }
  componentDidMount() {
    this.props.onOvertoneArrayChange(this.state.overtoneGainArray);
    this.props.onOvertoneAmountChange(this.state.amountOfOvertones);
  }
  render() {
    var overtoneSliders = [];
    for (var i = 0; i < this.state.amountOfOvertones; i++) {
      overtoneSliders.push(
        <Rcslider id={'gain-control-' + i}
          min={0} max={100} defaultValue={this.state.overtoneGainArray[i]} onAfterChange={this.onAmountChange} key={i} onAfterChange={this.onGainChange.bind(this, i)}/>);
    }
    return(
      <div className="OvertToneSlidersContainer container column small-centered small-8">
        <b>Amount of overtones</b>
        <OverTonesAmountSlider onOvertoneChange={this.onOvertoneAmountChange}/>
        <b>Overtones</b>
        {overtoneSliders}
      </div>
    );
  }
}

var OverTonesAmountSlider = React.createClass({
  getInitialState: function() {
    return {amountOfOvertones: 10};
  },
  componentDidMount: function() {

  },
  onAmountChange: function(value) {
    this.setState({amountOfOvertones: value});
    this.props.onOvertoneChange(value);
  },
  render: function() {
    return(
      <Rcslider className="OverTonesAmountSlider" id="number-overtones-slider"
        min={0} max={25} defaultValue={this.state.amountOfOvertones} onAfterChange={this.onAmountChange}/>
    );
  }
});
