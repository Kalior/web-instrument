function drawEnvelope() {
  var canvas = document.getElementById("envelope-graph");
  var context = canvas.getContext("2d");
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.beginPath();

  var envelopeAttack       = canvas.width * (parseInt($("#envelope-attack-input").val()) / 100);
  var envelopeDecay        = canvas.width * (parseInt($("#envelope-decay-input").val()) / 100);
  var envelopeRelease      = canvas.width * (parseInt($("#envelope-release-input").val()) / 100);
  var envelopeSustainGain  = canvas.height * (1 - parseInt($("#envelope-sustain-input").val()) / 100);
  var envelopeSustainTime  = canvas.width - envelopeAttack - envelopeDecay - envelopeRelease;

  context.moveTo(0, 200);
  context.lineTo(envelopeAttack, 0);

  drawSetTargetAtTime(context, envelopeAttack, envelopeDecay, 0, envelopeSustainGain, envelopeDecay * 0.2);

  var timeBeforeRelease = envelopeAttack + envelopeDecay;
  if (envelopeSustainTime > 0) {
    context.lineTo(envelopeAttack + envelopeDecay + envelopeSustainTime, envelopeSustainGain);
    timeBeforeRelease += envelopeSustainTime;
  }

  drawSetTargetAtTime(context, timeBeforeRelease, envelopeRelease, envelopeSustainGain, canvas.height, envelopeRelease * 0.2);

  context.stroke();
}

function drawSetTargetAtTime (context, timeBefore, length, V0, V1, timeConstant) {
  for (var i = 0; i < length; i++) {
    context.lineTo(timeBefore + i, V1 + (V0 - V1) * Math.exp(-i/timeConstant));
  }
}


$('.envelope-slider').on('moved.zf.slider', function(){
  drawEnvelope();
});
