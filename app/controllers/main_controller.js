var _ = require('lodash');
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

      // Find at what time frame each video was published at then sorting the videos at each timeFrame.
      // Limit of displaying videos is 2 weeks.
      _.forEach(['second', 'minute', 'hour', 'day', 'week'], function(time) {
        timeFrame[time] = _.filter(videos, function(video) {
          if (time === 'week') {
            return video.publishedAt.indexOf('week') >= 0 && Number(video.publishedAt.match(re)[0]) <= 2;
          }
          return video.publishedAt.indexOf(time) >= 0;
        }).sort(function(a, b) {
          return Number(a.publishedAt.match(re)[0]) - Number(b.publishedAt.match(re)[0]);
        });
      });

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
    var sort = 'newest';

    if (req.query.sort && req.query.sort.toLowerCase() === 'popular') {
      link += '?flow=grid&sort=p&view=0';
      sort = 'popular';
    }

    request(link, function(err, response, body) {
      if (err || response.statusCode !== 200) return res.render('error', { message: 'Channel does not exist.' });
      var $ = cheerio.load(body);
      var videos = $('.channels-content-item').map(function(i, el) {
        return getContent.call(this, $, user);
      }).get();

      res.render('channel', { title: user, videos: videos, channel: user, query: req.query.sort, sort: sort });
    });
  },

  privacy: function(req, res) {
    res.render('privacy', { title: 'Privacy Policy' });
  }

};

/**
 * Web scrape youtube channel page for videos.
 *
 * @param {Function} $
 * @param {String} user
 * @return {Object} Video infomation
 */
function getContent($, user) {
  var $info = $(this).find('.yt-lockup-meta-info').find('li');
  return {
    img: 'https:' + $(this).find('img').attr('src'),
    link: 'https://www.youtube.com' + $(this).find('a').attr('href'),
    time: $(this).find('.video-time').text(),
    title: $(this).find('.yt-lockup-content a').text(),
    author: user,
    viewCount: $info.first().text(),
    publishedAt: $info.last().text()
  };
}
