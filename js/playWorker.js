var playing = false;
var timer;

onmessage = function(e) {
  playing = e.data[0];
  if (playing) {
    var secondsPerBeat = e.data[1];
    var numberOfBeats = e.data[2];
    var beatNr = 0;
    timer = setInterval(function() {
      postMessage(beatNr);
      var nextBeat = 0;
      if (beatNr < numberOfBeats - 1) {
        nextBeat = beatNr + 1;
      }
      beatNr = nextBeat;
    }, 0.25 * secondsPerBeat * 1000);
  }
  else {
    clearInterval(timer);
  }
}
