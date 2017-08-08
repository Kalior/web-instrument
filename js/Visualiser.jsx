import React from 'react'
import Rcslider from 'rc-slider-colored'

export default class Visualiser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visualiser: props.visualiser
    };
  }
  componentDidMount () {
    this.drawVisualiser(this.state.visualiser);
  }
  componentWillReceiveProps(nextProps) {
    if (this.state.visualiser === null && nextProps.visualiser !== null) {
      this.drawVisualiser(nextProps.visualiser);
      this.setState({ visualiser: nextProps.visualiser });
    }
  }
  drawVisualiser = (visualiser) => {
    if (visualiser === null) {
      return;
    }

    const { index } = this.props;

    visualiser.fftSize = 2048;
    var bufferLength = visualiser.frequencyBinCount;
    var dataArray = new Uint8Array(bufferLength);
    visualiser.getByteTimeDomainData(dataArray);

    // Get a canvas defined with ID "oscilloscope"
    var canvas = document.getElementById("oscilloscope-" + index);
    var canvasCtx = canvas.getContext("2d");

    // draw an oscilloscope of the current audio source
    const draw = () => {
      const { muted } = this.props;

      requestAnimationFrame(draw);
      visualiser.getByteTimeDomainData(dataArray);

      canvasCtx.fillStyle = muted ? 'rgb(255, 255, 255)' : 'rgba(255, 255, 255, 0.8)';
      canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

      canvasCtx.lineWidth = 2;
      canvasCtx.strokeStyle = muted ? 'rgba(0, 0, 0, 0.1)' : 'rgba(0, 0, 0, 0.6)';

      canvasCtx.beginPath();

      const sliceWidth = canvas.width * 1.0 / bufferLength;
      let x = 0;
      for (let i = 0; i < bufferLength; i++) {
        const v = dataArray[i] / 128.0;
        const y = v * canvas.height / 2;
        if (i === 0) {
          canvasCtx.moveTo(x, y);
        } else {
          canvasCtx.lineTo(x, y);
        }
        x += sliceWidth;
      }
      canvasCtx.lineTo(canvas.width, canvas.height / 2);
      canvasCtx.stroke();
    };
    draw();
  }
  drawBarVisualiser = () => {
    if (this.props.visualiser === null) {
      console.log("ads")
      return;
    }
    const visualiser = this.props.visualiser;
    visualiser.fftSize = 256;
    const bufferLength = visualiser.frequencyBinCount;
    console.log(bufferLength);
    const dataArray = new Uint8Array(bufferLength);

    // Get a canvas defined with ID "oscilloscope"
    const canvas = document.getElementById("oscilloscope-" + this.props.index);
    const canvasCtx = canvas.getContext("2d");
    const WIDTH = canvas.width;
    const HEIGHT = canvas.height;
    canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

    // draw an oscilloscope of the current audio source
    const draw = () => {
      requestAnimationFrame(draw);

      visualiser.getByteFrequencyData(dataArray);

      canvasCtx.fillStyle = 'rgb(0, 0, 0)';
      canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

      const barWidth = (WIDTH / bufferLength) * 2.5;
      let x = 0;
      for (let i = 0; i < bufferLength; i++) {
        let barHeight = dataArray[i] / 2;

        canvasCtx.fillStyle = 'rgb(' + (barHeight + 100) + ',50,50)';
        canvasCtx.fillRect(x, HEIGHT - barHeight / 2, barWidth, barHeight);

        x += barWidth + 1;
      }
    };
    draw();
  }
  render () {
    const {index, isTop} = this.props;
    return (
      <canvas
        id={"oscilloscope-" + index}
        className={isTop ? "instrument-visualiser active-instrument" : "instrument-visualiser"}
        width={200}
        height={100}
      />
    )
  }
}
