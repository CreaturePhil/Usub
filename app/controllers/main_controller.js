var async = require('async');
var cheerio = require('cheerio');
var request = require('request');

var re = /[0-9]{1,2}/;
var yt_channel_startLink = 'https://www.youtube.com/user/';
var yt_channel_endLink = '/videos?view=0';

module.exports = {

  index: function(req, res, next) {
    if (!req.isAuthenticated()) return res.render('index', { title: '' });

    var videos = [];

    async.each(req.user.subscriptions, function(user, callback) {
      var link = yt_channel_startLink + user + yt_channel_endLink;
      request(link, function(err, response, body) {
        if (err || response.statusCode !== 200) return callback(); 
        var $ = cheerio.load(body);
        var content = $('.channels-content-item').map(function(i, el) {
          return getContent.call(this, $, user);
        }).get();
        videos = videos.concat(content);
        callback();
      });
    }, function(err) {
      if (err) return next(err);

      var timeFrame = { 'second': [], 'minute': [], 'hour': [], 'day': [], 'week': [] };
      var len = videos.length;
      var timeArray = Object.keys(timeFrame);
      var timeLen = timeArray.length;

      while(len--) {
        timeInsertion('second', videos[len], timeFrame);
        timeInsertion('minute', videos[len], timeFrame);
        timeInsertion('hour', videos[len], timeFrame);
        timeInsertion('day', videos[len], timeFrame);
        timeInsertion('week', videos[len], timeFrame);
      }

      while(timeLen--) {
        timeFrame[timeArray[timeLen]].sort(timeSort);
      }

      videos = timeFrame.second.concat(timeFrame.minute, timeFrame.hour, timeFrame.day, timeFrame.week);

      res.render('dashboard', { videos: videos });
    });
  },

  about: function(req, res) {
    res.render('about', { title: 'About' });
  },

  youtubeChannel: function(req, res, next) {
    var user = req.params.name;
    var link = yt_channel_startLink + user + yt_channel_endLink;

    request(link, function(err, response, body) {
      if (err || response.statusCode !== 200) return res.render('error', { message: 'Channel does not exist.' });
      var $ = cheerio.load(body);
      var videos = $('.channels-content-item').map(function(i, el) {
        return getContent.call(this, $, user);
      }).get();

      res.render('channel', { title: user, videos: videos, channel: user });
    });
  },

  privacy: function(req, res) {
    res.render('privacy', { title: 'Privacy Policy' });
  }

};

function getContent($, user) {
  var $info = $(this).find('.yt-lockup-meta-info').find('li');
  return {
    img: 'https:' + $(this).find('img').attr('src'),
    link: 'https://www.youtube.com' + $(this).find('a').attr('href').split('&')[0],
    time: $(this).find('.video-time').text(),
    title: $(this).find('.yt-lockup-content a').text(),
    author: user,
    viewCount: $info.first().text(),
    publishedAt: $info.last().text()
  };
}

function timeInsertion(time, content, timeFrame) {
  if (content.publishedAt.indexOf(time) >= 0) {
    if (time === 'week' && Number(content.publishedAt.match(re)[0]) > 2) return;
    timeFrame[time].push(content);
  } 
}

function timeSort(a, b) {
  return Number(a.publishedAt.match(re)[0]) - Number(b.publishedAt.match(re)[0]);
}
