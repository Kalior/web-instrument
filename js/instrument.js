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
  gainSum = 0;
  for (var i = 0; i <= $("#number-overtones-input").val(); i++) {
    gainSum += $("#gain-control-" + i).val() / 100;
  }

  for (var i = 0; i <= $("#number-overtones-input").val(); i++) {
    createOscilator(100 * (i+1), $("#gain-control-" + i).val() / (100 * gainSum));
  }
});
}

function round (value, decimals) {
    return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}

function addTones() {
  for (var i = 0; i < 3; i++) {
    var $tr = $('<tr id="melody-row-' + i +'"></tr>');
    for (var j = 0; j <= 7; j++) {
      var $td = $('<td><input id="melody-row-' + i + '-column-'+ j +'" type="checkbox"></td>');
      $tr.append($td);
    }
    $("#melody-table-body").append($tr);
  }
}
