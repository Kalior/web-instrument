import React from "react";

const isWhiteArray = [
  true,
  true,
  false,
  true,
  false,
  true,
  true,
  false,
  true,
  false,
  true,
  false,
  true,
  true,
  false,
  true,
  false,
  true,
  true,
  false,
  true,
  false,
  true,
  false,
  true,
  true
];

export default class PianoRollContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mouseDown: false,
      adding: false
    };
  }
  handleMouseUp = () => {
    this.setState({ mouseDownCanvas: false });
  };
  handlePianoRollClick = (i, j, event) => {
    event.preventDefault();
    event.stopPropagation();
    $(event.target).toggleClass("selected");

    let newNotesGrid = this.props.notesGrid;
    let isAdding = !newNotesGrid[i][j];
    newNotesGrid[i][j] = isAdding;
    this.setState({
      adding: isAdding,
      mouseDown: true
    });
    this.props.onPianoRollChange(newNotesGrid);
  };
  handlePianoRollEnter = (i, j, event) => {
    const { mouseDown, adding } = this.state;
    if (mouseDown) {
      let newNotesGrid = this.props.notesGrid;
      if (adding && !newNotesGrid[i][j]) {
        $(event.target).toggleClass("selected");
        newNotesGrid[i][j] = !newNotesGrid[i][j];
      } else if (!adding && newNotesGrid[i][j]) {
        $(event.target).toggleClass("selected");
        newNotesGrid[i][j] = !newNotesGrid[i][j];
      }
      this.props.onPianoRollChange(newNotesGrid);
    }
  };
  handlePianoEnter = (index, event) => {
    if (this.state.mouseDown) {
      let newFrequencyArray = this.state.frequencyArray;
      if (this.state.adding && !newFrequencyArray[index]) {
        $(event.target).toggleClass("selected");
        newFrequencyArray[index] = !newFrequencyArray[index];
      } else if (!this.state.adding && newFrequencyArray[index]) {
        $(event.target).toggleClass("selected");
        newFrequencyArray[index] = !newFrequencyArray[index];
      }
      this.setState({ frequencyArray: newFrequencyArray });
      this.props.onFrequencyArrayChange(newFrequencyArray);
    }
  };
  handlePianoLeave = event => {
    this.setState({ mouseDown: false });
  };
  handlePianoClick = (index, event) => {
    event.preventDefault();
    event.stopPropagation();
    $(event.target).toggleClass("selected");

    let newFrequencyArray = this.props.frequencyArray;
    let isAdding = !newFrequencyArray[index];
    newFrequencyArray[index] = isAdding;
    this.setState({
      adding: isAdding,
      mouseDown: true
    });
    this.props.onFrequencyArrayChange(newFrequencyArray);
  };
  render() {
    let piano = [];
    for (let i = 0; i < this.props.frequencyArray.length - 1; i++) {
      let classes = "piano-key";
      if (isWhiteArray[i]) {
        classes += " white-key";
      } else {
        classes += " black-key";
      }
      if (this.props.frequencyArray[i]) {
        classes += " selected";
      }
      piano.push(
        <div
          className={classes}
          id={"piano-key-" + i}
          key={i}
          onMouseDown={this.handlePianoClick.bind(this, i)}
          onMouseEnter={this.handlePianoEnter.bind(this, i)}
        />
      );
    }
    let pianoRoll = [];
    for (var i = 0; i < 16; i++) {
      let pianoRollRow = [];
      for (var j = 0; j < this.props.frequencyArray.length - 1; j++) {
        if (this.props.frequencyArray[j]) {
          let classes = "piano-roll-element";
          if (this.props.notesGrid[i][j]) {
            classes += " selected";
          }
          if (i === this.props.currentBeat) {
            classes += " current-beat";
          }
          pianoRollRow.push(
            <div
              className={classes}
              key={j + i * j}
              onMouseDown={this.handlePianoRollClick.bind(this, i, j)}
              onMouseEnter={this.handlePianoRollEnter.bind(this, i, j)}
              onMouseUp={this.handlePianoLeave}
            />
          );
        }
      }
      pianoRoll.push(
        <div key={i} className="piano-roll-row"> {pianoRollRow} </div>
      );
    }
    return (
      <div
        className="piano-roll-container container"
        onMouseUp={this.handlePianoLeave}
      >
        <h4>Melody</h4>
        <div onMouseLeave={this.handlePianoLeave} className="piano-roll">
          {pianoRoll}
        </div>
        <div onMouseLeave={this.handlePianoLeave} className="piano">
          {piano}
        </div>
      </div>
    );
  }
}
