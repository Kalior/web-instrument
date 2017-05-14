import React from 'react'

const isWhiteArray = [
  true, true, false, true, false, true, true, false, true, false, true, false, true,
  true, false, true, false, true, true, false, true, false, true, false, true, true
]

export default class PianoRollContainer extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      notesGrid: props.initialNotesGrid,
      mouseDown: false,
      adding: false,
      frequencyArray: props.frequencyArray
    }
    this.handleMouseUp = this.handleMouseUp.bind(this)
    this.handlePianoClick = this.handlePianoClick.bind(this)
    this.handlePianoRollClick = this.handlePianoRollClick.bind(this)
    this.handlePianoRollEnter = this.handlePianoRollEnter.bind(this)
    this.handlePianoEnter = this.handlePianoEnter.bind(this)
    this.handlePianoLeave = this.handlePianoLeave.bind(this)
  }
  handleMouseUp () {
    this.setState({mouseDownCanvas: false})
  }
  handlePianoRollClick (i, j, event) {
    event.preventDefault()
    event.stopPropagation()
    $(event.target).toggleClass('selected')

    let newNotesGrid = this.state.notesGrid
    let isAdding = !newNotesGrid[i][j]
    newNotesGrid[i][j] = isAdding
    this.setState({
      notesGrid: newNotesGrid,
      adding: isAdding,
      mouseDown: true
    })
    this.props.onPianoRollChange(newNotesGrid)
  }
  handlePianoRollEnter (i, j, event) {
    if (this.state.mouseDown) {
      let newNotesGrid = this.state.notesGrid
      if (this.state.adding && !newNotesGrid[i][j]) {
        $(event.target).toggleClass('selected')
        newNotesGrid[i][j] = !newNotesGrid[i][j]
      } else if (!this.state.adding && newNotesGrid[i][j]) {
        $(event.target).toggleClass('selected')
        newNotesGrid[i][j] = !newNotesGrid[i][j]
      }
      this.setState({notesGrid: newNotesGrid})
      this.props.onPianoRollChange(newNotesGrid)
    }
  }
  handlePianoEnter (index, event) {
    if (this.state.mouseDown) {
      let newFrequencyArray = this.state.frequencyArray
      if (this.state.adding && !newFrequencyArray[index]) {
        $(event.target).toggleClass('selected')
        newFrequencyArray[index] = !newFrequencyArray[index]
      } else if (!this.state.adding && newFrequencyArray[index]) {
        $(event.target).toggleClass('selected')
        newFrequencyArray[index] = !newFrequencyArray[index]
      }
      this.setState({frequencyArray: newFrequencyArray})
      this.props.onFrequencyArrayChange(newFrequencyArray)
    }
  }
  handlePianoLeave (event) {
    this.setState({mouseDown: false})
  }
  handlePianoClick (index, event) {
    event.preventDefault()
    event.stopPropagation()
    $(event.target).toggleClass('selected')

    let newFrequencyArray = this.state.frequencyArray
    let isAdding = !newFrequencyArray[index]
    newFrequencyArray[index] = isAdding
    this.setState({
      frequencyArray: newFrequencyArray,
      adding: isAdding,
      mouseDown: true
    })
    this.props.onFrequencyArrayChange(newFrequencyArray)
  }
  render () {
    let piano = []
    for (let i = 0; i < this.state.frequencyArray.length - 1; i++) {
      let classes = 'piano-key'
      if (isWhiteArray[i]) {
        classes += ' white-key'
      } else {
        classes += ' black-key'
      }
      if (this.state.frequencyArray[i]) {
        classes += ' selected'
      }
      piano.push(<div
        className={classes}
        id={'piano-key-' + i}
        key={i}
        onMouseDown={this.handlePianoClick.bind(this, i)}
        onMouseEnter={this.handlePianoEnter.bind(this, i)}
        />)
    }
    let pianoRoll = []
    for (var i = 0; i < 16; i++) {
      let pianoRollRow = []
      for (var j = 0; j < this.state.frequencyArray.length - 1; j++) {
        if (this.state.frequencyArray[j]) {
          let classes = 'piano-roll-element'
          if (this.state.notesGrid[i][j]) {
            classes += ' selected'
          }
          if (i === this.props.currentBeat) {
            classes += ' current-beat'
          }
          pianoRollRow.push(<div
            className={classes}
            key={j + (i * j)}
            onMouseDown={this.handlePianoRollClick.bind(this, i, j)}
            onMouseEnter={this.handlePianoRollEnter.bind(this, i, j)}
            onMouseUp={this.handlePianoLeave}
            />)
        }
      }
      pianoRoll.push(<div key={i} className='piano-roll-row'> {pianoRollRow} </div>)
    }
    return (
      <div
        className='piano-roll-container container column small-12 medium-6'
        onMouseUp={this.handlePianoLeave}
        >
        <h4>Melody</h4>
        <div
          onMouseLeave={this.handlePianoLeave}
          className='piano-roll'>
          {pianoRoll}
        </div>
        <div
          onMouseLeave={this.handlePianoLeave}
          className='piano'>
          {piano}
        </div>
      </div>
    )
  }
}
