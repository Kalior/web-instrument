import React from 'react';
import Rcslider from 'rc-slider-colored';

function drawEnvelope(attack, decay, release, sustainGain) {
  var canvas = document.getElementById("envelope-graph");
  var context = canvas.getContext("2d");
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.lineWidth = "2";

  var envelopeAttack       = canvas.width * attack / 100;
  var envelopeDecay        = canvas.width * decay / 100;
  var envelopeRelease      = canvas.width * release / 100;
  var envelopeSustainGain  = canvas.height * (1 - sustainGain / 100);
  var envelopeSustainTime  = canvas.width - envelopeAttack - envelopeDecay - envelopeRelease;

  context.beginPath();
  context.moveTo(0, canvas.height);
  context.lineTo(envelopeAttack, 0);
  context.strokeStyle = "#2199e8";
  context.stroke();

  context.beginPath();
  context.moveTo(envelopeAttack, 0);
  drawSetTargetAtTime(context, envelopeAttack, envelopeDecay, 0, envelopeSustainGain, envelopeDecay * 0.2, "#3adb76");

  var timeBeforeRelease = envelopeAttack + envelopeDecay;
  if (envelopeSustainTime >= 0) {
    context.lineTo(envelopeAttack + envelopeDecay + envelopeSustainTime, envelopeSustainGain);
    context.strokeStyle = "#777777";
    context.stroke();
    timeBeforeRelease += envelopeSustainTime;
  }

  context.beginPath();
  context.moveTo(envelopeAttack + envelopeDecay + envelopeSustainTime, envelopeSustainGain);
  drawSetTargetAtTime(context, timeBeforeRelease, envelopeRelease, envelopeSustainGain, canvas.height, envelopeRelease * 0.2, "#ec5840");
}

function drawSetTargetAtTime (context, timeBefore, length, V0, V1, timeConstant, color) {
  context.beginPath();
  for (var i = 0; i < length; i++) {
    context.lineTo(timeBefore + i, V1 + (V0 - V1) * Math.exp(-i/timeConstant));
  }
  context.strokeStyle = color;
  context.stroke()
  context.beginPath();
  context.moveTo(timeBefore + length, V1 + (V0 - V1) * Math.exp(-length/timeConstant));
}


$('.envelope-slider').on('moved.zf.slider', function(){
  drawEnvelope();
});


export default class EnvelopeContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {attack: 10, decay: 20, sustain: 50, release: 30};
    this.handleAttackChange = this.handleAttackChange.bind(this);
    this.handleDecayChange = this.handleDecayChange.bind(this);
    this.handleSustainChange = this.handleSustainChange.bind(this);
    this.handleReleaseChange = this.handleReleaseChange.bind(this);
  }
  handleAttackChange(newAttack) {
    this.setState({attack: newAttack});
    drawEnvelope(this.state.attack, this.state.decay, this.state.release, this.state.sustain);
    this.props.onAttackChange(newAttack);
  }
  handleDecayChange(newDecay) {
    this.setState({decay: newDecay});
    drawEnvelope(this.state.attack, this.state.decay, this.state.release, this.state.sustain);
    this.props.onDecayChange(newDecay);
  }
  handleSustainChange(newSustain) {
    this.setState({sustain: newSustain});
    drawEnvelope(this.state.attack, this.state.decay, this.state.release, this.state.sustain);
    this.props.onSustainChange(newSustain);
  }
  handleReleaseChange(newRelease) {
    this.setState({release: newRelease});
    drawEnvelope(this.state.attack, this.state.decay, this.state.release, this.state.sustain);
    this.props.onReleaseChange(newRelease);
  }
  componentDidMount() {
    drawEnvelope(this.state.attack, this.state.decay, this.state.release, this.state.sustain);
  }
  render() {
    return(
      <div className="container column small-6">
        <b>Envelope</b>
        <div id="envelope-container">
          <canvas id="envelope-graph" height={200} width={800}/>
          <br></br>
          <b>Attack</b>
          <Rcslider id={'attack-envelope-input'} defaultValue={this.state.attack}
            min={0} max={100} onChange={this.handleAttackChange}  marks={{0: {color: '#2199e8'}, 100: {}}}/>
          <b>Decay</b>
          <Rcslider id={'envelope-decay-input'} defaultValue={this.state.decay}
            min={1} max={100} onChange={this.handleDecayChange} marks={{1: {color: '#3adb76'}, 100: {}}}/>
          <b>Sustain</b>
          <Rcslider id={'envelope-sustain-input'} defaultValue={this.state.sustain}
            min={0} max={100} onChange={this.handleSustainChange} marks={{0: {color: '#777777'}, 100: {}}}/>
          <b>Release</b>
          <Rcslider id={'envelope-release-input'} defaultValue={this.state.release}
            min={0} max={100} onChange={this.handleReleaseChange} marks={{0: {color: '#ec5840'}, 100: {}}}/>
        </div>
      </div>
    );
  }
}
