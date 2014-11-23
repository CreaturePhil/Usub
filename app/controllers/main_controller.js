module.exports = {

  index: function(req, res) {
    if (!req.isAuthenticated()) return res.render('index');
    res.render('index');
  },

  about: function(req, res) {
    res.render('about', { title: 'About' });
  }

};
