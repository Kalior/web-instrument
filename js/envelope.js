function drawEnvelope() {
  var canvas = document.getElementById("envelope-graph");
  var context = canvas.getContext("2d");
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.lineWidth = "2";

  var envelopeAttack       = canvas.width * (parseInt($("#envelope-attack-input").val()) / 100);
  var envelopeDecay        = canvas.width * (parseInt($("#envelope-decay-input").val()) / 100);
  var envelopeRelease      = canvas.width * (parseInt($("#envelope-release-input").val()) / 100);
  var envelopeSustainGain  = canvas.height * (1 - parseInt($("#envelope-sustain-input").val()) / 100);
  var envelopeSustainTime  = canvas.width - envelopeAttack - envelopeDecay - envelopeRelease;

  context.beginPath();
  context.moveTo(0, canvas.height);
  context.lineTo(envelopeAttack, 0);
  context.strokeStyle = "#2199e8";
  context.stroke();

  context.beginPath();
  context.moveTo(envelopeAttack, 0);
  drawSetTargetAtTime(context, envelopeAttack, envelopeDecay, 0, envelopeSustainGain, envelopeDecay * 0.2, "#3adb76");

  var timeBeforeRelease = envelopeAttack + envelopeDecay;
  if (envelopeSustainTime >= 0) {
    context.lineTo(envelopeAttack + envelopeDecay + envelopeSustainTime, envelopeSustainGain);
    context.strokeStyle = "#777777";
    context.stroke();
    timeBeforeRelease += envelopeSustainTime;
  }

  context.beginPath();
  context.moveTo(envelopeAttack + envelopeDecay + envelopeSustainTime, envelopeSustainGain);
  drawSetTargetAtTime(context, timeBeforeRelease, envelopeRelease, envelopeSustainGain, canvas.height, envelopeRelease * 0.2, "#ec5840");
}

function drawSetTargetAtTime (context, timeBefore, length, V0, V1, timeConstant, color) {
  context.beginPath();
  for (var i = 0; i < length; i++) {
    context.lineTo(timeBefore + i, V1 + (V0 - V1) * Math.exp(-i/timeConstant));
  }
  context.strokeStyle = color;
  context.stroke()
  context.beginPath();
  context.moveTo(timeBefore + length, V1 + (V0 - V1) * Math.exp(-length/timeConstant));
}


$('.envelope-slider').on('moved.zf.slider', function(){
  drawEnvelope();
});
