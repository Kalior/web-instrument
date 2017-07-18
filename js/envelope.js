import React from 'react'
import Rcslider from 'rc-slider-colored'

function drawEnvelope (attack, decay, release, sustainGain) {
  var canvas = document.getElementById('envelope-graph')
  var context = canvas.getContext('2d')
  context.clearRect(0, 0, canvas.width, canvas.height)
  context.lineWidth = '2'

  var envelopeAttack = canvas.width * attack / 100
  var envelopeDecay = canvas.width * decay / 100
  var envelopeRelease = canvas.width * release / 100
  var envelopeSustainGain = canvas.height * (1 - sustainGain / 100)
  var envelopeSustainTime = canvas.width - envelopeAttack - envelopeDecay - envelopeRelease

  context.beginPath()
  context.moveTo(0, canvas.height)
  context.lineTo(envelopeAttack, 0)
  context.strokeStyle = '#2199e8'
  context.stroke()

  context.beginPath()
  context.moveTo(envelopeAttack, 0)
  drawSetTargetAtTime(context, envelopeAttack, envelopeDecay, 0, envelopeSustainGain, envelopeDecay * 0.2, '#3adb76')

  var timeBeforeRelease = envelopeAttack + envelopeDecay
  if (envelopeSustainTime >= 0) {
    context.lineTo(envelopeAttack + envelopeDecay + envelopeSustainTime, envelopeSustainGain)
    context.strokeStyle = '#777777'
    context.stroke()
    timeBeforeRelease += envelopeSustainTime
  }

  context.beginPath()
  context.moveTo(envelopeAttack + envelopeDecay + envelopeSustainTime, envelopeSustainGain)
  drawSetTargetAtTime(context, timeBeforeRelease, envelopeRelease, envelopeSustainGain, canvas.height, envelopeRelease * 0.2, '#ec5840')
}

function drawSetTargetAtTime (context, timeBefore, length, V0, V1, timeConstant, color) {
  context.beginPath()
  for (var i = 0; i < length; i++) {
    context.lineTo(timeBefore + i, V1 + (V0 - V1) * Math.exp(-i / timeConstant))
  }
  context.strokeStyle = color
  context.stroke()
  context.beginPath()
  context.moveTo(timeBefore + length, V1 + (V0 - V1) * Math.exp(-length / timeConstant))
}

$('.envelope-slider').on('moved.zf.slider', function () {
  drawEnvelope()
})

export default class EnvelopeContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      newAttack: props.attack,
      newDecay: props.decay,
      newRelease: props.release,
      newSustain: props.sustain
    };
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      newAttack: nextProps.attack,
      newDecay: nextProps.decay,
      newRelease: nextProps.release,
      newSustain: nextProps.sustain
    });
    drawEnvelope(nextProps.attack, nextProps.decay, nextProps.release, nextProps.sustain)
  }
  handleAttackChange = (newAttack) => {
    this.props.onAttackChange(newAttack);
  }
  handleDecayChange = (newDecay) => {
    this.props.onDecayChange(newDecay);
  }
  handleReleaseChange = (newRelease) => {
    this.props.onReleaseChange(newRelease);
  }
  handleSustainChange = (newSustain) => {
    this.props.onSustainChange(newSustain);
  }
  handleAttackUpdate = (newAttack) => {
    drawEnvelope(newAttack, this.props.decay, this.props.release, this.props.sustain);
    this.setState({ newAttack: newAttack });
  }
  handleDecayUpdate = (newDecay) => {
    drawEnvelope(this.props.attack, newDecay, this.props.release, this.props.sustain)
    this.setState({ newDecay: newDecay });
  }
  handleReleaseUpdate = (newRelease) => {
    drawEnvelope(this.props.attack, this.props.decay, newRelease, this.props.sustain)
    this.setState({ newRelease: newRelease });
  }
  handleSustainUpdate = (newSustain) => {
    drawEnvelope(this.props.attack, this.props.decay, this.props.release, newSustain)
    this.setState({ newSustain: newSustain });
  }
  componentDidMount () {
    drawEnvelope(this.props.attack, this.props.decay, this.props.release, this.props.sustain)
  }
  render () {
    return (
      <div className='container'>
        <h4>Envelope</h4>
        <div id='envelope-container'>
          <b>Visualization</b>
          <canvas id='envelope-graph' height={200} width={800} />
          <br />
          <b>Attack</b>
          <Rcslider
            id={'attack-envelope-input'}
            value={this.state.newAttack}
            min={0}
            max={100}
            onAfterChange={this.handleAttackChange}
            onChange={this.handleAttackUpdate}
            marks={{0: {color: '#2199e8', label: '0 ms'}, 100: {label: '100 ms'}}}
          />
          <b>Decay</b>
          <Rcslider
            id={'envelope-decay-input'}
            value={this.state.newDecay}
            min={1}
            max={100}
            onAfterChange={this.handleDecayChange}
            onChange={this.handleDecayUpdate}
            marks={{1: {color: '#3adb76', label: '0 ms'}, 100: {label: '100 ms'}}}
          />
          <b>Sustain</b>
          <Rcslider
            id={'envelope-sustain-input'}
            value={this.state.newSustain}
            min={0}
            max={100}
            onAfterChange={this.handleSustainChange}
            onChange={this.handleSustainUpdate}
            marks={{0: {color: '#777777', label: '0% gain'}, 100: {label: '100% gain'}}}
          />
          <b>Release</b>
          <Rcslider
            id={'envelope-release-input'}
            value={this.state.newRelease}
            min={0}
            max={100}
            onAfterChange={this.handleReleaseChange}
            onChange={this.handleReleaseUpdate}
            marks={{0: {color: '#ec5840', label: '0 ms'}, 100: {label: '100 ms'}}}
          />
        </div>
      </div>
    )
  }
}
