module.exports = {
  defaultSrc: [
    "'self'"
  ],
  scriptSrc: [
    "'self'",
    "'unsafe-eval'",
    "'unsafe-inline'",
    'http://ajax.googleapis.com',
    'https://ajax.googleapis.com',
    'http://www.google-analytics.com',
    'https://www.google-analytics.com',
    'http://oss.maxcdn.com',
    'https://oss.maxcdn.com',
    'http://cdn.socket.io',
    'https://cdn.socket.io',
    'http://checkout.stripe.com',
    'https://checkout.stripe.com',
    'http://cdnjs.cloudflare.com',
    'https://cdnjs.cloudflare.com'
  ],
  styleSrc: [
    "'self'",
    "'unsafe-inline'",
    'http://fonts.googleapis.com',
    'https://fonts.googleapis.com',
    'http://checkout.stripe.com',
    'https://checkout.stripe.com'
  ],
  fontSrc: [
    "'self'",
    'http://fonts.googleapis.com',
    'https://fonts.googleapis.com',
    'http://fonts.gstatic.com',
    'https://fonts.gstatic.com',
    'htp://themes.googleusercontent.com',
    'https://themes.googleusercontent.com'
  ],
  imgSrc: [
    "'self'",
    'data:',
    'https://gravatar.com',
    'https://avatars.githubusercontent.com',
    'http://pbs.twimg.com',
    'https://pbs.twimg.com',
    'http://*.4sqi.net',
    'https://*.4sqi.net',
    'http://*.media.tumblr.com',
    'http://userserve-ak.last.fm',
    'http://graph.facebook.com',
    'https://graph.facebook.com',
    'http://*.fbcdn.net',
    'https://*.fbcdn.net',
    'http://fbcdn-profile-a.akamaihd.net',
    'https://fbcdn-profile-a.akamaihd.net',
    'http://github.global.ssl.fastly.net',
    'https://github.global.ssl.fastly.net',
    'http://chart.googleapis.com',
    'https://chart.googleapis.com',
    'http://www.google-analytics.com',
    'https://www.google-analytics.com'
  ],
  mediaSrc: [
    "'self'"
  ],
  connectSrc: [ // limit the origins (via XHR, WebSockets, and EventSource)
    "'self'",
    'ws://localhost:5000',
    'ws://localhost:3000',
    'ws://127.0.0.1:35729/livereload',
    'wss://skeleton-app.jit.su',
    'https://api.github.com'
  ],
  objectSrc: [  // allows control over Flash and other plugins
    "'none'"
  ],
  frameSrc: [   // origins that can be embedded as frames
    'http://checkout.stripe.com',
    'https://checkout.stripe.com',
  ],
  sandbox: [
    'allow-same-origin',
    'allow-forms',
    'allow-scripts'
  ],
  reportOnly: false,     // set to true if you *only* want to report errors
  setAllHeaders: false   // set to true if you want to set all headers
};
