module.exports = {

  db: process.env.MONGODB || 'mongodb://localhost:27017/test',

  session: process.env.SESSION || 'Your Session Secret goes here',

  sendgrid: {
    user: process.env.SENDGRID_USER || 'hslogin',
    password: process.env.SENDGRID_PASSWORD || 'hspassword00'
  },

  hash: process.env.HASH || 'Your Hash Secret here',

  banUsernames: [ 'about', 
                  'signup',
                  'login',
                  'logout',
                  'settings',
                  'auth',
                  'subscriptions',
                  'api',
                  'user',
                  'channel',
                  'privacy' ]

};
