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
