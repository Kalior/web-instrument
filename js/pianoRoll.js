import React from 'react';

export default class PianoRollContainer extends React.Component {
  constructor(props) {
    super(props);
    var initialNotesGrid = [];
    for (var i = 0; i <= 12; i++) {
      initialNotesGrid[i] = [];
      for (var j = 0; j <= 16; j++) {
        initialNotesGrid[i][j] = false;
      }
    }
    this.state = {notesGrid: initialNotesGrid};
    this.handleCellClicked = this.handleCellClicked.bind(this);
  }
  componentDidMount() {
    this.props.onPianoRollChange(this.state.notesGrid);
  }
  handleCellClicked(value, row, column) {
    var newNotesGrid = this.state.notesGrid;
    newNotesGrid[row][column] = value;
    this.setState({notesGrid: newNotesGrid});
    this.props.onPianoRollChange(newNotesGrid);
  }
  render() {
    var toneNames = ["B", "A#", "A", "G#", "G", "F#", "F", "E", "D#", "D", "C#", "C"];
    var isWhite = [true, false, true, false, true, false, true, true, false, true, false, true];
    var pianoRows = [];
    for (var i = 0; i < toneNames.length; i++) {
      pianoRows.push(<PianoRollRow
        key={i} row={i} cellAmount={16} white={isWhite[i]} note={toneNames[i]} onCellClicked={this.handleCellClicked}/>);
    }
    return (
      <div className="PianoRollContainer container column small-centered small-8">
        <b>Melody</b>
        {pianoRows}
      </div>
    );
  }
}

var PianoRollRow = React.createClass({
  render: function() {
    var pianoCells = []
    for (var i = 0; i < this.props.cellAmount; i++) {
      pianoCells.push(React.createElement(PianoRollCell, {row: this.props.row, column: i, onCellClicked: this.props.onCellClicked, key: i}));
    }
    var containerStyle = {
      display: 'flex',
      alignItems: 'center'
    }
    var rowStyle = {
      background: this.props.white ? '#f0f0f0' : '#666',
      width: this.props.cellAmount*20 + 'px',
      height: '20px'
    }
    return (
      React.createElement('div', {className: "PianoRollRow", style: containerStyle},
        React.createElement('b', {style: {display: 'inline', width: '20px'}}, this.props.note),
        React.createElement('div', {style: rowStyle}, pianoCells)
      )
    );
  }
});

var PianoRollCell = React.createClass({
  getInitialState: function() {
    return {checked: false};
  },
  handleClick: function(e) {
    e.preventDefault();
    this.props.onCellClicked(!this.state.checked, this.props.row, this.props.column);
    this.setState({checked: !this.state.checked});
  },

  render: function() {
    var divStyle = {
      background: this.state.checked ? '#3adb76' : '',
      height: '20px',
      width: '20px',
      display: 'inline-block',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: '#aaa'
    }
    return (
      React.createElement('div', {className: "PianoRollCell", onClick: this.handleClick, onDragEnter: this.handleClick, style: divStyle})
    );
  }
});
