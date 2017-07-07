import React from 'react'
import {render} from 'react-dom'
import WebInstrument from './WebInstrument.jsx'

const NUMBER_OF_BEATS = 16;

export default class MainView extends React.Component {
  constructor (props) {
    super(props)

    let initialPlayWorker = new Worker("js/playWorker.js")
    initialPlayWorker.onmessage = this.onPlayWorkerMessage

    this.state = {
      context: null,
      playing: false,
      playWorker: initialPlayWorker,
      currentBeat: 0
    }
  }

  render () {
    const {context, playing, currentBeat} = this.state;
    return (
      <WebInstrument context={context} playing={playing} currentBeat={currentBeat}/>
    )
  }
  readyContext = () => {
    try {
      window.AudioContext = window.AudioContext
      this.setState({context: new AudioContext()})
    }
    catch (e) {
      alert(e)
    }
  }
  componentDidMount () {
    this.readyContext()
    $('#play-sound').click(this.startPlaying)
    $('#stop-sound').click(this.stopPlaying)
  }
  startPlaying = () => {
    var tempo = 120.0
    var secondsPerBeat = 60.0 / tempo
    if (!this.state.playing) {
      this.setState({
        playing: true,
        currentBeat: 0
      })
      this.state.playWorker.postMessage([true, secondsPerBeat, NUMBER_OF_BEATS])
    }
  }
  stopPlaying = () => {
    if (this.state.playing) {
      this.state.playWorker.postMessage([false])
      this.setState({playing: false})
    }
  }
  onPlayWorkerMessage = e => {
    this.setState({currentBeat: e.data})
  }
}

render(
  <MainView />,
  document.getElementById('react-web-instrument')
)
