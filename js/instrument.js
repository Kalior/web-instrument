var context;

$(document).ready(function () {
  try {
    window.AudioContext = window.AudioContext||window.webkitAudioContext;
    context = new webkitAudioContext();
    addSliders();
    addTones();
  }
  catch(e) {
    alert(e);
  }
});

$("#play-sound").click(function () {
  var tones = [261.63, 329.628, 391.995]
  var melody = [200, 400, 100, 440, 220, 320]

  // Setting tempo to 60 BPM just for now
  var tempo = 120.0;
  var secondsPerBeat = 60.0 / tempo;

  for (var i = 0; i <= 7; i++) {
    for (var j = 0; j < 3; j++) {
      if ($("#melody-row-" + j + "-column-" + i).is(":checked")) {
        playSound(tones[j], context.currentTime + 0.25 * i * secondsPerBeat, 0.25 * secondsPerBeat);
      }
    }
  }
});

function playSound (freq, time, length) {
  var gainSum = 0;
  for (var i = 0; i <= $("#number-overtones-input").val(); i++) {
    gainSum += $("#gain-control-" + i).val() / 100;
  }

  for (var i = 0; i <= $("#number-overtones-input").val(); i++) {
    createOscilator(freq * (i+1), $("#gain-control-" + i).val() / (100 * gainSum), time, length);
  }
}

function round (value, decimals) {
    return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}

function addTones() {
  for (var i = 0; i < 3; i++) {
    var $tr = $('<tr class="melody-row" id="melody-row-' + i +'"></tr>');
    for (var j = 0; j <= 7; j++) {
      var $td =
        $('<td class="melody-cell">' +
          '<label for="melody-row-' + i + '-column-'+ j +'" class="melody-label"></label>' +
          '<input class="melody-checkbox" id="melody-row-' + i + '-column-'+ j +'" type="checkbox">' +
          '<div class="melody-box"></div>' +
        '</td>');
      $tr.append($td);
    }
    $("#melody-table-body").append($tr);
  }
}
