module.exports = {

  index: function(req, res) {
    res.render('index');
  },

  about: function(req, res) {
    res.render('about', { title: 'About' });
  }

};
