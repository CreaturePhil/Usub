module.exports = {

  db: process.env.MONGODB || 'mongodb://localhost:27017/test',

  session: process.env.SESSION || 'Your Session Secret goes here',

  sendgrid: {
    user: process.env.SENDGRID_USER || 'hslogin',
    password: process.env.SENDGRID_PASSWORD || 'hspassword00'
  },

  hash: process.env.HASH || 'Your Hash Secret here',

  google: {
    clientID: process.env.GOOGLE_ID || '828110519058.apps.googleusercontent.com',
    clientSecret: process.env.GOOGLE_SECRET || 'JdZsIaWhUFIchmC1a_IZzOHb',
    callbackURL: '/auth/google/callback',
    passReqToCallback: true
  },

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
