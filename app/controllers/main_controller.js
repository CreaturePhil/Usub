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
            views: $(this).find('.yt-lockup-meta ul li').first().text(),
            published: $(this).find('.yt-lockup-deemphasized-text').text()
          };
        }).get();
        videos = videos.concat(content);
        callback();
      });
    }, function(err, results) {
      if (err) return next(err);
      res.render('dashboard', { videos: videos });
    });

//    var videos = [];
//    var yt_channel_startLink = 'https://www.youtube.com/user/';
//    var yt_channel_endLink = '/videos?view=0';
//    var gapis_startLink = 'https://www.googleapis.com/youtube/v3/videos?id=';
//    var gapis_midLink = '&key=';
//    var gapis_endLink= '&part=snippet,contentDetails,statistics';
//
//    async.each(req.user.subscriptions, function(user, eachCb) {
//      var link = yt_channel_startLink + user + yt_channel_endLink;
//      scraperjs.StaticScraper.create(link)
//        .scrape(function($) {
//          return $('.channels-content-item').map(function() {
//            return $(this).find('a').attr('href').split('&')[0].split('=')[1];
//          }).get();
//        }, function(vids) {
//          async.map(vids, function(vid, mapCb) {
//            var url = gapis_startLink + vid + gapis_midLink + secrets.googleApiKey + gapis_endLink;
//            request(url, function(err, response, body) {
//              if (err || response.statusCode !== 200) return next(err);
//              mapCb(null, body);
//            }); 
//          }, function(err, results) {
//            if (err) return next(err); 
//            videos = videos.concat(results);
//            eachCb();
//          });
//        });
//    }, function(err) {
//      if (err) return next(err);
//      videos.sort(function(a, b) {
//        b = JSON.parse(b).items[0].snippet.publishedAt;
//        a = JSON.parse(a).items[0].snippet.publishedAt; 
//        return new Date(b) - new Date(a);
//      });
//      res.render('dashboard', { videos: videos });
//    });
  },

  about: function(req, res) {
    res.render('about', { title: 'About' });
  }

};
