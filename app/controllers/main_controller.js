var async = require('async');
var request = require('request');
var cheerio = require('cheerio');

module.exports = {

  index: function(req, res, next) {
    if (!req.isAuthenticated()) return res.render('index');

    var videos = [];
    var yt_channel_startLink = 'https://www.youtube.com/user/';
    var yt_channel_endLink = '/videos?view=0';

    async.each(req.user.subscriptions, function(user, callback) {
      var link = yt_channel_startLink + user + yt_channel_endLink;
      request(link, function(err, response, body) {
        if (err || response.statusCode !== 200) return callback();
        var $ = cheerio.load(body);
        var content = $('.channels-content-item').map(function(i, el) {
          return {
            img: 'https:' + $(this).find('img').attr('src'),
            link: 'https://www.youtube.com' + $(this).find('a').attr('href').split('&')[0],
            time: $(this).find('.video-time').text(),
            title: $(this).find('.yt-lockup-content a').text(),
            author: user,
            viewCount: $(this).find('.yt-lockup-meta ul li').first().text(),
            publishedAt: $(this).find('.yt-lockup-deemphasized-text').text()
          };
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

      res.render('dashboard', { videos: videos });
    });
  },

  about: function(req, res) {
    res.render('about', { title: 'About' });
  }

};
