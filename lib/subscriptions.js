module.exports = function(videos) {
  var timeFrame = { 'second': [], 'minute': [], 'hour': [], 'day': [], 'week': [] };
  var len = videos.length;
  var timeArray = Object.keys(timeFrame);
  var timeLen = timeArray.length; 
  var re = /[0-9]{1,2}/;
  
  function timeInsertion(time, content) {
    if (content.publishedAt.indexOf(time) >= 0) {
      if (time === 'week' && Number(content.publishedAt.match(re)[0]) > 2) return;
      timeFrame[time].push(content);
    } 
  }

  function timeSort(a, b) {
    return Number(a.publishedAt.match(re)[0]) - Number(b.publishedAt.match(re)[0]);
  }

  while(len--) {
    timeInsertion('second', videos[len]);
    timeInsertion('minute', videos[len]);
    timeInsertion('hour', videos[len]);
    timeInsertion('day', videos[len]);
    timeInsertion('week', videos[len]);
  }

  while(timeLen--) {
    timeFrame[timeArray[timeLen]].sort(timeSort);
  }

  videos = timeFrame.second.concat(timeFrame.minute, timeFrame.hour, timeFrame.day, timeFrame.week);

  return videos;
};
