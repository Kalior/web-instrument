var context;

$(document).ready(function () {
  try {
    window.AudioContext = window.AudioContext||window.webkitAudioContext;
    context = new webkitAudioContext();
  }
  catch(e) {
    alert(e);
  }
});

$("#play-sound").click(function () {
  gainSum = 0;
  for (var i = 0; i <= 13; i++) {
    gainSum += $("#gain-control-" + i).val() / 100;
  }

  for (var i = 0; i <= 13; i++) {
    createOscilator(100 * (i+1), $("#gain-control-" + i).val() / (100 * gainSum));
  }
});

function createOscilator (freq, gain) {
  oscillator = context.createOscillator();
  oscillator.frequency.value = freq;

  gainNode = context.createGain();
  oscillator.connect(gainNode)
  gainNode.gain.value = gain;
  gainNode.connect(context.destination);
  oscillator.start(context.currentTime);
  oscillator.stop(context.currentTime + 1);
}

function round (value, decimals) {
    return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}
