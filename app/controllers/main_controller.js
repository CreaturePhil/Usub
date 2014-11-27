var async = require('async');
var scraperjs = require('scraperjs');
var request = require('request');
var cheerio = require('cheerio');
var secrets = require('../../config/secrets');

module.exports = {

  index: function(req, res, next) {
    if (!req.isAuthenticated()) return res.render('index');

    var videos = [];
    var yt_channel_startLink = 'https://www.youtube.com/user/';
    var yt_channel_endLink = '/videos?view=0';

    async.each(req.user.subscriptions, function(user, callback) {
      var link = yt_channel_startLink + user + yt_channel_endLink;
      request(link, function(err, response, body) {
        if (err || response.statusCode !== 200) return next(err);
        var $ = cheerio.load(body);
        var content = $('.channels-content-item').map(function(i, el) {
          return {
            img: 'http:' + $(this).find('img').attr('src'),
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
    }, function(err, results) {
      if (err) return next(err);
      res.render('dashboard', { videos: videos });
    });
  },

  about: function(req, res) {
    res.render('about', { title: 'About' });
  }

};
