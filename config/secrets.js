var router = require('./routes');
var debug = require('../lib/debug');

module.exports = {

  db: process.env.MONGODB || 'mongodb://localhost:27017/test',

  session: process.env.SESSION || 'Your Session Secret goes here',

  sendgrid: {
    user: process.env.SENDGRID_USER || 'hslogin',
    password: process.env.SENDGRID_PASSWORD || 'hspassword00'
  },

  hash: process.env.HASH || 'Your Hash Secret here',

  banUsernames: ['about', 'signup', 'login', 'logout', 'forgot_password', 'reset_password', 'settings', 'api'],

  googleApiKey: process.env.GOOGLE_API_KEY

};
