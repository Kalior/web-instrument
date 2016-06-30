function addTones() {
  for (var i = 0; i < numberOfTones; i++) {
    var $tr = $('<tr class="melody-row" id="melody-row-' + i +'"></tr>');
    var $toneLabel = $('<td><b>' + toneNames[i] + '</b></td>')
    $tr.append($toneLabel);
    for (var j = 0; j < numberOfBeats; j++) {
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

function toneLength (i, j) {
  if (isToneWithIndexChecked(i,j)) {
    return 1 + toneLength(i+1, j);
  } else {
    return 0;
  }
}

function isToneWithIndexChecked(i, j) {
  return $("#melody-row-" + j + "-column-" + i).is(":checked")
}
