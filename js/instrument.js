var context;

$(document).ready(function () {
  try {
    window.AudioContext = window.AudioContext||window.webkitAudioContext;
    context = new webkitAudioContext();
    addSliders();
  }
  catch(e) {
    alert(e);
  }
});

$("#play-sound").click(function () {
  gainSum = 0;
  for (var i = 0; i <= $("#number-overtones-input").val(); i++) {
    gainSum += $("#gain-control-" + i).val() / 100;
  }

  for (var i = 0; i <= $("#number-overtones-input").val(); i++) {
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

$('#number-overtones-slider').on('changed.zf.slider', function(){
  addSliders();
  removeSliders();
});

function addSliders() {
  for (var i = 0; i <= $("#number-overtones-input").val(); i++) {
    if (!$("#gain-control-" + i).length) {
      $div = newSlider(i);
      $("#slider-container").append($div);
      new Foundation.Slider($div, {});
    }
  }
}

function newSlider(i) {
  var $div = $('<div class="slider vertical" data-slider data-initial-start="0" data-end="100" data-vertical="true"></div>');
  var $span1 = $('<span class="slider-handle" data-slider-handle role="slider" tabindex="1"></span>');
  var $span2 = $('<span class="slider-fill" data-slider-fill></span>');
  var $input = $('<input id="gain-control-' + i + '" type="hidden">');
  return $div.append($span1, $span2, $input);
}

function removeSliders() {
  // 25 is magical number right now, upper limit of the slider that
  // controls the amount of overtones
  for (var i = 25; i > $("#number-overtones-input").val(); i--) {
    if ($("#gain-control-" + i).length) {
      $("#gain-control-" + i).parent().remove();
    }
  }
}
