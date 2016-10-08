import React from 'react';

var pianoRollCellSize = 30;

export default class PianoRollContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {notesGrid: this.props.initialNotesGrid, mouseDownCanvas: false, adding: false};
    this.handleCellClicked = this.handleCellClicked.bind(this);
    this.initializeCanvasEvents = this.initializeCanvasEvents.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.drawCanvas = this.drawCanvas.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseClick = this.handleMouseClick.bind(this);
  }
  componentDidMount() {
    this.initializeCanvasEvents();
    this.drawCanvas();
  }
  handleCellClicked(value, row, column) {
    var newNotesGrid = this.state.notesGrid;
    newNotesGrid[row][column] = value;
    this.setState({notesGrid: newNotesGrid});
    this.props.onPianoRollChange(newNotesGrid);
  }
  handleMouseUp() {
    this.setState({mouseDownCanvas: false});
  }
  handleMouseDown(event) {
    var canvas = document.getElementById("piano-roll-canvas");
    this.setState({mouseDownCanvas: true});
    var mousePos = getMouseCoordinates(canvas, event);
    if (!this.state.notesGrid[mousePos.row][mousePos.column]) {
      this.setState({adding: true});
    }
    else {
      this.setState({adding: false});
    }
  }
  drawCanvas() {
    // this should probably know about the grid.
    var canvas = document.getElementById("piano-roll-canvas");
    var context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.beginPath();
    for (var i = 0; i < 12; i++) {
      for (var j = 0; j < 16; j++) {
        roundRect(context, pianoRollCellSize*i, pianoRollCellSize*j, pianoRollCellSize, pianoRollCellSize, 5);
        if (this.state.notesGrid[i][j]) {
          context.fillStyle = 'rgb(58, 219, 118)';
        }
        else {
          context.fillStyle = 'white';
        }
        context.fill();
        context.lineWidth = 1;
        context.strokeStyle = 'black';
        context.stroke();
      }
    }
  }
  initializeCanvasEvents() {
    var canvas = document.getElementById("piano-roll-canvas");
    // Bunch of event handlers for when mouse is down, up, moves, and preventing selection.
    canvas.addEventListener("mousemove", this.handleMouseMove, false);
    canvas.addEventListener("mousedown", this.handleMouseDown, false);
    canvas.addEventListener("mouseup", this.handleMouseUp, false);
    canvas.addEventListener("mouseout", this.handleMouseUp, false);
    canvas.addEventListener("click", this.handleMouseClick, false);
    // do nothing in the event handler except canceling the event
    canvas.ondragstart = function(e) {
      if (e && e.preventDefault) { e.preventDefault(); }
      if (e && e.stopPropagation) { e.stopPropagation(); }
      return false;
    }
    // do nothing in the event handler except canceling the event
    canvas.onselectstart = function(e) {
      if (e && e.preventDefault) { e.preventDefault(); }
      if (e && e.stopPropagation) { e.stopPropagation(); }
      return false;
    }
  }
  handleMouseMove(event) {
    event.preventDefault();
    if (this.state.mouseDownCanvas) {
      var canvas = document.getElementById("piano-roll-canvas");
      var mousePos = getMouseCoordinates(canvas, event);
      if (!this.state.notesGrid[mousePos.row][mousePos.column] && this.state.adding) {
        this.handleCellClicked(true, mousePos.row, mousePos.column);
        this.drawCanvas();
      }
      else if (this.state.notesGrid[mousePos.row][mousePos.column] && !this.state.adding) {
        this.handleCellClicked(false, mousePos.row, mousePos.column);
        this.drawCanvas();
      }
    }
  }
  handleMouseClick(event) {
    event.preventDefault();
    var canvas = document.getElementById("piano-roll-canvas");
    var mousePos = getMouseCoordinates(canvas, event);
    if (!this.state.notesGrid[mousePos.row][mousePos.column] && this.state.adding) {
      this.handleCellClicked(true, mousePos.row, mousePos.column);
    }
    else if (!this.state.adding) {
      this.handleCellClicked(false, mousePos.row, mousePos.column);
    }
    this.drawCanvas();
  }
  render() {
    var toneNames = ["B", "A#", "A", "G#", "G", "F#", "F", "E", "D#", "D", "C#", "C"];
    var isWhite = [true, false, true, false, true, false, true, true, false, true, false, true];
    return (
      <div className="PianoRollContainer container column small-centered small-8">
        <b>Melody</b>
        <div>
          <canvas id="piano-roll-canvas" width={12*pianoRollCellSize+4} height={16*pianoRollCellSize+4}/>
          <br></br>
          <b>B A# A G# G F# F E D# D C# C</b>
        </div>
      </div>
    );
  }
}

 //integrate this in the react component later, will give access to state and such.
function getMouseCoordinates(canvas, event) {
  var rect = canvas.getBoundingClientRect();
  return {row: Math.floor((event.clientX - rect.left) / pianoRollCellSize),
          column: Math.floor((event.clientY - rect.top) / pianoRollCellSize)};
}

function roundRect(context, x, y, w, h, r) {
  if (w < 2 * r) r = w / 2;
  if (h < 2 * r) r = h / 2;
  context.save();
  context.translate(2, 2);
  context.beginPath();
  context.moveTo(x+r, y);
  context.arcTo(x+w, y,   x+w, y+h, r);
  context.arcTo(x+w, y+h, x,   y+h, r);
  context.arcTo(x,   y+h, x,   y,   r);
  context.arcTo(x,   y,   x+w, y,   r);
  context.closePath();
  context.restore();
}
