module.exports = function(input) {
  var reptms = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/;
  var hours = 0, minutes = 0, seconds = 0, totalseconds;

  if (reptms.test(input)) {
    var matches = reptms.exec(input);
    if (matches[1]) hours = Number(matches[1]);
    if (matches[2]) minutes = Number(matches[2]);
    if (matches[3]) seconds = Number(matches[3]);
  }

  if (hours) {
    if (String(minutes).length === 1) return hours + ':0' + minutes + ':' + seconds;
    return hours + ':' + minutes + ':' + seconds;
  }
  if (minutes) {
    if (String(seconds).length === 1) return minutes + ':0' + seconds;
    return minutes + ':' + seconds;
  }
  if (seconds) {
    if (String(seconds).length === 1) return '0:0' + seconds;
    return '0:' + seconds; 
  }
};
