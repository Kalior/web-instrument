import React from 'react'
import _ from 'lodash'

export default class PianoRollContainer extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      notesGrid: props.initialNotesGrid,
      mouseDown: false,
      adding: false,
      frequencyMultipliers: props.frequencyMultipliers
    }
    this.handleMouseUp = this.handleMouseUp.bind(this)
    this.handlePianoClick = this.handlePianoClick.bind(this)
    this.handlePianoRollClick = this.handlePianoRollClick.bind(this)
    this.handlePianoRollEnter = this.handlePianoRollEnter.bind(this)
    this.handlePianoEnter = this.handlePianoEnter.bind(this)
    this.handlePianoUp = this.handlePianoUp.bind(this)
  }
  handleMouseUp () {
    this.setState({mouseDownCanvas: false})
  }
  handlePianoRollClick (i, j, event) {
    event.preventDefault()
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
    let frequencyMultipliers = this.state.frequencyMultipliers
    if (this.state.mouseDown) {
      if (this.state.adding && !_.includes(frequencyMultipliers, index)) {
        $(event.target).addClass('selected')
        // Reverse because lodash expects a certain ordering.
        frequencyMultipliers = _.reverse(frequencyMultipliers)
        frequencyMultipliers.splice(_.sortedIndex(frequencyMultipliers, index), 0, index)
        _.reverse(frequencyMultipliers)
      } else if (!this.state.adding && _.includes(frequencyMultipliers, index)) {
        $(event.target).removeClass('selected')
        _.pull(frequencyMultipliers, index)
      }

      this.setState({frequencyMultipliers: frequencyMultipliers})
      this.props.onFrequencyMultipliersChange(frequencyMultipliers)
    }
  }
  handlePianoUp (event) {
    this.setState({mouseDown: false})
  }
  handlePianoClick (index, event) {
    event.preventDefault()
    $(event.target).toggleClass('selected')
    let isAdding = false
    // Reverse because lodash expects a certain ordering.
    let frequencyMultipliers = _.reverse(this.state.frequencyMultipliers)
    if (_.includes(frequencyMultipliers, index)) {
      _.pull(frequencyMultipliers, index)
      isAdding = false
    } else {
      frequencyMultipliers.splice(_.sortedIndex(frequencyMultipliers, index), 0, index)
      isAdding = true
    }
    _.reverse(frequencyMultipliers)

    this.setState({
      frequencyMultipliers: frequencyMultipliers,
      adding: isAdding,
      mouseDown: true
    })
    this.props.onFrequencyMultipliersChange(frequencyMultipliers)
  }
  render () {
    let piano = []
    for (let i = 24; i > 0; i--) {
      let classes = 'piano-key white-key'
      if (_.includes(this.state.frequencyMultipliers, i - 22)) {
        classes += ' selected'
      }
      piano.push(<div
        className={classes}
        id={'piano-key-' + i}
        key={i}
        onMouseDown={this.handlePianoClick.bind(this, i - 22)}
        onMouseEnter={this.handlePianoEnter.bind(this, i - 22)}
        />)
    }
    let pianoRoll = []
    for (var i = 0; i < this.state.frequencyMultipliers.length; i++) {
      let pianoRollColumn = []
      for (var j = 0; j < 16; j++) {
        let classes = 'piano-roll-element'
        if (this.state.notesGrid[i][j]) {
          classes += ' selected'
        }
        if (j === this.props.currentBeat) {
          classes += ' current-beat'
        }
        pianoRollColumn.push(<div
          className={classes}
          key={j + (i * j)}
          onMouseDown={this.handlePianoRollClick.bind(this, i, j)}
          onMouseEnter={this.handlePianoRollEnter.bind(this, i, j)}
          onMouseUp={this.handlePianoUp}
          />)
      }
      pianoRoll.push(<div key={i} className='piano-roll-column'> {pianoRollColumn} </div>)
    }
    return (
      <div
        className='piano-roll-container container column small-12 medium-6'
        onMouseUp={this.handlePianoUp}
        >
        <h4>Melody</h4>
        <div className='piano-roll'>
          {pianoRoll}
        </div>
        <div className='piano'>
          {piano}
        </div>
      </div>
    )
  }
}
