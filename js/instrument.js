var context;

var numberOfBeats = 16*4;
var numberOfTones = 12;

var toneFreqs = [493.88, 466.16, 440.00, 415.30, 391.995, 369.99, 349.23, 329.628, 311.13, 293.66, 277.18, 261.63];
var toneNames = ["B", "A#", "A", "G#", "G", "F#", "F", "E", "D#", "D", "C#", "C"];

$(document).ready(function () {
  try {
    window.AudioContext = window.AudioContext||window.webkitAudioContext;
    context = new webkitAudioContext();
    addSliders();
    addTones();
    drawEnvelope();
  }
  catch(e) {
    alert(e);
  }
});

$("#play-sound").click(function () {
  // Setting tempo to 120 BPM just for now
  var tempo = 120.0;
  var secondsPerBeat = 60.0 / tempo;

  for (var i = 0; i < numberOfBeats; i++) {
    for (var j = 0; j < numberOfTones; j++) {
      if ($("#melody-row-" + j + "-column-" + i).is(":checked")) {
        playSound(toneFreqs[j], context.currentTime + 0.25 * i * secondsPerBeat, 0.25 * secondsPerBeat);
      }
    }
  }
});

function playSound (freq, time, length) {
  var envelopeAttack = $("#envelope-attack-input").val() / 100;
  var envelopeDecay = $("#envelope-decay-input").val() / 100;
  var envelopeRelease = $("#envelope-release-input").val() / 100;
  var envelopeSustainTime = 1 - envelopeAttack - envelopeDecay - envelopeRelease;
  var envelopeSustainGain = $("#envelope-sustain-input").val() / 100;

  var gainSum = 0;
  for (var i = 0; i <= $("#number-overtones-input").val(); i++) {
    gainSum += $("#gain-control-" + i).val() / 100;
  }

  var attack = length * envelopeAttack;
  var decay = length * envelopeDecay;
  var sustainTime = length * envelopeSustainTime;
  var release = length * envelopeRelease;

  for (var i = 0; i <= $("#number-overtones-input").val(); i++) {
    createOscilator(freq * (i+1), $("#gain-control-" + i).val() / (100 * gainSum), time,
      length, attack, decay, sustainTime, release, envelopeSustainGain);
  }
}

function round (value, decimals) {
    return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}
